import { useMemo, useState } from 'react';
import { Search, UserPlus, Check, ChevronDown } from 'lucide-react';
import type { Customer } from '@/types';

interface Props {
  customers: Customer[];
  selected: Customer;
  onSelect: (c: Customer) => void;
  onSaveNew: (c: Customer) => void;
}

export function CustomerPanel({ customers, selected, onSelect, onSaveNew }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'select' | 'new'>('select');
  const [draft, setDraft] = useState<Customer>({ id: '', name: '', phone: '', address: '' });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q),
    );
  }, [customers, query]);

  function choose(c: Customer) {
    onSelect(c);
    setOpen(false);
    setQuery('');
    setMode('select');
  }

  function saveNew() {
    if (!draft.name.trim()) return;
    const c: Customer = { ...draft, id: 'c-' + Date.now().toString(36) };
    onSaveNew(c);
    choose(c);
    setDraft({ id: '', name: '', phone: '', address: '' });
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-700">
          <UserPlus className="h-4 w-4" /> Customer
        </h3>
        <button
          type="button"
          onClick={() => { setMode('new'); setOpen(true); }}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800"
        >
          + New customer
        </button>
      </div>

      {/* Selected summary */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setMode('select'); }}
        className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-left transition hover:border-amber-300"
      >
        <div className="min-w-0">
          {selected.name ? (
            <>
              <p className="truncate text-sm font-bold text-stone-800">{selected.name}</p>
              <p className="truncate text-xs text-stone-500">{selected.phone} · {selected.address}</p>
            </>
          ) : (
            <p className="text-sm text-stone-400">Select or add a customer…</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-amber-600 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* tabs */}
          <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setMode('select')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                mode === 'select' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500'
              }`}
            >
              Saved list
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                mode === 'new' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500'
              }`}
            >
              New entry
            </button>
          </div>

          {mode === 'select' ? (
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone, address…"
                  className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <ul className="max-h-56 space-y-1 overflow-y-auto">
                {filtered.length === 0 && (
                  <li className="px-2 py-3 text-center text-xs text-stone-400">No matches.</li>
                )}
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => choose(c)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-amber-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-800">{c.name}</p>
                        <p className="truncate text-xs text-stone-500">{c.phone} · {c.address}</p>
                      </div>
                      {selected.id === c.id && <Check className="h-4 w-4 shrink-0 text-amber-600" />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="space-y-2">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Customer name *"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="Phone"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <textarea
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                placeholder="Address"
                rows={2}
                className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveNew}
                  disabled={!draft.name.trim()}
                  className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save &amp; use
                </button>
                <button
                  type="button"
                  onClick={() => setMode('select')}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
