import type { Branding, FormatMode, InvoiceState } from '@/types';
import { discountAmount, grandTotal, lineTotal, money, subtotal, taxAmount } from '@/lib/calc';
import { amountInWords } from '@/lib/words';

interface Props {
  state: InvoiceState;
  mode: FormatMode;
  branding: Branding;
}

export function PrintableDocument({ state, mode, branding }: Props) {
  if (mode === 'receipt') return <ReceiptDoc state={state} branding={branding} />;
  return <InvoiceDoc state={state} branding={branding} />;
}

/* ----------------------------- A4 INVOICE ----------------------------- */

function InvoiceDoc({ state, branding }: { state: InvoiceState; branding: Branding }) {
  const sub = subtotal(state.items);
  const disc = discountAmount(state);
  const tax = taxAmount(state);
  const total = grandTotal(state);

  return (
    <div id="print-area" className="print-area relative mx-auto w-full max-w-[800px] bg-white p-8 text-stone-800 shadow-sm sm:p-10">
      {/* watermark */}
      {branding.logoDataUrl && (
        <img
          src={branding.logoDataUrl}
          alt=""
          className="pointer-events-none absolute inset-0 m-auto h-64 w-64 object-contain opacity-10"
        />
      )}

      {/* header */}
      <div className="relative flex items-start justify-between border-b-2 border-orange-500 pb-5">
        <div className="flex items-start gap-3">
          {branding.logoDataUrl ? (
            <img src={branding.logoDataUrl} alt="logo" className="h-12 w-12 object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-lg font-black text-white">
              EG
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900">{branding.brand}</h1>
            <p className="text-xs text-stone-500">{branding.address}</p>
            <p className="text-xs text-stone-500">Tel: {branding.phone} · {branding.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black uppercase tracking-tight text-orange-600">Invoice</h2>
          <p className="mt-1 text-sm font-semibold text-stone-700">#{state.invoiceNumber}</p>
          <p className="text-xs text-stone-500">Issued: {state.date}</p>
          <p className="text-xs text-stone-500">Due: {state.dueDate}</p>
        </div>
      </div>

      {/* bill to */}
      <div className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-orange-50/60 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">Bill To</p>
          <p className="text-sm font-bold text-stone-800">{state.customer.name || '—'}</p>
          <p className="text-xs text-stone-600">{state.customer.phone}</p>
          <p className="text-xs text-stone-600">{state.customer.address}</p>
        </div>
        <div className="rounded-lg bg-stone-50 p-4 sm:text-right">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">Payment</p>
          <p className="text-sm font-semibold text-stone-800">{state.paymentMethod}</p>
          <p className="text-xs text-stone-500">Status: Unpaid</p>
        </div>
      </div>

      {/* items table with borders */}
      <table className="relative mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border border-orange-500 bg-orange-50 text-left text-[11px] uppercase tracking-wider text-orange-700">
            <th className="border border-orange-300 px-2 py-2 text-center">S/N</th>
            <th className="border border-orange-300 px-2 py-2">Item Name</th>
            <th className="border border-orange-300 px-2 py-2 text-center">Qty</th>
            <th className="border border-orange-300 px-2 py-2 text-right">Unit Price ₦</th>
            <th className="border border-orange-300 px-2 py-2 text-right">Total ₦</th>
          </tr>
        </thead>
        <tbody>
          {state.items.length === 0 ? (
            <tr>
              <td colSpan={5} className="border border-stone-200 py-6 text-center text-stone-400">
                No items.
              </td>
            </tr>
          ) : (
            state.items.map((it, idx) => (
              <tr key={it.id} className="border border-stone-200">
                <td className="border border-stone-200 px-2 py-2 text-center">{idx + 1}</td>
                <td className="border border-stone-200 px-2 py-2">
                  <p className="font-semibold text-stone-800">{it.name || '—'}</p>
                  <p className="text-[11px] text-stone-400">{it.sku}</p>
                </td>
                <td className="border border-stone-200 px-2 py-2 text-center">
                  {it.quantity} {it.unit}
                </td>
                <td className="border border-stone-200 px-2 py-2 text-right">{money(it.price)}</td>
                <td className="border border-stone-200 px-2 py-2 text-right font-semibold">{money(lineTotal(it))}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* totals */}
      <div className="relative mt-5 flex justify-end">
        <div className="w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Subtotal</span>
            <span>{money(sub)}</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-orange-700">
              <span>Discount</span>
              <span>- {money(disc)}</span>
            </div>
          )}
          {state.taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-stone-500">VAT ({state.taxRate}%)</span>
              <span>{money(tax)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-orange-500 pt-2 text-lg font-black text-stone-900">
            <span>Grand Total</span>
            <span>{money(total)}</span>
          </div>
          <p className="pt-1 text-xs italic text-stone-600">
            Amount in Words: {amountInWords(total)}
          </p>
        </div>
      </div>

      {/* payment information */}
      <div className="relative mt-6 border-t border-stone-200 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-orange-700">Payment Information</p>
        <div className="grid grid-cols-1 gap-1 text-xs text-stone-600 sm:grid-cols-3">
          <p><span className="font-semibold text-stone-700">Bank:</span> {state.payment.bankName}</p>
          <p><span className="font-semibold text-stone-700">Account Name:</span> {state.payment.accountName}</p>
          <p><span className="font-semibold text-stone-700">Account No:</span> {state.payment.accountNumber}</p>
        </div>
      </div>

      {state.notes && (
        <div className="relative mt-4 rounded-lg border border-stone-200 p-3 text-xs text-stone-600">
          <p className="mb-1 font-bold uppercase tracking-wider text-stone-500">Notes</p>
          {state.notes}
        </div>
      )}

      {/* footer */}
      <div className="relative mt-8 border-t border-stone-200 pt-4 text-center">
        <p className="text-sm font-bold text-orange-700">
          Thank you for shopping with {branding.brand}.
        </p>
        <p className="text-[11px] text-stone-400">Created by: {branding.userName}</p>
      </div>
    </div>
  );
}

/* --------------------------- 80mm RECEIPT --------------------------- */

function ReceiptDoc({ state, branding }: { state: InvoiceState; branding: Branding }) {
  const total = grandTotal(state);
  return (
    <div id="print-area" className="print-area mx-auto w-[300px] bg-white p-3 text-[11px] text-stone-800 shadow-sm receipt-width">
      <div className="text-center">
        {branding.logoDataUrl ? (
          <img src={branding.logoDataUrl} alt="logo" className="mx-auto mb-1 h-10 w-10 object-contain" />
        ) : (
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-orange-500 to-amber-600 text-xs font-black text-white">
            EG
          </div>
        )}
        <h1 className="text-sm font-black uppercase tracking-tight text-stone-900">{branding.brand}</h1>
        <p className="text-[10px] text-stone-500">{branding.address}</p>
        <p className="text-[10px] text-stone-500">Tel: {branding.phone}</p>
      </div>

      <div className="my-1.5 border-t border-dashed border-stone-300" />

      <div className="flex justify-between text-[10px] text-stone-600">
        <span>Receipt #{state.invoiceNumber}</span>
        <span>{state.date}</span>
      </div>

      <div className="mt-1 text-[10px] text-stone-600">
        <p className="font-semibold text-stone-800">{state.customer.name || 'Walk-in'}</p>
        <p>{state.customer.phone}</p>
        <p>{state.customer.address}</p>
      </div>

      <div className="my-1.5 border-t border-dashed border-stone-300" />

      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className="border border-stone-300 bg-stone-50 text-left text-stone-500">
            <th className="border border-stone-300 px-1 py-0.5 text-center">#</th>
            <th className="border border-stone-300 px-1 py-0.5">Item</th>
            <th className="border border-stone-300 px-1 py-0.5 text-center">Qty</th>
            <th className="border border-stone-300 px-1 py-0.5 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {state.items.length === 0 ? (
            <tr>
              <td colSpan={4} className="border border-stone-300 py-2 text-center text-stone-400">
                No items
              </td>
            </tr>
          ) : (
            state.items.map((it, idx) => (
              <tr key={it.id} className="border border-stone-300 align-top">
                <td className="border border-stone-300 px-1 py-0.5 text-center">{idx + 1}</td>
                <td className="border border-stone-300 px-1 py-0.5">
                  <p className="font-semibold">{it.name || '—'}</p>
                  <p className="text-stone-400">{money(it.price)}/{it.unit}</p>
                </td>
                <td className="border border-stone-300 px-1 py-0.5 text-center">{it.quantity}</td>
                <td className="border border-stone-300 px-1 py-0.5 text-right font-semibold">{money(lineTotal(it))}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="my-1.5 border-t border-dashed border-stone-300" />

      <div className="space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(subtotal(state.items))}</span>
        </div>
        {discountAmount(state) > 0 && (
          <div className="flex justify-between text-orange-700">
            <span>Discount</span>
            <span>- {money(discountAmount(state))}</span>
          </div>
        )}
        {state.taxRate > 0 && (
          <div className="flex justify-between">
            <span>VAT ({state.taxRate}%)</span>
            <span>{money(taxAmount(state))}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-stone-300 pt-0.5 text-sm font-black text-stone-900">
          <span>TOTAL</span>
          <span>{money(total)}</span>
        </div>
        <p className="pt-0.5 text-[9px] italic text-stone-500">In Words: {amountInWords(total)}</p>
      </div>

      <div className="my-1.5 border-t border-dashed border-stone-300" />

      <div className="text-[10px] text-stone-600">
        <p className="font-semibold text-stone-700">Payment Info:</p>
        <p>{state.payment.bankName}</p>
        <p>{state.payment.accountName}</p>
        <p>A/C: {state.payment.accountNumber}</p>
      </div>

      <div className="my-1.5 border-t border-dashed border-stone-300" />

      <div className="text-center text-[10px] text-stone-600">
        <p>Paid via: {state.paymentMethod}</p>
        {state.notes && <p className="mt-0.5 text-stone-500">{state.notes}</p>}
        <p className="mt-1.5 font-bold text-orange-700">Thank you for shopping!</p>
        <p className="text-stone-400">{branding.brand}</p>
        <p className="text-stone-400">Created by: {branding.userName}</p>
      </div>
    </div>
  );
}
