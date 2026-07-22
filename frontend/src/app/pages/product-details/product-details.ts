import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product';
import { MOCK_PRODUCTS } from '../../data/mock-products';

const LS_KEY = 'ck_wishlist';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  selectedImage = '';
  isLoading = false;
  errorMessage = '';
  isWishlisted = false;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  toastVisible = false;
  private toastTimer: any;

  // Contact panel
  showContactPanel = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    // Step 1: Show mock data immediately if available (no wait, no spinner)
    const mock = MOCK_PRODUCTS.find(p => p._id === id);
    if (mock) {
      this.product = mock;
      this.selectedImage = mock.images?.[0] ?? '';
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }

    // Check wishlist state from localStorage
    const saved = this.getLocalWishlist();
    if (id) this.isWishlisted = saved.has(id);

    // Step 2: Try the real API in background — update if it succeeds
    this.productService.getProduct(id).pipe(
      timeout(6000),
      catchError(() => of({ product: null }))
    ).subscribe((res) => {
      if (res.product) {
        this.product = res.product;
        this.isLoading = false;
        if (res.product.images?.length > 0) {
          this.selectedImage = res.product.images[0];
        }
      } else if (!mock) {
        this.isLoading = false;
        this.errorMessage = 'Product not found.';
      }
    });
  }

  // ─── WISHLIST ────────────────────────────────────────────────
  toggleWishlist() {
    if (!this.product) return;
    const pid = this.product._id!;

    if (this.isWishlisted) {
      // Try API remove first, fallback to localStorage
      this.wishlistService.removeFromWishlist(pid).pipe(
        timeout(5000), catchError(() => of(null))
      ).subscribe(() => {
        this.isWishlisted = false;
        this.removeFromLocalWishlist(pid);
        this.showToast('Removed from wishlist', 'info');
      });
    } else {
      // Optimistic update immediately
      this.isWishlisted = true;
      this.addToLocalWishlist(pid);
      this.showToast('Added to wishlist ❤️', 'success');

      // Also try API
      this.wishlistService.addToWishlist(pid).pipe(
        timeout(5000), catchError(() => of(null))
      ).subscribe();
    }
  }

  private getLocalWishlist(): Set<string> {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  }

  private addToLocalWishlist(id: string) {
    const s = this.getLocalWishlist();
    s.add(id);
    localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  }

  private removeFromLocalWishlist(id: string) {
    const s = this.getLocalWishlist();
    s.delete(id);
    localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  }

  // ─── CHAT WITH SELLER ────────────────────────────────────────
  chatWithSeller() {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.showToast('Please log in to chat with the seller', 'error');
      return;
    }

    const sellerId = typeof this.product.seller === 'object'
      ? this.product.seller._id
      : this.product.seller;

    // Try the real API; show contact panel as fallback
    this.chatService.startConversation(this.product._id!, sellerId).pipe(
      timeout(5000),
      catchError(() => of(null))
    ).subscribe((res) => {
      if (res) {
        window.location.href = '/chat';
      } else {
        // Backend unavailable — show contact panel instead
        this.showContactPanel = true;
      }
    });
  }

  closeContactPanel() {
    this.showContactPanel = false;
  }

  // ─── TOAST ───────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  // ─── HELPERS ─────────────────────────────────────────────────
  getSellerName(): string {
    if (!this.product) return 'Unknown';
    if (typeof this.product.seller === 'object' && this.product.seller?.name)
      return this.product.seller.name;
    if (typeof this.product.seller === 'string') return this.product.seller;
    return 'Unknown';
  }

  getSellerPhone(): string {
    if (!this.product) return '';
    if (typeof this.product.seller === 'object') return this.product.seller.phone || '';
    return '';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute(s) ago`;
    if (diffHours < 24) return `${diffHours} hour(s) ago`;
    if (diffDays < 7) return `${diffDays} day(s) ago`;
    return date.toLocaleDateString();
  }
}
