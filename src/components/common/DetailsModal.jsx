export default function DetailsModal({ title, item, fields, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label={`${title} details`} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-brand-900">{title} details</h2>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Close</button>
        </div>
        <dl className="mt-5 divide-y divide-slate-100">
          {fields.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[ minmax(100px,.35fr)_1fr] gap-4 py-3 text-sm">
              <dt className="font-semibold text-slate-500">{label}</dt>
              <dd className="break-words text-slate-800">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
