import { ArrowLeft, ArrowRight, Check, ChefHat, Clock3, MapPin, PackageCheck, Truck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ORDER_STATUSES, useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { orderStatusCopy, pageCopy } from '../data/platformData';
import { localize } from '../data/siteData';

const icons = { submitted: Clock3, confirmed: Check, preparing: ChefHat, cooking: ChefHat, quality_check: PackageCheck, ready: PackageCheck, courier_handoff: Truck, completed: MapPin };

export default function LiveOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl } = useTheme();
  const { orders, activeOrder } = useApp();
  const order = orders.find((item) => item.id === orderId) || activeOrder;
  if (!order) return <main className="route-page route-not-found"><h1>No active order</h1></main>;
  const statuses = order.type === 'delivery' ? ORDER_STATUSES : ORDER_STATUSES.filter((status) => status !== 'courier_handoff');
  const currentIndex = statuses.indexOf(order.status);
  return <main className="route-page live-order-page" id="main">
    <header className="route-mini-header page-width"><button onClick={() => navigate(-1)}>{isRtl ? <ArrowRight /> : <ArrowLeft />}{localize(pageCopy.back, lang)}</button><span>ARSHIDA · LIVE</span></header>
    <section className="live-order-hero page-width"><span className="eyebrow">{localize(pageCopy.liveOrder, lang)}</span><h1>#{order.id}</h1><p>{order.message || localize(orderStatusCopy[order.status], lang)}</p><div className="live-pulse"><i />LIVE · {order.estimate}</div></section>
    <section className="order-progress page-width" aria-live="polite">{statuses.map((status, index) => { const Icon = icons[status]; const complete = index < currentIndex; const active = index === currentIndex; const history = [...order.history].reverse().find((item) => item.status === status); return <article className={`${complete ? 'complete' : ''} ${active ? 'active' : ''}`} key={status}><div className="order-progress-icon"><Icon /></div><div><span>{String(index + 1).padStart(2, '0')}</span><h2>{localize(orderStatusCopy[status], lang)}</h2><time>{history ? new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' }).format(new Date(history.at)) : '—'}</time></div></article>; })}</section>
    <section className="order-receipt page-width"><div><span className="eyebrow">ORDER DETAILS</span><h2>{order.type === 'delivery' ? 'Delivery' : order.type === 'dinein' ? `Table ${order.table}` : 'Pickup'}</h2>{order.customer?.address && <p><MapPin />{order.customer.address}</p>}</div><div>{order.items.map((item, index) => <p key={`${item.name}-${index}`}><span>{item.quantity} × {typeof item.name === 'object' ? item.name.en : item.name}</span><strong>€{(item.price * item.quantity).toFixed(2)}</strong></p>)}<p className="receipt-total"><span>Total</span><strong>€{Number(order.total).toFixed(2)}</strong></p></div></section>
  </main>;
}
