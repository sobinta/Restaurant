import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarPlus, CheckCircle2, Clock3, Heart, Share2, Sparkles, Ticket, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { eventDetails, pageCopy } from '../data/platformData';
import { localize } from '../data/siteData';

const locales = { de: 'de-DE', en: 'en-GB', fa: 'fa-IR', ar: 'ar-DE' };

export default function EventPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl } = useTheme();
  const { eventBookings, bookEvent, favoriteEventIds, toggleFavoriteEvent } = useApp();
  const event = useMemo(() => eventDetails.find((item) => item.slug === slug), [slug]);
  const [guests, setGuests] = useState(2);
  const [reference, setReference] = useState('');
  if (!event) return <main className="route-page route-not-found"><h1>Event not found</h1></main>;

  const booked = eventBookings.filter((item) => item.eventId === event.id).reduce((sum, item) => sum + item.guests, 0);
  const remaining = Math.max(0, event.remaining - booked);
  const favorite = favoriteEventIds.includes(event.id);
  const formattedDate = new Intl.DateTimeFormat(locales[lang], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${event.date}T12:00:00`));
  const price = new Intl.NumberFormat(locales[lang], { style: 'currency', currency: 'EUR' }).format(event.price * guests);
  const share = async () => navigator.share ? navigator.share({ title: localize(event.title, lang), url: location.href }) : navigator.clipboard?.writeText(location.href);
  const calendar = () => {
    const content = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${event.date.replaceAll('-', '')}T163000Z\nSUMMARY:${event.title.en}\nLOCATION:Arshida Berlin\nEND:VEVENT\nEND:VCALENDAR`;
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([content], { type: 'text/calendar' })); link.download = `${event.slug}.ics`; link.click(); URL.revokeObjectURL(link.href);
  };
  const reserve = () => {
    if (guests > remaining) return;
    const record = bookEvent({ eventId: event.id, guests, total: event.price * guests, date: event.date }); setReference(record.id);
  };

  return <main className="route-page event-page" id="main">
    <section className="event-cover" style={{ '--event-image': `url(${event.cover})` }}>
      <button className="route-back" onClick={() => navigate(-1)}>{isRtl ? <ArrowRight /> : <ArrowLeft />}{localize(pageCopy.back, lang)}</button>
      <div className="event-cover-copy page-width"><span className="eyebrow"><Sparkles />ARSHIDA SPECIAL EVENING</span><h1>{localize(event.title, lang)}</h1><p>{localize(event.description, lang)}</p><div className="event-cover-meta"><span><Clock3 />{formattedDate}</span><span><Users />{remaining} {localize(pageCopy.seatsLeft, lang)}</span><span><Ticket />€{event.price}</span></div></div>
    </section>
    <section className="event-editorial page-width">
      <div className="event-intro"><span className="event-number">01</span><h2>{localize(event.description, lang)}</h2><p>{event.performer} · ARSHIDA BERLIN</p></div>
      <div className="event-columns"><article><span className="eyebrow">02 · {localize(pageCopy.eventProgram, lang)}</span>{event.program.map((item) => <p className="program-row" key={item}><time>{item.split(' · ')[0]}</time><span>{item.split(' · ')[1]}</span></p>)}</article><article><span className="eyebrow">03 · {localize(pageCopy.eventMenu, lang)}</span><h3>{localize(event.menu, lang)}</h3><p>Seasonal ingredients, open-fire cooking and a progression composed only for this night.</p></article></div>
    </section>
    <section className="event-booking"><div className="page-width event-booking-inner">{reference ? <div className="event-confirmed"><CheckCircle2 /><div><span className="eyebrow">CONFIRMED</span><h2>{reference}</h2></div></div> : <><div><span className="eyebrow">{localize(pageCopy.bookEvent, lang)}</span><h2>{formattedDate}</h2><p>{remaining} {localize(pageCopy.seatsLeft, lang)}</p></div><label><span>Guests</span><select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{[1,2,3,4,5,6].filter((count) => count <= remaining).map((count) => <option key={count}>{count}</option>)}</select></label><strong>{price}</strong><button className="button button-primary" disabled={!remaining} onClick={reserve}><Ticket />{localize(pageCopy.bookEvent, lang)}</button></>}<button className={`icon-button ${favorite ? 'active' : ''}`} onClick={() => toggleFavoriteEvent(event.id)}><Heart fill={favorite ? 'currentColor' : 'none'} /></button><button className="icon-button" onClick={calendar}><CalendarPlus /></button><button className="icon-button" onClick={share}><Share2 /></button></div></section>
  </main>;
}
