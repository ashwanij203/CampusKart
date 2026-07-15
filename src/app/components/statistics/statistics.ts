import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class Statistics {
  stats = [
    {
      icon:'bi-mortarboard-fill',
      value:'30,000+',
      title:'Students'
    },
    {
      icon:'bi-box-seam',
      value:'5,000+',
      title:'Products'
    },
    {
      icon:'bi-arrow-left-right',
      value:'1,200+',
      title:'Successful Deals'
    },
    {
      icon:'bi-star-fill',
      value:'4.9',
      title:'Average Rating'
    }
  ];
}