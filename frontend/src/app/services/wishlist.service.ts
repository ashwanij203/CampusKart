import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = 'http://localhost:5000/api/wishlist';

  constructor(private http: HttpClient) {}

  // ===== GET WISHLIST =====
  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ===== ADD TO WISHLIST =====
  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.apiUrl, { productId });
  }

  // ===== REMOVE FROM WISHLIST =====
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
