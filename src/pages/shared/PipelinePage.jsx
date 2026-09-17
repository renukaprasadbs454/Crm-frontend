import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listLeads, updateLeadStage } from '../../services/crm.js';
import {
  STAGE_OPTIONS,
  stageAccentClass,
  interestBadgeClass,
  formatInterest,
} from '../../utils/constants.js';

export default function PipelinePage() {
  const location = useLocation();
  const base = '/app/leads';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState(null);
  const [overStage, setOverStage] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await listLeads({ limit: 200 });
      setLeads(res.items || []);
    } catch {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function moveTo(leadId, stage) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === stage) return;

    const prevStage = lead.stage;
    // Optimistic update
    setLeads((cur) => cur.map((l) => (l.id === leadId ? { ...l, stage } : l)));
    try {
      await updateLeadStage(leadId, stage);
    } catch (err) {
      setLeads((cur) => cur.map((l) => (l.id === leadId ? { ...l, stage: prevStage } : l)));
      toast.error(err.response?.data?.message || 'Could not move lead');
    }
  }

  function onDrop(e, stage) {
    e.preventDefault();
    setOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggingId;
    if (leadId) moveTo(leadId, stage);
    setDraggingId(null);
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-brand-900">Pipeline</h1>
        <p className="mt-1 text-sm text-slate-500">
          Drag a lead card between stages to move it through the pipeline.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGE_OPTIONS.map((stage) => {
          const items = leads.filter((l) => l.stage === stage.value);
          return (
            <div
              key={stage.value}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage.value);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage.value ? null : s))}
              onDrop={(e) => onDrop(e, stage.value)}
              className={`flex w-72 flex-none flex-col rounded-xl border border-t-4 bg-slate-50/60 ${stageAccentClass(
                stage.value
              )} ${overStage === stage.value ? 'ring-2 ring-brand-400' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-sm font-semibold text-slate-700">{stage.label}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                  {items.length}
                </span>
              </div>

              <div className="flex min-h-[120px] flex-col gap-2 px-2 pb-3">
                {items.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', lead.id);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggingId(lead.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing ${
                      draggingId === lead.id ? 'opacity-50' : 'hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`${base}/${lead.id}`}
                        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        {lead.fullName || lead.phone}
                      </Link>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${interestBadgeClass(
                          lead.interest
                        )}`}
                      >
                        {formatInterest(lead.interest)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{lead.phone}</p>
                    <p className="truncate text-xs text-slate-500">{lead.collegeName}</p>
                    {lead.assignedTo?.name && (
                      <p className="mt-1 text-[11px] text-slate-400">→ {lead.assignedTo.name}</p>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-slate-400">Drop here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
