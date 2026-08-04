import { useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, ChefHat, Clock3, MapPin, PackageCheck, Truck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderStatuses, useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { enrichedDishes, orderStatusByTypeCopy, orderStatusCopy, pageCopy } from '../data/platformData';
import { localize } from '../data/siteData';

const stageMeta = {
  submitted: { Icon: Clock3, tone: 'slate' },
  confirmed: { Icon: Check, tone: 'sage' },
  preparing: { Icon: ChefHat, tone: 'amber' },
  cooking: { Icon: ChefHat, tone: 'ember' },
  quality_check: { Icon: PackageCheck, tone: 'violet' },
  ready: { Icon: PackageCheck, tone: 'mint' },
  courier_handoff: { Icon: Truck, tone: 'blue' },
  completed: { Icon: MapPin, tone: 'green' },
};

function statusCopyFor(order, status) {
  return orderStatusByTypeCopy[order.type]?.[status] || orderStatusCopy[status];
}

function formatStageTime(history, status, lang) {
  const entry = [...history].reverse().find((item) => item.status === status);
  if (!entry) return '—';
  return new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' }).format(new Date(entry.at));
}

function formatOrderMoment(order, lang, options) {
  const source = order.createdAt || order.history?.[0]?.at;
  if (!source || Number.isNaN(new Date(source).getTime())) return '—';
  return new Intl.DateTimeFormat(lang, options).format(new Date(source));
}

function resolveDish(item) {
  const storedName = typeof item.name === 'object' ? item.name.en : item.name;
  return enrichedDishes.find((dish) => String(dish.id) === String(item.dishId) || dish.name.en === storedName);
}

function OrderDossier({ order, lang, restaurantAddress }) {
  const fulfilmentCopy = order.type === 'delivery' ? pageCopy.deliveryType : order.type === 'dinein' ? pageCopy.dineinType : pageCopy.pickupType;
  const serviceLocation = order.type === 'dinein'
    ? `${localize(pageCopy.tableLabel, lang)} ${order.table || '—'} · ARSHIDA`
    : `ARSHIDA · ${restaurantAddress}`;

  return <section className="order-dossier" aria-labelledby="order-dossier-title">
    <header>
      <span id="order-dossier-title">{localize(pageCopy.orderDossier, lang)}</span>
      <strong className="latin-data">#{order.id}</strong>
    </header>
    <div className="order-dossier-facts">
      <p><small>{localize(pageCopy.orderDate, lang)}</small><b>{formatOrderMoment(order, lang, { day: 'numeric', month: 'short', year: 'numeric' })}</b></p>
      <p><small>{localize(pageCopy.orderTime, lang)}</small><b>{formatOrderMoment(order, lang, { hour: '2-digit', minute: '2-digit' })}</b></p>
    </div>
    <div className="order-dossier-location">
      <span>{localize(pageCopy.fulfilment, lang)}</span><b>{localize(fulfilmentCopy, lang)}</b>
      <small>{localize(pageCopy.restaurantLocation, lang)}</small><p><MapPin />{serviceLocation}</p>
      {order.type === 'delivery' && <><small>{localize(pageCopy.deliveryLocation, lang)}</small><p><MapPin />{order.customer?.address || localize(pageCopy.unavailable, lang)}</p></>}
    </div>
    <span className="order-dossier-list-label">{localize(pageCopy.orderedDishes, lang)}</span>
    <div className="order-dossier-items" tabIndex="0">
      {order.items.map((item, index) => {
        const dish = resolveDish(item);
        const title = dish ? localize(dish.name, lang) : typeof item.name === 'object' ? localize(item.name, lang) : item.name;
        return <article key={`${item.dishId || item.name}-${index}`}>
          {dish?.image ? <img src={dish.image} alt="" loading="lazy" /> : <i aria-hidden="true">A</i>}
          <div><b>{title}</b>{item.options?.notes && <small>{item.options.notes}</small>}</div>
          <strong>{item.quantity}×</strong>
        </article>;
      })}
    </div>
  </section>;
}

export default function LiveOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl, t } = useTheme();
  const { orders, activeOrder } = useApp();
  const stageRefs = useRef({});
  const order = orders.find((item) => item.id === orderId) || activeOrder;
  const statuses = useMemo(() => order ? getOrderStatuses(order) : [], [order]);
  const currentIndex = order ? statuses.indexOf(order.status) : -1;

  useEffect(() => {
    if (!order?.status || !stageRefs.current[order.status]) return undefined;
    const mobile = window.matchMedia('(max-width: 760px)');
    if (!mobile.matches) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => {
      stageRefs.current[order.status]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [order?.status]);

  if (!order) return <main className="route-page route-not-found"><h1>No active order</h1></main>;

  const currentStatus = localize(statusCopyFor(order, order.status), lang);
  const currentTime = formatStageTime(order.history, order.status, lang);

  return <main className="route-page live-order-page" id="main">
    <header className="route-mini-header page-width"><button onClick={() => navigate(-1)}>{isRtl ? <ArrowRight /> : <ArrowLeft />}{localize(pageCopy.back, lang)}</button><span>ARSHIDA · LIVE</span></header>

    <section className="live-order-hero page-width">
      <span className="eyebrow">{localize(pageCopy.liveOrder, lang)}</span>
      <h1 className="latin-data" dir="ltr">#{order.id}</h1>
      <p>{order.message || currentStatus}</p>
      <div className="live-pulse"><i />LIVE · {order.estimate}</div>
    </section>

    <section className="live-tracker page-width" aria-live="polite" aria-label={localize(pageCopy.trackerJourney, lang)}>
      <div className="live-tracker-main">
        <header className="live-tracker-heading"><div><span className="eyebrow">{localize(pageCopy.orderJourney, lang)}</span><h2>{localize(pageCopy.kitchenToDoor, lang)}</h2></div><span>{String(currentIndex + 1).padStart(2, '0')} / {String(statuses.length).padStart(2, '0')}</span></header>
        <div className="service-ribbon" tabIndex="0">
          {statuses.map((status, index) => {
            const { Icon, tone } = stageMeta[status];
            const state = index === currentIndex ? 'active' : index < currentIndex ? 'complete' : 'future';
            return <article className="service-stage" data-state={state} data-tone={tone} aria-current={index === currentIndex ? 'step' : undefined} ref={(element) => { stageRefs.current[status] = element; }} key={status}>
              <div className="service-stage-track"><span><Icon /></span></div>
              <div className="service-stage-copy"><small>{String(index + 1).padStart(2, '0')}</small><h3>{localize(statusCopyFor(order, status), lang)}</h3><time>{formatStageTime(order.history, status, lang)}</time></div>
            </article>;
          })}
        </div>
        <div className="live-stage-caption"><span>{localize(pageCopy.nowServing, lang)}</span><strong>{currentStatus}</strong><p>{localize(pageCopy.statusUpdatesAutomatically, lang)}</p></div>
      </div>

      <aside className="live-signal-panel">
        <div className="live-signal-estimate"><strong>{order.estimate}</strong><span>{localize(pageCopy.liveEstimate, lang)}</span></div>
        <OrderDossier order={order} lang={lang} restaurantAddress={t('footerAddress')} />
        <div className="live-signal-reading"><span>{localize(pageCopy.liveSignal, lang)}</span><h2>{currentStatus}</h2><p>{localize(pageCopy.lastUpdated, lang)} · {currentTime}</p><div className="signal-wave" aria-hidden="true">{[0, 1, 2, 3, 4].map((bar) => <i key={bar} />)}</div></div>
      </aside>
    </section>

    <section className="order-receipt page-width"><div><span className="eyebrow">ORDER DETAILS</span><h2>{localize(order.type === 'delivery' ? pageCopy.deliveryType : order.type === 'dinein' ? pageCopy.dineinType : pageCopy.pickupType, lang)}</h2>{order.customer?.address && <p><MapPin />{order.customer.address}</p>}</div><div>{order.items.map((item, index) => <p key={`${item.name}-${index}`}><span>{item.quantity} × {resolveDish(item) ? localize(resolveDish(item).name, lang) : typeof item.name === 'object' ? localize(item.name, lang) : item.name}</span><strong>€{(item.price * item.quantity).toFixed(2)}</strong></p>)}<p className="receipt-total"><span>Total</span><strong>€{Number(order.total).toFixed(2)}</strong></p></div></section>
  </main>;
}
