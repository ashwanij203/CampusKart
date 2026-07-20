import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Wishlist } from './pages/wishlist/wishlist';
import { Chat } from './pages/chat/chat';
import { SellProduct } from './pages/sell-product/sell-product';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'products', component: Products },
  { path: 'product/:id', component: ProductDetails },
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'wishlist', component: Wishlist },
  { path: 'chat', component: Chat },
  { path: 'sell-product', component: SellProduct },
  // Aliases that redirect
  { path: 'add-product', redirectTo: 'sell-product', pathMatch: 'full' },
  { path: 'product-details', redirectTo: 'products', pathMatch: 'full' },
  // Catch-all
  { path: '**', redirectTo: '' },
];
