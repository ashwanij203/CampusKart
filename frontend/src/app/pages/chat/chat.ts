import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { Conversation, Message, User } from '../../interfaces/product';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  isLoadingConversations = false;
  isLoadingMessages = false;
  isSending = false;
  currentUser: User | null = null;

  private pollInterval: any = null;
  private shouldScroll = false;
  searchQuery = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadConversations();
    // Poll conversations every 10 seconds
    this.pollInterval = setInterval(() => {
      this.loadConversations(true);
      if (this.selectedConversation) {
        this.pollMessages();
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadConversations(silent = false) {
    if (!silent) this.isLoadingConversations = true;
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.isLoadingConversations = false;
        this.conversations = res.conversations || [];
        // If a conversation is selected, update its last message in the list
        if (this.selectedConversation) {
          const updated = this.conversations.find(c => c._id === this.selectedConversation?._id);
          if (updated) this.selectedConversation = updated;
        }
      },
      error: () => {
        this.isLoadingConversations = false;
      },
    });
  }

  pollMessages() {
    if (!this.selectedConversation?._id) return;
    this.chatService.getMessages(this.selectedConversation._id).subscribe({
      next: (res) => {
        const incoming = res.messages || [];
        if (incoming.length > this.messages.length) {
          this.messages = incoming;
          this.shouldScroll = true;
        }
      },
      error: () => {},
    });
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
    this.messages = [];
    this.loadMessages(conv._id!);
  }

  loadMessages(conversationId: string) {
    this.isLoadingMessages = true;
    this.chatService.getMessages(conversationId).subscribe({
      next: (res) => {
        this.isLoadingMessages = false;
        this.messages = res.messages || [];
        this.shouldScroll = true;
      },
      error: () => {
        this.isLoadingMessages = false;
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    this.isSending = true;
    const text = this.newMessage.trim();
    this.newMessage = '';

    this.chatService.sendMessage(this.selectedConversation._id!, text).subscribe({
      next: (res) => {
        this.isSending = false;
        if (res.success) {
          this.messages.push(res.message);
          this.shouldScroll = true;
          // Update last message in conversation list
          const conv = this.conversations.find(c => c._id === this.selectedConversation?._id);
          if (conv) {
            conv.lastMessage = text;
            conv.lastMessageAt = new Date().toISOString();
          }
        }
      },
      error: () => {
        this.isSending = false;
        this.newMessage = text; // restore if failed
      },
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getOtherParticipant(conv: Conversation): User {
    return conv.participants.find(p => p._id !== this.currentUser?._id) || conv.participants[0];
  }

  getAvatar(user: User): string {
    return user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2563eb&color=fff&size=48`;
  }

  isMyMessage(message: Message): boolean {
    const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
    return senderId === this.currentUser?._id;
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatLastMessageTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  get filteredConversations(): Conversation[] {
    if (!this.searchQuery.trim()) return this.conversations;
    const q = this.searchQuery.toLowerCase();
    return this.conversations.filter(conv => {
      const other = this.getOtherParticipant(conv);
      return other.name?.toLowerCase().includes(q) ||
             conv.product?.title?.toLowerCase().includes(q);
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  private scrollToBottom() {
    try {
      if (this.messagesEnd) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {}
  }
}
