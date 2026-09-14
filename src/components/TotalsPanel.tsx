import type { DiscountType, InvoiceState } from '@/types';
import { discountAmount, grandTotal, money, subtotal, taxAmount, taxableBase } from '@/lib/calc';
import { amountInWords } from '@/lib/words';

interface Props {
  state: InvoiceState;
  onPatch: (patch: Partial<InvoiceState>) => void;
}

export function TotalsPanel({ state, onPatch }: Props) {
  const sub = subtotal(state.items);
  const disc = discountAmount(state);
  const base = taxableBase(state);
  const tax = taxAmount(state);
  const total = grandTotal(state);

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-700">Totals &amp; Adjustments</h3>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Discount</label>
          <select
            value={state.discountType}
            onChange={(e) => onPatch({ discountType: e.target.value as DiscountType, discountValue: 0 })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="none">None</option>
            <option value="percent">Percent %</option>
            <option value="flat">Flat amount</option>
          </select>
        </div>
        {state.discountType !== 'none' && (
          <div className="col-span-2 sm:col-span-2">
            <label className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">
              {state.discountType === 'percent' ? 'Percentage (%)' : 'Amount'}
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={state.discountValue || ''}
              onChange={(e) => onPatch({ discountValue: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        )}
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">VAT (%)</label>
          <input
            type="number"
            min={0}
            step="any"
            value={state.taxRate || ''}
            onChange={(e) => onPatch({ taxRate: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <label className="mb-1 block text-[11px] font-semibold uppercase text-stone-400">Payment method</label>
          <select
            value={state.paymentMethod}
            onChange={(e) => onPatch({ paymentMethod: e.target.value })}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>POS / Card</option>
            <option>Mobile Money</option>
            <option>Credit</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 border-t border-dashed border-stone-200 pt-3 text-sm">
        <Row label="Subtotal" value={money(sub)} />
        {disc > 0 && <Row label="Discount" value={`- ${money(disc)}`} accent />}
        <Row label={`VAT (${state.taxRate}%)`} value={money(tax)} />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 text-white shadow">
        <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Grand Total</span>
        <span className="text-xl font-extrabold">{money(total)}</span>
      </div>
      <p className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs italic text-orange-800">
        Amount in Words: {amountInWords(total)}
      </p>
      <p className="mt-1 text-center text-[11px] text-stone-400">
        Taxable base after discount: {money(base)}
      </p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-500">{label}</span>
      <span className={accent ? 'font-semibold text-orange-700' : 'font-semibold text-stone-800'}>{value}</span>
    </div>
  );
}
