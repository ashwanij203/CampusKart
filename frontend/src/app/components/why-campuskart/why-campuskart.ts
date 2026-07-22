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
      description: 'Only verified LPU students can buy or sell products — zero strangers, maximum trust.',
      color: 'linear-gradient(135deg,#2563eb,#3b82f6)',
      bg: 'rgba(37,99,235,0.1)'
    },
    {
      icon: '🤖',
      title: 'AI Price Suggestion',
      description: 'Our AI suggests a fair resale price based on market trends so you never undersell.',
      color: 'linear-gradient(135deg,#7c3aed,#8b5cf6)',
      bg: 'rgba(124,58,237,0.1)'
    },
    {
      icon: '💬',
      title: 'Secure In-App Chat',
      description: 'Communicate safely with buyers and sellers directly inside CampusKart.',
      color: 'linear-gradient(135deg,#06b6d4,#0ea5e9)',
      bg: 'rgba(6,182,212,0.1)'
    },
    {
      icon: '📍',
      title: 'Campus Pickup Points',
      description: 'Meet at popular convenient spots inside LPU — safe and hassle-free.',
      color: 'linear-gradient(135deg,#10b981,#34d399)',
      bg: 'rgba(16,185,129,0.1)'
    },
    {
      icon: '⚡',
      title: 'Quick Listing',
      description: 'Post your product with photos and price in under 60 seconds — no paperwork.',
      color: 'linear-gradient(135deg,#f59e0b,#f97316)',
      bg: 'rgba(245,158,11,0.1)'
    },
    {
      icon: '🛡️',
      title: 'Safe Marketplace',
      description: 'A trusted, moderated marketplace exclusively built for the LPU student community.',
      color: 'linear-gradient(135deg,#ec4899,#f43f5e)',
      bg: 'rgba(236,72,153,0.1)'
    }
  ];
}