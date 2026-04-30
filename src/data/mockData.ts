import { Kakanin, User, Order, InventoryItem } from '../types';

export const initialUsers: User[] = [
  { id: 1, username: 'admin', fullName: 'Clara Santos', email: 'admin@clarasbest.com', role: 'admin', phone: '09171234567', address: '123 Mabini St, Manila' },
  { id: 2, username: 'juan', fullName: 'Juan Dela Cruz', email: 'juan@email.com', role: 'customer', phone: '09189876543', address: '456 Rizal Ave, Quezon City' },
  { id: 3, username: 'maria', fullName: 'Maria Clara', email: 'maria@email.com', role: 'customer', phone: '09195551234', address: '789 Bonifacio St, Makati' },
];

export const initialKakanin: Kakanin[] = [
  { id: 1, name: 'Bibingka', description: 'Traditional rice cake cooked in clay pots with banana leaves, topped with salted egg and cheese.', price: 85, image: 'https://images.unsplash.com/photo-1600490256735-4284d6f62f2d?w=400', category: 'Rice Cakes', stock: 50, isAvailable: true },
  { id: 2, name: 'Puto', description: 'Steamed rice muffins that are soft, fluffy, and slightly sweet. Perfect with dinuguan.', price: 45, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', category: 'Rice Cakes', stock: 100, isAvailable: true },
  { id: 3, name: 'Kutsinta', description: 'Chewy steamed rice cakes with a distinctive dark brown color, topped with grated coconut.', price: 50, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: 'Rice Cakes', stock: 80, isAvailable: true },
  { id: 4, name: 'Sapin-Sapin', description: 'Layered glutinous rice cake with vibrant colors and flavors - ube, langka, and coconut.', price: 120, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', category: 'Layered Cakes', stock: 40, isAvailable: true },
  { id: 5, name: 'Biko', description: 'Sticky rice cake cooked in coconut milk and brown sugar, topped with latik (coconut curds).', price: 95, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', category: 'Sticky Rice', stock: 60, isAvailable: true },
  { id: 6, name: 'Suman', description: 'Steamed glutinous rice wrapped in banana leaves, served with sugar or chocolate.', price: 40, image: 'https://images.unsplash.com/photo-1600490256735-4284d6f62f2d?w=400', category: 'Wrapped Rice', stock: 90, isAvailable: true },
  { id: 7, name: 'Maja Blanca', description: 'Creamy coconut milk pudding with corn kernels, topped with toasted coconut.', price: 75, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: 'Puddings', stock: 55, isAvailable: true },
  { id: 8, name: 'Cassava Cake', description: 'Rich and creamy cassava cake baked with coconut milk and topped with cheese.', price: 110, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', category: 'Root Cakes', stock: 45, isAvailable: true },
  { id: 9, name: 'Pichi-Pichi', description: 'Soft and chewy cassava balls coated with grated coconut or cheese.', price: 55, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', category: 'Root Cakes', stock: 70, isAvailable: true },
  { id: 10, name: 'Kalamay', description: 'Sweet sticky rice dessert with coconut milk, latik, and muscovado sugar.', price: 100, image: 'https://images.unsplash.com/photo-1600490256735-4284d6f62f2d?w=400', category: 'Sticky Rice', stock: 35, isAvailable: true },
  { id: 11, name: 'Tikoy', description: 'Chinese-Filipino rice cake traditionally eaten during Lunar New Year celebrations.', price: 150, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', category: 'Specialty', stock: 30, isAvailable: true },
  { id: 12, name: 'Espasol', description: 'Cylinder-shaped rice cake made from toasted rice flour cooked in coconut milk.', price: 65, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: 'Rice Cakes', stock: 65, isAvailable: true },
];

export const initialOrders: Order[] = [
  {
    id: 1001,
    customerId: 2,
    customerName: 'Juan Dela Cruz',
    customerPhone: '09189876543',
    customerAddress: '456 Rizal Ave, Quezon City',
    items: [
      { id: 1, kakaninId: 1, kakaninName: 'Bibingka', quantity: 2, unitPrice: 85, subtotal: 170 },
      { id: 2, kakaninId: 3, kakaninName: 'Kutsinta', quantity: 5, unitPrice: 50, subtotal: 250 },
    ],
    totalAmount: 420,
    paymentMethod: 'gcash',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    notes: 'Please pack carefully',
    createdAt: '2025-04-28T10:00:00Z',
    updatedAt: '2025-04-28T14:30:00Z',
  },
  {
    id: 1002,
    customerId: 3,
    customerName: 'Maria Clara',
    customerPhone: '09195551234',
    customerAddress: '789 Bonifacio St, Makati',
    items: [
      { id: 3, kakaninId: 5, kakaninName: 'Biko', quantity: 3, unitPrice: 95, subtotal: 285 },
      { id: 4, kakaninId: 7, kakaninName: 'Maja Blanca', quantity: 2, unitPrice: 75, subtotal: 150 },
    ],
    totalAmount: 435,
    paymentMethod: 'maya',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    reservationDate: '2025-05-02',
    notes: 'For birthday party',
    createdAt: '2025-04-29T09:15:00Z',
    updatedAt: '2025-04-29T09:15:00Z',
  },
  {
    id: 1003,
    customerId: 2,
    customerName: 'Juan Dela Cruz',
    customerPhone: '09189876543',
    customerAddress: '456 Rizal Ave, Quezon City',
    items: [
      { id: 5, kakaninId: 4, kakaninName: 'Sapin-Sapin', quantity: 1, unitPrice: 120, subtotal: 120 },
    ],
    totalAmount: 120,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    createdAt: '2025-04-30T08:30:00Z',
    updatedAt: '2025-04-30T08:30:00Z',
  },
];

export const initialInventory: InventoryItem[] = [
  { id: 1, ingredientName: 'Glutinous Rice', quantity: 50, unit: 'kg', minStock: 10, supplier: 'Manila Rice Trading', lastRestocked: '2025-04-25' },
  { id: 2, ingredientName: 'Coconut Milk', quantity: 30, unit: 'L', minStock: 5, supplier: 'Coco Fresh Suppliers', lastRestocked: '2025-04-26' },
  { id: 3, ingredientName: 'Brown Sugar', quantity: 25, unit: 'kg', minStock: 5, supplier: 'Sweet Source Co.', lastRestocked: '2025-04-24' },
  { id: 4, ingredientName: 'Grated Coconut', quantity: 20, unit: 'kg', minStock: 3, supplier: 'Coco Fresh Suppliers', lastRestocked: '2025-04-26' },
  { id: 5, ingredientName: 'Cassava', quantity: 40, unit: 'kg', minStock: 8, supplier: 'Root Crop Farms', lastRestocked: '2025-04-27' },
  { id: 6, ingredientName: 'Ube (Purple Yam)', quantity: 15, unit: 'kg', minStock: 3, supplier: 'Root Crop Farms', lastRestocked: '2025-04-27' },
  { id: 7, ingredientName: 'Salted Egg', quantity: 100, unit: 'pcs', minStock: 20, supplier: 'Eggcellent Farms', lastRestocked: '2025-04-28' },
  { id: 8, ingredientName: 'Cheese', quantity: 10, unit: 'kg', minStock: 2, supplier: 'Dairy Best', lastRestocked: '2025-04-28' },
  { id: 9, ingredientName: 'Corn Kernels', quantity: 12, unit: 'kg', minStock: 2, supplier: 'Golden Harvest', lastRestocked: '2025-04-25' },
  { id: 10, ingredientName: 'Banana Leaves', quantity: 200, unit: 'pcs', minStock: 50, supplier: 'Leafy Greens', lastRestocked: '2025-04-29' },
];

export const categories = ['All', 'Rice Cakes', 'Layered Cakes', 'Sticky Rice', 'Wrapped Rice', 'Puddings', 'Root Cakes', 'Specialty'];

export const orderStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};
