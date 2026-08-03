import { useEffect, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, BarChart3, CalendarDays, CircleAlert, Clock3, ContactRound, Gauge, Globe2, GripVertical, LayoutDashboard, Pause, Play, QrCode, RefreshCw, Settings2, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { ORDER_STATUSES, useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { eventDetails, orderStatusCopy } from '../data/platformData';
import { enrichedDishes, rewards } from '../data/platformData';
import { localize, tables } from '../data/siteData';

const tabItems = [
  ['orders', LayoutDashboard, 'Live orders'], ['reservations', CalendarDays, 'Floor & bookings'], ['menu', UtensilsCrossed, 'Menu & media'],
  ['guests', ContactRound, 'Guests & loyalty'], ['events', Sparkles, 'Events'], ['insights', BarChart3, 'Insights'], ['settings', Settings2, 'Brand & QR'],
];

export default function RestaurantWorkspace() {
  const navigate = useNavigate();
  const { lang, isRtl } = useTheme();
  const { orders, bookings, eventBookings, guests, loyaltyPoints, activity, updateOrderStatus, resetPlatform } = useApp();
  const [tab, setTab] = useState('orders');
  const [role, setRole] = useState('Owner');
  const [autoOrder, setAutoOrder] = useState('');
  const [autopilot, setAutopilot] = useState(false);
  const [qrTable, setQrTable] = useState('T4');
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    if (!autopilot || !autoOrder) return undefined;
    const timer = setInterval(() => {
      const order = orders.find((item) => item.id === autoOrder);
      if (!order) return;
      const current = ORDER_STATUSES.indexOf(order.status);
      if (current >= ORDER_STATUSES.length - 1) { setAutopilot(false); return; }
      const next = ORDER_STATUSES[current + 1];
      if (order.type !== 'delivery' && next === 'courier_handoff') updateOrderStatus(order.id, 'completed');
      else updateOrderStatus(order.id, next);
    }, 4200);
    return () => clearInterval(timer);
  }, [autopilot, autoOrder, orders, updateOrderStatus]);

  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const conversion = eventBookings.length ? Math.min(98, 64 + eventBookings.length * 3) : 64;
  const columns = ORDER_STATUSES.filter((status) => status !== 'courier_handoff' || orders.some((order) => order.type === 'delivery'));
  const activeOrders = orders.filter((order) => order.status !== 'completed');
  const qrUrl = `${window.location.origin}/?table=${encodeURIComponent(qrTable)}&mode=dinein`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(qrUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#24130fff', light: '#f7efe4ff' },
      errorCorrectionLevel: 'H',
    }).then((image) => active && setQrImage(image));
    return () => { active = false; };
  }, [qrUrl]);

  return <main className="workspace" id="main">
    <aside className="workspace-nav"><button className="workspace-brand" onClick={() => navigate('/')}><span>A</span><b>ARSHIDA</b></button><nav>{tabItems.map(([id, Icon, label]) => <button className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}><Icon />{label}</button>)}</nav><div className="workspace-role"><span>Workspace role</span><select value={role} onChange={(event) => setRole(event.target.value)}><option>Owner</option><option>Kitchen</option><option>Reception</option><option>Marketing</option></select></div></aside>
    <section className="workspace-main">
      <header className="workspace-header"><div><button className="workspace-back" onClick={() => navigate('/')}>{isRtl ? <ArrowRight /> : <ArrowLeft />}Restaurant site</button><span className="eyebrow">ARSHIDA OPERATIONS · {role}</span><h1>{tabItems.find((item) => item[0] === tab)?.[2]}</h1></div><div className="workspace-live"><i />LIVE SYNC</div></header>

      {tab === 'orders' && <><div className="workspace-kpis"><Metric icon={Activity} label="Active orders" value={activeOrders.length} /><Metric icon={Clock3} label="Average fulfilment" value="18m" /><Metric icon={Gauge} label="Tonight revenue" value={`€${revenue.toFixed(0)}`} /></div><div className="autopilot"><div><Play /><span><b>Presentation autopilot</b><small>Advance one selected order through the real status pipeline.</small></span></div><select value={autoOrder} onChange={(e) => setAutoOrder(e.target.value)}><option value="">Select order</option>{activeOrders.map((order) => <option value={order.id} key={order.id}>{order.id}</option>)}</select><button className="button button-quiet" disabled={!autoOrder} onClick={() => setAutopilot((value) => !value)}>{autopilot ? <><Pause />Pause</> : <><Play />Start</>}</button></div><div className="order-board">{columns.map((status) => <section className="order-column" key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => updateOrderStatus(event.dataTransfer.getData('text/order-id'), status)}><header><span>{localize(orderStatusCopy[status], lang)}</span><b>{orders.filter((order) => order.status === status).length}</b></header>{orders.filter((order) => order.status === status).map((order) => <article draggable onDragStart={(event) => event.dataTransfer.setData('text/order-id', order.id)} key={order.id}><div><GripVertical /><strong>{order.id}</strong><time>{new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' }).format(new Date(order.createdAt))}</time></div><p>{order.items.length} items · {order.type}</p><span>€{Number(order.total).toFixed(2)}</span><div className="order-card-actions">{ORDER_STATUSES.indexOf(status) > 0 && <button onClick={() => updateOrderStatus(order.id, ORDER_STATUSES[ORDER_STATUSES.indexOf(status) - 1])}>Back</button>}{ORDER_STATUSES.indexOf(status) < ORDER_STATUSES.length - 1 && <button onClick={() => updateOrderStatus(order.id, ORDER_STATUSES[ORDER_STATUSES.indexOf(status) + 1])}>Advance</button>}</div></article>)}</section>)}</div></>}

      {tab === 'reservations' && <div className="workspace-grid"><section className="workspace-panel span-2"><PanelTitle icon={CalendarDays} title="Tonight’s floor" detail={`${bookings.length} online bookings`} /><div className="floor-mini">{tables.map((table) => <button className={`${table.status} ${bookings.some((booking) => booking.table === table.id) ? 'booked' : ''}`} style={{ left: `${table.x}%`, top: `${table.y}%` }} key={table.id}><b>{table.id}</b><span>{table.seats}</span></button>)}</div></section><section className="workspace-panel"><PanelTitle icon={Clock3} title="Waitlist matcher" detail="3 guests match the next opening" /><div className="ops-list"><p><b>19:30 · 2 guests</b><span>Window table · Anniversary</span></p><p><b>20:00 · 4 guests</b><span>Main salon · Gluten free</span></p><p><b>21:30 · 2 guests</b><span>Chef’s counter</span></p></div></section></div>}

      {tab === 'menu' && <div className="workspace-grid">{enrichedDishes.map((dish) => <article className="menu-admin-card" key={dish.id}><img src={dish.image} alt="" /><div><span className="eyebrow">{dish.category}</span><h3>{localize(dish.name, lang)}</h3><p>Gallery {dish.gallery.length} · Film · Story · Nutrition</p></div><label className="availability-toggle"><input type="checkbox" defaultChecked /><span>Available</span></label></article>)}</div>}

      {tab === 'guests' && <div className="workspace-grid"><section className="workspace-panel span-2"><PanelTitle icon={ContactRound} title="Guest intelligence" detail={`${guests.length} priority profiles`} /><div className="guest-admin-list">{guests.map((guest) => <article key={guest.id}><i>{guest.name[0]}</i><div><b>{guest.name}</b><span>{guest.tier} · {guest.visits} visits</span></div><strong>{guest.total}</strong><p>{guest.note}</p></article>)}</div></section><section className="workspace-panel"><PanelTitle icon={Sparkles} title="Loyalty studio" detail={`${loyaltyPoints} current guest points`} />{rewards.map((reward) => <p className="reward-admin" key={reward.id}><span>{localize(reward.title, lang)}</span><b>{reward.points}</b></p>)}</section></div>}

      {tab === 'events' && <div className="workspace-grid">{eventDetails.map((event) => { const sold = eventBookings.filter((item) => item.eventId === event.id).reduce((sum, item) => sum + item.guests, 0); return <article className="event-admin-card" key={event.id} style={{ '--cover': `url(${event.cover})` }}><div><span className="eyebrow">{event.date}</span><h2>{localize(event.title, lang)}</h2><p>{event.performer}</p></div><strong>{event.remaining - sold}<small>remaining</small></strong></article>; })}</div>}

      {tab === 'insights' && <div className="workspace-grid"><MetricCard label="Menu detail conversion" value="34.8%" trend="+8.2%" /><MetricCard label="Reservation conversion" value="21.4%" trend="+4.1%" /><MetricCard label="Event conversion" value={`${conversion}%`} trend="Live" /><section className="workspace-panel span-3"><PanelTitle icon={BarChart3} title="Demand by service hour" detail="Reservations and orders" /><div className="bar-chart">{[32,48,72,96,84,59,38].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{17 + index}:00</span></div>)}</div></section></div>}

      {tab === 'settings' && <div className="workspace-grid"><section className="workspace-panel span-2"><PanelTitle icon={Globe2} title="Brand system" detail="2 layouts · 8 themes · 4 languages" /><div className="brand-preview"><span>A</span><div><b>ARSHIDA</b><small>CONTEMPORARY DINING · BERLIN</small></div></div></section><section className="workspace-panel qr-panel"><PanelTitle icon={QrCode} title="Table QR" detail="Scannable link bound to dine-in ordering" /><div className="qr-visual">{qrImage ? <img src={qrImage} alt={`QR code for table ${qrTable}`} /> : <QrCode />}</div><input value={qrTable} onChange={(event) => setQrTable(event.target.value.toUpperCase())} aria-label="Table number" /><code>{qrUrl}</code><a className="button button-quiet" href={qrImage} download={`arshida-${qrTable}-qr.png`}>Download QR</a></section><section className="workspace-panel span-3 danger-panel"><PanelTitle icon={CircleAlert} title="Local product data" detail="Reset orders, reservations and activity to the curated starting state." /><button className="button button-quiet" onClick={() => confirm('Reset all local platform data?') && resetPlatform()}><RefreshCw />Reset local data</button></section></div>}

      <footer className="workspace-activity"><span>{activity[0]?.action || 'platform:ready'}</span><time>{activity[0] ? new Date(activity[0].at).toLocaleTimeString() : 'now'}</time></footer>
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value }) { return <article><Icon /><span>{label}</span><strong>{value}</strong></article>; }
function PanelTitle({ icon: Icon, title, detail }) { return <header className="panel-title"><Icon /><div><h2>{title}</h2><p>{detail}</p></div></header>; }
function MetricCard({ label, value, trend }) { return <article className="metric-card"><span>{label}</span><strong>{value}</strong><small>{trend}</small></article>; }
