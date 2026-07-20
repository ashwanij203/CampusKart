export interface Product {
  _id?: string;
  id?: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition: string;
  location: string;
  images?: string[];
  image?: string;
  seller: any;
  status?: string;
  rating?: number;
  featured?: boolean;
  posted?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  hostel?: string;
  roomNumber?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface Conversation {
  _id?: string;
  participants: User[];
  product: Product;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
}

export interface Message {
  _id?: string;
  conversationId: string;
  sender: User;
  text: string;
  read?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
}
