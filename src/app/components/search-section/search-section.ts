import { Component } from '@angular/core';

@Component({
  selector: 'app-search-section',
  standalone: true,
  templateUrl: './search-section.html',
  styleUrl: './search-section.css'
})
export class SearchSection {

  categories = [
    'All',
    'Books',
    'Electronics',
    'Mobiles',
    'Furniture',
    'Bicycle'
  ];
}