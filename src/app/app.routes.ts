import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { AddProduct } from  './pages/add-product/add-product';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Wishlist } from './pages/wishlist/wishlist';
import { Chat } from './pages/chat/chat';


export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'register',
        component: Register,
    },
    {
        path: 'products',
        component: Products,
    },
    {
        path: 'product/:id',
        component: ProductDetails,
    },
    {
        path: 'add-product',
        component: AddProduct,
    },
    {
        path: 'dashboard',
        component: Dashboard,
    },
    {
        path: 'profile',
        component: Profile,
    },
    {
        path: 'wishlist',
        component: Wishlist,
    },
    {
        path: 'chat',
        component: Chat,
    }
];
