import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getMe,
  getOrganization,
  updateOrganization,
  updateProfile,
} from '../../services/crm.js';
import { useAuthStore } from '../../store/authStore.js';

export default function SettingsPage({ canEditOrg = false }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [tab, setTab] = useState(canEditOrg ? 'organization' : 'profile');
  const [org, setOrg] = useState(null);
  const [profile, setProfile] = useState({ name: '', phone: '', timezone: 'Asia/Kolkata', password: '' });
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe()
      .then((u) => {
        setMe(u);
        setProfile({ name: u.name || '', phone: u.phone || '', timezone: u.timezone || 'Asia/Kolkata', password: '' });
      })
      .catch(() => toast.error('Failed to load profile'));
    if (canEditOrg) {
      getOrganization()
        .then(setOrg)
        .catch(() => toast.error('Failed to load organization'));
    }
  }, [canEditOrg]);

  async function saveOrg(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateOrganization({
        name: org.name,
        currency: org.currency,
        publicSlug: org.publicSlug,
        logoUrl: org.logoUrl || null,
        reminderLeadMinutes: Number(org.reminderLeadMinutes) || 15,
        browserNotifications: !!org.browserNotifications,
      });
      setOrg(updated);
      toast.success('Organization saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone || null,
        timezone: profile.timezone,
      };
      if (profile.password) payload.password = profile.password;
      const updated = await updateProfile(payload);
      setMe(updated);
      setAuth(token, { ...updated });
      setProfile((p) => ({ ...p, password: '' }));
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const publicUrl = org ? `${window.location.origin}/reviews/${org.publicSlug}` : '';
  const badgeCode = org
    ? `<div id="skill99-badge"></div>\n<script src="${window.location.origin}/api/badge.js?slug=${org.publicSlug}" async></script>`
    : '';

  const tabs = [
    ...(canEditOrg ? [{ id: 'organization', label: 'Organization' }] : []),
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Organization, profile, and account.</p>
      </div>

      {canEditOrg && org && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <p className="text-sm font-semibold text-slate-800">Your public reviews page</p>
          <p className="mt-1 text-xs text-slate-500">Share this link to collect reviews.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input readOnly value={publicUrl} className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                toast.success('Copied');
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
            >
              Copy
            </button>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
              Open
            </a>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-medium ${tab === t.id ? 'border-b-2 border-brand-600 text-brand-700' : 'text-slate-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'organization' && org && (
        <form onSubmit={saveOrg} className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Organization name</span>
            <input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Currency</span>
            <select value={org.currency} onChange={(e) => setOrg({ ...org, currency: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Public slug</span>
            <input value={org.publicSlug} onChange={(e) => setOrg({ ...org, publicSlug: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Logo URL</span>
            <input value={org.logoUrl || ''} onChange={(e) => setOrg({ ...org, logoUrl: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="https://…" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Default reminder lead time (minutes)</span>
            <input type="number" min="0" value={org.reminderLeadMinutes} onChange={(e) => setOrg({ ...org, reminderLeadMinutes: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!org.browserNotifications} onChange={(e) => setOrg({ ...org, browserNotifications: e.target.checked })} />
            Browser notifications enabled
          </label>
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-700">Reviews badge embed</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{badgeCode}</pre>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(badgeCode);
                toast.success('Embed code copied');
              }}
              className="mt-2 font-medium text-brand-600"
            >
              Copy embed code
            </button>
          </div>
          <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save organization'}
          </button>
        </form>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Full name</span>
            <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input disabled value={me?.email || ''} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500" />
            <span className="mt-1 block text-xs text-slate-500">Email cannot be changed here.</span>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Phone</span>
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Timezone</span>
            <select value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="Asia/Kolkata">India Standard Time (IST) — Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time — New York</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">New password</span>
            <input type="password" minLength={6} value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Leave blank to keep current" />
          </label>
          <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      )}

      {tab === 'account' && (
        <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5">
          <div>
            <p className="text-xs uppercase text-slate-500">User ID</p>
            <p className="mt-1 break-all text-sm font-medium">{me?.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Account created</p>
            <p className="mt-1 text-sm font-medium">{me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : '—'}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAuth();
              window.location.href = '/login';
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
