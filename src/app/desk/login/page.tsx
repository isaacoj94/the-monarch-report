'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/desk/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || 'Could not sign in');
      return;
    }
    router.replace(params.get('next') || '/desk');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm bg-tm-card border border-tm-border rounded-lg p-6 space-y-4">
      <div>
        <p className="text-[10px] font-mono tracking-widest text-tm-gold mb-2">EDITORIAL DESK</p>
        <h1 className="text-xl font-bold text-tm-heading">Sign in</h1>
        <p className="text-xs font-mono text-tm-muted mt-2">Unpublished drafts only. Nothing here is live.</p>
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Desk password"
        className="w-full bg-tm-page border border-tm-border rounded px-3 py-2 text-sm text-tm-heading"
        autoFocus
      />
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-tm-gold text-tm-page font-mono text-sm font-bold rounded disabled:opacity-60"
      >
        {loading ? 'Checking…' : 'Enter desk'}
      </button>
    </form>
  );
}

export default function DeskLoginPage() {
  return (
    <div className="min-h-screen bg-tm-page flex items-center justify-center px-4">
      <Suspense fallback={<p className="text-tm-muted font-mono text-sm">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
