import { useState } from 'react';
import { useData } from '../context/DataContext';
import { orderStatusColors } from '../data/mockData';
import { OrderStatus } from '../types';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChefHat } from 'lucide-react';

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

export default function OrderProcessor() {
  const { orders, updateOrder } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch = String(o.id).includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.id - a.id);

  const advanceStatus = (orderId: number, currentStatus: OrderStatus) => {
    const idx = statusFlow.indexOf(currentStatus);
    if (idx >= 0 && idx < statusFlow.length - 1) {
      updateOrder(orderId, { orderStatus: statusFlow[idx + 1] });
    }
  };

  const cancelOrder = (orderId: number) => {
    updateOrder(orderId, { orderStatus: 'cancelled' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Process Orders</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div
              className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${orderStatusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-amber-700">₱{order.totalAmount}</p>
                  <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {expandedOrder === order.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t px-4 py-4 bg-gray-50/50">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer Info</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {order.customerName}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Address:</span> {order.customerAddress}</p>
                    {order.reservationDate && <p className="text-sm text-gray-700"><span className="font-medium">Reservation:</span> {order.reservationDate}</p>}
                    {order.notes && <p className="text-sm text-gray-700"><span className="font-medium">Notes:</span> {order.notes}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Items</p>
                    <div className="space-y-1">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.kakaninName} x{item.quantity}</span>
                          <span className="text-gray-600">₱{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                    <button
                      onClick={() => advanceStatus(order.id, order.orderStatus)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Mark as {statusFlow[statusFlow.indexOf(order.orderStatus) + 1] || 'next'}
                    </button>
                  )}
                  {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders found.</p>
        </div>
      )}
    </motion.div>
  );
}
