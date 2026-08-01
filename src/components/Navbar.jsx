import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  Compass, 
  ShoppingBag, 
  User, 
  Crown, 
  SlidersHorizontal, 
  Sparkles,
  PhoneCall,
  Calendar,
  Users,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { 
    branding, 
    presenterMode, 
    lang, 
    toggleLanguage, 
    themeMode, 
    toggleThemeMode, 
    t 
  } = useTheme();

  const { 
    cart, 
    setIsCartOpen, 
    setIsReservationOpen, 
    setIsCrmOpen, 
    setIsWhiteLabelOpen,
    setIsProfileOpen,
    user
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel transition-all duration-300">
      {/* Presenter Pitch Banner */}
      {presenterMode && (
        <div className={`py-1.5 px-4 text-xs font-semibold flex items-center justify-between shadow-inner transition-colors ${
          themeMode === 'dark' 
            ? 'bg-[#9f1239] text-white' 
            : 'bg-[#dc2626] text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              themeMode === 'dark' ? 'bg-[#f59e0b] text-black' : 'bg-white text-[#dc2626]'
            }`}>
              {t('presenterBannerTitle')}
            </span>
            <span className="hidden md:inline">
              {t('presenterBannerDesc')}
            </span>
          </div>
          <button 
            onClick={() => setIsWhiteLabelOpen(true)}
            className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-bold transition-all shadow ${
              themeMode === 'dark' 
                ? 'bg-[#18181b] text-[#f59e0b] hover:bg-[#27272a]' 
                : 'bg-white text-[#0ea5e9] hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('whiteLabelSettings')}</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl p-0.5 shadow-lg flex items-center justify-center ${
              themeMode === 'dark' 
                ? 'bg-gradient-to-br from-[#f59e0b] to-[#9f1239] shadow-[#f59e0b]/20' 
                : 'bg-gradient-to-br from-[#0ea5e9] to-[#dc2626] shadow-[#0ea5e9]/20'
            }`}>
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                themeMode === 'dark' ? 'bg-[#18181b]' : 'bg-white'
              }`}>
                <Utensils className={`w-6 h-6 ${themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'}`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight font-serif ${
                  themeMode === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {branding.name}
                </h1>
                {branding.badge && (
                  <span className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                    themeMode === 'dark' 
                      ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30' 
                      : 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30'
                  }`}>
                    {branding.badge}
                  </span>
                )}
              </div>
              <p className={`text-xs font-light truncate max-w-xs ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {branding.subName}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border ${
            themeMode === 'dark' ? 'bg-[#27272a] border-[#3f3f46]' : 'bg-slate-100 border-slate-200'
          }`}>
            <a 
              href="#menu-section"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                themeMode === 'dark' ? 'text-slate-200 hover:text-[#f59e0b] hover:bg-[#3f3f46]' : 'text-slate-700 hover:text-[#0ea5e9] hover:bg-white'
              }`}
            >
              <Utensils className={`w-4 h-4 ${themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'}`} />
              <span>{t('digitalMenu')}</span>
            </a>

            <button 
              onClick={() => setIsReservationOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                themeMode === 'dark' 
                  ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30 hover:bg-[#f59e0b]/20' 
                  : 'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/20'
              }`}
            >
              <Compass className={`w-4 h-4 animate-spin-slow ${themeMode === 'dark' ? 'text-[#f59e0b]' : 'text-[#0ea5e9]'}`} />
              <span>{t('tableReservation360')}</span>
            </button>

            <button 
              onClick={() => setIsCrmOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                themeMode === 'dark' ? 'text-slate-200 hover:text-white hover:bg-[#3f3f46]' : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{t('crmDashboard')}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => toggleLanguage()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                themeMode === 'dark' 
                  ? 'bg-[#27272a] text-[#f59e0b] border-[#f59e0b]/30 hover:bg-[#3f3f46]' 
                  : 'bg-white text-[#0ea5e9] border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
              title="Toggle Language (EN / FA)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'FA (فارسی)' : 'EN (English)'}</span>
            </button>

            {/* Theme Mode Switcher */}
            <button
              onClick={() => toggleThemeMode()}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                themeMode === 'dark' 
                  ? 'bg-[#27272a] text-[#f59e0b] border-[#3f3f46] hover:bg-[#3f3f46]' 
                  : 'bg-white text-[#0ea5e9] border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
              title="Toggle Theme Mode"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-[#f59e0b]" /> : <Moon className="w-4 h-4 text-[#dc2626]" />}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                themeMode === 'dark' 
                  ? 'bg-[#27272a] text-slate-200 border-[#3f3f46] hover:bg-[#3f3f46]' 
                  : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
              title={t('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce ${
                  themeMode === 'dark' ? 'bg-[#f59e0b] text-black' : 'bg-[#dc2626] text-white'
                }`}>
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Reservation CTA Button */}
            <button
              onClick={() => setIsReservationOpen(true)}
              className={`hidden sm:flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-xs ${
                themeMode === 'dark' 
                  ? 'bg-[#f59e0b] text-black hover:bg-[#d97706] shadow-[#f59e0b]/20' 
                  : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow-[#0ea5e9]/20'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookTable')}</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className={`p-1.5 rounded-xl border transition-all ${
                themeMode === 'dark' ? 'bg-[#27272a] border-[#3f3f46]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <img 
                src={user.avatar} 
                alt="User" 
                className={`w-7 h-7 rounded-lg object-cover ring-2 ${
                  themeMode === 'dark' ? 'ring-[#f59e0b]/50' : 'ring-[#0ea5e9]/50'
                }`}
              />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
