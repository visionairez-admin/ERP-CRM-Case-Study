import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface DashboardData {
  metrics: {
    totalCustomers: number;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
  };
  recentSales: Array<{
    id: string;
    challanNumber: string;
    totalAmount: number;
    createdAt: string;
    customer: { businessName: string };
  }>;
  lowStockProducts: Array<{
    name: string;
    sku: string;
    currentStock: number;
    minimumStock: number;
  }>;
}

const MetricCard = ({
  title,
  value,
  subtext,
  icon,
  iconBg,
  trend,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; up: boolean };
}) => (
  <div className="relative bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 overflow-hidden group hover:border-slate-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          trend.up
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            : 'text-red-400 bg-red-500/10 border border-red-500/20'
        }`}>
          <svg className={`w-3 h-3 ${trend.up ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {trend.value}
        </div>
      )}
    </div>

    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">{title}</p>
      <p className="text-3xl font-bold text-white tracking-tight count-up">{value}</p>
      {subtext && <p className="text-xs text-slate-600 mt-1">{subtext}</p>}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => setError('Failed to load dashboard metrics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-5 rounded-xl flex items-center gap-3">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error || 'No metrics data found'}
      </div>
    );
  }

  const { metrics, recentSales, lowStockProducts } = data;

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Good day! 👋</h1>
          <p className="text-sm text-slate-500">Here's what's happening in your business today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Total Revenue"
          value={`₹${Number(metrics.totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtext="All-time earnings"
          trend={{ value: 'Active', up: true }}
          iconBg="bg-emerald-500/15"
          icon={
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Sales Transactions"
          value={metrics.totalSales}
          subtext="Challans created"
          iconBg="bg-indigo-500/15"
          icon={
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <MetricCard
          title="Product Catalog"
          value={metrics.totalProducts}
          subtext="Total SKUs in system"
          iconBg="bg-amber-500/15"
          icon={
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <MetricCard
          title="Active Customers"
          value={metrics.totalCustomers}
          subtext="Registered accounts"
          iconBg="bg-cyan-500/15"
          icon={
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Recent Transactions</h3>
                  <p className="text-xs text-slate-500">Latest sales challans</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/40">
                {recentSales.length} records
              </span>
            </div>

            {/* Table body */}
            {recentSales.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">No transactions yet</p>
                <p className="text-slate-600 text-xs mt-1">Sales challans will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {recentSales.map((sale, idx) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/20 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/15 flex items-center justify-center text-xs font-bold text-indigo-400">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {sale.challanNumber}
                        </p>
                        <p className="text-xs text-slate-500">{sale.customer.businessName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        ₹{Number(sale.totalAmount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {new Date(sale.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Card Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Low Stock Alerts</h3>
                <p className="text-xs text-slate-500">Inventory warnings</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-emerald-400 font-semibold text-sm">All levels optimal</p>
                  <p className="text-slate-600 text-xs mt-1">No stock alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map(prod => {
                    const pct = Math.min(100, Math.round((prod.currentStock / prod.minimumStock) * 100));
                    const isCritical = pct < 30;
                    return (
                      <div key={prod.sku} className={`p-4 rounded-xl border transition-all ${
                        isCritical
                          ? 'bg-red-500/8 border-red-500/20'
                          : 'bg-amber-500/8 border-amber-500/20'
                      }`}>
                        <div className="flex items-start justify-between mb-2.5">
                          <p className={`text-sm font-semibold truncate flex-1 mr-2 ${isCritical ? 'text-red-300' : 'text-amber-300'}`}>
                            {prod.name}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isCritical
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {prod.currentStock}/{prod.minimumStock}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-[10px] text-slate-600 font-mono">{prod.sku}</span>
                          <span className={`text-[10px] font-semibold ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
