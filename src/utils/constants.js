export const INTEREST_OPTIONS = [
  { value: 'INTERESTED', label: 'Interested' },
  { value: 'NOT_INTERESTED', label: 'Not interested' },
  { value: 'ON_HOLD', label: 'On hold' },
];

export function interestBadgeClass(interest) {
  switch (interest) {
    case 'INTERESTED':
      return 'bg-emerald-100 text-emerald-800';
    case 'NOT_INTERESTED':
      return 'bg-rose-100 text-rose-800';
    case 'ON_HOLD':
      return 'bg-amber-100 text-amber-900';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function formatInterest(interest) {
  return INTEREST_OPTIONS.find((o) => o.value === interest)?.label || interest;
}

export const STAGE_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'DEMO_SCHEDULED', label: 'Demo scheduled' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export const STAGE_VALUES = STAGE_OPTIONS.map((o) => o.value);

export function formatStage(stage) {
  return STAGE_OPTIONS.find((o) => o.value === stage)?.label || stage;
}

export function stageBadgeClass(stage) {
  switch (stage) {
    case 'NEW':
      return 'bg-slate-100 text-slate-700';
    case 'CONTACTED':
      return 'bg-sky-100 text-sky-800';
    case 'QUALIFIED':
      return 'bg-indigo-100 text-indigo-800';
    case 'DEMO_SCHEDULED':
      return 'bg-violet-100 text-violet-800';
    case 'NEGOTIATING':
      return 'bg-amber-100 text-amber-900';
    case 'WON':
      return 'bg-emerald-100 text-emerald-800';
    case 'LOST':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

/** Top border accent for pipeline columns. */
export function stageAccentClass(stage) {
  switch (stage) {
    case 'NEW':
      return 'border-t-slate-400';
    case 'CONTACTED':
      return 'border-t-sky-500';
    case 'QUALIFIED':
      return 'border-t-indigo-500';
    case 'DEMO_SCHEDULED':
      return 'border-t-violet-500';
    case 'NEGOTIATING':
      return 'border-t-amber-500';
    case 'WON':
      return 'border-t-emerald-500';
    case 'LOST':
      return 'border-t-rose-500';
    default:
      return 'border-t-slate-300';
  }
}

export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'NOTE', label: 'Note' },
  { value: 'CALL', label: 'Call' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'MEETING', label: 'Meeting' },
];

export function formatActivityType(type) {
  const map = {
    NOTE: 'Note',
    CALL: 'Call',
    EMAIL: 'Email',
    WHATSAPP: 'WhatsApp',
    MEETING: 'Meeting',
    STAGE_CHANGE: 'Stage change',
    ASSIGNMENT: 'Assignment',
    CONVERSION: 'Conversion',
    SYSTEM: 'System',
  };
  return map[type] || type;
}

export function activityDotClass(type) {
  switch (type) {
    case 'CALL':
      return 'bg-sky-500';
    case 'EMAIL':
      return 'bg-indigo-500';
    case 'WHATSAPP':
      return 'bg-emerald-500';
    case 'MEETING':
      return 'bg-violet-500';
    case 'STAGE_CHANGE':
      return 'bg-amber-500';
    case 'ASSIGNMENT':
      return 'bg-brand-500';
    case 'CONVERSION':
      return 'bg-emerald-600';
    case 'SYSTEM':
      return 'bg-slate-400';
    default:
      return 'bg-slate-500';
  }
}
