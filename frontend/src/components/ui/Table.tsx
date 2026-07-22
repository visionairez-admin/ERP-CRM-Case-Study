import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (row: any, index: number) => React.ReactNode;
  loading?: boolean;
  empty?: boolean;
}

export const Table: React.FC<TableProps> = ({ headers, data, renderRow, loading, empty }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-1 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (empty || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p className="font-medium">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-slate-700/50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-left px-6 py-4 font-bold text-slate-200 uppercase tracking-wide text-xs">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-800/50 transition-colors duration-200 group">
              {renderRow(row, idx)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
