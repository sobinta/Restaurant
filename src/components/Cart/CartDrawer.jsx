import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Truck, 
  Store, 
  QrCode,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    appliedPromo,
    applyPromoCode,
    promoError,
    activeOrder,
    setActiveOrder
  } = useApp();

  const [orderType, setOrderType] = useState('takeout'); // takeout, delivery, dinein
  const [promoInput, setPromoInput] = useState('');
  const [address, setAddress] = useState('تهران، خیابان ولیعصر، فرشته، پلاک ۴۲');
  const [tableNo, setTableNo] = useState('میز ۴');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discountPercent / 100)) : 0;
  const deliveryFee = orderType === 'delivery' ? 45000 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    setActiveOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderType === 'delivery' ? 'ارسال با پیک' : orderType === 'dinein' ? `سفارش سر ${tableNo}` : 'بیرون‌بر',
      status: 'in_kitchen',
      items: cart.map(i => ({ name: i.dish.name, qty: i.quantity, price: i.dish.price })),
      total: grandTotal,
      time: '۲۰-۲۵ دقیقه ماندگار'
    });

    setIsOrdered(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-900 border-r border-amber-500/30 text-white flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">سبد خرید سفارش آنلاین</h3>
                <p className="text-xs text-slate-400">بیرون‌بر، ارسال با پیک یا سفارش سر میز</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsOrdered(false);
              }}
              className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6">

            {isOrdered ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">سفارش شما با موفقیت به آشپزخانه ارسال شد!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  می‌توانید وضعیت سفارش خود را به صورت زنده در پروفایل کاربری مشاهده کنید.
                </p>
                <button
                  onClick={() => {
                    setIsOrdered(false);
                    setIsCartOpen(false);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl"
                >
                  متوجه شدم
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto" />
                <h4 className="font-bold text-slate-400 text-sm">سبد خرید شما خالی است</h4>
                <p className="text-xs text-slate-500">از منوی دیجیتال غذاهای دلخواه خود را انتخاب کنید.</p>
              </div>
            ) : (
              <>
                {/* Order Type Selector */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setOrderType('takeout')}
                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      orderType === 'takeout' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>تحویل حضوری</span>
                  </button>
                  
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      orderType === 'delivery' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>ارسال پیک</span>
                  </button>

                  <button
                    onClick={() => setOrderType('dinein')}
                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      orderType === 'dinein' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>سفارش سر میز</span>
                  </button>
                </div>

                {/* Additional details depending on order type */}
                {orderType === 'delivery' && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <label className="text-slate-400 mb-1 block">آدرس ارسال:</label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none" 
                    />
                  </div>
                )}

                {orderType === 'dinein' && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <label className="text-slate-400 mb-1 block">شماره میز شما:</label>
                    <input 
                      type="text" 
                      value={tableNo} 
                      onChange={(e) => setTableNo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-400 font-bold focus:outline-none" 
                    />
                  </div>
                )}

                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.dish.image} 
                          alt={item.dish.name} 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-white">{item.dish.name}</h4>
                          <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                            {item.dish.price.toLocaleString('fa-IR')} تومان
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button 
                          onClick={() => updateCartQuantity(index, -1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(index, 1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="کد تخفیف (مثال: VIP2026)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={() => applyPromoCode(promoInput)}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-2 rounded-xl font-bold border border-slate-700"
                    >
                      اعمال
                    </button>
                  </div>
                  {promoError && <div className="text-[11px] text-rose-400 mt-1">{promoError}</div>}
                  {appliedPromo && <div className="text-[11px] text-emerald-400 mt-1">✓ کد {appliedPromo.code} اعمال شد!</div>}
                </div>

              </>
            )}

          </div>

          {/* Footer Summary & Checkout Button */}
          {!isOrdered && cart.length > 0 && (
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>جمع کل آیتم‌ها:</span>
                  <span>{subtotal.toLocaleString('fa-IR')} تومان</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>تخفیف:</span>
                    <span>-{discountAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <span>{deliveryFee.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className="flex justify-between text-white text-base font-bold pt-2 border-t border-slate-800">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-amber-400 font-mono">{grandTotal.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all"
              >
                <span>تأیید & ارسال سفارش</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
