import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css'
})
export class HowItWorks {
  steps = [
    {
      icon:'📦',
      title:'List Product',
      description:'Upload your used item in a few clicks.'
    },
    {
      icon:'💬',
      title:'Chat',
      description:'Talk directly with interested buyers.'
    },
    {
      icon:'🤝',
      title:'Meet on Campus',
      description:'Meet safely inside LPU campus.'
    },
    {
      icon:'✅',
      title:'Complete Deal',
      description:'Buy or sell with confidence.'
    }
  ];
}