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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Background Gradient */}
      <div className={`absolute inset-0 -z-10 transition-colors duration-500 ${
        themeMode === 'dark' 
          ? 'bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950' 
          : 'bg-gradient-to-b from-blue-50/40 via-white to-slate-50'
      }`} />

      {/* Decorative Glows */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        themeMode === 'dark' ? 'bg-amber-500/10' : 'bg-blue-600/10'
      }`} />
      <div className={`absolute bottom-10 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        themeMode === 'dark' ? 'bg-amber-600/10' : 'bg-rose-500/10'
      }`} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (LTR/RTL responsive) */}
        <div className="lg:col-span-7 space-y-6 text-center ltr:lg:text-left rtl:lg:text-right">
          
          {/* Top Pill Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border shadow-inner ${
            themeMode === 'dark' 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Sparkles className={`w-4 h-4 animate-spin-slow ${themeMode === 'dark' ? 'text-amber-400' : 'text-blue-600'}`} />
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
            themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="text-center ltr:lg:text-left rtl:lg:text-right">
              <div className={`text-xl sm:text-2xl font-black flex items-center justify-center ltr:lg:justify-start rtl:lg:justify-start gap-1 ${
                themeMode === 'dark' ? 'text-amber-400' : 'text-blue-700'
              }`}>
                <span>4.9</span>
                <Star className="w-4 h-4 fill-current text-current" />
              </div>
              <div className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('heroRating')}
              </div>
            </div>

            <div className={`text-center ltr:lg:text-left rtl:lg:text-right border-x px-2 ${
              themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
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
                themeMode === 'dark' ? 'text-purple-400' : 'text-rose-600'
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
            <button
              onClick={() => setIsReservationOpen(true)}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 ${
                themeMode === 'dark' 
                  ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-amber-500/25' 
                  : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-blue-600/25'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span>{t('btnReserve360')}</span>
            </button>

            <a
              href="#menu-section"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-base px-7 py-4 rounded-2xl border transition-all ${
                themeMode === 'dark' 
                  ? 'bg-slate-900/90 text-white border-slate-700 hover:bg-slate-800' 
                  : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
            >
              <Utensils className={`w-5 h-5 ${themeMode === 'dark' ? 'text-amber-400' : 'text-blue-600'}`} />
              <span>{t('btnViewMenu')}</span>
            </a>
          </div>

        </div>

        {/* Right Column: 360 Preview Showcase Card */}
        <div className="lg:col-span-5 relative">
          <div className={`relative mx-auto max-w-md rounded-3xl p-1 shadow-2xl ${
            themeMode === 'dark' 
              ? 'bg-gradient-to-b from-amber-500/40 via-slate-800 to-slate-900 shadow-amber-500/10' 
              : 'bg-gradient-to-b from-blue-500/30 via-slate-200 to-white shadow-blue-500/10'
          }`}>
            <div className={`relative rounded-[22px] overflow-hidden aspect-[4/5] flex flex-col justify-between p-6 ${
              themeMode === 'dark' ? 'bg-slate-950' : 'bg-slate-900'
            }`}>
              
              {/* Background image */}
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                alt="360 Table Simulation" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Top Badge Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{t('preview360Badge')}</span>
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30">
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
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-300' 
                      : 'bg-blue-600/30 border-blue-400/80 text-blue-200'
                  }`}
                >
                  <Maximize2 className="w-8 h-8 group-hover:rotate-45 transition-transform" />
                  <span className="absolute -bottom-7 text-[11px] font-bold whitespace-nowrap bg-slate-950/90 px-2.5 py-0.5 rounded-md border border-amber-500/30 text-amber-300">
                    {t('clickToTest360')}
                  </span>
                </button>
              </div>

              {/* Bottom Card Meta */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">{t('vipGlassRoom')}</h3>
                  <span className="text-amber-400 text-xs font-semibold">{t('capacity')}: 8 {t('guestsCount')}</span>
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
