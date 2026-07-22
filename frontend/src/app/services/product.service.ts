import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductFilters {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) {}

  // ===== GET ALL PRODUCTS (with filters) =====
  getProducts(filters: ProductFilters = {}): Observable<any> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params = params.set('category', filters.category);
    if (filters.condition && filters.condition !== 'All') params = params.set('condition', filters.condition);
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.location) params = params.set('location', filters.location);
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get(this.apiUrl, { params });
  }

  // ===== GET SINGLE PRODUCT =====
  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ===== ADD PRODUCT =====
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // ===== UPDATE PRODUCT =====
  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ===== DELETE PRODUCT =====
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ===== MY PRODUCTS =====
  getMyProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-products`);
  }

  // ===== CATEGORY COUNTS =====
  getCategoryCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category-counts`);
  }
}

