import React from 'react';
import { useApp } from '../../context/AppContext';
import { REWARDS } from '../../data/mockData';
import { 
  X, 
  User, 
  Crown, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Award,
  ChevronRight,
  Flame,
  Cake,
  Coffee,
  Salad
} from 'lucide-react';

const iconMap = { Cake, Coffee, Salad, Crown };

export default function UserProfileModal() {
  const { isProfileOpen, setIsProfileOpen, user, activeOrder } = useApp();

  if (!isProfileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-0 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg">{user.name}</h3>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{user.phone}</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Loyalty Points Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">موجودی صندوق باشگاه مشتریان:</div>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <span>{user.points} امتیاز</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-left max-w-xs">
              با هر ثبت رزرو یا سفارش آنلاین، ۱۰٪ مبلغ به صورت امتیاز هدیه شارژ می‌شود.
            </div>
          </div>

          {/* Live Active Order Status Tracker */}
          {activeOrder && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h4 className="font-bold text-white text-sm">پیگیری زنده آخرین سفارش ({activeOrder.id})</h4>
                </div>
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {activeOrder.time}
                </span>
              </div>

              {/* Status Timeline Progress Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-bold">
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="text-emerald-400">ثبت سفارش</div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <div className="text-amber-400">پخت در آشپزخانه</div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-slate-800"></div>
                  <div className="text-slate-500">تحویل به پیک</div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-slate-800"></div>
                  <div className="text-slate-500">تحویل شد</div>
                </div>
              </div>
            </div>
          )}

          {/* Past Bookings Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>تاریخچه رزروهای آنلاین میز:</span>
            </h4>

            {user.bookings.map(b => (
              <div key={b.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{b.table}</div>
                  <div className="text-slate-400 mt-1">{b.date} - ساعت {b.time} ({b.guests} نفر)</div>
                </div>

                <div className="text-left">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {b.status}
                  </span>
                  <div className="text-slate-400 text-[11px] mt-1">بیعانه: {b.deposit}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Redeemable Loyalty Rewards Cards */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>جوایز قابل دریافت با امتیاز شما:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REWARDS.map(r => {
                const IconComp = iconMap[r.icon] || Award;
                const canRedeem = user.points >= r.pointsReq;

                return (
                  <div 
                    key={r.id} 
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      canRedeem ? 'bg-slate-950 border-amber-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{r.title}</div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">{r.pointsReq} امتیاز</div>
                      </div>
                    </div>

                    <button
                      disabled={!canRedeem}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl ${
                        canRedeem 
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'دریافت جایزه' : 'امتیاز ناكافی'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
