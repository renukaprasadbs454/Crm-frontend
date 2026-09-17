import { useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitPublicLead } from '../../services/crm.js';

export default function WebsiteChatWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', collegeName: '', message: '' });
  function setField(key, value) { setForm((prev) => ({ ...prev, [key]: value })); }
  async function submit(e) {
    e.preventDefault(); setSending(true);
    try { await submitPublicLead({ ...form, source: 'WEBSITE_CHAT' }); setSent(true); toast.success('Enquiry received'); }
    catch (err) { toast.error(err.response?.data?.message || 'Could not send your enquiry'); }
    finally { setSending(false); }
  }
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm animate-chat-pop overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-200/40">
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 px-5 py-4 text-white"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-100"><Sparkles size={14}/> Skill99 concierge</div><h3 className="mt-1 text-lg font-black">How can we help?</h3><p className="mt-1 text-xs text-indigo-100">Send an enquiry and our team can follow up.</p></div><button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10"><X size={17}/></button></div></div>
        {sent ? <div className="px-5 py-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Send size={20}/></div><h4 className="mt-3 font-black text-slate-900">Thanks — you're on our radar.</h4><p className="mt-1 text-sm leading-6 text-slate-500">We saved your enquiry in the CRM. Our team will get back to you.</p><button onClick={() => { setSent(false); setForm({ fullName: '', phone: '', email: '', collegeName: '', message: '' }); }} className="mt-4 text-sm font-black text-violet-600">Send another enquiry</button></div> : <form onSubmit={submit} className="space-y-3 p-5"><input required value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"/><input required value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="Mobile number" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"/><div className="grid gap-3 sm:grid-cols-2"><input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="Email (optional)" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"/><input required value={form.collegeName} onChange={(e) => setField('collegeName', e.target.value)} placeholder="College / organisation" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"/></div><textarea rows={3} value={form.message} onChange={(e) => setField('message', e.target.value)} placeholder="What would you like to know?" className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400"/><button disabled={sending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:opacity-50"><Send size={16}/>{sending ? 'Sending…' : 'Send enquiry'}</button><p className="text-center text-[11px] text-slate-400">Your message becomes a tracked CRM lead.</p></form>}
      </div>}
      <button onClick={() => setOpen((value) => !value)} className="group flex items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-2xl shadow-indigo-300/40 transition hover:-translate-y-1 hover:bg-violet-700"><span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10"><span className="absolute inset-0 animate-ping rounded-full bg-white/20"/><MessageCircle size={18}/></span><span className="hidden sm:inline">Chat with Skill99</span></button>
    </div>
  );
}
