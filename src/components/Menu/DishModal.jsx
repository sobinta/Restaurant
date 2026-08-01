import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Check, 
  Plus, 
  Minus, 
  UtensilsCrossed, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function DishModal() {
  const { selectedDish, setSelectedDish, addToCart } = useApp();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);

  if (!selectedDish) return null;

  const handleOptionSelect = (groupName, choice) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: choice
    }));
  };

  const handleAddToCart = () => {
    addToCart(selectedDish, selectedOptions, quantity);
    setSelectedDish(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-0 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedDish(null)}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white transition-all border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Banner */}
        <div className="relative aspect-[16/8] w-full overflow-hidden">
          <img 
            src={selectedDish.image} 
            alt={selectedDish.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {selectedDish.dietary.map((tag, idx) => (
              <span key={idx} className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-3 py-1 rounded-full font-semibold border border-amber-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">{selectedDish.name}</h2>
              <div className="text-amber-400 font-mono font-bold text-xl">
                {selectedDish.price.toLocaleString('fa-IR')} <span className="text-xs text-slate-400 font-vazir font-normal">تومان</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">{selectedDish.enName}</p>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {selectedDish.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2 justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>زمان تهیه: {selectedDish.prepTime}</span>
            </div>
            <div className="flex items-center gap-2 justify-center border-x border-slate-800">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{selectedDish.calories}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{selectedDish.rating} امتیاز</span>
            </div>
          </div>

          {/* Wine / Drinks Pairing Suggestion */}
          {selectedDish.pairing && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{selectedDish.pairing}</span>
            </div>
          )}

          {/* Options Selection (e.g., Doneness, Sides) */}
          {selectedDish.options && selectedDish.options.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">شخصی‌سازی سفارش:</h4>
              {selectedDish.options.map((optionGroup, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <div className="text-xs text-slate-400 font-medium">{optionGroup.name}:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {optionGroup.choices.map((choice, cIdx) => {
                      const isSelected = selectedOptions[optionGroup.name] === choice;
                      return (
                        <button
                          key={cIdx}
                          onClick={() => handleOptionSelect(optionGroup.name, choice)}
                          className={`p-2.5 rounded-xl text-xs text-right transition-all flex items-center justify-between border ${
                            isSelected 
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{choice}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-white text-sm w-6 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>افزودن به سبد ({ (selectedDish.price * quantity).toLocaleString('fa-IR') } تومان)</span>
          </button>

        </div>

      </div>
    </div>
  );
}
