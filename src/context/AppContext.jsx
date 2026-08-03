/* eslint-disable react/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AppContext = createContext(null);
const STORAGE_KEY = 'arshida-platform-v2';
const CHANNEL_KEY = 'arshida-live-platform';

export const ORDER_STATUSES = ['submitted', 'confirmed', 'preparing', 'cooking', 'quality_check', 'ready', 'courier_handoff', 'completed'];

const now = () => new Date().toISOString();
const seedOrder = {
  id: 'ORD-2048', type: 'delivery', status: 'cooking', total: 84, estimate: '20–25 min', createdAt: now(),
  customer: { name: 'Leonie Weber', phone: '+49 30 884 21 90', address: 'Torstraße 82, Berlin' },
  items: [{ name: 'Duck · Saffron · Barberry', quantity: 1, price: 38 }, { name: 'Wild Mushroom Risotto · Truffle', quantity: 1, price: 29 }],
  history: [
    { status: 'submitted', at: now() },
    { status: 'confirmed', at: now() },
    { status: 'preparing', at: now() },
    { status: 'cooking', at: now() },
  ],
};

const seedState = {
  orders: [seedOrder], bookings: [], eventBookings: [], favoriteDishIds: [], favoriteEventIds: [], loyaltyPoints: 650,
  feedback: [], waitlist: [], activity: [],
};

const GUESTS = [
  { id: 'CRM-101', name: 'Anna Keller', tier: 'Gold', visits: 14, total: '€2,840', note: 'Prefers quiet window tables' },
  { id: 'CRM-102', name: 'Omar Haddad', tier: 'Platinum', visits: 22, total: '€4,960', note: 'Gluten-free menu' },
  { id: 'CRM-103', name: 'Sara Rahimi', tier: 'Silver', visits: 7, total: '€1,290', note: 'Anniversary in October' },
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.version === 2 ? { ...seedState, ...saved.data } : seedState;
  } catch { return seedState; }
}

function mirrorToIndexedDb(data) {
  if (!('indexedDB' in window)) return;
  const request = indexedDB.open('arshida-platform', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('state');
  request.onsuccess = () => {
    const tx = request.result.transaction('state', 'readwrite');
    tx.objectStore('state').put({ version: 2, data }, 'snapshot');
    tx.oncomplete = () => request.result.close();
  };
}

export function AppProvider({ children }) {
  const [platform, setPlatform] = useState(loadState);
  const [cart, setCart] = useState([]);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationIntent, setReservationIntent] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedTableFor360, setSelectedTableFor360] = useState(null);
  const [selectedTableForBooking, setSelectedTableForBooking] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const channelRef = useRef(null);

  const publish = useCallback((updater, action = 'update') => {
    setPlatform((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      const withActivity = { ...next, activity: [{ id: crypto.randomUUID(), action, at: now() }, ...(next.activity || [])].slice(0, 80) };
      channelRef.current?.postMessage({ type: 'state', data: withActivity });
      return withActivity;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, data: platform }));
    mirrorToIndexedDb(platform);
  }, [platform]);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return undefined;
    const channel = new BroadcastChannel(CHANNEL_KEY);
    channelRef.current = channel;
    channel.onmessage = (event) => event.data?.type === 'state' && setPlatform(event.data.data);
    return () => { channel.close(); channelRef.current = null; };
  }, []);

  const addToCart = useCallback((dish, options = {}, quantity = 1) => {
    setCart((current) => {
      const index = current.findIndex((item) => item.dish.id === dish.id && JSON.stringify(item.options) === JSON.stringify(options));
      if (index < 0) return [...current, { dish, options, quantity }];
      return current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: item.quantity + quantity } : item);
    });
  }, []);

  const updateCartQuantity = useCallback((index, delta) => setCart((current) => current
    .map((item, itemIndex) => itemIndex === index ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0)), []);

  const applyPromoCode = useCallback((code) => {
    if (code.trim().toUpperCase() === 'ARSHIDA20') {
      setAppliedPromo({ code: 'ARSHIDA20', discountPercent: 20 }); setPromoError(''); return true;
    }
    setAppliedPromo(null); setPromoError('invalid'); return false;
  }, []);

  const createOrder = useCallback((details) => {
    if (!cart.length) return null;
    const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const discount = appliedPromo ? subtotal * appliedPromo.discountPercent / 100 : 0;
    const deliveryFee = details.type === 'delivery' ? 4.5 : 0;
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`, status: 'submitted', createdAt: now(), estimate: details.type === 'delivery' ? '35–45 min' : '20–25 min',
      ...details, subtotal, discount, deliveryFee, total: Math.max(0, subtotal - discount + deliveryFee),
      items: cart.map((item) => ({ dishId: item.dish.id, name: item.dish.name.en, quantity: item.quantity, price: item.dish.price, options: item.options })),
      history: [{ status: 'submitted', at: now() }],
    };
    publish((current) => ({ ...current, orders: [order, ...current.orders] }), `order:create:${order.id}`);
    setCart([]); setAppliedPromo(null); return order;
  }, [appliedPromo, cart, publish]);

  const updateOrderStatus = useCallback((orderId, status, message = '') => {
    if (!ORDER_STATUSES.includes(status)) return false;
    publish((current) => ({ ...current, orders: current.orders.map((order) => order.id === orderId ? {
      ...order, status, message, history: [...order.history, { status, at: now(), message }],
    } : order) }), `order:status:${orderId}:${status}`);
    return true;
  }, [publish]);

  const addReservation = useCallback((booking) => {
    const record = { id: `AR-${Date.now().toString().slice(-6)}`, ...booking, status: 'confirmed', createdAt: now() };
    publish((current) => ({ ...current, bookings: [record, ...current.bookings] }), `reservation:create:${record.id}`);
    return record;
  }, [publish]);

  const bookEvent = useCallback((booking) => {
    const record = { id: `EV-${Date.now().toString().slice(-6)}`, ...booking, status: 'confirmed', createdAt: now() };
    publish((current) => ({ ...current, eventBookings: [record, ...current.eventBookings] }), `event:book:${record.id}`);
    return record;
  }, [publish]);

  const toggleFavoriteDish = useCallback((id) => publish((current) => ({ ...current, favoriteDishIds: current.favoriteDishIds.includes(id) ? current.favoriteDishIds.filter((item) => item !== id) : [...current.favoriteDishIds, id] }), `dish:favorite:${id}`), [publish]);
  const toggleFavoriteEvent = useCallback((id) => publish((current) => ({ ...current, favoriteEventIds: current.favoriteEventIds.includes(id) ? current.favoriteEventIds.filter((item) => item !== id) : [...current.favoriteEventIds, id] }), `event:favorite:${id}`), [publish]);
  const redeemReward = useCallback((points, title) => {
    if (platform.loyaltyPoints < points) return false;
    publish((current) => ({ ...current, loyaltyPoints: current.loyaltyPoints - points }), `reward:redeem:${title}`); return true;
  }, [platform.loyaltyPoints, publish]);

  const guests = GUESTS;
  const user = useMemo(() => ({ name: 'Leonie Weber', phone: '+49 30 884 21 90', points: platform.loyaltyPoints, tier: 'Gold Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' }), [platform.loyaltyPoints]);
  const activeOrder = platform.orders.find((order) => order.status !== 'completed') || platform.orders[0] || null;

  const value = useMemo(() => ({
    ...platform, cart, addToCart, removeFromCart: (index) => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index)), updateCartQuantity, clearCart: () => setCart([]),
    isReservationOpen, setIsReservationOpen, reservationIntent, setReservationIntent, isCartOpen, setIsCartOpen, isCrmOpen, setIsCrmOpen, isProfileOpen, setIsProfileOpen,
    isWhiteLabelOpen, setIsWhiteLabelOpen, isAdminOpen, setIsAdminOpen, selectedDish, setSelectedDish, selectedTableFor360,
    open360View: setSelectedTableFor360, close360View: () => setSelectedTableFor360(null), selectedTableForBooking, setSelectedTableForBooking,
    activeCampaign: { code: 'ARSHIDA20', discountPercent: 20 }, appliedPromo, applyPromoCode, promoError, guests, user, activeOrder,
    createOrder, updateOrderStatus, addReservation, bookEvent, toggleFavoriteDish, toggleFavoriteEvent, redeemReward,
    resetPlatform: () => publish(seedState, 'platform:reset'),
  }), [platform, cart, addToCart, updateCartQuantity, isReservationOpen, reservationIntent, isCartOpen, isCrmOpen, isProfileOpen, isWhiteLabelOpen, isAdminOpen, selectedDish, selectedTableFor360, selectedTableForBooking, appliedPromo, applyPromoCode, promoError, activeOrder, guests, user, createOrder, updateOrderStatus, addReservation, bookEvent, toggleFavoriteDish, toggleFavoriteEvent, redeemReward, publish]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
