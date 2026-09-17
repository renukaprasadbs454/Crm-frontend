import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, MessageCircle, ShieldCheck } from 'lucide-react';
import { requestActivationOtp, setActivationPassword, verifyActivationOtp } from '../../services/company.js';
import { useAuthStore } from '../../store/authStore.js';

export default function ActivateAccount() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [identifier, setIdentifier] = useState(params.get('identifier') || params.get('email') || '');
  const [channel, setChannel] = useState(params.get('channel') === 'email' ? 'email' : 'whatsapp');
  const [otp, setOtp] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState(params.get('step') === 'password' ? 3 : 1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return undefined;
    const id = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function sendOtp(e) {
    e?.preventDefault();
    if (loading || cooldown) return;
    setLoading(true);
    try {
      const result = await requestActivationOtp(identifier.trim(), channel);
      setCooldown(60);
      setStep(2);
      toast.success(`OTP sent to your ${channel === 'email' ? 'email' : 'WhatsApp number'}`);
      if (channel === 'whatsapp' && result?.phone) toast(`Sent to ${result.phone}`, { icon: '💬' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const result = await verifyActivationOtp(identifier.trim(), otp.trim(), channel);
      setSetupToken(result.setupToken);
      setStep(3);
      toast.success('OTP verified. Create your password.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  async function createPassword(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await setActivationPassword(setupToken, password);
      localStorage.removeItem('skill99.pendingActivation');
      setAuth(result.token, result.user, 'staff');
      toast.success(`Welcome to Skill99 CRM, ${result.user.name}`);
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not activate account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,.12),transparent_30%),#f8fafc] p-5">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600"><ArrowLeft size={16} /> Back to login</Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
          <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-white"><ShieldCheck size={21} /></div><div><p className="font-black text-slate-950">Skill99 <span className="text-violet-600">CRM</span></p><p className="text-xs font-semibold text-slate-400">Secure member activation</p></div></div>
          <h1 className="mt-7 text-2xl font-black text-slate-950">Activate your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Verify one OTP by email or WhatsApp, then create your password.</p>

          <div className="mt-6 grid grid-cols-[auto_1fr_auto_1fr_auto] items-start gap-2 text-center text-xs font-bold text-slate-500"><div><span className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-slate-100'}`}>1</span><span className="mt-2 block">Choose method</span></div><span className="mt-3 h-px bg-slate-200" /><div><span className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${step >= 2 ? 'bg-violet-600 text-white' : 'bg-slate-100'}`}>2</span><span className="mt-2 block">Verify OTP</span></div><span className="mt-3 h-px bg-slate-200" /><div><span className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${step >= 3 ? 'bg-violet-600 text-white' : 'bg-slate-100'}`}>3</span><span className="mt-2 block">Create password</span></div></div>

          {step === 1 && <form onSubmit={sendOtp} className="mt-7 space-y-4"><label className="block text-sm font-semibold text-slate-700">{channel === 'email' ? 'Email address' : 'Mobile number'}<input autoFocus autoComplete={channel === 'email' ? 'email' : 'tel'} type={channel === 'email' ? 'email' : 'tel'} required value={identifier} onChange={(e) => setIdentifier(channel === 'email' ? e.target.value : e.target.value.replace(/\D/g, ''))} placeholder={channel === 'email' ? 'you@company.com' : '9876543210'} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-violet-500 focus:ring-2" /></label><fieldset className="text-sm font-semibold text-slate-700"><legend>Choose one verification method</legend><div className="mt-2 grid gap-2 sm:grid-cols-2"><label className={`rounded-xl border p-3 ${channel === 'whatsapp' ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}><input type="radio" name="activationChannel" value="whatsapp" checked={channel === 'whatsapp'} onChange={() => { setChannel('whatsapp'); setIdentifier(''); }} /> WhatsApp OTP</label><label className={`rounded-xl border p-3 ${channel === 'email' ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}><input type="radio" name="activationChannel" value="email" checked={channel === 'email'} onChange={() => { setChannel('email'); setIdentifier(''); }} /> Email OTP</label></div></fieldset><div className="flex gap-3 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><MessageCircle size={17} className="mt-0.5 shrink-0" /> Only one verification code will be sent.</div><button disabled={loading || !identifier} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white disabled:opacity-60">{loading ? 'Sending…' : `Send ${channel === 'email' ? 'Email' : 'WhatsApp'} OTP`}</button></form>}

          {step === 2 && <form onSubmit={verifyOtp} className="mt-7 space-y-4"><label className="block text-sm font-semibold text-slate-700">6-digit OTP<input autoFocus inputMode="numeric" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-black tracking-[0.45em] outline-none ring-violet-500 focus:ring-2" /></label><button disabled={loading || otp.length !== 6} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white disabled:opacity-60">{loading ? 'Verifying…' : 'Verify OTP'}</button><button type="button" disabled={loading || cooldown > 0} onClick={sendOtp} className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 disabled:opacity-50">{cooldown ? `Resend in ${cooldown}s` : 'Resend OTP'}</button><button type="button" onClick={() => setStep(1)} className="w-full text-sm font-semibold text-slate-500">Use a different email</button></form>}

          {step === 3 && <form onSubmit={createPassword} className="mt-7 space-y-4"><div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} /> {channel === 'email' ? 'Email' : 'WhatsApp'} verification complete</div><label className="block text-sm font-semibold text-slate-700">Create password<div className="relative mt-1.5"><input autoFocus autoComplete="new-password" type={showPassword ? 'text' : 'password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 outline-none ring-violet-500 focus:ring-2" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><label className="block text-sm font-semibold text-slate-700">Confirm password<input autoComplete="new-password" type="password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-violet-500 focus:ring-2" /></label><button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white disabled:opacity-60">{loading ? 'Activating…' : 'Create password & enter CRM'}</button></form>}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">Never share your OTP with anyone.</p>
      </div>
    </div>
  );
}
