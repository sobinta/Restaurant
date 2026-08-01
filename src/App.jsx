import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';

import PromoBanner from './components/Campaigns/PromoBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DigitalMenu from './components/Menu/DigitalMenu';
import DishModal from './components/Menu/DishModal';
import ReservationWizard from './components/Reservation/ReservationWizard';
import Panorama360Viewer from './components/Reservation/Panorama360Viewer';
import CartDrawer from './components/Cart/CartDrawer';
import CrmDashboardModal from './components/CRM/CrmDashboardModal';
import WhiteLabelPanel from './components/Admin/WhiteLabelPanel';
import UserProfileModal from './components/Profile/UserProfileModal';
import Footer from './components/Footer';

import { 
  Compass, 
  Users, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Award,
  ArrowLeft
} from 'lucide-react';

function PitchHighlightsSection() {
  const { setIsReservationOpen, setIsCrmOpen, setIsWhiteLabelOpen, open360View } = useApp();

  return (
    <section className="py-20 px-4 bg-slate-900/60 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-purple-400 font-bold text-xs uppercase tracking-widest bg-purple-500/10 border border-purple-500/30 px-3.5 py-1 rounded-full inline-block">
            مزیت‌های منحصر‌به‌فرد برای فروش به رستوران‌ها
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            چرا صاحب هر رستورانی شیفته این محصول خواهد شد؟
          </h2>
          <p className="text-slate-400 text-sm">
            این پلتفرم طراحی شده تا در جلسات پرزنت حضوری، ظرف ۱۰ دقیقه مشتری را مجذوب قابلیت‌های مدرن خود کند.
          </p>
        </div>

        {/* 3 Main Pitch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pitch Card 1: 360 Table Reservation */}
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-amber-500/30 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-xl hover:shadow-amber-500/10">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">رزرو میز ۳۶۰° هوشمند</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                مشتری پیش از رزرو، دقیقا دید صندلی خود را به صورت عکس و نمای ۳۶۰ درجه سه بعدی مشاهده می‌کند و بر اساس سلیقه خود میز را رزرو می‌کند.
              </p>
            </div>

            <button
              onClick={() => open360View({
                id: "T-04",
                name: "میز VIP شماره ۴ - لوکس آکواریوم",
                capacity: 8,
                view360Title: "تست زنده دید ۳۶۰ درجه صندلی VIP",
                view360Image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80",
                description: "اتاق خصوصی با سیستم صوتی جداگانه و سرویس‌دهی VIP اختصاصی."
              })}
              className="flex items-center justify-between text-amber-400 hover:text-amber-300 text-xs font-bold pt-4 border-t border-slate-800"
            >
              <span>تست زنده ویوی ۳۶۰°</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Pitch Card 2: CRM & Guest Intelligence */}
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-xl hover:shadow-emerald-500/10">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">اتصال به سیستم CRM مشتریان</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ثبت تاریخچه تمام مراجعات، میزان خرج‌کرد، سلیقه غذایی، آلرژی‌ها و ارسال پیامک‌های خودکار تبریک تولد و تخفیف‌های هدفمند.
              </p>
            </div>

            <button
              onClick={() => setIsCrmOpen(true)}
              className="flex items-center justify-between text-emerald-400 hover:text-emerald-300 text-xs font-bold pt-4 border-t border-slate-800"
            >
              <span>مشاهده داشبورد CRM</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Pitch Card 3: White-Label Customization */}
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-purple-500/30 hover:border-purple-500 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-xl hover:shadow-purple-500/10">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">شخصی‌سازی زنده (White-Label)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تغییر لحظه‌ای تمام تم‌ها، رنگ‌ها، نام رستوران و لوگو فقط با یک کلیک در حضور صاحب رستوران برای بستن قرارداد فوری!
              </p>
            </div>

            <button
              onClick={() => setIsWhiteLabelOpen(true)}
              className="flex items-center justify-between text-purple-400 hover:text-purple-300 text-xs font-bold pt-4 border-t border-slate-800"
            >
              <span>تست سفارشی‌سازی زنده</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

function MainContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DigitalMenu />
        <PitchHighlightsSection />
      </main>
      <Footer />

      {/* Global Modals */}
      <DishModal />
      <ReservationWizard />
      <Panorama360Viewer />
      <CartDrawer />
      <CrmDashboardModal />
      <WhiteLabelPanel />
      <UserProfileModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
