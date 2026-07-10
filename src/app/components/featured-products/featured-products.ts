import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts {
  products: Product[] = [
{
id:1,
title:'MacBook Air M2',
price:65000,
image:'/images/macbook.jpg',
location:'BH-2',
condition:'Like New'
},
{
id:2,
title:'Engineering Books',
price:1200,
image:'/images/books.jpg',
location:'BH-4',
condition:'Good'
},
{
id:3,
title:'Bicycle',
price:4500,
image:'/images/cycle.jpg',
location:'BH-5',
condition:'Excellent'
},
{
id:4,
title:'iPhone 15',
price:52000,
image:'/images/iphone.jpg',
location:'BH-3',
condition:'New'
}
];
}
