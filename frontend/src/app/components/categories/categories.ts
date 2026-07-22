import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

interface Category {
  icon: string;
  colorClass: string;
  title: string;
  routeValue: string; // value passed as ?category= query param
  count: number;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  categories: Category[] = [
    { icon: 'bi-book-fill',       colorClass: 'cat-books',     title: 'Books',       routeValue: 'Books',       count: 0, description: 'Notes, novels & study material' },
    { icon: 'bi-laptop-fill',     colorClass: 'cat-elec',      title: 'Electronics', routeValue: 'Electronics', count: 0, description: 'Laptops, chargers & gadgets' },
    { icon: 'bi-phone-fill',      colorClass: 'cat-mobiles',   title: 'Mobiles',     routeValue: 'Mobiles',     count: 0, description: 'Smartphones & accessories' },
    { icon: 'bi-bicycle',         colorClass: 'cat-bicycles',  title: 'Bicycles',    routeValue: 'Bicycle',     count: 0, description: 'Cycles & riding accessories' },
    { icon: 'bi-house-door-fill', colorClass: 'cat-furniture', title: 'Furniture',   routeValue: 'Furniture',   count: 0, description: 'Tables, chairs & hostel items' },
    { icon: 'bi-controller',      colorClass: 'cat-gaming',    title: 'Gaming',      routeValue: 'Gaming',      count: 0, description: 'Consoles & gaming gear' },
    { icon: 'bi-bag-fill',        colorClass: 'cat-clothing',  title: 'Clothing',    routeValue: 'Clothing',    count: 0, description: 'Clothes, shoes & fashion' },
    { icon: 'bi-backpack-fill',   colorClass: 'cat-access',    title: 'Accessories', routeValue: 'Other',       count: 0, description: 'Bags & hostel essentials' },
  ];

  totalItems = 0;
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategoryCounts();
  }

  loadCategoryCounts(): void {
    this.productService.getCategoryCounts().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.counts) {
          this.categories = this.categories.map(cat => ({
            ...cat,
            count: res.counts[cat.routeValue] || 0
          }));
          this.totalItems = Object.values(res.counts as Record<string, number>)
            .reduce((sum, v) => sum + v, 0);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
