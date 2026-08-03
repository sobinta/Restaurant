import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Clock3, Heart, Play, Share2, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { enrichedDishes, pageCopy } from '../data/platformData';
import { localize } from '../data/siteData';

const locales = { de: 'de-DE', en: 'en-GB', fa: 'fa-IR', ar: 'ar-DE' };

export default function DishPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl } = useTheme();
  const { addToCart, setIsCartOpen, favoriteDishIds, toggleFavoriteDish } = useApp();
  const dish = useMemo(() => enrichedDishes.find((item) => item.slug === slug), [slug]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [videoFailed, setVideoFailed] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [slug]);
  if (!dish) return <main className="route-page route-not-found"><h1>Dish not found</h1><button className="button button-primary" onClick={() => navigate('/')}>Home</button></main>;

  const price = new Intl.NumberFormat(locales[lang], { style: 'currency', currency: 'EUR' }).format(dish.price * quantity);
  const favorite = favoriteDishIds.includes(dish.id);
  const directionIcon = isRtl ? <ArrowRight /> : <ArrowLeft />;
  const share = async () => {
    const payload = { title: localize(dish.name, lang), url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard?.writeText(window.location.href);
  };
  const add = () => {
    addToCart(dish, { notes }, quantity); setAdded(true); setTimeout(() => setAdded(false), 1800);
  };

  return <main className="route-page dish-page" id="main">
    <section className="dish-film-hero">
      {!videoFailed && <video autoPlay muted loop playsInline poster={dish.image} onError={() => setVideoFailed(true)}><source src={dish.video} type="video/mp4" /></video>}
      {videoFailed && <img src={dish.image} alt={localize(dish.name, lang)} />}
      <div className="dish-film-scrim" />
      <button className="route-back" onClick={() => navigate(-1)}>{directionIcon}{localize(pageCopy.back, lang)}</button>
      <div className="dish-film-copy page-width">
        <span className="eyebrow"><Play size={14} />{localize(pageCopy.film, lang)}</span>
        <h1>{localize(dish.name, lang)}</h1>
        <p>{localize(dish.description, lang)}</p>
        <div className="dish-film-meta"><span><Star />{dish.rating}</span><span><Clock3 />{dish.time} min</span><span><Sparkles />ARSHIDA SIGNATURE</span></div>
      </div>
      <div className="film-edge" />
    </section>

    <section className="dish-narrative page-width">
      <div className="dish-story-index"><span>01</span><i /></div>
      <div><span className="eyebrow">{localize(pageCopy.chefStory, lang)}</span><h2>{localize(dish.story, lang)}</h2></div>
      <aside><span className="field-label">{localize(pageCopy.provenance, lang)}</span><p>{localize(dish.origin, lang)}</p></aside>
    </section>

    <section className="dish-gallery page-width" aria-label={localize(pageCopy.gallery, lang)}>
      <div className="gallery-heading"><div><span className="eyebrow">02 · {localize(pageCopy.gallery, lang)}</span><h2>{String(galleryIndex + 1).padStart(2, '0')} / {String(dish.gallery.length).padStart(2, '0')}</h2></div><div><button onClick={() => setGalleryIndex((galleryIndex - 1 + dish.gallery.length) % dish.gallery.length)} aria-label="Previous"><ChevronLeft /></button><button onClick={() => setGalleryIndex((galleryIndex + 1) % dish.gallery.length)} aria-label="Next"><ChevronRight /></button></div></div>
      <img src={dish.gallery[galleryIndex]} alt={`${localize(dish.name, lang)} ${galleryIndex + 1}`} />
      <div className="gallery-thumbs">{dish.gallery.map((image, index) => <button className={index === galleryIndex ? 'active' : ''} key={image} onClick={() => setGalleryIndex(index)}><img src={image} alt="" /></button>)}</div>
    </section>

    <section className="dish-facts page-width">
      <article><span className="eyebrow">03 · {localize(pageCopy.nutrition, lang)}</span><div className="fact-grid"><p><strong>{dish.nutrition.calories}</strong><span>{localize(pageCopy.calories, lang)}</span></p><p><strong>{dish.nutrition.protein}g</strong><span>{localize(pageCopy.protein, lang)}</span></p><p><strong>{dish.nutrition.carbs}g</strong><span>{localize(pageCopy.carbs, lang)}</span></p></div></article>
      <article><span className="eyebrow">{localize(pageCopy.allergens, lang)}</span><div className="tag-list">{dish.allergens.map((item) => <span key={item}>{item}</span>)}</div><span className="eyebrow pairing-label">{localize(pageCopy.pairing, lang)}</span><p>{localize(dish.pairings, lang)}</p></article>
    </section>

    <section className="dish-order-bar">
      <div className="page-width dish-order-inner"><div><strong>{localize(dish.name, lang)}</strong><span>{price}</span></div><label><span className="sr-only">{localize(pageCopy.customize, lang)}</span><input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={localize(pageCopy.customize, lang)} /></label><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}>+</button></div><button className={`button button-primary ${added ? 'success' : ''}`} onClick={add}>{added ? <><Check />Added</> : <><ShoppingBag />{localize(pageCopy.add, lang)}</>}</button><button className={`icon-button ${favorite ? 'active' : ''}`} onClick={() => toggleFavoriteDish(dish.id)} aria-label={localize(pageCopy.favorite, lang)}><Heart fill={favorite ? 'currentColor' : 'none'} /></button><button className="icon-button" onClick={share} aria-label={localize(pageCopy.share, lang)}><Share2 /></button><button className="text-button" onClick={() => setIsCartOpen(true)}>Cart</button></div>
    </section>
  </main>;
}
