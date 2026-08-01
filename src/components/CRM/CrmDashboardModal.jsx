import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Users, 
  Search, 
  Crown, 
  Send, 
  TrendingUp, 
  Award, 
  Calendar, 
  AlertTriangle,
  Phone,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CrmDashboardModal() {
  const { isCrmOpen, setIsCrmOpen, guests } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(guests[0]);
  const [campaignSent, setCampaignSent] = useState(false);

  if (!isCrmOpen) return null;

  const filteredGuests = guests.filter(g => 
    g.name.includes(search) || g.phone.includes(search) || g.tier.includes(search)
  );

  const handleSendCampaign = () => {
    setCampaignSent(true);
    setTimeout(() => setCampaignSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">سیستم مدیریت مشتریان یکپارچه (CRM Dashboard)</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  متصل به داده‌های رزرو & فاکتور
                </span>
              </div>
              <p className="text-xs text-slate-400">تحلیل رفتاری مشتریان، دسته‌بندی VIP و اتوماسیون کمپین‌های پیامکی</p>
            </div>
          </div>

          <button
            onClick={() => setIsCrmOpen(false)}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 px-6 bg-slate-950/60 border-b border-slate-800/80">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">کل مشتریان ثبت‌شده:</div>
              <div className="text-lg font-black text-white font-mono">۱,۴۲۰ نفر</div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">میانگین فاکتور هر میز:</div>
              <div className="text-lg font-black text-emerald-400 font-mono">۸۵۰,۰۰۰ تومان</div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">نرخ بازگشت مشتریان VIP:</div>
              <div className="text-lg font-black text-purple-400 font-mono">۶۸٪ (بسیار بالا)</div>
            </div>
          </div>
        </div>

        {/* Body Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Guest List */}
          <div className="lg:col-span-5 border-l border-slate-800 flex flex-col bg-slate-950/40">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجوی نام یا تلفن مشتری..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredGuests.map(guest => {
                const isSelected = selectedGuest?.id === guest.id;
                return (
                  <div
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={guest.avatar} 
                        alt={guest.name} 
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white">{guest.name}</h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{guest.phone}</div>
                      </div>
                    </div>

                    <span className="text-[10px] bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 font-semibold text-amber-400">
                      {guest.tier}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Selected Guest Deep Details & Campaign Trigger */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6">
            {selectedGuest ? (
              <>
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedGuest.avatar} 
                      alt={selectedGuest.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                    />
                    <div>
                      <h3 className="font-black text-lg text-white">{selectedGuest.name}</h3>
                      <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" />
                        <span>سطح مشتری: {selectedGuest.tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-mono">
                    <div className="text-xs text-slate-400">مجموع خریدهای ثبت‌شده:</div>
                    <div className="text-emerald-400 font-bold text-base">{selectedGuest.totalSpent}</div>
                  </div>
                </div>

                {/* Guest Attributes Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">تعداد مراجعه:</span>
                    <div className="font-bold text-white text-sm">{selectedGuest.visits} بار حضور</div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">میز مورد علاقه:</span>
                    <div className="font-bold text-amber-300 text-sm">{selectedGuest.favTable}</div>
                  </div>
                </div>

                {/* Allergy & Preference Alert Box */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>آلرژی غذایی و ملاحظات پزشکی:</span>
                  </div>
                  <p className="text-amber-200">{selectedGuest.allergies}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-300">یادداشت اختصاصی گارسون & سیستم:</span>
                  <p className="text-slate-400 leading-relaxed">{selectedGuest.notes}</p>
                </div>

                {/* Trigger Targeted SMS Campaign Demo */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    ارسال پیشنهاد اختصاصی ۲۰٪ تخفیف تولد یا رزرو مجدد:
                  </div>

                  <button
                    onClick={handleSendCampaign}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال پیامک کمپین هدفمند</span>
                  </button>
                </div>

                {campaignSent && (
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>پیامک کمپین با موفقیت به {selectedGuest.phone} ارسال گردید!</span>
                  </div>
                )}
              </>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
}
