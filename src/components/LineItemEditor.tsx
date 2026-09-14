import { useMemo, useRef, useState } from 'react';
import { Search, Plus, Trash2, Package, AlertCircle } from 'lucide-react';
import type { LineItem, Product } from '@/types';
import { lineTotal, money } from '@/lib/calc';
import { newLineItem } from '@/lib/invoice';

interface Props {
  items: LineItem[];
  products: Product[];
  onChange: (items: LineItem[]) => void;
}

export function LineItemEditor({ items, products, onChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const blurTimer = useRef<number | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q),
      )
      .slice(0, 8);
  }, [products, query]);

  function update(id: string, patch: Partial<LineItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function remove(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function add() {
    onChange([...items, newLineItem()]);
  }

  function pickProduct(itemId: string, p: Product) {
    update(itemId, {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      barcode: p.barcode,
      price: p.price,
      unit: p.unit,
    });
    setActiveId(null);
    setQuery('');
  }

  function openDropdown(id: string) {
    if (blurTimer.current) window.clearTimeout(blurTimer.current);
    setActiveId(id);
    setQuery('');
  }

  function closeDropdownSoon() {
    blurTimer.current = window.setTimeout(() => setActiveId(null), 150);
  }

  function stockFor(item: LineItem): number | null {
    if (!item.productId) return null;
    const p = products.find((x) => x.id === item.productId);
    return p ? p.stock : null;
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
          <Package className="h-4 w-4" /> Line Items
        </h3>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 py-10 text-center">
          <Package className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-2 text-sm text-stone-400">No items yet. Tap "Add row" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const stock = stockFor(item);
            const overStock = stock !== null && item.quantity > stock;
            return (
              <div key={item.id} className="rounded-xl border border-stone-200 p-3">
                {/* S/N badge + product search */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                    {idx + 1}
                  </span>
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      value={activeId === item.id ? query : item.name}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveId(item.id);
                      }}
                      onFocus={() => openDropdown(item.id)}
                      onBlur={closeDropdownSoon}
                      placeholder="Search product / SKU / barcode…"
                      className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                    {activeId === item.id && (
                      <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                        {results.length === 0 && (
                          <li className="px-3 py-2 text-xs text-stone-400">No products found.</li>
                        )}
                        {results.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => pickProduct(item.id, p)}
                              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-orange-50"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-stone-800">{p.name}</p>
                                <p className="text-xs text-stone-500">
                                  {p.sku} · {money(p.price)}/{p.unit} · {p.stock} in stock
                                </p>
                              </div>
                              <Plus className="h-4 w-4 shrink-0 text-orange-600" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* bordered mini-table: Qty | Unit Price | Total | Action */}
                <div className="overflow-hidden rounded-lg border border-stone-300">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-stone-50 text-[11px] uppercase text-stone-500">
                        <th className="border-b border-r border-stone-300 px-2 py-1 text-left">Qty</th>
                        <th className="border-b border-r border-stone-300 px-2 py-1 text-left">Unit Price ₦</th>
                        <th className="border-b border-r border-stone-300 px-2 py-1 text-left">Total ₦</th>
                        <th className="border-b border-stone-300 px-2 py-1 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-stone-300 px-1 py-1">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={item.quantity || ''}
                            onChange={(e) =>
                              update(item.id, { quantity: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                          />
                        </td>
                        <td className="border-r border-stone-300 px-1 py-1">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={item.price || ''}
                            onChange={(e) =>
                              update(item.id, { price: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                          />
                        </td>
                        <td className="border-r border-stone-300 px-2 py-1">
                          <span className="block py-1 text-sm font-bold text-orange-800">
                            {money(lineTotal(item))}
                          </span>
                        </td>
                        <td className="px-1 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            aria-label="Remove row"
                            className="inline-flex items-center justify-center rounded border border-red-200 px-2 py-1 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* stock warning */}
                {overStock && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Only {stock} in stock — reduce quantity.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
