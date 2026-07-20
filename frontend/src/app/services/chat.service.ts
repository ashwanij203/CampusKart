import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  // ===== START / GET CONVERSATION =====
  startConversation(productId: string, sellerId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversations`, { productId, sellerId });
  }

  // ===== GET MY CONVERSATIONS =====
  getConversations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations`);
  }

  // ===== GET MESSAGES =====
  getMessages(conversationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  // ===== SEND MESSAGE =====
  sendMessage(conversationId: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversations/${conversationId}/messages`, { text });
  }
}
