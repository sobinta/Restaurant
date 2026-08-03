import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChefHat,
  Camera, ChevronDown, CircleAlert, Clock3, Eye, Globe2, LayoutTemplate,
  House, Mail, MapPin, Minus, Palette, Phone, Plus, Search, Send, ShoppingBag,
  Sparkles, Star, Trash2, UserRound, Users, UtensilsCrossed, X,
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { categories, localize, tables } from './data/siteData';
import { enrichedDishes as dishes, eventDetails as events, lunchBuffet, orderStatusCopy, pageCopy, rewards } from './data/platformData';
import CinematicLoader from './components/CinematicLoader';

const PanoramaViewer = lazy(() => import('./components/PanoramaViewer'));
const DishPage = lazy(() => import('./pages/DishPage'));
const EventPage = lazy(() => import('./pages/EventPage'));
const LiveOrderPage = lazy(() => import('./pages/LiveOrderPage'));
const RestaurantWorkspace = lazy(() => import('./pages/RestaurantWorkspace'));

const IconArrow = ({ className = '' }) => {
  const { isRtl } = useTheme();
  return isRtl ? <ArrowLeft className={className} /> : <ArrowRight className={className} />;
};

const localeCodes = { de: 'de-DE', en: 'en-GB', fa: 'fa-IR', ar: 'ar-DE' };
const formatPrice = (value, lang) => new Intl.NumberFormat(localeCodes[lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);
const formatEventDate = (value, lang) => new Intl.DateTimeFormat(localeCodes[lang], { day: '2-digit', month: '2-digit' }).format(new Date(`${value}T12:00:00`));

function Modal({ open, onClose, title, children, size = 'medium', className = '', shellClassName = '' }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector('button, input, select, [tabindex="0"]')?.focus());
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`modal-shell ${shellClassName}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} role="dialog" aria-modal="true" aria-label={title} className={`modal-panel modal-${size} ${className}`}>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {children}
      </section>
    </div>
  );
}

function AppearanceControls({ includeLanguage = false }) {
  const { t, themeId, setThemeId, themeOptions, layoutMode, setLayoutMode } = useTheme();
  const dark = themeOptions.filter((item) => item.family === 'dark');
  const light = themeOptions.filter((item) => item.family === 'light');
  return (
    <div className="appearance-controls">
      <div className="layout-switch" aria-label={t('siteLayout')}>
        <button className={layoutMode === 'cinematic' ? 'active' : ''} onClick={() => setLayoutMode('cinematic')}><Sparkles size={16} />{t('cinematic')}</button>
        <button className={layoutMode === 'editorial' ? 'active' : ''} onClick={() => setLayoutMode('editorial')}><LayoutTemplate size={16} />{t('editorial')}</button>
      </div>
      <ThemeRows title={t('darkThemes')} items={dark} themeId={themeId} setThemeId={setThemeId} />
      <ThemeRows title={t('lightThemes')} items={light} themeId={themeId} setThemeId={setThemeId} />
      {includeLanguage && <LanguageChoices />}
    </div>
  );
}

function AppearancePanel({ onClose }) {
  const { t } = useTheme();
  return <div className="appearance-panel" role="dialog" aria-label={t('appearance')}>
    <div className="panel-heading"><div><span className="eyebrow">{t('appearance')}</span><h3>{t('siteLayout')}</h3></div><button className="icon-button" onClick={onClose} aria-label={t('close')}><X size={18} /></button></div>
    <AppearanceControls />
  </div>;
}

function ThemeRows({ title, items, themeId, setThemeId }) {
  return <div className="theme-group"><span className="field-label">{title}</span><div className="theme-grid">{items.map((item) => (
    <button key={item.id} className={`theme-choice ${themeId === item.id ? 'selected' : ''}`} onClick={() => setThemeId(item.id)} aria-pressed={themeId === item.id} title={item.label}>
      <span className="theme-swatches">{item.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span><span>{item.id.toUpperCase()}</span>{themeId === item.id && <Check size={14} />}
    </button>
  ))}</div></div>;
}

function LanguageMenu({ compact = false }) {
  const { lang, toggleLanguage, t } = useTheme();
  const [open, setOpen] = useState(false);
  const labels = { de: 'DE', en: 'EN', fa: 'FA', ar: 'AR' };
  return <div className="language-control">
    <button className={compact ? 'icon-button' : 'nav-tool'} aria-label={t('language')} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Globe2 size={18} />{!compact && <span>{labels[lang]}</span>}<ChevronDown size={14} /></button>
    {open && <div className="language-menu">{Object.entries(labels).map(([code, label]) => <button key={code} className={lang === code ? 'active' : ''} onClick={() => { toggleLanguage(code); setOpen(false); }}><span>{label}</span><small>{code === 'de' ? 'Deutsch' : code === 'en' ? 'English' : code === 'fa' ? 'فارسی' : 'العربية'}</small>{lang === code && <Check size={14} />}</button>)}</div>}
  </div>;
}

function LanguageChoices() {
  const { lang, toggleLanguage, t } = useTheme();
  const languages = [['de', 'DE', 'Deutsch'], ['en', 'EN', 'English'], ['fa', 'FA', 'فارسی'], ['ar', 'AR', 'العربية']];
  return <div className="sheet-language"><span className="field-label">{t('language')}</span><div>{languages.map(([code, short, name]) => <button key={code} className={lang === code ? 'active' : ''} onClick={() => toggleLanguage(code)} aria-pressed={lang === code}><b>{short}</b><span>{name}</span>{lang === code && <Check />}</button>)}</div></div>;
}

function MobileAppearanceSheet({ open, onClose }) {
  const { t } = useTheme();
  return <Modal open={open} onClose={onClose} title={t('appearance')} size="bottom" className="mobile-appearance-sheet">
    <div className="mobile-sheet-handle" aria-hidden="true" />
    <header className="mobile-sheet-heading"><span className="eyebrow">ARSHIDA · PERSONAL</span><h2>{t('appearance')}</h2><p>{t('siteLayout')} · 8 {t('theme')}</p></header>
    <AppearanceControls includeLanguage />
  </Modal>;
}

function MobileBottomNav({ count, onReserve, onOrder, onAppearance }) {
  const { t, lang } = useTheme();
  const homeLabel = { de: 'Start', en: 'Home', fa: 'خانه', ar: 'الرئيسية' }[lang];
  return <nav className="mobile-bottom-nav" aria-label={t('mobileMenu')}>
    <a href="/#top"><House /><span>{homeLabel}</span></a>
    <a href="/#menu"><UtensilsCrossed /><span>{t('navMenu')}</span></a>
    <button className="mobile-reserve-action" onClick={onReserve}><span><CalendarDays /></span><b>{t('book')}</b></button>
    <button onClick={onOrder}><span className="mobile-nav-icon"><ShoppingBag />{count > 0 && <i>{count}</i>}</span><span>{t('cart')}</span></button>
    <button onClick={onAppearance} aria-haspopup="dialog"><Palette /><span>{t('appearance')}</span></button>
  </nav>;
}

function Navbar() {
  const { t, branding, lang } = useTheme();
  const { cart, setIsCartOpen, setIsReservationOpen, setIsProfileOpen } = useApp();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [mobileAppearanceOpen, setMobileAppearanceOpen] = useState(false);
  const closeMobileAppearance = useCallback(() => setMobileAppearanceOpen(false), []);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const nav = [['/#menu', t('navMenu')], ['/#lunch-buffet', localize(categories.find((item) => item.id === 'buffet').label, lang)], ['/#experience', t('navExperience')], ['/#journal', t('navStories')], ['/#events', t('navEvents')]];
  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = (event) => event.matches && setMobileAppearanceOpen(false);
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  return <>
    <a className="skip-link" href="#main">{t('skip')}</a>
    <header className="site-header">
      <a className="brand" href="/#top" aria-label="Arshida home"><span className="brand-mark">A</span><span><b>{branding.name}</b><small>{branding.subName}</small></span></a>
      <nav className="desktop-nav">{nav.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="header-actions">
        <LanguageMenu />
        <div className="appearance-anchor"><button className="nav-tool" onClick={() => setAppearanceOpen((value) => !value)} aria-expanded={appearanceOpen}><Palette size={18} /><span>{t('appearance')}</span></button>{appearanceOpen && <AppearancePanel onClose={() => setAppearanceOpen(false)} />}</div>
        <button className="icon-button" onClick={() => setIsProfileOpen(true)} aria-label={t('profile')}><UserRound size={19} /></button>
        <button className="icon-button cart-trigger" onClick={() => setIsCartOpen(true)} aria-label={t('cart')}><ShoppingBag size={19} />{count > 0 && <span>{count}</span>}</button>
        <button className="button button-primary header-book" onClick={() => setIsReservationOpen(true)}><CalendarDays size={17} />{t('book')}</button>
      </div>
    </header>
    <MobileBottomNav count={count} onReserve={() => setIsReservationOpen(true)} onOrder={() => setIsCartOpen(true)} onAppearance={() => setMobileAppearanceOpen(true)} />
    <MobileAppearanceSheet open={mobileAppearanceOpen} onClose={closeMobileAppearance} />
  </>;
}

function CinematicHero() {
  const { t } = useTheme();
  const { setIsReservationOpen } = useApp();
  return <section className="hero hero-cinematic" id="top">
    <img src="/arshida-hero.png" width="1747" height="941" fetchPriority="high" alt="Chef’s tasting menu plated in Arshida’s dining room" className="hero-photo" />
    <div className="hero-scrim" />
    <div className="hero-content page-width">
      <div className="hero-copy reveal"><span className="eyebrow hero-eyebrow"><i />{t('heroKicker')}</span><h1>{t('heroTitle')}</h1><p>{t('heroSubtitle')}</p><div className="hero-actions"><button className="button button-primary" onClick={() => setIsReservationOpen(true)}>{t('reserveExperience')}<IconArrow /></button><a className="button button-ghost" href="#menu">{t('exploreMenu')}</a></div></div>
      <div className="hero-meta"><span><Clock3 />{t('openTonight')}</span><span><Star />{t('rating')}</span><span><Eye />{t('seatView')}</span></div>
    </div>
    <a className="scroll-cue" href="#menu"><span>SCROLL</span><i /></a>
  </section>;
}

function EditorialHero() {
  const { t } = useTheme();
  const { setIsReservationOpen } = useApp();
  return <section className="hero hero-editorial" id="top"><div className="editorial-hero-grid page-width">
    <div className="editorial-cover reveal"><img src="/arshida-hero.png" width="1747" height="941" fetchPriority="high" alt="Arshida seasonal tasting menu" /><div className="issue-label">ARSHIDA JOURNAL · 01</div><div className="cover-caption"><span>BERLIN</span><span>2026</span></div></div>
    <div className="editorial-intro reveal"><span className="eyebrow">{t('heroEditorialKicker')}</span><h1>{t('heroEditorialTitle')}</h1><p>{t('heroEditorialSubtitle')}</p><div className="editorial-rule"><span>01</span><i /></div><div className="hero-actions"><a className="button button-primary" href="#journal">{t('storyCta')}<IconArrow /></a><button className="button button-ghost" onClick={() => setIsReservationOpen(true)}>{t('book')}</button></div><div className="editorial-facts"><span>{t('rating')}</span><span>{t('localProduce')}</span></div></div>
  </div></section>;
}

function MenuSection() {
  const { t, lang } = useTheme();
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const shown = dishes.filter((dish) => (category === 'all' || dish.category === category) && localize(dish.name, lang).toLocaleLowerCase(lang).includes(query.toLocaleLowerCase(lang)));
  const normalizedQuery = query.toLocaleLowerCase(lang);
  const buffetMatches = (category === 'all' || category === 'buffet') && [lunchBuffet.title, lunchBuffet.eyebrow, lunchBuffet.description].some((value) => localize(value, lang).toLocaleLowerCase(lang).includes(normalizedQuery));
  return <section className="section menu-section" id="menu"><div className="page-width">
    <div className="section-heading split-heading"><div><span className="eyebrow">{t('menuEyebrow')}</span><h2>{t('menuTitle')}</h2></div><p>{t('menuSubtitle')}</p></div>
    <div className="menu-tools"><div className="category-tabs" role="tablist">{categories.map((item) => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{localize(item.label, lang)}</button>)}</div><label className="search-field"><Search size={18} /><span className="sr-only">{t('search')}</span><input name="dish-search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${t('search')}…`} /></label></div>
    {shown.length || buffetMatches ? <div className="dish-grid">{buffetMatches && <BuffetMenuCard />}{shown.map((dish, index) => <article className={`dish-card ${index === 0 && !buffetMatches ? 'dish-featured' : ''}`} key={dish.id}>
      <button className="dish-image" onClick={() => navigate(`/menu/${dish.slug}`)} aria-label={`${t('details')}: ${localize(dish.name, lang)}`}><img src={dish.image} width="1000" height="800" loading={index > 2 ? 'lazy' : 'eager'} alt={localize(dish.name, lang)} />{dish.tags.includes('signature') && <span className="dish-badge"><Sparkles size={13} />{t('chefChoice')}</span>}</button>
      <div className="dish-body"><div className="dish-line"><div><span className="dish-category">{localize(categories.find((item) => item.id === dish.category)?.label, lang)}</span><h3>{localize(dish.name, lang)}</h3></div><strong>{formatPrice(dish.price, lang)}</strong></div><p>{localize(dish.description, lang)}</p><div className="dish-meta"><span><Star size={14} />{dish.rating}</span><span><Clock3 size={14} />{dish.time} {t('minutes')}</span><div className="dish-actions"><button className="text-button" onClick={() => navigate(`/menu/${dish.slug}`)}>{t('details')}</button><button className="round-add" onClick={() => addToCart(dish)} aria-label={`${t('add')}: ${localize(dish.name, lang)}`}><Plus size={18} /></button></div></div></div>
    </article>)}</div> : <div className="empty-state"><Search size={28} /><p>{t('noResults')}</p><button className="text-button" onClick={() => { setQuery(''); setCategory('all'); }}>{t('all')}</button></div>}
  </div></section>;
}

function BuffetMenuCard() {
  const { lang } = useTheme();
  const { setIsReservationOpen, setReservationIntent } = useApp();
  const reserve = () => { setReservationIntent(`${localize(lunchBuffet.title, lang)} · ${localize(lunchBuffet.days, lang)} · ${lunchBuffet.time}`); setIsReservationOpen(true); };
  return <article className="buffet-menu-card" id="buffet-menu-card">
    <div className="buffet-card-visual"><img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1400&q=88" width="1400" height="900" loading="lazy" alt="Arshida weekday lunch buffet" /><span>11:30<small>—</small>15:30</span></div>
    <div className="buffet-card-copy"><span className="eyebrow">{localize(lunchBuffet.eyebrow, lang)}</span><h3>{localize(lunchBuffet.title, lang)}</h3><p>{localize(lunchBuffet.description, lang)}</p><div className="buffet-card-facts"><span><CalendarDays />{localize(lunchBuffet.days, lang)}</span><strong>{formatPrice(lunchBuffet.adultPrice, lang)}<small>{localize(lunchBuffet.adultLabel, lang)}</small></strong><strong>{formatPrice(lunchBuffet.childPrice, lang)}<small>{localize(lunchBuffet.childLabel, lang)}</small></strong></div><button className="button button-primary" onClick={reserve}>{localize(lunchBuffet.reserve, lang)}<IconArrow /></button></div>
  </article>;
}

function BuffetSection() {
  const { lang } = useTheme();
  const { setIsReservationOpen, setReservationIntent } = useApp();
  const reserve = () => { setReservationIntent(`${localize(lunchBuffet.title, lang)} · ${localize(lunchBuffet.days, lang)} · ${lunchBuffet.time}`); setIsReservationOpen(true); };
  return <section className="buffet-section" id="lunch-buffet"><div className="page-width buffet-stage">
    <div className="buffet-time" aria-label={lunchBuffet.time}><span>11:30</span><i /><span>15:30</span></div>
    <div className="buffet-copy"><span className="eyebrow">{localize(lunchBuffet.eyebrow, lang)}</span><h2>{localize(lunchBuffet.title, lang)}</h2><p>{localize(lunchBuffet.description, lang)}</p><div className="buffet-actions"><button className="button button-primary" onClick={reserve}>{localize(lunchBuffet.reserve, lang)}<IconArrow /></button><a className="text-link" href="#buffet-menu-card">{localize(lunchBuffet.viewMenu, lang)}</a></div></div>
    <div className="buffet-prices"><span>{localize(lunchBuffet.days, lang)} · {lunchBuffet.time}</span><p><small>{localize(lunchBuffet.adultLabel, lang)}</small><strong>{formatPrice(lunchBuffet.adultPrice, lang)}</strong></p><p><small>{localize(lunchBuffet.childLabel, lang)}</small><strong>{formatPrice(lunchBuffet.childPrice, lang)}</strong></p></div>
  </div></section>;
}

function StorySection() {
  const { t } = useTheme();
  return <section className="section story-section" id="journal"><div className="page-width story-grid">
    <div className="story-image"><img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=88" width="1200" height="1500" loading="lazy" alt="Arshida chef finishing a plate" /><span>THE CRAFT<br />BEHIND<br />THE PLATE</span></div>
    <div className="story-copy"><span className="eyebrow">{t('storyEyebrow')}</span><h2>{t('storyTitle')}</h2><p>{t('storyText')}</p><a className="text-link" href="#events">{t('storyCta')}<IconArrow /></a><div className="source-list"><span><i>01</i>{t('sourceOne')}</span><span><i>02</i>{t('sourceTwo')}</span><span><i>03</i>{t('sourceThree')}</span></div></div>
  </div></section>;
}

function ExperienceSection() {
  const { t } = useTheme();
  const { setIsReservationOpen, open360View } = useApp();
  return <section className="section experience-section" id="experience"><div className="page-width experience-grid">
    <div className="experience-copy"><span className="eyebrow">{t('reserveEyebrow')}</span><h2>{t('reserveTitle')}</h2><p>{t('reserveText')}</p><div className="hero-actions"><button className="button button-primary" onClick={() => setIsReservationOpen(true)}>{t('openReservation')}<IconArrow /></button><button className="button button-ghost" onClick={() => open360View(tables[4])}><Eye size={18} />{t('view360')}</button></div></div>
    <div className="experience-visual"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=88" width="1400" height="980" loading="lazy" alt="Arshida dining room" /><div className="view-orbit"><span>360°</span></div><div className="availability-chip"><i />{t('available')} · T5 · 8 {t('seats')}</div></div>
  </div></section>;
}

function EventsSection() {
  const { t, lang } = useTheme();
  return <section className="section events-section" id="events"><div className="page-width"><div className="section-heading"><span className="eyebrow">{t('eventsEyebrow')}</span><h2>{t('eventsTitle')}</h2></div><div className="event-list">{events.map((event, index) => <Link to={`/events/${event.slug}`} className="event-row-link" key={event.date}><article><span className="event-index">0{index + 1}</span><time dateTime={event.date}>{formatEventDate(event.date, lang)}</time><div><h3>{localize(event.title, lang)}</h3><p>{localize(event.description, lang)}</p></div><span className="event-action">{t('eventBook')}<ArrowUpRight size={18} /></span></article></Link>)}</div></div></section>;
}

function Newsletter() {
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return <section className="newsletter"><div className="page-width newsletter-inner"><div><Mail /><span className="eyebrow">PRIVATE NOTES</span><h2>{t('newsletterTitle')}</h2><p>{t('newsletterText')}</p></div><form onSubmit={(event) => { event.preventDefault(); if (email) setDone(true); }}><label><span className="sr-only">{t('email')}</span><input required name="email" autoComplete="email" spellCheck="false" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={`${t('email')}…`} /></label><button className="button button-primary" type="submit">{done ? <><Check size={18} />{t('subscribed')}</> : <>{t('subscribe')}<Send size={17} /></>}</button></form></div></section>;
}

function Footer() {
  const { t, branding } = useTheme();
  return <footer className="site-footer"><div className="page-width footer-grid"><div className="footer-brand"><span className="brand-mark">A</span><h2>{branding.name}</h2><p>{branding.subName}</p></div><div><span className="footer-label">{t('footerVisit')}</span><p><MapPin size={16} />{t('footerAddress')}</p><p><Clock3 size={16} />{t('footerHours')}</p><p><Phone size={16} />{t('footerContact')}</p></div><div><span className="footer-label">ARSHIDA</span><a href="#menu">{t('navMenu')}</a><a href="#journal">{t('navStories')}</a><a href="#events">{t('navEvents')}</a></div><div className="footer-social"><span className="footer-label">SOCIAL</span><a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={17} />Instagram</a><a href="mailto:hello@arshida.berlin"><Mail size={17} />hello@arshida.berlin</a></div></div><div className="page-width footer-bottom"><span>© 2026 {branding.name}</span><span>{t('legal')}</span><Link to="/restaurant">{t('restaurantLogin')}</Link></div></footer>;
}

function DishDialog() {
  const { selectedDish, setSelectedDish, addToCart } = useApp();
  const { t, lang } = useTheme();
  const [quantity, setQuantity] = useState(1);
  useEffect(() => setQuantity(1), [selectedDish]);
  if (!selectedDish) return null;
  const dish = selectedDish;
  return <Modal open onClose={() => setSelectedDish(null)} title={localize(dish.name, lang)} size="large" className="dish-dialog"><div className="dish-dialog-grid"><div className="dialog-image"><img src={dish.image} width="1000" height="800" alt={localize(dish.name, lang)} /><span>{formatPrice(dish.price, lang)}</span></div><div className="dialog-content"><span className="eyebrow">{t('dishAbout')}</span><h2>{localize(dish.name, lang)}</h2><p>{localize(dish.description, lang)}</p><div className="detail-stats"><span><Star />{dish.rating}</span><span><Clock3 />{dish.time} {t('minutes')}</span><span><ChefHat />{t('chefChoice')}</span></div><span className="field-label">{t('dietary')}</span><div className="tag-list">{dish.tags.map((tag) => <span key={tag}>{t(tag)}</span>)}</div><div className="dialog-purchase"><div className="quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease"><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase"><Plus /></button></div><button className="button button-primary" onClick={() => { addToCart(dish, {}, quantity); setSelectedDish(null); }}>{t('addToOrder')} · {formatPrice(dish.price * quantity, lang)}</button></div></div></div></Modal>;
}

function LegacyCartDialog() {
  const { t, lang } = useTheme();
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, appliedPromo, applyPromoCode, promoError, clearCart } = useApp();
  const [code, setCode] = useState('');
  const [ordered, setOrdered] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discountPercent / 100 : 0;
  return <Modal open={isCartOpen} onClose={() => setIsCartOpen(false)} title={t('cart')} size="drawer" className="cart-dialog"><div className="dialog-header"><span className="eyebrow">ARSHIDA · ORDER</span><h2>{t('cart')}</h2></div>{ordered ? <div className="success-state"><CheckCircle2 /><h3>{t('orderConfirmed')}</h3><button className="button button-primary" onClick={() => { clearCart(); setOrdered(false); setIsCartOpen(false); }}>{t('done')}</button></div> : cart.length === 0 ? <div className="empty-state tall"><ShoppingBag /><p>{t('emptyCart')}</p><a href="#menu" className="button button-primary" onClick={() => setIsCartOpen(false)}>{t('exploreMenu')}</a></div> : <><div className="cart-items">{cart.map((item, index) => <article key={`${item.dish.id}-${index}`}><img src={item.dish.image} width="80" height="84" alt="" /><div><h3>{localize(item.dish.name, lang)}</h3><span>{formatPrice(item.dish.price, lang)}</span><div className="mini-quantity"><button onClick={() => updateCartQuantity(index, -1)} aria-label="Decrease"><Minus /></button><b>{item.quantity}</b><button onClick={() => updateCartQuantity(index, 1)} aria-label="Increase"><Plus /></button></div></div><button className="delete-button" onClick={() => removeFromCart(index)} aria-label="Remove"><Trash2 /></button></article>)}</div><div className="promo-row"><label><span className="sr-only">{t('promo')}</span><input name="promotion-code" autoComplete="off" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} placeholder={`${t('promo')} · ARSHIDA20…`} /></label><button className="button button-quiet" onClick={() => applyPromoCode(code)}>{t('apply')}</button></div>{promoError && <p className="field-error" role="alert"><CircleAlert />{t('invalidPromo')}</p>}<div className="totals"><p><span>{t('subtotal')}</span><b>{formatPrice(subtotal, lang)}</b></p>{discount > 0 && <p><span>{t('discount')}</span><b>−{formatPrice(discount, lang)}</b></p>}<p className="grand-total"><span>{t('total')}</span><b>{formatPrice(subtotal - discount, lang)}</b></p></div><button className="button button-primary button-block" onClick={() => setOrdered(true)}>{t('checkout')}<IconArrow /></button></>}</Modal>;
}

function CartDialog() {
  const { t, lang } = useTheme();
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, appliedPromo, applyPromoCode, promoError, createOrder } = useApp();
  const [code, setCode] = useState('');
  const [ordered, setOrdered] = useState(null);
  const [orderType, setOrderType] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'dinein' ? 'dinein' : 'pickup');
  const [address, setAddress] = useState('Torstraße 82, Berlin');
  const [table, setTable] = useState(new URLSearchParams(window.location.search).get('table') || 'T4');
  const [customer, setCustomer] = useState({ name: 'Leonie Weber', phone: '+49 30 884 21 90' });
  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discountPercent / 100 : 0;
  const deliveryFee = orderType === 'delivery' ? 4.5 : 0;
  const close = () => { setIsCartOpen(false); setTimeout(() => setOrdered(null), 250); };
  const checkout = () => {
    if (!customer.name || !customer.phone || (orderType === 'delivery' && !address)) return;
    setOrdered(createOrder({ type: orderType, table: orderType === 'dinein' ? table : '', customer: { ...customer, address: orderType === 'delivery' ? address : '' }, payment: 'authorized' }));
  };
  return <Modal open={isCartOpen} onClose={close} title={t('cart')} size="drawer" className="cart-dialog"><div className="dialog-header"><span className="eyebrow">ARSHIDA · ORDER</span><h2>{t('cart')}</h2></div>{ordered ? <div className="success-state"><CheckCircle2 /><h3>{t('orderConfirmed')}</h3><strong>{ordered.id}</strong><p>{localize(orderStatusCopy.submitted, lang)}</p><button className="button button-primary" onClick={() => { close(); navigate(`/order/${ordered.id}`); }}>{localize(pageCopy.liveOrder, lang)}<IconArrow /></button><button className="button button-quiet" onClick={close}>{t('done')}</button></div> : cart.length === 0 ? <div className="empty-state tall"><ShoppingBag /><p>{t('emptyCart')}</p><a href="/#menu" className="button button-primary" onClick={close}>{t('exploreMenu')}</a></div> : <><div className="order-type-switch"><button className={orderType === 'pickup' ? 'active' : ''} onClick={() => setOrderType('pickup')}>Pickup</button><button className={orderType === 'delivery' ? 'active' : ''} onClick={() => setOrderType('delivery')}>Delivery</button><button className={orderType === 'dinein' ? 'active' : ''} onClick={() => setOrderType('dinein')}>At table</button></div>{orderType === 'delivery' && <label className="cart-field"><span>Delivery address</span><input value={address} onChange={(event) => setAddress(event.target.value)} /></label>}{orderType === 'dinein' && <label className="cart-field"><span>Table</span><select value={table} onChange={(event) => setTable(event.target.value)}>{tables.map((item) => <option key={item.id}>{item.id}</option>)}</select></label>}<div className="cart-items">{cart.map((item, index) => <article key={`${item.dish.id}-${index}`}><img src={item.dish.image} width="80" height="84" alt="" /><div><h3>{localize(item.dish.name, lang)}</h3><span>{formatPrice(item.dish.price, lang)}</span><div className="mini-quantity"><button onClick={() => updateCartQuantity(index, -1)} aria-label="Decrease"><Minus /></button><b>{item.quantity}</b><button onClick={() => updateCartQuantity(index, 1)} aria-label="Increase"><Plus /></button></div></div><button className="delete-button" onClick={() => removeFromCart(index)} aria-label="Remove"><Trash2 /></button></article>)}</div><div className="cart-customer"><label><span>{t('name')}</span><input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label><label><span>{t('phone')}</span><input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label></div><div className="promo-row"><label><span className="sr-only">{t('promo')}</span><input value={code} onChange={(event) => setCode(event.target.value)} placeholder={`${t('promo')} · ARSHIDA20…`} /></label><button className="button button-quiet" onClick={() => applyPromoCode(code)}>{t('apply')}</button></div>{promoError && <p className="field-error" role="alert"><CircleAlert />{t('invalidPromo')}</p>}<div className="totals"><p><span>{t('subtotal')}</span><b>{formatPrice(subtotal, lang)}</b></p>{discount > 0 && <p><span>{t('discount')}</span><b>−{formatPrice(discount, lang)}</b></p>}{deliveryFee > 0 && <p><span>Delivery</span><b>{formatPrice(deliveryFee, lang)}</b></p>}<p className="grand-total"><span>{t('total')}</span><b>{formatPrice(subtotal - discount + deliveryFee, lang)}</b></p></div><button className="button button-primary button-block" onClick={checkout}>{t('checkout')}<IconArrow /></button></>}</Modal>;
}

function ReservationDialog() {
  const { t } = useTheme();
  const { isReservationOpen, setIsReservationOpen, reservationIntent, setReservationIntent, selectedTableForBooking, setSelectedTableForBooking, open360View, addReservation } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ date: '', time: '19:30', party: 2, guestName: '', guestPhone: '', notes: '' });
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  useEffect(() => {
    if (!isReservationOpen || !reservationIntent) return;
    setForm((current) => ({ ...current, notes: reservationIntent }));
    setReservationIntent('');
  }, [isReservationOpen, reservationIntent, setReservationIntent]);
  const close = () => { setIsReservationOpen(false); setTimeout(() => { setStep(1); setError(''); setReference(''); setSelectedTableForBooking(null); }, 250); };
  const next = () => {
    if (step === 1 && !form.date) { setError(t('required')); return; }
    if (step === 2 && !selectedTableForBooking) { setError(t('selectTable')); return; }
    setError(''); setStep((value) => Math.min(3, value + 1));
  };
  const submit = () => {
    if (!form.guestName || !form.guestPhone) { setError(t('required')); return; }
    const booking = addReservation({ ...form, table: selectedTableForBooking.id, deposit: 50 });
    setReference(booking.id);
  };
  return <Modal open={isReservationOpen} onClose={close} title={t('reservation')} size="large" className="reservation-dialog"><div className="dialog-header"><span className="eyebrow">ARSHIDA · BERLIN</span><h2>{reference ? t('confirmed') : t('reservation')}</h2></div>{reference ? <div className="success-state reservation-success"><CheckCircle2 /><p>{t('reference')}</p><strong>{reference}</strong><button className="button button-primary" onClick={close}>{t('done')}</button></div> : <><div className="steps"><span className={step >= 1 ? 'active' : ''}><i>1</i>{t('stepDate')}</span><span className={step >= 2 ? 'active' : ''}><i>2</i>{t('stepTable')}</span><span className={step >= 3 ? 'active' : ''}><i>3</i>{t('stepDetails')}</span></div>{step === 1 && <div className="form-grid reservation-form"><label><span>{t('date')}</span><input name="reservation-date" autoComplete="off" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label><span>{t('time')}</span><select name="reservation-time" autoComplete="off" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })}><option>17:30</option><option>19:30</option><option>21:30</option></select></label><label className="full"><span>{t('party')}</span><div className="party-picker">{[2,3,4,5,6,8].map((number) => <button type="button" className={form.party === number ? 'active' : ''} key={number} onClick={() => setForm({ ...form, party: number })}>{number}</button>)}</div></label></div>}{step === 2 && <div className="table-map"><div className="room-label">ARSHIDA · MAIN SALON</div><div className="window-line">PANORAMIC WINDOW</div>{tables.map((table) => <button key={table.id} disabled={table.status === 'reserved'} className={`table-node ${table.status} ${selectedTableForBooking?.id === table.id ? 'selected' : ''} ${table.vip ? 'vip' : ''}`} style={{ left: `${table.x}%`, top: `${table.y}%` }} onClick={() => setSelectedTableForBooking(table)}><span>{table.id}</span><small>{table.seats}</small></button>)}<div className="map-legend"><span><i className="free" />{t('available')}</span><span><i className="busy" />{t('reserved')}</span></div>{selectedTableForBooking && <button className="view-table-button" onClick={() => open360View(selectedTableForBooking)}><Eye />{t('view360')} · {selectedTableForBooking.id}</button>}</div>}{step === 3 && <div className="form-grid reservation-form"><label><span>{t('name')}</span><input name="guest-name" autoComplete="name" value={form.guestName} onChange={(event) => setForm({ ...form, guestName: event.target.value })} /></label><label><span>{t('phone')}</span><input name="guest-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.guestPhone} onChange={(event) => setForm({ ...form, guestPhone: event.target.value })} /></label><label className="full"><span>{t('notes')}</span><textarea name="guest-notes" autoComplete="off" rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label></div>}{error && <p className="field-error" role="alert"><CircleAlert />{error}</p>}<div className="dialog-footer">{step > 1 && <button className="button button-quiet" onClick={() => { setError(''); setStep((value) => value - 1); }}>{t('back')}</button>}<button className="button button-primary" onClick={step === 3 ? submit : next}>{step === 3 ? t('confirm') : t('continue')}<IconArrow /></button></div></>}</Modal>;
}

function LegacyPanoramaDialog() {
  const { t } = useTheme();
  const { selectedTableFor360, close360View, setSelectedTableForBooking, setIsReservationOpen } = useApp();
  const [position, setPosition] = useState(50);
  return <Modal open={Boolean(selectedTableFor360)} onClose={close360View} title={t('view360')} size="wide" className="panorama-dialog"><div className="panorama" style={{ backgroundPosition: `${position}% center` }}><div className="panorama-top"><span>{selectedTableFor360?.id} · {selectedTableFor360?.seats} {t('seats')}</span><span>360°</span></div><div className="panorama-reticle"><i /><span>{position > 62 ? 'BAR' : position < 38 ? 'WINDOW' : 'SALON'}</span></div><label className="panorama-control"><span>{t('previous')}</span><input aria-label="View angle" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(event.target.value)} /><span>{t('next')}</span></label></div><div className="panorama-footer"><div><span className="eyebrow">IMMERSIVE TABLE VIEW</span><h3>{t('view360')} · {selectedTableFor360?.id}</h3></div><button className="button button-primary" onClick={() => { setSelectedTableForBooking(selectedTableFor360); close360View(); setIsReservationOpen(true); }}>{t('book')}<IconArrow /></button></div></Modal>;
}

function PanoramaDialog() {
  const { t } = useTheme();
  const { selectedTableFor360, close360View, setSelectedTableForBooking, setIsReservationOpen } = useApp();
  if (!selectedTableFor360) return null;
  const reserve = () => { setSelectedTableForBooking(selectedTableFor360); close360View(); setIsReservationOpen(true); };
  return <Modal open onClose={close360View} title={t('view360')} size="wide" className="panorama-dialog"><Suspense fallback={<div className="panorama-loading">Preparing your seat view…</div>}><PanoramaViewer table={selectedTableFor360} onReserve={reserve} /></Suspense></Modal>;
}

function LegacyProfileDialog() {
  const { t } = useTheme();
  const { isProfileOpen, setIsProfileOpen, user, bookings, activeOrder } = useApp();
  return <Modal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} title={t('profile')} size="medium"><div className="dialog-header"><span className="eyebrow">ARSHIDA CIRCLE</span><h2>{t('profile')}</h2></div><div className="profile-card"><img src={user.avatar} width="240" height="240" alt="" /><div><h3>{user.name}</h3><p>{user.tier}</p></div><strong>{user.points}<small>{t('points')}</small></strong></div><div className="order-status"><div><span className="field-label">{t('orderStatus')}</span><h3>#{activeOrder.id}</h3></div><span className="status-pill"><i />{t('inKitchen')}</span></div><div className="booking-list"><span className="field-label">{t('bookings')}</span>{bookings.length ? bookings.map((booking) => <article key={booking.id}><CalendarDays /><div><b>{booking.date} · {booking.time}</b><span>{booking.table} · {booking.party} {t('seats')}</span></div><strong>{booking.id}</strong></article>) : <p className="muted-text">{t('noBookings')}</p>}</div></Modal>;
}

function ProfileDialog() {
  const { t, lang } = useTheme();
  const navigate = useNavigate();
  const { isProfileOpen, setIsProfileOpen, user, bookings, activeOrder, orders, redeemReward } = useApp();
  const [message, setMessage] = useState('');
  const close = () => setIsProfileOpen(false);
  return <Modal open={isProfileOpen} onClose={close} title={t('profile')} size="large" className="profile-dialog"><div className="dialog-header"><span className="eyebrow">ARSHIDA CIRCLE</span><h2>{t('profile')}</h2></div><div className="profile-card"><img src={user.avatar} width="240" height="240" alt="" /><div><h3>{user.name}</h3><p>{user.tier}</p></div><strong>{user.points}<small>{t('points')}</small></strong></div>{activeOrder && <button className="profile-live-order" onClick={() => { close(); navigate(`/order/${activeOrder.id}`); }}><span><i />{localize(pageCopy.liveOrder, lang)}</span><strong>#{activeOrder.id}</strong><small>{localize(orderStatusCopy[activeOrder.status], lang)}</small><IconArrow /></button>}<div className="profile-sections"><section><span className="field-label">{t('bookings')}</span>{bookings.length ? bookings.map((booking) => <article className="profile-row" key={booking.id}><CalendarDays /><div><b>{booking.date} · {booking.time}</b><span>{booking.table} · {booking.party} {t('seats')}</span></div><strong>{booking.id}</strong></article>) : <p className="muted-text">{t('noBookings')}</p>}</section><section><span className="field-label">REWARDS</span>{rewards.map((reward) => <article className="reward-row" key={reward.id}><div><b>{localize(reward.title, lang)}</b><span>{reward.points} {t('points')}</span></div><button disabled={user.points < reward.points} onClick={() => { const ok = redeemReward(reward.points, reward.id); setMessage(ok ? 'Reward added to your visit.' : 'Not enough points.'); }}>{user.points >= reward.points ? 'Redeem' : 'Locked'}</button></article>)}{message && <p className="profile-message" role="status">{message}</p>}</section><section><span className="field-label">ORDER HISTORY</span>{orders.map((order) => <button className="profile-order-row" key={order.id} onClick={() => { close(); navigate(`/order/${order.id}`); }}><span>{order.id}</span><b>{localize(orderStatusCopy[order.status], lang)}</b><small>€{Number(order.total).toFixed(2)}</small></button>)}</section></div></Modal>;
}

function AdminDialog() {
  const { t, branding, updateBranding } = useTheme();
  const { isAdminOpen, setIsAdminOpen, guests } = useApp();
  const [tab, setTab] = useState('crm');
  const [draft, setDraft] = useState(branding);
  const [saved, setSaved] = useState(false);
  return <Modal open={isAdminOpen} onClose={() => setIsAdminOpen(false)} title={t('adminTitle')} size="wide" className="admin-dialog"><div className="admin-top"><div><span className="eyebrow">PRIVATE OPERATIONS</span><h2>{t('adminTitle')}</h2><p>{t('adminSubtitle')}</p></div><span className="admin-notice"><CircleAlert />{t('adminNotice')}</span></div><div className="admin-tabs"><button className={tab === 'crm' ? 'active' : ''} onClick={() => setTab('crm')}><Users />{t('crm')}</button><button className={tab === 'branding' ? 'active' : ''} onClick={() => setTab('branding')}><Palette />{t('branding')}</button><button className={tab === 'campaigns' ? 'active' : ''} onClick={() => setTab('campaigns')}><Send />{t('campaigns')}</button></div>{tab === 'crm' && <div className="crm-table"><div className="crm-head"><span>{t('guest')}</span><span>{t('visits')}</span><span>{t('spend')}</span><span>{t('note')}</span></div>{guests.map((guest) => <div className="crm-row" key={guest.id}><span><i>{guest.name.charAt(0)}</i><b>{guest.name}</b><small>{guest.tier}</small></span><strong>{guest.visits}</strong><strong>{guest.total}</strong><p>{guest.note}</p></div>)}</div>}{tab === 'branding' && <div className="branding-form form-grid"><label><span>{t('brandName')}</span><input name="restaurant-name" autoComplete="off" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label><span>{t('brandLine')}</span><input name="restaurant-descriptor" autoComplete="off" value={draft.subName} onChange={(event) => setDraft({ ...draft, subName: event.target.value })} /></label><button className="button button-primary" onClick={() => { updateBranding(draft); setSaved(true); setTimeout(() => setSaved(false), 2500); }}>{saved ? <><Check />{t('saved')}</> : t('save')}</button></div>}{tab === 'campaigns' && <div className="campaign-card"><div><span className="eyebrow">ACTIVE CAMPAIGN</span><h3>ARSHIDA20</h3><p>20% · Seasonal tasting menu</p></div><span className="status-pill"><i />LIVE</span></div>}</Modal>;
}

void LegacyCartDialog;
void LegacyPanoramaDialog;
void LegacyProfileDialog;

function BuffetCampaignModal({ open, onClose }) {
  const { lang } = useTheme();
  const { setIsReservationOpen, setReservationIntent } = useApp();
  const reserve = () => { setReservationIntent(`${localize(lunchBuffet.title, lang)} · ${localize(lunchBuffet.days, lang)} · ${lunchBuffet.time}`); onClose(); setIsReservationOpen(true); };
  const viewMenu = () => { onClose(); window.setTimeout(() => document.getElementById('buffet-menu-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 220); };
  return <Modal open={open} onClose={onClose} title={localize(lunchBuffet.popupTitle, lang)} size="large" className="buffet-campaign-modal" shellClassName="buffet-campaign-shell"><div className="buffet-modal-art"><img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1400&q=88" width="1400" height="1000" alt="Arshida lunch buffet" /><span><b>11:30</b><i />15:30</span></div><div className="buffet-modal-copy"><span className="eyebrow">{localize(lunchBuffet.eyebrow, lang)}</span><h2>{localize(lunchBuffet.popupTitle, lang)}</h2><p>{localize(lunchBuffet.description, lang)}</p><div className="buffet-modal-schedule"><CalendarDays /><span>{localize(lunchBuffet.days, lang)}</span><strong>{lunchBuffet.time}</strong></div><div className="buffet-modal-prices"><p><span>{localize(lunchBuffet.adultLabel, lang)}</span><strong>{formatPrice(lunchBuffet.adultPrice, lang)}</strong></p><p><span>{localize(lunchBuffet.childLabel, lang)}</span><strong>{formatPrice(lunchBuffet.childPrice, lang)}</strong></p></div><div className="buffet-modal-actions"><button className="button button-primary" onClick={reserve}>{localize(lunchBuffet.reserve, lang)}<IconArrow /></button><button className="button button-quiet" onClick={viewMenu}>{localize(lunchBuffet.viewMenu, lang)}</button></div></div></Modal>;
}

function MainContent() {
  const { layoutMode } = useTheme();
  const location = useLocation();
  const [introComplete, setIntroComplete] = useState(false);
  const [buffetCampaignOpen, setBuffetCampaignOpen] = useState(false);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
  const closeBuffetCampaign = useCallback(() => setBuffetCampaignOpen(false), []);
  useEffect(() => {
    if (!introComplete || location.pathname !== '/' || sessionStorage.getItem('arshida-buffet-seen')) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('arshida-buffet-seen', '1');
      setBuffetCampaignOpen(true);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [introComplete, location.pathname]);
  const home = <><Navbar /><main id="main">{layoutMode === 'cinematic' ? <CinematicHero /> : <EditorialHero />}<MenuSection /><BuffetSection /><StorySection /><ExperienceSection /><EventsSection /><Newsletter /></main><Footer /></>;
  return <div className="app-shell"><CinematicLoader onComplete={finishIntro} /><Suspense fallback={<div className="route-loading"><span>A</span><p>Composing your experience…</p></div>}><Routes><Route path="/" element={home} /><Route path="/menu/:slug" element={<><Navbar /><DishPage /><Footer /></>} /><Route path="/events/:slug" element={<><Navbar /><EventPage /><Footer /></>} /><Route path="/order/:orderId" element={<><Navbar /><LiveOrderPage /><Footer /></>} /><Route path="/restaurant" element={<RestaurantWorkspace />} /><Route path="*" element={home} /></Routes></Suspense><BuffetCampaignModal open={buffetCampaignOpen} onClose={closeBuffetCampaign} /><DishDialog /><CartDialog /><ReservationDialog /><PanoramaDialog /><ProfileDialog /><AdminDialog /><div className="sr-only" aria-live="polite" /></div>;
}

export default function App() {
  return <ThemeProvider><AppProvider><MainContent /></AppProvider></ThemeProvider>;
}
