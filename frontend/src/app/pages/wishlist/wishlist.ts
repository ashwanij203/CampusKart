import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  wishlistItems: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.wishlistItems = res.wishlist || [];
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load wishlist.';
      },
    });
  }

  removeItem(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(
          (item) => item.product?._id !== productId
        );
      },
      error: () => {},
    });
  }

  getProductImage(product: Product): string {
    if (product?.images && product.images.length > 0) return product.images[0];
    return '/mackbook.jpg';
  }

  getSellerName(seller: any): string {
    if (typeof seller === 'object' && seller?.name) return seller.name;
    return 'Unknown';
  }
}
