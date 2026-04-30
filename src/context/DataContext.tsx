import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kakanin, Order, InventoryItem } from '../types';
import { initialKakanin, initialOrders, initialInventory } from '../data/mockData';

interface DataContextType {
  kakanin: Kakanin[];
  orders: Order[];
  inventory: InventoryItem[];
  addKakanin: (item: Omit<Kakanin, 'id'>) => void;
  updateKakanin: (id: number, item: Partial<Kakanin>) => void;
  deleteKakanin: (id: number) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrder: (id: number, updates: Partial<Order>) => void;
  updateInventory: (id: number, updates: Partial<InventoryItem>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: number) => void;
  getOrdersByCustomer: (customerId: number) => Order[];
  getOrderById: (id: number) => Order | undefined;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function getStoredData<T>(key: string, fallback: T[]): T[] {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [kakanin, setKakanin] = useState<Kakanin[]>(() => getStoredData('kakanin', initialKakanin));
  const [orders, setOrders] = useState<Order[]>(() => getStoredData('orders', initialOrders));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getStoredData('inventory', initialInventory));

  useEffect(() => { localStorage.setItem('kakanin', JSON.stringify(kakanin)); }, [kakanin]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);

  const addKakanin = (item: Omit<Kakanin, 'id'>) => {
    const newId = Math.max(...kakanin.map(k => k.id), 0) + 1;
    setKakanin(prev => [...prev, { ...item, id: newId }]);
  };

  const updateKakanin = (id: number, updates: Partial<Kakanin>) => {
    setKakanin(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const deleteKakanin = (id: number) => {
    setKakanin(prev => prev.filter(k => k.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const newId = Math.max(...orders.map(o => o.id), 1000) + 1;
    const now = new Date().toISOString();
    const newOrder: Order = { ...order, id: newId, createdAt: now, updatedAt: now };
    setOrders(prev => [...prev, newOrder]);
    // Deduct stock
    order.items.forEach(item => {
      setKakanin(prev => prev.map(k => 
        k.id === item.kakaninId ? { ...k, stock: Math.max(0, k.stock - item.quantity) } : k
      ));
    });
    return newOrder;
  };

  const updateOrder = (id: number, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o));
  };

  const updateInventory = (id: number, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newId = Math.max(...inventory.map(i => i.id), 0) + 1;
    setInventory(prev => [...prev, { ...item, id: newId }]);
  };

  const deleteInventoryItem = (id: number) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const getOrdersByCustomer = (customerId: number) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const getOrderById = (id: number) => {
    return orders.find(o => o.id === id);
  };

  const refreshData = () => {
    setKakanin(getStoredData('kakanin', initialKakanin));
    setOrders(getStoredData('orders', initialOrders));
    setInventory(getStoredData('inventory', initialInventory));
  };

  return (
    <DataContext.Provider value={{
      kakanin, orders, inventory,
      addKakanin, updateKakanin, deleteKakanin,
      addOrder, updateOrder,
      updateInventory, addInventoryItem, deleteInventoryItem,
      getOrdersByCustomer, getOrderById, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
