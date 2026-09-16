import { useState, type FormEvent } from 'react';
import logoUrl from '@/assets/branding/LOGO.jpeg';

export type Role = 'owner' | 'staff' | 'guest';

// TEMPORARY: local-only password gate, not secure — visible in plain text
// to anyone who inspects the built JS bundle. Replace with real Supabase
// auth later. Change these two values to whatever you want for now.
const OWNER_PASSWORD = 'eby-gold-owner';
const STAFF_PASSWORD = 'eby-gold-staff';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selected, setSelected] = useState<'owner' | 'staff' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const expected = selected === 'owner' ? OWNER_PASSWORD : STAFF_PASSWORD;
    if (password === expected) {
      onLogin(selected);
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-orange-100">
          <img src={logoUrl} alt="Eby-Gold Superstores logo" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-center text-lg font-bold text-stone-800">Eby-Gold Superstores</h1>
        <p className="mt-1 text-center text-sm text-stone-500">Sign in to continue</p>

        {!selected ? (
          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={() => { setSelected('owner'); setError(''); }}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Sign in as Owner
            </button>
            <button
              type="button"
              onClick={() => { setSelected('staff'); setError(''); }}
              className="w-full rounded-lg border border-orange-600 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
            >
              Sign in as Staff
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                {selected === 'owner' ? 'Owner' : 'Staff'} password
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Enter password"
              />
              {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setSelected(null); setPassword(''); setError(''); }}
                className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 border-t border-stone-200 pt-4 text-center">
          <button
            type="button"
            onClick={() => onLogin('guest')}
            className="text-sm font-semibold text-stone-500 underline decoration-dotted hover:text-stone-700"
          >
            Continue as Guest (view only)
          </button>
        </div>
      </div>
    </div>
  );
}
