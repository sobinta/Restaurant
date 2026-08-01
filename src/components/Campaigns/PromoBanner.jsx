import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPAIGNS } from '../../data/mockData';
import { 
  Sparkles, 
  Tag, 
  X, 
  ArrowLeft, 
  Compass, 
  Calendar,
  Gift
} from 'lucide-react';

export default function PromoBanner() {
  const { activeCampaign, setIsReservationOpen, applyPromoCode } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activeCampaign) return null;

  const handleUseCode = () => {
    applyPromoCode(activeCampaign.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setIsReservationOpen(true);
    setShowModal(false);
  };

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-2 text-xs font-bold shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-slate-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
              {activeCampaign.badge}
            </span>
            <span className="truncate">{activeCampaign.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="hidden sm:flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 px-3 py-1 rounded-lg text-[11px] font-black transition-all shadow"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>کد تخفیف: {activeCampaign.code}</span>
            </button>

            <button
              onClick={() => setIsReservationOpen(true)}
              className="bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 hover:text-white px-2.5 py-0.5 rounded-md text-[11px] transition-all"
            >
              رزرو سریع
            </button>
          </div>

        </div>
      </div>

      {/* Campaign Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-0">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img 
                src={activeCampaign.image} 
                alt={activeCampaign.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4 text-right">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 inline-block">
                {activeCampaign.badge}
              </span>

              <h3 className="text-xl font-black text-white">{activeCampaign.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeCampaign.subtitle}
              </p>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">کد تخفیف اختصاصی:</div>
                  <div className="text-lg font-mono font-black text-amber-400">{activeCampaign.code}</div>
                </div>

                <button
                  onClick={handleUseCode}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  {copied ? '✓ کد اعمال شد' : 'اعمال کد & رزرو میز'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
