import { Component } from '@angular/core';
import { Categories } from '../../components/categories/categories';
import { FeaturedProducts } from '../../components/featured-products/featured-products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Categories, FeaturedProducts],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
