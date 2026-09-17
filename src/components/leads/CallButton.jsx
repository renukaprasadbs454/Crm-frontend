import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, PhoneCall, Smartphone, XCircle } from 'lucide-react';
import { callsApi } from '../../services/crm.js';

const labels = {
  QUEUED: 'Sending to mobile…',
  DELIVERED: 'Delivered to mobile',
  RINGING: 'Ringing…',
  CONNECTED: 'Connected',
  ENDED: 'Completed',
  FAILED: 'Call failed',
  EXPIRED: 'Command expired',
};

export default function CallButton({ lead, className = '' }) {
  const [state, setState] = useState('idle');
  const [call, setCall] = useState(null);
  const timerRef = useRef(null);
  useEffect(() => () => timerRef.current && window.clearInterval(timerRef.current), []);

  async function initiate() {
    if (!lead?.id || !lead?.phone) return;
    setState('starting');
    try {
      const result = await callsApi.initiate({ leadId: lead.id, idempotencyKey: `${lead.id}-${Date.now()}` });
      setCall(result);
      setState(result.status);
      timerRef.current = window.setInterval(async () => {
        try {
          const latest = await callsApi.get(result.id);
          setCall(latest);
          setState(latest.status);
          if (['ENDED', 'FAILED', 'EXPIRED'].includes(latest.status)) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
            if (latest.status === 'ENDED') toast.success(`Call completed · ${latest.durationSeconds || 0}s`);
            else toast.error(labels[latest.status]);
          }
        } catch {
          // Keep the last status visible; the Calls page continues polling independently.
        }
      }, 2000);
      toast.success('Call command sent to your mobile device');
    } catch (err) {
      setState('idle');
      toast.error(err.response?.data?.message || 'Could not start the call');
    }
  }

  const busy = state !== 'idle' && !['ENDED', 'FAILED', 'EXPIRED'].includes(state);
  const terminal = ['ENDED', 'FAILED', 'EXPIRED'].includes(state);
  const Icon = terminal ? (state === 'ENDED' ? CheckCircle2 : XCircle) : busy ? Loader2 : PhoneCall;

  return (
    <div className="space-y-2">
      <button type="button" onClick={initiate} disabled={busy || state === 'starting'} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
        <Icon size={16} className={busy ? 'animate-spin' : ''} />
        {state === 'idle' ? 'Call' : state === 'starting' ? 'Starting…' : labels[state] || state}
      </button>
      {call && <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><Smartphone size={13}/>{call.device?.deviceName || 'Paired mobile'}{call.device?.selectedSimId ? ` · ${call.device.selectedSimId}` : ''}</div>}
    </div>
  );
}
