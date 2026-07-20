import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { Conversation, Message, User } from '../../interfaces/product';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  isLoadingConversations = false;
  isLoadingMessages = false;
  isSending = false;
  currentUser: User | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadConversations();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadConversations() {
    this.isLoadingConversations = true;
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.isLoadingConversations = false;
        this.conversations = res.conversations || [];
      },
      error: () => {
        this.isLoadingConversations = false;
      },
    });
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
    this.loadMessages(conv._id!);
  }

  loadMessages(conversationId: string) {
    this.isLoadingMessages = true;
    this.chatService.getMessages(conversationId).subscribe({
      next: (res) => {
        this.isLoadingMessages = false;
        this.messages = res.messages || [];
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

  private scrollToBottom() {
    try {
      if (this.messagesEnd) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {}
  }
}
