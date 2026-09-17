import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { requestPasswordReset, resetPassword, verifyPasswordReset } from '../../services/company.js';
import { useAuthStore } from '../../store/authStore.js';

const channels = [
  { id: 'whatsapp', label: 'WhatsApp', hint: 'Get a 6-digit OTP on your registered WhatsApp number.', icon: MessageCircle },
  { id: 'email', label: 'Email', hint: 'Get a 6-digit OTP in your registered email inbox.', icon: Mail },
];

export default function ForgotPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [identifier, setIdentifier] = useState(params.get('email') || '');
  const role = params.get('role') || undefined;
  const companyId = params.get('companyId') || undefined;
  const [channel, setChannel] = useState('whatsapp');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!cooldown) return undefined;
    const id = setInterval(() => setCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function sendCode(e) {
    e?.preventDefault();
    if (loading || cooldown || !identifier.trim()) return;
    setLoading(true);
    try {
      const result = await requestPasswordReset({ identifier: identifier.trim(), channel, role, companyId });
      setCooldown(60);
      setStep(2);
      toast.success(`${channel === 'email' ? 'Email' : 'WhatsApp'} OTP sent`);
      if (result?.destination) toast(`Sent to ${result.destination}`, { icon: channel === 'email' ? '✉️' : '💬' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset code');
    } finally { setLoading(false); }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyPasswordReset({ identifier: identifier.trim(), otp, role, companyId });
      setResetToken(result.resetToken);
      setStep(3);
      toast.success('OTP verified. Create a new password.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const result = await resetPassword({ resetToken, password });
      setAuth(result.token, result.user, 'staff');
      toast.success('Password changed successfully');
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password');
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,.14),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(14,165,233,.12),transparent_28%),#f8fafc] p-5 sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md items-center justify-center">
        <div className="w-full animate-fade-up">
          <Link to="/login" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-violet-700"><ArrowLeft size={16}/> Back to login</Link>
          <section className="rounded-[2rem] border border-white bg-white/95 p-7 shadow-2xl shadow-slate-300/40 backdrop-blur sm:p-9">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg"><KeyRound size={23}/></div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">Reset your password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Choose where you want to receive the one-time verification code.</p>

            <div className="mt-7 flex items-center gap-2 text-xs font-black text-slate-500">
              {[1,2,3].map((n) => <span key={n} className={`grid h-8 w-8 place-items-center rounded-full ${step >= n ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-slate-100 text-slate-400'}`}>{step > n ? <CheckCircle2 size={16}/> : n}</span>)}
              <span className="h-px flex-1 bg-slate-200"/>
            </div>

            {step === 1 && <form onSubmit={sendCode} className="mt-7 space-y-5">
              <label className="block text-sm font-bold text-slate-700">Email or mobile<input autoFocus required value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="name@company.com or 9876543210" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"/></label>
              <div className="grid gap-3 sm:grid-cols-2">
                {channels.map(({id,label,hint,icon:Icon}) => <button type="button" key={id} onClick={()=>setChannel(id)} className={`group rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg ${channel===id?'border-violet-400 bg-violet-50 shadow-md':'border-slate-200 bg-white hover:border-violet-200'}`}><div className="flex items-center gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl ${channel===id?'bg-violet-600 text-white':'bg-slate-100 text-slate-500'}`}><Icon size={19}/></div><span className="font-black text-slate-900">{label}</span></div><p className="mt-3 text-xs leading-5 text-slate-500">{hint}</p></button>)}
              </div>
              <button disabled={loading || !identifier.trim()} className="w-full rounded-xl btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-60">{loading?'Sending…':`Send OTP via ${channel==='email'?'Email':'WhatsApp'}`}</button>
            </form>}

            {step === 2 && <form onSubmit={verifyCode} className="mt-7 space-y-4">
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><ShieldCheck size={17} className="mr-1 inline"/> Code sent via <b>{channel === 'email' ? 'email' : 'WhatsApp'}</b>. Enter the 6-digit code to continue.</div>
              <input autoFocus required inputMode="numeric" maxLength={6} value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="123456" className="w-full rounded-xl border border-slate-200 px-4 py-4 text-center text-3xl font-black tracking-[.5em] outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"/>
              <button disabled={loading || otp.length!==6} className="w-full rounded-xl btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-black text-white disabled:opacity-60">{loading?'Verifying…':'Verify OTP'}</button>
              <button type="button" disabled={loading || cooldown>0} onClick={sendCode} className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 disabled:opacity-50">{cooldown?`Resend in ${cooldown}s`:'Resend OTP'}</button>
              <button type="button" onClick={()=>setStep(1)} className="w-full text-sm font-bold text-slate-500">Choose another method</button>
            </form>}

            {step === 3 && <form onSubmit={savePassword} className="mt-7 space-y-4">
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800"><CheckCircle2 size={18}/> Verification complete</div>
              <label className="block text-sm font-bold text-slate-700">New password<div className="relative mt-1.5"><input autoFocus required minLength={8} type={showPassword?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
              <label className="block text-sm font-bold text-slate-700">Confirm password<input required minLength={8} type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Repeat your new password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"/></label>
              <button disabled={loading} className="w-full rounded-xl btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-60">{loading?'Updating…':'Set new password & sign in'}</button>
            </form>}
          </section>
          <p className="mt-5 text-center text-xs text-slate-400">For security, OTPs expire and can only be used once.</p>
        </div>
      </div>
    </main>
  );
}
