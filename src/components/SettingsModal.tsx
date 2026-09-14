import { useRef, useState } from 'react';
import { Upload, X, Building2, CreditCard, User, Image as ImageIcon } from 'lucide-react';
import type { Branding, PaymentInfo } from '@/types';

interface Props {
  branding: Branding;
  payment: PaymentInfo;
  onBranding: (b: Branding) => void;
  onPayment: (p: PaymentInfo) => void;
  onClose: () => void;
}

export function SettingsModal({ branding, payment, onBranding, onPayment, onClose }: Props) {
  const [b, setB] = useState<Branding>(branding);
  const [p, setP] = useState<PaymentInfo>(payment);
  const [logoError, setLogoError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogo(file: File | undefined) {
    setLogoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please upload an image file (PNG or JPG).');
      return;
    }
    if (file.size > 1_500_000) {
      setLogoError('Logo must be under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setB({ ...b, logoDataUrl: reader.result as string });
    reader.onerror = () => setLogoError('Could not read that file.');
    reader.readAsDataURL(file);
  }

  function save() {
    onBranding(b);
    onPayment(p);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* logo */}
        <section className="mb-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
            <ImageIcon className="h-4 w-4" /> Logo
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-orange-200 bg-orange-50">
              {b.logoDataUrl ? (
                <img src={b.logoDataUrl} alt="logo" className="h-full w-full object-contain" />
              ) : (
                <ImageIcon className="h-8 w-8 text-orange-300" />
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleLogo(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                <Upload className="h-4 w-4" /> Upload logo
              </button>
              {b.logoDataUrl && (
                <button
                  type="button"
                  onClick={() => setB({ ...b, logoDataUrl: null })}
                  className="ml-2 text-xs font-semibold text-stone-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <p className="mt-1 text-xs text-stone-400">PNG or JPG, under 1.5 MB. Used as PDF watermark + header.</p>
              {logoError && <p className="mt-1 text-xs text-red-600">{logoError}</p>}
            </div>
          </div>
        </section>

        {/* business info */}
        <section className="mb-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
            <Building2 className="h-4 w-4" /> Business Info
          </h3>
          <div className="space-y-2">
            <input
              value={b.brand}
              onChange={(e) => setB({ ...b, brand: e.target.value })}
              placeholder="Business name"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <input
              value={b.address}
              onChange={(e) => setB({ ...b, address: e.target.value })}
              placeholder="Address"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={b.phone}
                onChange={(e) => setB({ ...b, phone: e.target.value })}
                placeholder="Phone"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <input
                value={b.email}
                onChange={(e) => setB({ ...b, email: e.target.value })}
                placeholder="Email"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </section>

        {/* user name */}
        <section className="mb-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
            <User className="h-4 w-4" /> Your Name
          </h3>
          <input
            value={b.userName}
            onChange={(e) => setB({ ...b, userName: e.target.value })}
            placeholder="Shown as 'Created by' on PDF"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </section>

        {/* payment info */}
        <section className="mb-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
            <CreditCard className="h-4 w-4" /> Payment Information
          </h3>
          <div className="space-y-2">
            <input
              value={p.bankName}
              onChange={(e) => setP({ ...p, bankName: e.target.value })}
              placeholder="Bank name"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <input
              value={p.accountName}
              onChange={(e) => setP({ ...p, accountName: e.target.value })}
              placeholder="Account name"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <input
              value={p.accountNumber}
              onChange={(e) => setP({ ...p, accountNumber: e.target.value })}
              placeholder="Account number"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </section>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            Save settings
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
