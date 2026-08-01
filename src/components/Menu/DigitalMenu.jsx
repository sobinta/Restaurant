import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { MENU_CATEGORIES, DISHES } from '../../data/mockData';
import { 
  Utensils, 
  Crown, 
  Flame, 
  Salad, 
  Cake, 
  Coffee, 
  Search, 
  Star, 
  Clock, 
  Plus, 
  Sparkles,
  Info
} from 'lucide-react';

const iconMap = {
  Utensils,
  Crown,
  Flame,
  Salad,
  Cake,
  Coffee
};

export default function DigitalMenu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('all');
  
  const { addToCart, setSelectedDish } = useApp();
  const { themeMode, lang, currency, t } = useTheme();

  // Filter logic
  const filteredDishes = DISHES.filter(dish => {
    const matchesCategory = activeCategory === 'all' || dish.categoryId === activeCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.enName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = selectedDietary === 'all' || dish.dietary.some(tag => tag.includes(selectedDietary));
    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <section id="menu-section" className={`py-16 px-4 relative border-t transition-colors duration-500 ${
      themeMode === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`font-bold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block border ${
            themeMode === 'dark' 
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
              : 'text-blue-700 bg-blue-50 border-blue-200'
          }`}>
            {t('digitalMenu')}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black ${
            themeMode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {t('menuTitle')}
          </h2>
          <p className={`text-sm ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('menuSubtitle')}
          </p>
        </div>

        {/* Search Bar & Dietary Filter */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className={`w-4 h-4 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-xl ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-sm focus:outline-none transition-all ${
                  themeMode === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600 shadow-sm'
                }`}
              />
            </div>

            {/* Quick Dietary Tags Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <span className={`text-xs whitespace-nowrap ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('dietaryFilter')}
              </span>
              {['all', 'Halal', 'Vegan', 'Gluten-Free'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedDietary(tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium border ${
                    selectedDietary === tag 
                      ? themeMode === 'dark'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' 
                        : 'bg-blue-600 text-white font-bold border-blue-600'
                      : themeMode === 'dark'
                        ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tag === 'all' ? t('all') : tag}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b ${
            themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            {MENU_CATEGORIES.map(cat => {
              const IconComponent = iconMap[cat.icon] || Utensils;
              const isActive = activeCategory === cat.id;
              const catName = lang === 'en' ? (cat.enName || cat.name) : cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                    isActive 
                      ? themeMode === 'dark'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20' 
                        : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                      : themeMode === 'dark'
                        ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${
                    isActive ? (themeMode === 'dark' ? 'text-slate-950' : 'text-white') : (themeMode === 'dark' ? 'text-amber-400' : 'text-blue-600')
                  }`} />
                  <span>{catName}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map(dish => {
            const dishTitle = lang === 'en' ? dish.enName : dish.name;
            const dishDesc = lang === 'en' ? (dish.enDescription || dish.description) : dish.description;
            const formattedPrice = lang === 'en' 
              ? `$${(dish.price / 40000).toFixed(2)}` 
              : `${dish.price.toLocaleString('fa-IR')} تومان`;

            return (
              <div 
                key={dish.id}
                className={`group border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  themeMode === 'dark' 
                    ? 'bg-slate-900/80 border-slate-800/80 hover:border-amber-500/40 shadow-amber-500/5' 
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-slate-200'
                }`}
              >
                
                {/* Dish Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dishTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                  {/* Badges */}
                  <div className="absolute top-3 ltr:left-3 rtl:right-3 flex items-center gap-2">
                    {dish.isChefSpecial && (
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md ${
                        themeMode === 'dark' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                      }`}>
                        <Crown className="w-3 h-3" />
                        <span>{t('chefSpecial')}</span>
                      </span>
                    )}
                    {dish.dietary.map((tag, idx) => (
                      <span key={idx} className="bg-slate-950/80 text-slate-300 backdrop-blur-md text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 ltr:right-3 rtl:left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`font-bold text-base transition-colors ${
                      themeMode === 'dark' ? 'text-white group-hover:text-amber-400' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {dishTitle}
                    </h3>
                    <p className={`text-xs font-light mt-1 line-clamp-2 leading-relaxed ${
                      themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {dishDesc}
                    </p>
                  </div>

                  {/* Meta Specs */}
                  <div className={`flex items-center gap-4 text-[11px] pt-2 border-t ${
                    themeMode === 'dark' ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3.5 h-3.5 ${themeMode === 'dark' ? 'text-amber-500' : 'text-blue-600'}`} />
                      <span>{dish.prepTime}</span>
                    </div>
                    <div>•</div>
                    <div>{dish.calories}</div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className={`text-[11px] ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('price')}:</div>
                      <div className={`text-lg font-black font-mono ${
                        themeMode === 'dark' ? 'text-amber-400' : 'text-blue-700'
                      }`}>
                        {formattedPrice}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDish(dish)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          themeMode === 'dark' 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                        title={t('viewDetails')}
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => addToCart(dish)}
                        className={`flex items-center gap-1.5 font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all transform hover:scale-105 ${
                          themeMode === 'dark' 
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('addToCart')}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
