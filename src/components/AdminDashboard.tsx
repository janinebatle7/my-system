import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Utensils, Package, ClipboardList,
  CreditCard, BarChart3, Users
} from 'lucide-react';
import MenuManager from './MenuManager';
import InventoryManager from './InventoryManager';
import OrderProcessor from './OrderProcessor';
import PaymentConfirm from './PaymentConfirm';
import SalesReports from './SalesReports';

const tabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'menu', label: 'Menu', icon: Utensils },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.key
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <Overview key="overview" />}
        {activeTab === 'menu' && <MenuManager key="menu" />}
        {activeTab === 'inventory' && <InventoryManager key="inventory" />}
        {activeTab === 'orders' && <OrderProcessor key="orders" />}
        {activeTab === 'payments' && <PaymentConfirm key="payments" />}
        {activeTab === 'reports' && <SalesReports key="reports" />}
      </AnimatePresence>
    </div>
  );
}

function Overview() {
  const { orders, kakanin, inventory } = useDataImport();
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const lowStock = inventory.filter(i => i.quantity <= i.minStock).length;
  const totalCustomers = new Set(orders.map(o => o.customerId)).size;

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'bg-blue-500', icon: ClipboardList },
    { label: 'Revenue', value: `₱${totalRevenue.toLocaleString()}`, color: 'bg-green-500', icon: BarChart3 },
    { label: 'Pending Orders', value: pendingOrders, color: 'bg-yellow-500', icon: Package },
    { label: 'Low Stock Items', value: lowStock, color: 'bg-red-500', icon: Utensils },
    { label: 'Menu Items', value: kakanin.length, color: 'bg-purple-500', icon: Utensils },
    { label: 'Customers', value: totalCustomers, color: 'bg-teal-500', icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {orders.slice(-5).reverse().map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-700">₱{order.totalAmount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Low Stock Alerts</h3>
          <div className="space-y-2">
            {inventory.filter(i => i.quantity <= i.minStock).length === 0 ? (
              <p className="text-sm text-gray-400">All inventory levels are healthy.</p>
            ) : (
              inventory.filter(i => i.quantity <= i.minStock).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.ingredientName}</p>
                    <p className="text-xs text-gray-400">Min: {item.minStock} {item.unit}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">{item.quantity} {item.unit}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper to avoid circular imports
import { useData } from '../context/DataContext';
function useDataImport() {
  return useData();
}
