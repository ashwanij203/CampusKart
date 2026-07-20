import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/product';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: User | null = null;
  menuOpen = false;
  private sub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getAvatar(): string {
    return (
      this.currentUser?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser?.name || 'U')}&background=2563eb&color=fff&size=36`
    );
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
