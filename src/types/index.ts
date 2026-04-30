export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

export interface Kakanin {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isAvailable: boolean;
}

export interface OrderItem {
  id: number;
  kakaninId: number;
  kakaninName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'gcash' | 'maya';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  reservationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  lastRestocked: string;
}

export interface SalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
}
