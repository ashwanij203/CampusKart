import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ===== REGISTER =====
  register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    hostel?: string;
    roomNumber?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ===== LOGIN =====
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  // ===== LOGOUT =====
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // ===== GET PROFILE =====
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  // ===== UPDATE PROFILE =====
  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, formData).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  // ===== TOKEN HELPERS =====
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
