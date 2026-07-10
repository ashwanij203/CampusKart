import { Component } from '@angular/core';
import { Categories } from '../../components/categories/categories';
import { FeaturedProducts } from '../../components/featured-products/featured-products';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { WhyCampuskart } from '../../components/why-campuskart/why-campuskart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Categories, FeaturedProducts, HowItWorks, WhyCampuskart],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
