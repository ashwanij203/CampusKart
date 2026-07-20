import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { ChatService } from '../../services/chat.service';
import { Product, User } from '../../interfaces/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: User | null = null;
  myProducts: Product[] = [];
  wishlistCount = 0;
  conversationCount = 0;
  isLoading = true;

  cards: { icon: string; title: string; value: string; link: string }[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Load my products
    this.productService.getMyProducts().subscribe({
      next: (res) => {
        this.myProducts = res.products || [];
        this.updateCards();
      },
      error: () => this.updateCards(),
    });

    // Load wishlist count
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistCount = (res.wishlist || []).length;
        this.updateCards();
      },
      error: () => {},
    });

    // Load conversations count
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.conversationCount = (res.conversations || []).length;
        this.updateCards();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  updateCards() {
    this.cards = [
      {
        icon: 'bi-box-seam',
        title: 'My Listings',
        value: String(this.myProducts.length),
        link: '/profile',
      },
      {
        icon: 'bi-heart',
        title: 'Wishlist',
        value: String(this.wishlistCount),
        link: '/wishlist',
      },
      {
        icon: 'bi-chat-dots',
        title: 'Messages',
        value: String(this.conversationCount),
        link: '/chat',
      },
      {
        icon: 'bi-currency-rupee',
        title: 'Active Listings',
        value: String(this.myProducts.filter(p => p.status === 'Available').length),
        link: '/profile',
      },
    ];
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) return product.images[0];
    return '/mackbook.jpg';
  }
}
