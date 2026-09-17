import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listCompanies, listFreelancers } from '../../services/company.js';

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : '—';
}

export default function PlatformPaymentDetails() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listCompanies(), listFreelancers()])
      .then(([companies, freelancers]) => setRows([
        ...companies.map((account) => ({ ...account, accountType: 'Company', accountName: account.name })),
        ...freelancers.map((account) => ({ ...account, accountType: 'Freelancer', accountName: account.name })),
      ]))
      .catch(() => toast.error('Failed to load payment details'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Payment Details</h1>
        <p className="mt-1 text-sm text-slate-500">Subscription billing metadata for every company and freelancer workspace.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Account</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment ID</th><th className="px-4 py-3">Paid at</th><th className="px-4 py-3">Period ends</th></tr>
          </thead>
          <tbody>
            {rows.map((account) => <tr key={`${account.accountType}-${account.id}`} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 font-medium text-slate-900">{account.accountName}</td><td className="px-4 py-3">{account.accountType}</td><td className="px-4 py-3">{account.plan?.name || 'No plan assigned'}</td><td className="px-4 py-3">{account.subscriptionStatus || 'No subscription'}</td><td className="px-4 py-3 font-mono text-xs">{account.paymentDetails?.razorpayPaymentId || 'Not available'}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(account.paymentDetails?.paidAt)}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(account.paymentDetails?.currentPeriodEnd)}</td></tr>)}
            {!loading && !rows.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No payment details available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
