import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
  categoryId: string;
  category: Category;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Pagination
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form (Product)
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [minimumStock, setMinimumStock] = useState(0);
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Form (Category)
  const [newCatName, setNewCatName] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: { page, search, categoryId, limit: 8 },
      });
      setProducts(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateProduct = () => {
    setEditingId(null);
    setSku('');
    setName('');
    setPrice(0);
    setMinimumStock(0);
    setProdCategoryId(categories[0]?.id || '');
    setIsActive(true);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingId(p.id);
    setSku(p.sku);
    setName(p.name);
    setPrice(Number(p.price));
    setMinimumStock(p.minimumStock);
    setProdCategoryId(p.categoryId);
    setIsActive(p.isActive);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      sku,
      name,
      price: Number(price),
      minimumStock: Number(minimumStock),
      categoryId: prodCategoryId,
      isActive,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await api.post('/products/categories', { name: newCatName });
      setNewCatName('');
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 h-10 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 h-10 text-slate-400 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 font-semibold text-sm rounded-lg px-4 h-10 flex items-center gap-2"
          >
            Add Category
          </button>
          <button
            onClick={handleOpenCreateProduct}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg px-4 h-10 flex items-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Catalog Table */}
      <div className="glass-card border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-300 font-semibold border-b border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">SKU / ID</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Levels</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mx-auto"></div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No products in catalog.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLowStock = p.currentStock <= p.minimumStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        {!p.isActive && (
                          <span className="text-[10px] text-red-400 font-medium mt-1">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-indigo-400">{p.sku}</td>
                    <td className="px-6 py-4">{p.category?.name || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-slate-300">${Number(p.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className={`font-semibold ${
                            isLowStock ? 'text-red-400' : 'text-slate-300'
                          }`}
                        >
                          {p.currentStock} units
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Min required: {p.minimumStock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

      {/* Product Entry Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">
              {editingId ? 'Edit Product Details' : 'Register New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Unique SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Wholesale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Minimum Stock Alert</label>
                  <input
                    type="number"
                    required
                    value={minimumStock}
                    onChange={(e) => setMinimumStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Category</label>
                  <select
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Active Status</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled / Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-semibold shadow-inner"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Creation Form Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">
              Add Product Category
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perishable Goods"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
