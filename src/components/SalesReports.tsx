import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

const COLORS = ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'];

export default function SalesReports() {
  const { orders, kakanin } = useData();
  const [reportType, setReportType] = useState<'daily' | 'category' | 'trend'>('daily');

  const stats = useMemo(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
    const uniqueCustomers = new Set(orders.map(o => o.customerId)).size;
    return { totalRevenue, totalOrders, avgOrder, uniqueCustomers };
  }, [orders]);

  const dailyData = useMemo(() => {
    const grouped: Record<string, { date: string; revenue: number; orders: number; items: number }> = {};
    orders.filter(o => o.paymentStatus === 'paid').forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) grouped[date] = { date, revenue: 0, orders: 0, items: 0 };
      grouped[date].revenue += order.totalAmount;
      grouped[date].orders += 1;
      grouped[date].items += order.items.reduce((s, i) => s + i.quantity, 0);
    });
    return Object.values(grouped).slice(-14);
  }, [orders]);

  const categoryData = useMemo(() => {
    const grouped: Record<string, { name: string; value: number; revenue: number }> = {};
    orders.filter(o => o.paymentStatus === 'paid').forEach(order => {
      order.items.forEach(item => {
        const k = kakanin.find(kk => kk.id === item.kakaninId);
        const cat = k?.category || 'Other';
        if (!grouped[cat]) grouped[cat] = { name: cat, value: 0, revenue: 0 };
        grouped[cat].value += item.quantity;
        grouped[cat].revenue += item.subtotal;
      });
    });
    return Object.values(grouped);
  }, [orders, kakanin]);

  const trendData = useMemo(() => {
    return dailyData.map((d, i, arr) => ({
      ...d,
      cumulative: arr.slice(0, i + 1).reduce((s, x) => s + x.revenue, 0)
    }));
  }, [dailyData]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Reports</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
          { label: 'Avg Order Value', value: `₱${stats.avgOrder}`, icon: TrendingUp, color: 'bg-amber-500' },
          { label: 'Unique Customers', value: stats.uniqueCustomers, icon: Users, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'daily', label: 'Daily Sales' },
          { key: 'category', label: 'By Category' },
          { key: 'trend', label: 'Revenue Trend' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              reportType === tab.key
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {reportType === 'daily' && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Daily Sales (Last 14 Days)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportType === 'category' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{cat.value} pcs</p>
                      <p className="text-xs text-gray-500">₱{cat.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'trend' && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Cumulative Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="cumulative" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
