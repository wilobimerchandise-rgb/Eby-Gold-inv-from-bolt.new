import { useEffect, useState } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { CustomerPanel } from '@/components/CustomerPanel';
import { LineItemEditor } from '@/components/LineItemEditor';
import { TotalsPanel } from '@/components/TotalsPanel';
import { MetaPanel } from '@/components/MetaPanel';
import { PrintableDocument } from '@/components/PrintableDocument';
import { InventoryTab } from '@/components/InventoryTab';
import { SettingsModal } from '@/components/SettingsModal';
import { LoginScreen, type Role } from '@/components/LoginScreen';
import { useLocalStorage } from '@/lib/storage';
import { setCurrency as setCurrencyState } from '@/lib/calc';
import { blankInvoice, nextInvoiceNumber, newLineItem } from '@/lib/invoice';
import { seedProducts, seedCustomers, defaultBranding, defaultPayment } from '@/lib/seed';
import { downloadPdf, triggerDownload } from '@/lib/pdf';
import { whatsappUrl } from '@/lib/whatsapp';
import type { AppTab, Branding, Customer, FormatMode, InvoiceState, LineItem, PaymentInfo, Product } from '@/types';

function App() {
  const [role, setRole] = useLocalStorage<Role | null>('eg_role', null);
  const [products, setProducts] = useLocalStorage<Product[]>('eg_products', seedProducts);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('eg_customers', seedCustomers);
  const [invoice, setInvoice] = useLocalStorage<InvoiceState>('eg_invoice', blankInvoice('EGS-2026-0001'));
  const [mode, setMode] = useLocalStorage<FormatMode>('eg_mode', 'invoice');
  const [currency, setCurrency] = useLocalStorage<string>('eg_currency', '₦');
  const [branding, setBranding] = useLocalStorage<Branding>('eg_branding', defaultBranding);
  const [payment, setPayment] = useLocalStorage<PaymentInfo>('eg_payment', defaultPayment);
  const [tab, setTab] = useState<AppTab>('invoice');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [firstRun, setFirstRun] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isGuest = role === 'guest';

  useEffect(() => { setCurrencyState(currency); }, [currency]);

  useEffect(() => {
    if (
      invoice.payment.bankName !== payment.bankName ||
      invoice.payment.accountName !== payment.accountName ||
      invoice.payment.accountNumber !== payment.accountNumber
    ) {
      setInvoice({ ...invoice, payment });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  // first-run logo prompt — skip entirely for guests, who can't act on it anyway
  useEffect(() => {
    if (role !== 'guest' && !branding.logoDataUrl && !window.localStorage.getItem('eg_skipped_logo')) {
      setFirstRun(true);
    }
  }, [branding.logoDataUrl, role]);

  function patchInvoice(patch: Partial<InvoiceState>) {
    setInvoice({ ...invoice, ...patch });
  }

  function handleSelectCustomer(c: Customer) {
    setInvoice({ ...invoice, customer: c });
  }

  function handleSaveNewCustomer(c: Customer) {
    setCustomers([...customers, c]);
  }

  function handleItemsChange(items: LineItem[]) {
    setInvoice({ ...invoice, items });
  }

  function handleClear() {
    if (!window.confirm('Clear the current document? This starts a fresh invoice but keeps your saved customers and products.')) return;
    setInvoice({
      ...blankInvoice(nextInvoiceNumber(invoice.invoiceNumber)),
      customer: customers[0] ?? { id: '', name: '', phone: '', address: '' },
      items: [newLineItem()],
      payment,
    });
  }

  function handleGuestBlocked() {
    alert('Guests have view-only access. Log in as Owner or Staff to make changes.');
  }

  function handlePrint() {
    setShowPreview(false);
    setTimeout(() => window.print(), 60);
  }

  async function handlePdf() {
    try {
      const blob = await downloadPdf(invoice, branding, products);
      triggerDownload(blob, `${invoice.invoiceNumber || 'invoice'}.pdf`);
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('Sorry, the PDF could not be generated. Please try again.');
    }
  }

  async function handleWhatsapp() {
    let blob: Blob;
    try {
      blob = await downloadPdf(invoice, branding, products);
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('Sorry, the invoice could not be generated. Please try again.');
      return;
    }

    const filename = `${invoice.invoiceNumber || 'invoice'}.pdf`;
    const file = new File([blob], filename, { type: 'application/pdf' });

    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await navigator.share({
          text: `Hello ${invoice.customer.name || 'Customer'}, please find your invoice from ${branding.brand} attached.`,
          files: [file],
        });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          return;
        }
        console.error('WhatsApp share failed', e);
      }
    }

    triggerDownload(blob, filename);
    window.open(whatsappUrl(invoice.customer, branding.brand), '_blank');
    alert(`"${filename}" was downloaded. Attach it to the WhatsApp chat that just opened — WhatsApp doesn't let a website attach a file automatically.`);
  }

  function skipLogo() {
    window.localStorage.setItem('eg_skipped_logo', '1');
    setFirstRun(false);
  }

  if (!role) {
    return <LoginScreen onLogin={setRole} />;
  }

  return (
    <div className="app-bg min-h-screen bg-stone-100 text-stone-800">
      <div className="no-print flex items-center justify-end gap-2 bg-stone-800 px-3 py-1 text-xs text-stone-200">
        <span>
          Signed in as <span className="font-semibold capitalize">{role}</span>
          {isGuest && ' (view only)'}
        </span>
        <button
          type="button"
          onClick={() => setRole(null)}
          className="rounded bg-stone-700 px-2 py-0.5 font-semibold hover:bg-stone-600"
        >
          Log out
        </button>
      </div>

      <Toolbar
        tab={tab}
        mode={mode}
        onTab={setTab}
        onMode={setMode}
        onPrint={handlePrint}
        onPdf={handlePdf}
        onWhatsapp={handleWhatsapp}
        onClear={isGuest ? handleGuestBlocked : handleClear}
        onSettings={() => setSettingsOpen(true)}
      />

      {firstRun && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <span className="text-2xl font-black text-orange-600">EG</span>
            </div>
            <h2 className="text-lg font-bold text-stone-800">Welcome to Eby-Gold Superstores</h2>
            <p className="mt-1 text-sm text-stone-500">
              Upload your logo now to brand your invoices and receipts, or skip and add it later in Settings.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => { setFirstRun(false); setSettingsOpen(true); }}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Upload logo
              </button>
              <button
                type="button"
                onClick={skipLogo}
                className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <fieldset disabled={isGuest} className="contents">
          <SettingsModal
            branding={branding}
            payment={payment}
            onBranding={setBranding}
            onPayment={setPayment}
            onClose={() => setSettingsOpen(false)}
          />
        </fieldset>
      )}

      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        {tab === 'inventory' && (
          <fieldset disabled={isGuest} className="min-w-0 border-0 m-0 p-0">
            <InventoryTab products={products} onChange={setProducts} />
          </fieldset>
        )}

        {tab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800">Settings</h2>
            <p className="text-sm text-stone-500">
              Click the button below to upload your logo, edit your business details, and set your payment information.
            </p>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Open settings
            </button>
          </div>
        )}

        {tab === 'invoice' && (
          <>
            <div className="mb-3 flex gap-1 rounded-xl bg-stone-200 p-1 lg:hidden no-print">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  !showPreview ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  showPreview ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500'
                }`}
              >
                Preview
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className={`space-y-4 no-print ${showPreview ? 'hidden lg:block' : ''}`}>
                <fieldset disabled={isGuest} className="min-w-0 border-0 m-0 p-0">
                  <MetaPanel state={invoice} onPatch={patchInvoice} />
                </fieldset>
                <fieldset disabled={isGuest} className="min-w-0 border-0 m-0 p-0">
                  <CustomerPanel
                    customers={customers}
                    selected={invoice.customer}
                    onSelect={handleSelectCustomer}
                    onSaveNew={handleSaveNewCustomer}
                  />
                </fieldset>
                <fieldset disabled={isGuest} className="min-w-0 border-0 m-0 p-0">
                  <LineItemEditor
                    items={invoice.items}
                    products={products}
                    onChange={handleItemsChange}
                  />
                </fieldset>
                <fieldset disabled={isGuest} className="min-w-0 border-0 m-0 p-0">
                  <TotalsPanel state={invoice} onPatch={patchInvoice} />
                </fieldset>
              </div>

              <div className={`${showPreview ? '' : 'hidden lg:block'}`}>
                <div className="no-print mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    {mode === 'invoice' ? 'A4 Invoice Preview' : '80mm Receipt Preview'}
                  </h2>
                  <span className="text-[11px] text-stone-400">Print uses this layout</span>
                </div>
                <div className="overflow-x-auto rounded-2xl bg-stone-200/60 p-3 sm:p-4">
                  <PrintableDocument state={invoice} mode={mode} branding={branding} />
                </div>
              </div>
            </div>

            <div className="hidden print:block">
              <PrintableDocument state={invoice} mode={mode} branding={branding} />
            </div>
          </>
        )}

        <footer className="no-print mt-8 text-center text-[11px] text-stone-400">
          Eby-Gold Superstores · Invoice &amp; Receipt Generator · Data saved locally in your browser
        </footer>
      </div>
    </div>
  );
}

export default App;
