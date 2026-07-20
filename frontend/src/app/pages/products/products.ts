import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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
    this.isLoading = true;
    this.errorMessage = '';

    const priceRange = this.getPriceRange();

    this.productService.getProducts({
      search: this.searchTerm || undefined,
      category: this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
      condition: this.selectedCondition !== 'All' ? this.selectedCondition : undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: this.selectedSort,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.products = res.products || [];
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load products.';
      },
    });
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
    if (product.images && product.images.length > 0) return product.images[0];
    return '/mackbook.jpg';
  }

  getSellerName(seller: any): string {
    if (typeof seller === 'object' && seller?.name) return seller.name;
    return 'Unknown';
  }
}
