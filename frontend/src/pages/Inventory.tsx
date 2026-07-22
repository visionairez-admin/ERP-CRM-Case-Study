import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Movement {
  id: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string | null;
  createdAt: string;
  product: { name: string; sku: string };
  createdBy: { name: string };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
}

export const Inventory: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory/movements', {
        params: { page, limit: 10 },
      });
      setMovements(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load inventory movements history');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsList = async () => {
    try {
      const res = await api.get('/products', { params: { limit: 100 } });
      setProducts(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedProductId(res.data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching products list', err);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [page]);

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleOpenAdjustment = () => {
    setSelectedProductId(products[0]?.id || '');
    setMovementType('IN');
    setQuantity(1);
    setReason('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      await api.post('/inventory/movements', {
        productId: selectedProductId,
        movementType,
        quantity: Number(quantity),
        reason: reason || undefined,
      });

      setShowModal(false);
      // Reload both movements & products to reflect correct stock values
      fetchMovements();
      fetchProductsList();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error processing inventory adjustment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 text-sm font-semibold">Audit Logs & Actions</h3>
        <button
          onClick={handleOpenAdjustment}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg px-4 h-10 flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Record Stock Adjustment
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Movements Table */}
      <div className="glass-card border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-300 font-semibold border-b border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Product details</th>
              <th className="px-6 py-4">Action Type</th>
              <th className="px-6 py-4">Qty adjusted</th>
              <th className="px-6 py-4">Reason / Notes</th>
              <th className="px-6 py-4">Logged by</th>
              <th className="px-6 py-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mx-auto"></div>
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No inventory logs registered.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-200">{m.product?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.product?.sku}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.movementType === 'IN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      STOCK {m.movementType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-300">
                    {m.movementType === 'IN' ? '+' : '-'}{m.quantity}
                  </td>
                  <td className="px-6 py-4 text-xs italic">{m.reason || 'Manual Adjustment'}</td>
                  <td className="px-6 py-4 text-xs">{m.createdBy?.name || 'System'}</td>
                  <td className="px-6 py-4 text-right text-xs">
                    {new Date(m.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-2 border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-30 rounded-lg hover:text-slate-200"
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-30 rounded-lg hover:text-slate-200"
          >
            Next
          </button>
        </div>
      )}

      {/* Record Stock Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">
              Record Stock Adjustment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Stock: {p.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Movement Type</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="IN">Stock IN (Add)</option>
                    <option value="OUT">Stock OUT (Subtract)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Reason / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Regular Audit, Restock, Damaged Goods"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
