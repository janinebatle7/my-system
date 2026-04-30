import { useState } from 'react';
import { useData } from '../context/DataContext';
import { paymentStatusColors } from '../data/mockData';
import { motion } from 'framer-motion';
import { Search, CreditCard, CheckCircle, XCircle } from 'lucide-react';

export default function PaymentConfirm() {
  const { orders, updateOrder } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = orders.filter(o => {
    const matchesSearch = String(o.id).includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.id - a.id);

  const confirmPayment = (orderId: number) => {
    updateOrder(orderId, { paymentStatus: 'paid' });
  };

  const markFailed = (orderId: number) => {
    updateOrder(orderId, { paymentStatus: 'failed' });
  };

  const totalPending = orders.filter(o => o.paymentStatus === 'pending').reduce((s, o) => s + o.totalAmount, 0);
  const totalPaid = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Payments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-yellow-600">₱{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-amber-700">₱{(totalPending + totalPaid).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-amber-700">₱{order.totalAmount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.paymentStatus === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => confirmPayment(order.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Confirm Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => markFailed(order.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Mark as Failed"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
