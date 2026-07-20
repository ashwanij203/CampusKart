import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(this.apiUrl, { productId, quantity });
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, { quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}
