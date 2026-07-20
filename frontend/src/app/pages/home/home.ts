import { Component } from '@angular/core';
import { Categories } from '../../components/categories/categories';
import { FeaturedProducts } from '../../components/featured-products/featured-products';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { WhyCampuskart } from '../../components/why-campuskart/why-campuskart';
import { Hero } from '../../components/hero/hero';
import { SearchSection } from '../../components/search-section/search-section';
import { Statistics } from '../../components/statistics/statistics';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero,SearchSection, Statistics, Categories, FeaturedProducts, HowItWorks, WhyCampuskart],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
