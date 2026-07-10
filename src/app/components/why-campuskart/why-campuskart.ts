import { Component } from '@angular/core';

@Component({
  selector: 'app-why-campuskart',
  standalone: true,
  templateUrl: './why-campuskart.html',
  styleUrl: './why-campuskart.css'
})
export class WhyCampuskart {

  features = [
    {
      icon: '🎓',
      title: 'Verified LPU Students',
      description: 'Only verified LPU students can buy or sell products.'
    },
    {
      icon: '🤖',
      title: 'AI Price Suggestion',
      description: 'Get a fair resale price using AI.'
    },
    {
      icon: '💬',
      title: 'Secure Chat',
      description: 'Communicate safely with buyers and sellers.'
    },
    {
      icon: '📍',
      title: 'Campus Pickup',
      description: 'Meet at convenient locations inside LPU.'
    },
    {
      icon: '⚡',
      title: 'Quick Listing',
      description: 'Post your product in less than a minute.'
    },
    {
      icon: '🛡️',
      title: 'Safe Marketplace',
      description: 'A trusted marketplace exclusively for LPU students.'
    }
  ];
}