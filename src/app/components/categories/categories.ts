import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories =[ 
  { 
  icon: '📚',
  title: 'Books'
},
{
  icon: '💻',
  title: 'Electronic'
},
{
  icon: ' 📱',
  title: 'Mobiles'
},
{
  icon: '🚲',
  title: "Bicycles"
},
{
  icon: ' 🪑 ',
  title: 'Furnitures'
},
{
  icon: ' 👕',
  title: 'Clothes'
}
];
}
