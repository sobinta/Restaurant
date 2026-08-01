import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import TableMap360 from './TableMap360';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  QrCode,
  HeartHandshake
} from 'lucide-react';

export default function ReservationWizard() {
  const { 
    isReservationOpen, 
    setIsReservationOpen, 
    selectedTableForBooking, 
    setSelectedTableForBooking,
    addReservation,
    appliedPromo,
    applyPromoCode,
    promoError
  } = useApp();

  const [step, setStep] = useState(1);
  const [guestCount, setGuestCount] = useState(4);
  const [selectedDate, setSelectedDate] = useState('۱۴۰۳/۰۶/۱۵');
  const [selectedTime, setSelectedTime] = useState('۲۰:۳۰');
  const [selectedTable, setSelectedTable] = useState(null);

  // Guest inputs
  const [guestName, setGuestName] = useState('امیرحسین رضایی');
  const [guestPhone, setGuestPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [notes, setNotes] = useState('لطفا صندلی رو به پنجره همراه با دیزاین گل روی میز آماده شود (سالگرد ازدواج).');

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [promoInput, setPromoInput] = useState('');

  useEffect(() => {
    if (selectedTableForBooking) {
      setSelectedTable(selectedTableForBooking);
      setStep(2);
    }
  }, [selectedTableForBooking]);

  if (!isReservationOpen) return null;

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!selectedTable) return;
      setStep(3);
    }
    else if (step === 3) setStep(4);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const depositAmount = selectedTable ? selectedTable.minDeposit : 200000;
    const finalDeposit = appliedPromo ? Math.round(depositAmount * (1 - appliedPromo.discountPercent / 100)) : depositAmount;

    const bookingPayload = {
      guestName,
      guestPhone,
      guestsCount: guestCount,
      date: selectedDate,
      time: selectedTime,
      tableName: selectedTable ? selectedTable.name : 'میز شماره ۱',
      tableId: selectedTable ? selectedTable.id : 'T-01',
      deposit: finalDeposit.toLocaleString('fa-IR'),
      notes
    };

    addReservation(bookingPayload);
    setConfirmedBooking(bookingPayload);
  };

  const handleClose = () => {
    setIsReservationOpen(false);
    setSelectedTableForBooking(null);
    setStep(1);
    setConfirmedBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto">
        
        {/* Header Bar */}
        <div className="bg-slate-950 p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">سیستم رزرو آنلاین میز با ویوی ۳۶۰°</h2>
              <p className="text-xs text-slate-400">رزرو سریع در ۴ مرحله ساده</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        {!confirmedBooking && (
          <div className="bg-slate-950/50 p-3 px-6 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>۱</span>
              <span>زمان & تعداد</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>۲</span>
              <span>انتخاب میز ۳۶۰°</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>۳</span>
              <span>اطلاعات مهمان</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-amber-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 4 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>۴</span>
              <span>تأیید فاکتور</span>
            </div>
          </div>
        )}

        {/* Wizard Body Content */}
        <div className="p-6 space-y-6">

          {/* CONFIRMED BOOKING TICKET VIEW */}
          {confirmedBooking ? (
            <div className="text-center space-y-6 py-6 animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">رزرو شما با موفقیت ثبت گردید!</h3>
                <p className="text-sm text-slate-300">
                  کد پیگیری رزرو: <strong className="text-amber-400 font-mono text-base">RES-9821</strong>
                </p>
              </div>

              {/* Digital Ticket Container */}
              <div className="max-w-md mx-auto bg-slate-950 border border-amber-500/40 rounded-3xl p-6 text-right space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-xs text-slate-400">نام مهمان:</div>
                    <div className="font-bold text-white text-base">{confirmedBooking.guestName}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">تلفن:</div>
                    <div className="font-mono text-amber-400 font-bold">{confirmedBooking.guestPhone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">میز رزرو شده:</span>
                    <div className="font-bold text-amber-300 mt-0.5">{confirmedBooking.tableName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">تاریخ & ساعت:</span>
                    <div className="font-bold text-white mt-0.5">{confirmedBooking.date} - {confirmedBooking.time}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">مبلغ بیعانه پرداخت‌شده:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">{confirmedBooking.deposit} تومان</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl shadow">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm px-8 py-3 rounded-xl shadow-lg transition-all"
              >
                متوجه شدم & بستن پنجره
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: DATE, TIME & GUEST COUNT */}
              {step === 1 && (
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2">تعداد مهمانان:</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[2, 4, 6, 8, 10].map(count => (
                        <button
                          key={count}
                          onClick={() => setGuestCount(count)}
                          className={`py-3 rounded-2xl text-sm font-bold border transition-all ${
                            guestCount === count 
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md' 
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {count} نفر
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2">تاریخ رزرو:</label>
                      <select 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="۱۴۰۳/۰۶/۱۵">امروز - ۱۵ شهریور ۱۴۰۳</option>
                        <option value="۱۴۰۳/۰۶/۱۶">فردا - ۱۶ شهریور ۱۴۰۳</option>
                        <option value="۱۴۰۳/۰۶/۱۷">شنبه - ۱۷ شهریور ۱۴۰۳</option>
                        <option value="۱۴۰۳/۰۶/۱۸">یکشنبه - ۱۸ شهریور ۱۴۰۳</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2">ساعت حضور:</label>
                      <select 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="۱۳:۳۰">۱۳:۳۰ (نهار)</option>
                        <option value="۱۵:۰۰">۱۵:۰۰ (نهار)</option>
                        <option value="۱۹:۳۰">۱۹:۳۰ (شام)</option>
                        <option value="۲۰:۳۰">۲۰:۳۰ (شام - پرطرفدار)</option>
                        <option value="۲۲:۰۰">۲۲:۰۰ (شام)</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: TABLE MAP & 360 SELECTION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">میز مورد نظر خود را روی نقشه یا با ویوی ۳۶۰° انتخاب کنید:</h3>
                    {selectedTable && (
                      <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        انتخاب شده: {selectedTable.name}
                      </span>
                    )}
                  </div>

                  <TableMap360 
                    onSelectTable={(tbl) => setSelectedTable(tbl)}
                    selectedTableId={selectedTable ? selectedTable.id : null}
                  />
                </div>
              )}

              {/* STEP 3: GUEST DETAILS */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-1.5">نام و نام خانوادگی:</label>
                      <input 
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-1.5">شماره همراه (جهت دریافت پیامک تأیید):</label>
                      <input 
                        type="text"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1.5">درخواست‌های خاص یا آلرژی‌های غذایی:</label>
                    <textarea 
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      placeholder="مثال: دیزاین تولد، صندلی نوزاد، حساسیت به ادویه..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: SUMMARY & CONFIRMATION */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 text-sm border-b border-slate-800 pb-2">خلاصه پیش‌فاکتور رزرو میز:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>میز: <strong className="text-white">{selectedTable?.name}</strong></div>
                      <div>تعداد: <strong className="text-white">{guestCount} نفر</strong></div>
                      <div>تاریخ: <strong className="text-white">{selectedDate}</strong></div>
                      <div>ساعت: <strong className="text-white">{selectedTime}</strong></div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="کد تخفیف (مثلا: VIP2026)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={() => applyPromoCode(promoInput)}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-4 py-2 rounded-xl font-bold border border-slate-700"
                    >
                      اعمال
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="text-xs text-emerald-400 font-bold">
                      ✓ کد تخفیف {appliedPromo.code} با موفقیت اعمال گردید ({appliedPromo.discountPercent}٪ تخفیف).
                    </div>
                  )}

                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    مرحلت قبل
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={step === 2 && !selectedTable}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      step === 2 && !selectedTable 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                    }`}
                  >
                    مرحله بعدی
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 text-slate-950 font-black text-xs px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    پرداخت بیعانه & ثبت نهایی رزرو
                  </button>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
