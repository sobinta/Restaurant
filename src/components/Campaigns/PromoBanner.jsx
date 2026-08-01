import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { themeMode } = useTheme();
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
      <div className={`px-4 py-2 text-xs font-bold shadow-md transition-colors ${
        themeMode === 'dark' 
          ? 'bg-[#9f1239] text-white' 
          : 'bg-[#dc2626] text-white'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
              themeMode === 'dark' ? 'bg-[#f59e0b] text-black' : 'bg-white text-[#dc2626]'
            }`}>
              {activeCampaign.badge}
            </span>
            <span className="truncate">{activeCampaign.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black transition-all shadow ${
                themeMode === 'dark' 
                  ? 'bg-[#18181b] text-[#f59e0b] hover:bg-[#27272a]' 
                  : 'bg-white text-[#0ea5e9] hover:bg-slate-50'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Promo: {activeCampaign.code}</span>
            </button>

            <button
              onClick={() => setIsReservationOpen(true)}
              className="bg-black/20 hover:bg-black/40 text-white px-2.5 py-0.5 rounded-md text-[11px] transition-all"
            >
              Book Now
            </button>
          </div>

        </div>
      </div>

      {/* Campaign Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl space-y-0 border ${
            themeMode === 'dark' ? 'bg-[#27272a] border-[#f59e0b]/40 text-white' : 'bg-white border-[#0ea5e9]/40 text-slate-900'
          }`}>
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img 
                src={activeCampaign.image} 
                alt={activeCampaign.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4 ltr:text-left rtl:text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                themeMode === 'dark' 
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30' 
                  : 'bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30'
              }`}>
                {activeCampaign.badge}
              </span>

              <h3 className="text-xl font-black">{activeCampaign.title}</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                {activeCampaign.subtitle}
              </p>

              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                themeMode === 'dark' ? 'bg-[#18181b] border-[#3f3f46]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="text-[10px] opacity-70">PROMO CODE:</div>
                  <div className={`text-lg font-mono font-black ${
                    themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'
                  }`}>{activeCampaign.code}</div>
                </div>

                <button
                  onClick={handleUseCode}
                  className={`font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all ${
                    themeMode === 'dark' 
                      ? 'bg-[#f59e0b] text-black hover:bg-[#d97706]' 
                      : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
                  }`}
                >
                  {copied ? '✓ Applied' : 'Apply Code & Book'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
