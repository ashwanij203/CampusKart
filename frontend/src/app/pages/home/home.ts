import { Component } from '@angular/core';
import { Categories } from '../../components/categories/categories';
import { FeaturedProducts } from '../../components/featured-products/featured-products';
import { Hero } from '../../components/hero/hero';
import { SearchSection } from '../../components/search-section/search-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, SearchSection, Categories, FeaturedProducts],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
