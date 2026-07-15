import { Component } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  viewMode = 'grid';
  categories = [
    'All',
    'Books',
    'Electronics',
    'Mobiles',
    'Furniture',
    'Bicycles'
  ];
  products: Product[] = [
    {
      id:1,
      title:'MacBook Air M2',
      price:65000,
      image:'/images/macbook.jpg',
      location:'BH-2 Hostel',
      condition:'Like New',
      seller:'Ashwani',
      rating:4.9,
      featured:true,
      posted:'2 hours ago'
    },

    {
      id:2,
      title:'Engineering Books',
      price:1200,
      image:'/images/books.jpg',
      location:'BH-4',
      condition:'Good',
      seller:'Rahul',
      rating:4.8,
      featured:true,
      posted:'Yesterday'
    },

    {
      id:3,
      title:'Mountain Bicycle',
      price:4500,
      image:'/images/cycle.jpg',
      location:'BH-3',
      condition:'Excellent',
      seller:'Aman',
      rating:4.7,
      featured:false,
      posted:'Today'
    }
  ];
}