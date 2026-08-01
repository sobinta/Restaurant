import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Utensils, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Award, 
  Clock, 
  Flame,
  Maximize2
} from 'lucide-react';

export default function Hero() {
  const { branding, themeMode, t } = useTheme();
  const { setIsReservationOpen, open360View, setIsCrmOpen } = useApp();

  return (
    <section className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-[#18181b]' : 'bg-white'
    }`}>
      
      {/* Decorative Glows */}
      <div className={`absolute top-1/4 ltr:left-1/4 rtl:right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        themeMode === 'dark' ? 'bg-[#f59e0b]/10' : 'bg-[#0ea5e9]/10'
      }`} />
      <div className={`absolute bottom-10 ltr:right-1/4 rtl:left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        themeMode === 'dark' ? 'bg-[#9f1239]/15' : 'bg-[#dc2626]/10'
      }`} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (LTR/RTL responsive) */}
        <div className="lg:col-span-7 space-y-6 text-center ltr:lg:text-left rtl:lg:text-right">
          
          {/* Top Pill Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border shadow-inner ${
            themeMode === 'dark' 
              ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]' 
              : 'bg-[#0ea5e9]/10 border-[#0ea5e9]/30 text-[#0ea5e9]'
          }`}>
            <Sparkles className={`w-4 h-4 animate-spin-slow ${themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'}`} />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Main Title */}
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-serif ${
            themeMode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {branding.tagline || t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto ltr:lg:mx-0 rtl:lg:mx-0 ${
            themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {t('heroSubtitle')}
          </p>

          {/* Key Feature Stats Bar */}
          <div className={`grid grid-cols-3 gap-3 py-4 max-w-xl mx-auto ltr:lg:mx-0 rtl:lg:mx-0 border-y ${
            themeMode === 'dark' ? 'border-[#3f3f46]' : 'border-slate-200'
          }`}>
            <div className="text-center ltr:lg:text-left rtl:lg:text-right">
              <div className={`text-xl sm:text-2xl font-black flex items-center justify-center ltr:lg:justify-start rtl:lg:justify-start gap-1 ${
                themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'
              }`}>
                <span>4.9</span>
                <Star className="w-4 h-4 fill-current text-current" />
              </div>
              <div className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('heroRating')}
              </div>
            </div>

            <div className={`text-center ltr:lg:text-left rtl:lg:text-right border-x px-2 ${
              themeMode === 'dark' ? 'border-[#3f3f46]' : 'border-slate-200'
            }`}>
              <div className="text-xl sm:text-2xl font-black text-emerald-500 flex items-center justify-center ltr:lg:justify-start rtl:lg:justify-start gap-1">
                <span>360°</span>
                <Compass className="w-4 h-4 text-emerald-500" />
              </div>
              <div className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('hero360View')}
              </div>
            </div>

            <div className="text-center ltr:lg:text-left rtl:lg:text-right">
              <div className={`text-xl sm:text-2xl font-black flex items-center justify-center ltr:lg:justify-start rtl:lg:justify-start gap-1 ${
                themeMode === 'dark' ? 'text-[#9f1239]' : 'text-[#dc2626]'
              }`}>
                <span>100%</span>
                <ShieldCheck className="w-4 h-4 text-current" />
              </div>
              <div className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('heroCrmIntegrated')}
              </div>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center ltr:lg:justify-start rtl:lg:justify-start gap-4 pt-2">
            
            {/* Primary Action Button (Yellow in Dark, Sky Blue in Light) */}
            <button
              onClick={() => setIsReservationOpen(true)}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 ${
                themeMode === 'dark' 
                  ? 'bg-[#f59e0b] text-black hover:bg-[#d97706] shadow-[#f59e0b]/25' 
                  : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow-[#0ea5e9]/25'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span>{t('btnReserve360')}</span>
            </button>

            {/* Secondary Action Button (Crimson in Dark, Red in Light) */}
            <a
              href="#menu-section"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-base px-7 py-4 rounded-2xl transition-all ${
                themeMode === 'dark' 
                  ? 'bg-[#9f1239] text-white hover:bg-[#881337]' 
                  : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
              }`}
            >
              <Utensils className="w-5 h-5 text-white" />
              <span>{t('btnViewMenu')}</span>
            </a>
          </div>

        </div>

        {/* Right Column: 360 Preview Showcase Card */}
        <div className="lg:col-span-5 relative">
          <div className={`relative mx-auto max-w-md rounded-3xl p-1 shadow-2xl ${
            themeMode === 'dark' 
              ? 'bg-gradient-to-b from-[#f59e0b]/40 via-[#27272a] to-[#18181b] shadow-[#f59e0b]/10' 
              : 'bg-gradient-to-b from-[#0ea5e9]/30 via-slate-100 to-white shadow-[#0ea5e9]/10'
          }`}>
            <div className={`relative rounded-[22px] overflow-hidden aspect-[4/5] flex flex-col justify-between p-6 ${
              themeMode === 'dark' ? 'bg-[#27272a]' : 'bg-[#18181b]'
            }`}>
              
              {/* Background image */}
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                alt="360 Table Simulation" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Top Badge Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={`backdrop-blur-md text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border ${
                  themeMode === 'dark' 
                    ? 'bg-[#f59e0b]/20 border-[#f59e0b]/40 text-[#f59e0b]' 
                    : 'bg-[#0ea5e9]/20 border-[#0ea5e9]/40 text-[#0ea5e9]'
                }`}>
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{t('preview360Badge')}</span>
                </span>
                <span className="bg-black/80 backdrop-blur-md text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30">
                  {t('available')}
                </span>
              </div>

              {/* Center 360 Sight Trigger */}
              <div className="relative z-10 text-center my-auto">
                <button
                  onClick={() => open360View({
                    id: "T-04",
                    name: "Table VIP #4 - Glass Lounge",
                    capacity: 8,
                    view360Title: "360° Perspective View - Table VIP #4",
                    view360Image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80",
                    description: "Private pavilion with independent audio system and VIP butler service."
                  })}
                  className={`group relative inline-flex items-center justify-center p-4 rounded-full backdrop-blur-xl border text-white transition-all transform hover:scale-110 shadow-2xl animate-glow ${
                    themeMode === 'dark' 
                      ? 'bg-[#f59e0b]/20 border-[#f59e0b]/60 text-[#f59e0b]' 
                      : 'bg-[#0ea5e9]/30 border-[#0ea5e9]/80 text-[#0ea5e9]'
                  }`}
                >
                  <Maximize2 className="w-8 h-8 group-hover:rotate-45 transition-transform" />
                  <span className={`absolute -bottom-7 text-[11px] font-bold whitespace-nowrap bg-black/90 px-2.5 py-0.5 rounded-md border ${
                    themeMode === 'dark' ? 'border-[#f59e0b]/30 text-[#f59e0b]' : 'border-[#0ea5e9]/30 text-[#0ea5e9]'
                  }`}>
                    {t('clickToTest360')}
                  </span>
                </button>
              </div>

              {/* Bottom Card Meta */}
              <div className="relative z-10 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">{t('vipGlassRoom')}</h3>
                  <span className={`text-xs font-semibold ${themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'}`}>
                    {t('capacity')}: 8 {t('guestsCount')}
                  </span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2">
                  Panoramic 360 degree virtual perspective of the central piano lounge.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
