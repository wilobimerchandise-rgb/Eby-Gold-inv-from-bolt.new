import type { InvoiceState } from '@/types';

interface Props {
  state: InvoiceState;
  onPatch: (patch: Partial<InvoiceState>) => void;
}

export function MetaPanel({ state, onPatch }: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700">Document details</h3>
      <div className="grid grid-cols-2 gap-2">
        <label className="col-span-2 block">
          <span className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Invoice / Receipt #</span>
          <input
            value={state.invoiceNumber}
            onChange={(e) => onPatch({ invoiceNumber: e.target.value })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Date</span>
          <input
            type="date"
            value={state.date}
            onChange={(e) => onPatch({ date: e.target.value })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Due date</span>
          <input
            type="date"
            value={state.dueDate}
            onChange={(e) => onPatch({ dueDate: e.target.value })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </label>
        <label className="col-span-2 block">
          <span className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Notes</span>
          <textarea
            value={state.notes}
            onChange={(e) => onPatch({ notes: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </label>
      </div>
    </div>
  );
}
