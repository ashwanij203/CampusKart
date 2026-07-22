import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product';
import { MOCK_PRODUCTS } from '../../data/mock-products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  // Filter state
  searchTerm = '';
  selectedCategory = 'All';
  selectedCondition = 'All';
  selectedSort = 'newest';
  selectedPriceRange = '';

  categories = ['All', 'Books', 'Electronics', 'Mobiles', 'Furniture', 'Bicycle', 'Clothing', 'Other'];
  conditions = ['All', 'New', 'Like New', 'Good', 'Used'];

  wishlistProductIds = new Set<string>();

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read query params from URL (e.g. /products?category=Books)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      this.loadProducts();
    });

    if (this.authService.isLoggedIn()) {
      this.loadWishlist();
    }
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        (res.wishlist || []).forEach((item: any) => {
          if (item.product?._id) this.wishlistProductIds.add(item.product._id);
        });
      },
      error: () => {},
    });
  }

  loadProducts() {
    this.errorMessage = '';

    // Step 1: Show filtered mock data immediately — no spinner, no wait
    this.products = this.filterMockProducts(MOCK_PRODUCTS);
    this.isLoading = false;

    // Step 2: Try real API silently in background — update if it succeeds
    const priceRange = this.getPriceRange();
    this.productService.getProducts({
      search: this.searchTerm || undefined,
      category: this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
      condition: this.selectedCondition !== 'All' ? this.selectedCondition : undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: this.selectedSort,
    }).pipe(
      timeout(6000),
      catchError(() => of({ products: null }))
    ).subscribe((res) => {
      if (res.products && res.products.length > 0) {
        this.products = res.products;
      }
      // If API fails or returns empty, keep showing mock data already displayed
    });
  }

  filterMockProducts(all: Product[]): Product[] {
    let filtered = [...all];
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
    }
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    if (this.selectedCondition !== 'All') {
      filtered = filtered.filter(p => p.condition === this.selectedCondition);
    }
    const pr = this.getPriceRange();
    if (pr.min !== undefined) filtered = filtered.filter(p => p.price >= pr.min!);
    if (pr.max !== undefined) filtered = filtered.filter(p => p.price <= pr.max!);
    if (this.selectedSort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (this.selectedSort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (this.selectedSort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
    else filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return filtered;
  }

  getPriceRange(): { min?: number; max?: number } {
    switch (this.selectedPriceRange) {
      case '0-1000': return { min: 0, max: 1000 };
      case '1000-5000': return { min: 1000, max: 5000 };
      case '5000-10000': return { min: 5000, max: 10000 };
      case '10000+': return { min: 10000 };
      default: return {};
    }
  }

  applyFilters() {
    this.loadProducts();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedCondition = 'All';
    this.selectedSort = 'newest';
    this.selectedPriceRange = '';
    this.loadProducts();
  }

  toggleWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) return;
    const pid = product._id!;

    if (this.wishlistProductIds.has(pid)) {
      this.wishlistService.removeFromWishlist(pid).subscribe({
        next: () => this.wishlistProductIds.delete(pid),
        error: () => {},
      });
    } else {
      this.wishlistService.addToWishlist(pid).subscribe({
        next: () => this.wishlistProductIds.add(pid),
        error: () => {},
      });
    }
  }

  isWishlisted(product: Product): boolean {
    return this.wishlistProductIds.has(product._id!);
  }

  getProductImage(product: Product): string {
    // Guard: images can be empty string "" or empty array [] from API
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    // Category-based fallback images from Unsplash
    const fallbacks: Record<string, string> = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop',
      'Mobiles':     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop',
      'Books':       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop',
      'Bicycle':     'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&auto=format&fit=crop',
      'Furniture':   'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&auto=format&fit=crop',
      'Clothing':    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop',
      'Gaming':      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop',
      'Other':       'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop',
    };
    return fallbacks[product.category || ''] ||
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop';
  }

  getSellerName(seller: any): string {
    if (typeof seller === 'object' && seller?.name) return seller.name;
    return 'Unknown';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}
