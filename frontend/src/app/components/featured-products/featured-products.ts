import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCard } from '../product-card/product-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports:[ProductCard, RouterLink],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProducts {

products: Product[] = [
  {
    id: 1,
    title: 'MacBook Air M2',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop',
    location: 'BH-2 Hostel',
    condition: 'Like New',
    seller: 'Ashwani',
    rating: 4.9,
    featured: true,
    posted: '2 hours ago'
  },
  {
    id: 2,
    title: 'Engineering Books Set',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop',
    location: 'BH-4',
    condition: 'Good',
    seller: 'Rahul',
    rating: 4.7,
    featured: true,
    posted: '5 hours ago'
  },
  {
    id: 3,
    title: 'iPhone 15 Pro',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop',
    location: 'BH-5',
    condition: 'Excellent',
    seller: 'Priya',
    rating: 4.8,
    featured: true,
    posted: '1 day ago'
  },
  {
    id: 4,
    title: 'Mountain Bicycle',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop',
    location: 'BH-3',
    condition: 'Good',
    seller: 'Aman',
    rating: 4.6,
    featured: false,
    posted: '3 hours ago'
  },
  {
    id: 5,
    title: 'Study Table & Chair',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop',
    location: 'BH-6',
    condition: 'Good',
    seller: 'Neha',
    rating: 4.5,
    featured: false,
    posted: '6 hours ago'
  },
  {
    id: 6,
    title: 'JBL Bluetooth Speaker',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
    location: 'BH-1',
    condition: 'Like New',
    seller: 'Rohan',
    rating: 4.6,
    featured: true,
    posted: '12 hours ago'
  },
  {
    id: 7,
    title: 'Scientific Calculator',
    price: 850,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&auto=format&fit=crop',
    location: 'BH-2',
    condition: 'Good',
    seller: 'Kavya',
    rating: 4.4,
    featured: false,
    posted: '1 hour ago'
  },
  {
    id: 8,
    title: 'Dell Monitor 24"',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop',
    location: 'BH-7',
    condition: 'Like New',
    seller: 'Suresh',
    rating: 4.7,
    featured: false,
    posted: '2 days ago'
  }
];
}