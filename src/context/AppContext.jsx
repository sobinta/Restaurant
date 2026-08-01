import React, { createContext, useContext, useState } from 'react';
import { DISHES, TABLES, GUESTS_CRM, CAMPAIGNS, REWARDS } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Cart State
  const [cart, setCart] = useState([]);

  // Modals & Active Selections
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  
  // 360 Table View Modal
  const [selectedTableFor360, setSelectedTableFor360] = useState(null);
  const [selectedTableForBooking, setSelectedTableForBooking] = useState(null);
  
  // Campaigns & Discounts
  const [activeCampaign, setActiveCampaign] = useState(CAMPAIGNS[0]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // CRM State
  const [guests, setGuests] = useState(GUESTS_CRM);

  // User Profile & Order Tracker
  const [user, setUser] = useState({
    name: "آقای امیرحسین رضایی",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    points: 650,
    tier: "VIP Gold",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    savedTables: ["T-01", "T-04"],
    bookings: [
      {
        id: "RES-9821",
        date: "۱۴۰۳/۰۶/۱۰",
        time: "۲۰:۳۰",
        table: "میز VIP شماره ۴ - لوکس آکواریوم",
        guests: 4,
        status: "تأیید شده",
        deposit: "۶۰۰,۰۰۰ تومان"
      }
    ]
  });

  const [activeOrder, setActiveOrder] = useState({
    id: "ORD-7749",
    type: "بیرون‌بر", // بیرون‌بر, ارسال با پیک, سفارش روی میز
    status: "in_kitchen", // pending, in_kitchen, on_way, delivered
    items: [
      { name: "استیک فیله مینیون", qty: 1, price: 980000 },
      { name: "سالاد سزار اختصاصی", qty: 1, price: 390000 }
    ],
    total: 1370000,
    time: "۲۰-۲۵ دقیقه ماندگار"
  });

  // Cart Functions
  const addToCart = (dish, options = {}, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.dish.id === dish.id && JSON.stringify(item.options) === JSON.stringify(options));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { dish, options, quantity }];
    });
    // Trigger celebratory confetti effect
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch(e) {}
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const applyPromoCode = (code) => {
    setPromoError('');
    if (!code) return;
    const found = CAMPAIGNS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedPromo(found);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch(e) {}
    } else {
      setPromoError('کد تخفیف وارد شده معتبر نیست');
    }
  };

  // Open 360 View Modal for a Table
  const open360View = (table) => {
    setSelectedTableFor360(table);
  };

  const close360View = () => {
    setSelectedTableFor360(null);
  };

  // Confirm Reservation
  const addReservation = (bookingData) => {
    const newBooking = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData,
      status: "تأیید شده"
    };
    setUser(prev => ({
      ...prev,
      points: prev.points + 150, // Reward 150 points for online booking
      bookings: [newBooking, ...prev.bookings]
    }));
    // Add guest to CRM if not exists
    const newCrmEntry = {
      id: `CRM-${Math.floor(100 + Math.random() * 900)}`,
      name: bookingData.guestName,
      phone: bookingData.guestPhone,
      tier: "Silver Regular",
      visits: 1,
      totalSpent: `${bookingData.deposit} تومان (بیعانه)`,
      favTable: bookingData.tableName,
      allergies: bookingData.notes || "ثبت نشده",
      notes: "رزرو آنلاین اولیه با ویوی ۳۶۰ درجه",
      lastVisit: new Date().toLocaleDateString('fa-IR'),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };
    setGuests(prev => [newCrmEntry, ...prev]);

    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch(e) {}
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      
      isReservationOpen,
      setIsReservationOpen,
      isCartOpen,
      setIsCartOpen,
      isCrmOpen,
      setIsCrmOpen,
      isProfileOpen,
      setIsProfileOpen,
      isWhiteLabelOpen,
      setIsWhiteLabelOpen,
      
      selectedDish,
      setSelectedDish,
      
      selectedTableFor360,
      open360View,
      close360View,
      
      selectedTableForBooking,
      setSelectedTableForBooking,
      
      activeCampaign,
      setActiveCampaign,
      appliedPromo,
      applyPromoCode,
      promoError,
      
      guests,
      user,
      addReservation,
      activeOrder,
      setActiveOrder
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
