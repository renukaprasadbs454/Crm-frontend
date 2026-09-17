import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitPublicLead } from '../../services/crm.js';

const empty = {
  fullName: '',
  phone: '',
  email: '',
  collegeName: '',
  collegeCity: '',
  collegeCourse: '',
  collegeYear: '',
  message: '',
};

export default function PublicLeadPage() {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPublicLead({ ...form, source: 'WEBSITE' });
      setDone(true);
      setForm(empty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="font-display text-3xl font-bold text-brand-900">Skill99</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-800">Talk to our team</h1>
        <p className="mt-1 text-sm text-slate-500">
          Leave your details and a counsellor will reach out about our programs.
        </p>

        {done ? (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-display text-lg font-semibold text-emerald-800">Thank you!</p>
            <p className="mt-1 text-sm text-emerald-700">
              We&apos;ve received your details and will reach out shortly.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Full name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Phone *</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  placeholder="9876543210"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">College name *</span>
              <input
                required
                value={form.collegeName}
                onChange={(e) => setField('collegeName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">City</span>
                <input
                  value={form.collegeCity}
                  onChange={(e) => setField('collegeCity', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Course</span>
                <input
                  value={form.collegeCourse}
                  onChange={(e) => setField('collegeCourse', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  placeholder="B.Tech CSE"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Year</span>
                <input
                  value={form.collegeYear}
                  onChange={(e) => setField('collegeYear', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  placeholder="3rd year"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Message</span>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                placeholder="What would you like to know?"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Request a callback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
