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
  if (!dish) return <main className="route-page route-not-found"><h1>Dish not found</h1><button className="button button-primary" onClick={() => navigate('/menu')}>Menu</button></main>;

  const price = new Intl.NumberFormat(locales[lang], { style: 'currency', currency: 'EUR' }).format(dish.price * quantity);
  const unitPrice = new Intl.NumberFormat(locales[lang], { style: 'currency', currency: 'EUR' }).format(dish.price);
  const favorite = favoriteDishIds.includes(dish.id);
  const directionIcon = isRtl ? <ArrowRight /> : <ArrowLeft />;
  const share = async () => {
    const payload = { title: localize(dish.name, lang), url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard?.writeText(window.location.href);
  };
  const add = () => {
    addToCart(dish, { notes }, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const orderCard = <div className="dish-order-card">
    <span className="eyebrow">{localize(pageCopy.orderPanel, lang)}</span>
    <div className="dish-order-title"><div><h2>{localize(dish.name, lang)}</h2><small>{unitPrice}</small></div><strong>{price}</strong></div>
    <label className="dish-notes"><span>{localize(pageCopy.customize, lang)}</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="3" placeholder={localize(pageCopy.customize, lang)} /></label>
    <div className="dish-order-quantity"><span>{localize(pageCopy.orderPanel, lang)}</span><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease">−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase">+</button></div></div>
    <button className={`button button-primary button-block dish-order-primary ${added ? 'success' : ''}`} onClick={add}>{added ? <><Check />{localize(pageCopy.orderAdded, lang)}</> : <><ShoppingBag />{localize(pageCopy.add, lang)} · {price}</>}</button>
    <div className="dish-order-secondary"><button className={`button button-quiet ${favorite ? 'active' : ''}`} onClick={() => toggleFavoriteDish(dish.id)}><Heart fill={favorite ? 'currentColor' : 'none'} />{localize(pageCopy.favorite, lang)}</button><button className="button button-quiet" onClick={share}><Share2 />{localize(pageCopy.share, lang)}</button></div>
    <button className="dish-cart-shortcut" onClick={() => setIsCartOpen(true)}>{localize(pageCopy.cartShortcut, lang)}<span>{isRtl ? <ArrowLeft /> : <ArrowRight />}</span></button>
  </div>;

  return <main className="route-page dish-page dish-page-v2" id="main">
    <section className="dish-image-hero">
      <img src={dish.image} width="1800" height="1200" alt={localize(dish.name, lang)} />
      <div className="dish-image-scrim" />
      <button className="route-back" onClick={() => navigate(-1)}>{directionIcon}{localize(pageCopy.back, lang)}</button>
      <div className="dish-image-copy page-width"><span className="eyebrow"><Sparkles />ARSHIDA SIGNATURE</span><h1>{localize(dish.name, lang)}</h1><p>{localize(dish.description, lang)}</p><div><span><Star />{dish.rating}</span><span><Clock3 />{dish.time} min</span></div></div>
    </section>

    <div className="dish-detail-shell page-width">
      <article className="dish-detail-main">
        <section className="dish-narrative dish-narrative-v2">
          <div className="dish-story-index"><span>01</span><i /></div>
          <div><span className="eyebrow">{localize(pageCopy.chefStory, lang)}</span><h2>{localize(dish.story, lang)}</h2></div>
          <aside><span className="field-label">{localize(pageCopy.provenance, lang)}</span><p>{localize(dish.origin, lang)}</p></aside>
        </section>

        <section className="dish-gallery dish-gallery-v2" aria-label={localize(pageCopy.gallery, lang)}>
          <div className="gallery-heading"><div><span className="eyebrow">02 · {localize(pageCopy.gallery, lang)}</span><h2>{String(galleryIndex + 1).padStart(2, '0')} / {String(dish.gallery.length).padStart(2, '0')}</h2></div><div><button onClick={() => setGalleryIndex((galleryIndex - 1 + dish.gallery.length) % dish.gallery.length)} aria-label="Previous"><ChevronLeft /></button><button onClick={() => setGalleryIndex((galleryIndex + 1) % dish.gallery.length)} aria-label="Next"><ChevronRight /></button></div></div>
          <img src={dish.gallery[galleryIndex]} alt={`${localize(dish.name, lang)} ${galleryIndex + 1}`} />
          <div className="gallery-thumbs">{dish.gallery.map((image, index) => <button className={index === galleryIndex ? 'active' : ''} key={image} onClick={() => setGalleryIndex(index)} aria-label={`${localize(pageCopy.gallery, lang)} ${index + 1}`}><img src={image} alt="" /></button>)}</div>
        </section>

        <section className="dish-facts dish-facts-v2">
          <article><span className="eyebrow">03 · {localize(pageCopy.nutrition, lang)}</span><div className="fact-grid"><p><strong>{dish.nutrition.calories}</strong><span>{localize(pageCopy.calories, lang)}</span></p><p><strong>{dish.nutrition.protein}g</strong><span>{localize(pageCopy.protein, lang)}</span></p><p><strong>{dish.nutrition.carbs}g</strong><span>{localize(pageCopy.carbs, lang)}</span></p></div></article>
          <article><span className="eyebrow">{localize(pageCopy.allergens, lang)}</span><div className="tag-list">{dish.allergens.map((item) => <span key={item}>{item}</span>)}</div><span className="eyebrow pairing-label">{localize(pageCopy.pairing, lang)}</span><p>{localize(dish.pairings, lang)}</p></article>
        </section>

        <section className="dish-film-section">
          <div className="dish-film-heading"><span className="eyebrow">04 · {localize(pageCopy.film, lang)}</span><h2>{localize(pageCopy.filmIntro, lang)}</h2></div>
          <div className="dish-film-frame">{!videoFailed ? <video controls muted playsInline poster={dish.image} onError={() => setVideoFailed(true)}><source src={dish.video} type="video/mp4" /></video> : <img src={dish.image} alt={localize(dish.name, lang)} />}<span><Play />ARSHIDA FILM</span></div>
        </section>
      </article>

      <aside className="dish-order-rail">{orderCard}</aside>
    </div>

    <div className="dish-mobile-order"><div><span>{localize(dish.name, lang)}</span><strong>{price}</strong></div><button className={`button button-primary ${added ? 'success' : ''}`} onClick={add}>{added ? <Check /> : <ShoppingBag />}{added ? localize(pageCopy.orderAdded, lang) : localize(pageCopy.add, lang)}</button></div>
  </main>;
}
