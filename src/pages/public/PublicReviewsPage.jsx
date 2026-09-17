import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPublicReviews, submitPublicReview } from '../../services/crm.js';

export default function PublicReviewsPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ rating: 5, reviewer: '', comment: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setData(await getPublicReviews(slug));
    } catch {
      toast.error('Reviews page not found');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await submitPublicReview({
        rating: Number(form.rating),
        reviewer: form.reviewer || null,
        comment: form.comment || null,
      });
      toast.success('Thanks for your review!');
      setForm({ rating: 5, reviewer: '', comment: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit failed');
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p className="p-8 text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <p className="font-display text-3xl font-bold text-brand-900">{data.organization.name}</p>
      <p className="mt-1 text-sm text-slate-500">Public reviews · {data.average}/5 · {data.count} review{data.count === 1 ? '' : 's'}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800">Leave a review</h2>
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>)}
        </select>
        <input placeholder="Your name" value={form.reviewer} onChange={(e) => setForm({ ...form, reviewer: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <textarea rows={3} placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Submitting…' : 'Submit review'}</button>
      </form>

      <div className="mt-8 space-y-3">
        {data.reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} · {r.reviewer || 'Anonymous'}</p>
            {r.comment && <p className="mt-1 text-sm text-slate-700">{r.comment}</p>}
          </div>
        ))}
        {!data.reviews.length && <p className="text-sm text-slate-500">No reviews yet.</p>}
      </div>
    </div>
  );
}
