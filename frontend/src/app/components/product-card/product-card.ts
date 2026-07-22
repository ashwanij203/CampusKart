import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports:[RouterLink, DecimalPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  @Input() product!: Product;

}