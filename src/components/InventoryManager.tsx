import { useState } from 'react';
import { useData } from '../context/DataContext';
import { InventoryItem } from '../types';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Search, AlertTriangle } from 'lucide-react';

export default function InventoryManager() {
  const { inventory, updateInventory, addInventoryItem, deleteInventoryItem } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    ingredientName: '', quantity: '', unit: 'kg', minStock: '', supplier: '', lastRestocked: new Date().toISOString().split('T')[0]
  });

  const filtered = inventory.filter(i =>
    i.ingredientName.toLowerCase().includes(search.toLowerCase()) ||
    i.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setFormData({ ingredientName: '', quantity: '', unit: 'kg', minStock: '', supplier: '', lastRestocked: new Date().toISOString().split('T')[0] });
    setShowForm(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditing(item);
    setFormData({
      ingredientName: item.ingredientName,
      quantity: String(item.quantity),
      unit: item.unit,
      minStock: String(item.minStock),
      supplier: item.supplier,
      lastRestocked: item.lastRestocked,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ingredientName: formData.ingredientName,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      minStock: Number(formData.minStock),
      supplier: formData.supplier,
      lastRestocked: formData.lastRestocked,
    };
    if (editing) {
      updateInventory(editing.id, data);
    } else {
      addInventoryItem(data);
    }
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Manage Inventory</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ingredients..."
          className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ingredient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Min Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Restocked</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => {
                const isLow = item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isLow ? 'bg-red-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isLow && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="font-medium text-gray-800">{item.ingredientName}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${isLow ? 'text-red-600' : 'text-gray-600'}`}>
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.supplier}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.lastRestocked}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteInventoryItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Inventory Item</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredient Name</label>
                <input required value={formData.ingredientName} onChange={e => setFormData({...formData, ingredientName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input required type="number" min="0" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Restocked</label>
                <input required type="date" value={formData.lastRestocked} onChange={e => setFormData({...formData, lastRestocked: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors">
                {editing ? 'Update' : 'Add'} Item
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
