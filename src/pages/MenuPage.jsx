import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Search, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { enrichedDishes, lunchBuffet, pageCopy } from '../data/platformData';
import { categories, localize } from '../data/siteData';

const localeCodes = { de: 'de-DE', en: 'en-GB', fa: 'fa-IR', ar: 'ar-DE' };
const formatPrice = (value, lang) => new Intl.NumberFormat(localeCodes[lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);
const validCategories = new Set(categories.map((item) => item.id));

export default function MenuPage() {
  const { t, lang, isRtl } = useTheme();
  const { addToCart, setIsCartOpen, setIsReservationOpen, setReservationIntent } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category') || 'all';
  const category = validCategories.has(requestedCategory) ? requestedCategory : 'all';
  const [query, setQuery] = useState('');
  const [addedDishId, setAddedDishId] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase(lang);
  const shownDishes = useMemo(() => enrichedDishes.filter((dish) => {
    const categoryMatches = category === 'all' || dish.category === category;
    const searchMatches = !normalizedQuery || [dish.name, dish.description].some((field) => localize(field, lang).toLocaleLowerCase(lang).includes(normalizedQuery));
    return categoryMatches && searchMatches;
  }), [category, lang, normalizedQuery]);
  const buffetMatches = (category === 'all' || category === 'buffet') && (!normalizedQuery || [lunchBuffet.title, lunchBuffet.description, lunchBuffet.eyebrow].some((field) => localize(field, lang).toLocaleLowerCase(lang).includes(normalizedQuery)));

  const chooseCategory = (nextCategory) => {
    const next = new URLSearchParams();
    if (nextCategory !== 'all') next.set('category', nextCategory);
    setSearchParams(next, { replace: false });
  };
  const reset = () => { setQuery(''); chooseCategory('all'); };
  const addDish = (dish) => {
    addToCart(dish);
    setAddedDishId(dish.id);
    window.setTimeout(() => setAddedDishId((current) => current === dish.id ? null : current), 1800);
  };
  const reserveBuffet = () => {
    setReservationIntent(`${localize(lunchBuffet.title, lang)} · ${localize(lunchBuffet.days, lang)} · ${lunchBuffet.time}`);
    setIsReservationOpen(true);
  };

  return <main className="route-page full-menu-page" id="main">
    <header className="menu-ledger-hero">
      <div className="page-width menu-ledger-intro">
        <button className="menu-page-back" onClick={() => navigate('/')}>{isRtl ? <ArrowRight /> : <ArrowLeft />}{localize(pageCopy.back, lang)}</button>
        <div><span className="eyebrow">ARSHIDA · {localize(pageCopy.menuArchive, lang)}</span><h1>{localize(pageCopy.menuArchiveTitle, lang)}</h1></div>
        <p>{localize(pageCopy.menuArchiveIntro, lang)}</p>
      </div>
    </header>

    <section className="menu-ledger page-width" aria-label={localize(pageCopy.menuArchive, lang)}>
      <div className="menu-ledger-tools">
        <div className="category-tabs" role="tablist" aria-label={localize(pageCopy.menuArchive, lang)}>{categories.map((item) => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => chooseCategory(item.id)}>{localize(item.label, lang)}</button>)}</div>
        <label className="search-field"><Search /><span className="sr-only">{t('search')}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${t('search')}…`} /></label>
      </div>

      <div className="menu-ledger-rule"><span>{String((buffetMatches ? 1 : 0) + shownDishes.length).padStart(2, '0')} · ARSHIDA</span><i /></div>

      {buffetMatches && <article className="menu-buffet-row">
        <div className="menu-buffet-image"><img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=900&q=86" width="900" height="620" alt={localize(lunchBuffet.title, lang)} /></div>
        <div><span className="eyebrow"><Sparkles />{localize(pageCopy.buffetMenuLabel, lang)}</span><h2>{localize(lunchBuffet.title, lang)}</h2><p>{localize(lunchBuffet.description, lang)}</p><span className="menu-buffet-schedule"><CalendarDays />{localize(lunchBuffet.days, lang)} · {lunchBuffet.time}</span></div>
        <div className="menu-buffet-order"><span>{localize(lunchBuffet.adultLabel, lang)}</span><strong>{formatPrice(lunchBuffet.adultPrice, lang)}</strong><small>{localize(lunchBuffet.childLabel, lang)} · {formatPrice(lunchBuffet.childPrice, lang)}</small><button className="button button-primary" onClick={reserveBuffet}>{localize(lunchBuffet.reserve, lang)}</button></div>
      </article>}

      <div className="menu-ledger-list">{shownDishes.map((dish, index) => <article className="menu-ledger-row" key={dish.id}>
        <span className="menu-row-index">{String(index + 1).padStart(2, '0')}</span>
        <Link className="menu-row-image" to={`/menu/${dish.slug}`} aria-label={`${t('details')}: ${localize(dish.name, lang)}`}><img src={dish.image} width="220" height="180" loading={index > 3 ? 'lazy' : 'eager'} alt={localize(dish.name, lang)} /></Link>
        <div className="menu-row-copy"><span>{localize(categories.find((item) => item.id === dish.category)?.label, lang)}</span><h2><Link to={`/menu/${dish.slug}`}>{localize(dish.name, lang)}</Link></h2><p>{localize(dish.description, lang)}</p><div><span><Star />{dish.rating}</span><span><Clock3 />{dish.time} {t('minutes')}</span></div></div>
        <strong className="menu-row-price">{formatPrice(dish.price, lang)}</strong>
        <div className="menu-row-actions"><Link className="button button-quiet" to={`/menu/${dish.slug}`}>{t('details')}</Link><button className={`button button-primary ${addedDishId === dish.id ? 'success' : ''}`} onClick={() => addDish(dish)}>{addedDishId === dish.id ? <><Check />{localize(pageCopy.orderAdded, lang)}</> : <><ShoppingBag />{localize(pageCopy.add, lang)}</>}</button></div>
      </article>)}</div>

      {!shownDishes.length && !buffetMatches && <div className="empty-state menu-empty"><Search /><p>{t('noResults')}</p><button className="button button-primary" onClick={reset}>{localize(pageCopy.clearFilters, lang)}</button></div>}
      <div className="menu-ledger-cart"><span>{localize(pageCopy.orderPanel, lang)}</span><button className="button button-quiet" onClick={() => setIsCartOpen(true)}><ShoppingBag />{localize(pageCopy.cartShortcut, lang)}</button></div>
    </section>
  </main>;
}
