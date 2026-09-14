import { Printer, FileDown, Trash2, FileText, Receipt, MessageCircle, Settings, Boxes, FilePlus2 } from 'lucide-react';
import type { AppTab, FormatMode } from '@/types';

interface Props {
  tab: AppTab;
  mode: FormatMode;
  onTab: (t: AppTab) => void;
  onMode: (m: FormatMode) => void;
  onPrint: () => void;
  onPdf: () => void;
  onWhatsapp: () => void;
  onClear: () => void;
  onSettings: () => void;
}

export function Toolbar({
  tab,
  mode,
  onTab,
  onMode,
  onPrint,
  onPdf,
  onWhatsapp,
  onClear,
  onSettings,
}: Props) {
  return (
    <div className="no-print sticky top-0 z-30 border-b border-orange-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* brand */}
          <div className="flex items-center gap-2 pr-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-black text-white">
              EG
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black tracking-tight text-stone-900">Eby-Gold Superstores</p>
              <p className="text-[10px] text-stone-500">Invoice &amp; Receipt</p>
            </div>
          </div>

          <div className="ml-1 hidden h-8 w-px bg-stone-200 sm:block" />

          {/* tabs */}
          <nav className="flex gap-1 rounded-xl bg-stone-100 p-1">
            <TabBtn icon={FilePlus2} label="Invoice" active={tab === 'invoice'} onClick={() => onTab('invoice')} />
            <TabBtn icon={Boxes} label="Inventory" active={tab === 'inventory'} onClick={() => onTab('inventory')} />
            <TabBtn icon={Settings} label="Settings" active={tab === 'settings'} onClick={() => onTab('settings')} />
          </nav>

          {/* actions */}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {tab === 'invoice' && (
              <>
                {/* format toggle */}
                <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
                  <button
                    type="button"
                    onClick={() => onMode('invoice')}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      mode === 'invoice' ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => onMode('receipt')}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      mode === 'receipt' ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    <Receipt className="h-3.5 w-3.5" /> Receipt
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onPrint}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={onPdf}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
                >
                  <FileDown className="h-4 w-4" /> PDF
                </button>
                <button
                  type="button"
                  onClick={onWhatsapp}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
