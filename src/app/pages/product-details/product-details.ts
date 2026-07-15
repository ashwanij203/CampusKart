import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product = {
    title: 'MacBook Air M2',
    price: 65000,
    location: 'BH-2 Hostel',
    condition: 'Like New',
    seller: 'Ashwani Jaiswal',
    rating: 4.9,
    posted: '2 hours ago',
    description: 'Apple MacBook Air M2, 16GB RAM, 512GB SSD, excellent condition with original charger. Used for only one semester.',
    images: [
      '/images/macbook.jpg',
      '/images/macbook.jpg',
      '/images/macbook.jpg',
      '/images/macbook.jpg',
    ],
  };
  selectedImage = this.product.images[0];
}
