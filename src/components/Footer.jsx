import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Clock, 
  Camera, 
  Send, 
  Compass, 
  Sparkles,
  Heart
} from 'lucide-react';

export default function Footer() {
  const { branding, themeMode, t } = useTheme();
  const { setIsReservationOpen, setIsCrmOpen } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className={`border-t text-sm relative overflow-hidden transition-colors duration-500 ${
      themeMode === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white font-serif">{branding.name}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {branding.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-all border border-slate-800">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-all border border-slate-800">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">{t('contactInfo')}</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{t('address')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-mono text-white">{t('phone')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{t('hours')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu-section" className="hover:text-amber-400 transition-colors">{t('digitalMenu')}</a>
              </li>
              <li>
                <button onClick={() => setIsReservationOpen(true)} className="hover:text-amber-400 transition-colors text-left ltr:text-left rtl:text-right">
                  {t('tableReservation360')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsCrmOpen(true)} className="hover:text-amber-400 transition-colors text-left ltr:text-left rtl:text-right">
                  {t('crmDashboard')}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">{t('newsletter')}</h4>
            <p className="text-xs text-slate-400">
              {t('newsletterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                {t('subscribe')}
              </button>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 font-semibold text-center">
                  {t('subscribedSuccess')}
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {t('copyright')}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for high-converting sales pitches</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
