import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = {
    image: '/mackbook.jpg',
    title: 'MacBook Air M5',
    price: 50000,
    location: 'LPU Campus',
    condition: 'Like New'
  };

}
