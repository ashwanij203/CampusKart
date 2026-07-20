import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
categories = [

  {
    icon: 'bi-book',
    title: 'Books',
    count: 120,
    description: 'Notes, novels & study material'
  },

  {
    icon: 'bi-laptop',
    title: 'Electronics',
    count: 86,
    description: 'Laptops, chargers & gadgets'
  },

  {
    icon: 'bi-phone',
    title: 'Mobiles',
    count: 215,
    description: 'Smartphones & accessories'
  },

  {
    icon: 'bi-bicycle',
    title: 'Bicycles',
    count: 42,
    description: 'Cycles & riding accessories'
  },

  {
    icon: 'bi-house-door',
    title: 'Furniture',
    count: 37,
    description: 'Tables, chairs & hostel furniture'
  },

  {
    icon: 'bi-controller',
    title: 'Gaming',
    count: 58,
    description: 'Gaming consoles & accessories'
  },

  {
    icon: 'bi-bag',
    title: 'Clothing',
    count: 72,
    description: 'Clothes, shoes & fashion'
  },

  {
    icon: 'bi-backpack',
    title: 'Accessories',
    count: 45,
    description: 'Bags & hostel essentials'
  }

];

}
