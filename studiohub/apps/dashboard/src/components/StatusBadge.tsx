'use client';

interface StatusBadgeProps {
  status: 'active' | 'paused' | 'completed';
}

const config = {
  active: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'Active',
    pulse: true,
  },
  paused: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    label: 'Paused',
    pulse: false,
  },
  completed: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    label: 'Completed',
    pulse: false,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${c.dot}`}
        style={c.pulse ? { animation: 'dotPulse 2s ease-in-out infinite' } : undefined}
      />
      {c.label}
    </span>
  );
}
