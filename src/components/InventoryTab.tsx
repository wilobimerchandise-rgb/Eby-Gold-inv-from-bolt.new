import { useState } from 'react';
import { Plus, Trash2, Package, Search } from 'lucide-react';
import type { Product } from '@/types';
import { uid } from '@/lib/storage';
import { money } from '@/lib/calc';

interface Props {
  products: Product[];
  onChange: (p: Product[]) => void;
}

export function InventoryTab({ products, onChange }: Props) {
  const [query, setQuery] = useState('');

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode.includes(q)
    );
  });

  function update(id: string, patch: Partial<Product>) {
    onChange(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    if (!window.confirm('Remove this product from inventory?')) return;
    onChange(products.filter((p) => p.id !== id));
  }

  function add() {
    const np: Product = {
      id: uid(),
      name: 'New Product',
      sku: 'NEW-' + Date.now().toString(36).slice(-4),
      barcode: '',
      price: 0,
      cost: 0,
      unit: 'pc',
      stock: 0,
    };
    onChange([...products, np]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <Package className="h-5 w-5 text-orange-600" /> Inventory
        </h2>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-stone-300 sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-orange-50 text-left text-xs uppercase text-orange-700">
              <th className="border-b border-r border-stone-300 px-3 py-2">Name</th>
              <th className="border-b border-r border-stone-300 px-3 py-2">SKU</th>
              <th className="border-b border-r border-stone-300 px-3 py-2">Barcode</th>
              <th className="border-b border-r border-stone-300 px-3 py-2 text-right">Price ₦</th>
              <th className="border-b border-r border-stone-300 px-3 py-2 text-right">Cost ₦</th>
              <th className="border-b border-r border-stone-300 px-3 py-2 text-center">Stock</th>
              <th className="border-b border-stone-300 px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-orange-50/30">
                <td className="border-b border-r border-stone-300 px-2 py-1">
                  <input
                    value={p.name}
                    onChange={(e) => update(p.id, { name: e.target.value })}
                    className="w-full rounded border border-transparent px-1 py-1 text-sm outline-none focus:border-orange-300 focus:bg-orange-50/30"
                  />
                </td>
                <td className="border-b border-r border-stone-300 px-2 py-1">
                  <input
                    value={p.sku}
                    onChange={(e) => update(p.id, { sku: e.target.value })}
                    className="w-24 rounded border border-transparent px-1 py-1 text-sm outline-none focus:border-orange-300 focus:bg-orange-50/30"
                  />
                </td>
                <td className="border-b border-r border-stone-300 px-2 py-1">
                  <input
                    value={p.barcode}
                    onChange={(e) => update(p.id, { barcode: e.target.value })}
                    className="w-32 rounded border border-transparent px-1 py-1 text-sm outline-none focus:border-orange-300 focus:bg-orange-50/30"
                  />
                </td>
                <td className="border-b border-r border-stone-300 px-2 py-1 text-right">
                  <input
                    type="number"
                    value={p.price || ''}
                    onChange={(e) => update(p.id, { price: parseFloat(e.target.value) || 0 })}
                    className="w-20 rounded border border-transparent px-1 py-1 text-right text-sm outline-none focus:border-orange-300 focus:bg-orange-50/30"
                  />
                </td>
                <td className="border-b border-r border-stone-300 px-2 py-1 text-right">
                  <input
                    type="number"
                    value={p.cost || ''}
                    onChange={(e) => update(p.id, { cost: parseFloat(e.target.value) || 0 })}
                    className="w-20 rounded border border-transparent px-1 py-1 text-right text-sm outline-none focus:border-orange-300 focus:bg-orange-50/30"
                  />
                </td>
                <td className="border-b border-r border-stone-300 px-2 py-1 text-center">
                  <input
                    type="number"
                    value={p.stock || ''}
                    onChange={(e) => update(p.id, { stock: parseInt(e.target.value) || 0 })}
                    className={`w-16 rounded border px-1 py-1 text-center text-sm outline-none focus:border-orange-300 ${
                      p.stock <= 5
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-transparent'
                    }`}
                  />
                </td>
                <td className="border-b border-stone-300 px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="inline-flex items-center justify-center rounded border border-red-200 px-2 py-1 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="space-y-3 sm:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border border-stone-200 p-3">
            <input
              value={p.name}
              onChange={(e) => update(p.id, { name: e.target.value })}
              className="mb-2 w-full rounded border border-stone-200 px-2 py-1.5 text-sm font-semibold outline-none focus:border-orange-400"
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">SKU</span>
                <input
                  value={p.sku}
                  onChange={(e) => update(p.id, { sku: e.target.value })}
                  className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">Barcode</span>
                <input
                  value={p.barcode}
                  onChange={(e) => update(p.id, { barcode: e.target.value })}
                  className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">Price ₦</span>
                <input
                  type="number"
                  value={p.price || ''}
                  onChange={(e) => update(p.id, { price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">Cost ₦</span>
                <input
                  type="number"
                  value={p.cost || ''}
                  onChange={(e) => update(p.id, { cost: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">Stock</span>
                <input
                  type="number"
                  value={p.stock || ''}
                  onChange={(e) => update(p.id, { stock: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded border px-2 py-1 text-sm outline-none ${
                    p.stock <= 5 ? 'border-red-300 bg-red-50 text-red-700' : 'border-stone-200'
                  } focus:border-orange-400`}
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase text-stone-400">Unit</span>
                <input
                  value={p.unit}
                  onChange={(e) => update(p.id, { unit: e.target.value })}
                  className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-red-200 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-400">
        {products.length} products · Low stock items (≤5) shown in red. Profit per item:{' '}
        {money(Math.max(0, ...products.map((p) => p.price - p.cost)))} max margin.
      </p>
    </div>
  );
}
