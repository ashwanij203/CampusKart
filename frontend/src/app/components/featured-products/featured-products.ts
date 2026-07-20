import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports:[ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProducts {

products:Product[]=[
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
rating:4.7,
featured:true,
posted:'5 hours ago'
},

{
id:3,
title:'iPhone 15',
price:52000,
image:'/images/iphone.jpg',
location:'BH-5',
condition:'Excellent',
seller:'Priya',
rating:4.8,
featured:true,
posted:'1 day ago'
},

{
id:4,
title:'Mountain Bicycle',
price:4500,
image:'/images/cycle.jpg',
location:'BH-3',
condition:'Good',
seller:'Aman',
rating:4.6,
featured:false,
posted:'3 hours ago'
}
];
}