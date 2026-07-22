import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Customer {
  id: string;
  businessName: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  currentStock: number;
}

interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { name: string; sku: string };
}

interface Sale {
  id: string;
  challanNumber: string;
  totalAmount: number;
  status: string;
  notes: string | null;
  createdAt: string;
  customer: { businessName: string };
  createdBy: { name: string };
  items: SaleItem[];
}

export const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: '', quantity: 1 },
  ]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sales', { params: { page, limit: 8 } });
      setSales(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch sales records');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        api.get('/customers', { params: { limit: 100 } }),
        api.get('/products', { params: { limit: 100 } }),
      ]);
      setCustomers(custRes.data.data);
      setProducts(prodRes.data.data);
    } catch (err) {
      console.error('Error fetching dependencies', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const updated = [...items];
    if (field === 'productId') {
      updated[index].productId = value as string;
    } else {
      updated[index].quantity = Math.max(1, Number(value));
    }
    setItems(updated);
  };

  const handleOpenCreate = () => {
    setSelectedCustomerId(customers[0]?.id || '');
    setNotes('');
    setItems([{ productId: products[0]?.id || '', quantity: 1 }]);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanItems = items.filter((i) => i.productId !== '');
    if (cleanItems.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      await api.post('/sales', {
        customerId: selectedCustomerId,
        notes: notes || undefined,
        items: cleanItems,
      });

      setShowCreateModal(false);
      fetchSales();
      fetchDependencies(); // Reload stock
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating sales challan');
    }
  };

  const getCalculatedTotal = () => {
    return items.reduce((acc, row) => {
      const prod = products.find((p) => p.id === row.productId);
      if (prod) {
        return acc + Number(prod.price) * row.quantity;
      }
      return acc;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 text-sm font-semibold">Sales Order Management</h3>
        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg px-4 h-10 flex items-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Create Sales Challan
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Sales List Table */}
      <div className="glass-card border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-300 font-semibold border-b border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Challan No</th>
              <th className="px-6 py-4">Client Business</th>
              <th className="px-6 py-4">Total Value</th>
              <th className="px-6 py-4">Items count</th>
              <th className="px-6 py-4">Issued by</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mx-auto"></div>
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No sales challans recorded.
                </td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-200">{s.challanNumber}</td>
                  <td className="px-6 py-4">{s.customer?.businessName}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${Number(s.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs font-mono">{s.items?.length || 0} items</td>
                  <td className="px-6 py-4 text-xs">{s.createdBy?.name || 'System'}</td>
                  <td className="px-6 py-4 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedSale(s)}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                    >
                      View Invoice
                    </button>
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

      {/* Create Sales Challan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl glass p-6 rounded-xl border border-slate-800 space-y-6 my-8">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">
              Generate Sales Challan (Stock auto-deduction)
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Select Customer</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Internal challan notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Terms Net 30, Deliver to warehouse B"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wide">Challan Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    + Add Product Line
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {items.map((row, index) => {
                    const activeProd = products.find((p) => p.id === row.productId);
                    return (
                      <div key={index} className="flex gap-3 items-center">
                        <select
                          value={row.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id} disabled={p.currentStock <= 0}>
                              {p.name} ({p.sku}) — Stock: {p.currentStock} — Price: ${Number(p.price).toFixed(2)}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          required
                          value={row.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                        />

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(index)}
                            className="text-red-400 hover:text-red-300 p-2 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-lg flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-400">Total Challan Amount</span>
                <span className="text-xl font-bold text-emerald-400">
                  ${getCalculatedTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  Issue Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass p-6 rounded-xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-200">
                  Sales Challan Invoice
                </h3>
                <p className="text-xs text-slate-500 mt-1">Challan: {selectedSale.challanNumber}</p>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Customer</p>
                  <p className="font-semibold text-slate-200 mt-1">{selectedSale.customer?.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Issue Date</p>
                  <p className="mt-1">{new Date(selectedSale.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Line Items Details</p>
                <div className="border border-slate-800 rounded-lg overflow-hidden mt-2">
                  <table className="w-full text-left text-xs text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-300 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">Item</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedSale.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2">
                            <p className="font-semibold text-slate-300">{item.product?.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{item.product?.sku}</p>
                          </td>
                          <td className="px-3 py-2 font-mono">{item.quantity}</td>
                          <td className="px-3 py-2 text-right font-mono">${Number(item.unitPrice).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono text-emerald-400">${Number(item.totalPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedSale.notes && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Notes</p>
                  <p className="italic text-xs mt-1 text-slate-400">{selectedSale.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-4">
                <span className="text-xs text-slate-500 uppercase font-semibold">Grand Total</span>
                <span className="text-lg font-bold text-emerald-400">
                  ${Number(selectedSale.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
