import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  selectedImage = '';
  isLoading = false;
  errorMessage = '';
  isWishlisted = false;

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
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.product = res.product;
        if (this.product?.images && this.product.images.length > 0) {
          this.selectedImage = this.product.images[0];
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Product not found.';
      },
    });
  }

  toggleWishlist() {
    if (!this.authService.isLoggedIn() || !this.product) return;

    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product._id!).subscribe({
        next: () => (this.isWishlisted = false),
        error: () => {},
      });
    } else {
      this.wishlistService.addToWishlist(this.product._id!).subscribe({
        next: () => (this.isWishlisted = true),
        error: () => {},
      });
    }
  }

  chatWithSeller() {
    if (!this.authService.isLoggedIn() || !this.product) return;
    const sellerId = typeof this.product.seller === 'object' ? this.product.seller._id : this.product.seller;
    this.chatService.startConversation(this.product._id!, sellerId).subscribe({
      next: () => {
        window.location.href = '/chat';
      },
      error: () => {},
    });
  }

  getSellerName(): string {
    if (!this.product) return 'Unknown';
    if (typeof this.product.seller === 'object') return this.product.seller.name;
    return 'Unknown';
  }

  getSellerContact(): string {
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

    if (diffMins < 60) return `${diffMins} minute(s) ago`;
    if (diffHours < 24) return `${diffHours} hour(s) ago`;
    if (diffDays < 7) return `${diffDays} day(s) ago`;
    return date.toLocaleDateString();
  }
}
