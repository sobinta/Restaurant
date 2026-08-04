import React from 'react';
import { Activity } from 'lucide-react';

export default function AuditTimeline({ events, emptyLabel }) {
  if (!events.length) return <div className="audit-empty"><Activity /><span>{emptyLabel}</span></div>;
  return <ol className="audit-timeline">{events.map((event) => <li key={event.id}><i /><div><b>{event.action}</b><small>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(event.created_at))}</small></div><span>{event.target_type}</span></li>)}</ol>;
}
