import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { categories, orderStatusColors, paymentStatusColors } from '../data/mockData';
import { Kakanin, OrderItem, PaymentMethod } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Plus, Minus, Trash2, Search, ChefHat, Package,
  CreditCard, Calendar, CheckCircle,
  X, Filter
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { kakanin, addOrder, getOrdersByCustomer } = useData();
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders'>('menu');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [reservationDate, setReservationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filteredKakanin = kakanin.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const addToCart = (item: Kakanin) => {
    setCart(prev => {
      const existing = prev.find(c => c.kakaninId === item.id);
      if (existing) {
        return prev.map(c => c.kakaninId === item.id ? { ...c, quantity: c.quantity + 1, subtotal: (c.quantity + 1) * c.unitPrice } : c);
      }
      return [...prev, { id: Date.now(), kakaninId: item.id, kakaninName: item.name, quantity: 1, unitPrice: item.price, subtotal: item.price }];
    });
  };

  const updateCartQty = (kakaninId: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.kakaninId === kakaninId) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty, subtotal: newQty * c.unitPrice };
      }
      return c;
    }));
  };

  const removeFromCart = (kakaninId: number) => {
    setCart(prev => prev.filter(c => c.kakaninId !== kakaninId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = () => {
    if (!user || cart.length === 0) return;
    addOrder({
      customerId: user.id,
      customerName: user.fullName,
      customerPhone: user.phone || '',
      customerAddress: user.address || '',
      items: [...cart],
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      reservationDate: reservationDate || undefined,
      notes: notes || undefined,
    });
    setCart([]);
    setShowCheckout(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
    setActiveTab('orders');
  };

  const myOrders = user ? getOrdersByCustomer(user.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'menu', label: 'Browse Menu', icon: ChefHat },
          { key: 'cart', label: `My Cart (${cart.length})`, icon: ShoppingCart },
          { key: 'orders', label: 'My Orders', icon: Package },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
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
        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search kakanin..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredKakanin.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-amber-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{item.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-700">₱{item.price}</span>
                      <span className="text-xs text-gray-400">{item.stock} left</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredKakanin.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No kakanin found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {cart.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600">Your cart is empty</h3>
                <p className="text-gray-400 mt-1">Browse our menu and add some delicious kakanin!</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {cart.map(item => (
                    <div key={item.kakaninId} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <ChefHat className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.kakaninName}</h4>
                        <p className="text-sm text-gray-500">₱{item.unitPrice} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(item.kakaninId, -1)} className="p-1 hover:bg-gray-100 rounded">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.kakaninId, 1)} className="p-1 hover:bg-gray-100 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-semibold text-amber-700">₱{item.subtotal}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.kakaninId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
                  <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                      <span>₱{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-amber-700">₱{cartTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {orderSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
              >
                <CheckCircle className="w-5 h-5" />
                Order placed successfully! You can track it below.
              </motion.div>
            )}
            {myOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600">No orders yet</h3>
                <p className="text-gray-400 mt-1">Your order history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.sort((a, b) => b.id - a.id).map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.kakaninName} x{item.quantity}</span>
                          <span className="text-gray-800">₱{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> {order.paymentMethod.toUpperCase()}</span>
                        {order.reservationDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {order.reservationDate}</span>}
                      </div>
                      <span className="font-bold text-amber-700">₱{order.totalAmount}</span>
                    </div>
                    {order.notes && (
                      <p className="mt-2 text-xs text-gray-400 italic">Note: {order.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                <button onClick={() => setShowCheckout(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['cash', 'gcash', 'maya'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          paymentMethod === method
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method === 'cash' ? '💵 Cash' : method === 'gcash' ? '📱 GCash' : '💳 Maya'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reservation/Pickup Date (Optional)</label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none resize-none"
                    placeholder="Any special requests..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                  {cart.map(item => (
                    <div key={item.kakaninId} className="flex justify-between text-sm py-1">
                      <span>{item.kakaninName} x{item.quantity}</span>
                      <span>₱{item.subtotal}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold text-amber-700">
                    <span>Total</span>
                    <span>₱{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
