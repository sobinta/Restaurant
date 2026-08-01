import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TABLES, SECTIONS } from '../../data/mockData';
import { 
  Users, 
  Eye, 
  Crown, 
  Sun, 
  Check, 
  Maximize2,
  Sparkles,
  Lock
} from 'lucide-react';

export default function TableMap360({ onSelectTable, selectedTableId }) {
  const [activeSection, setActiveSection] = useState('main-hall');
  const { open360View } = useApp();

  const sectionTables = TABLES.filter(t => t.sectionId === activeSection);

  return (
    <div className="space-y-6">
      
      {/* Section Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {SECTIONS.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{sec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Floor Layout Grid */}
      <div className="relative min-h-[360px] bg-slate-950/80 border border-slate-800 rounded-3xl p-6 overflow-hidden flex flex-col justify-between">
        
        {/* Subtle Room Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Section Title Indicator */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            نقشه چیدمان: {SECTIONS.find(s => s.id === activeSection)?.name}
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> آماده رزرو</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> رزرو شده</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> انتخاب شده</span>
          </div>
        </div>

        {/* Tables Render Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {sectionTables.map(table => {
            const isSelected = selectedTableId === table.id;
            const isReserved = table.status === 'reserved';

            return (
              <div 
                key={table.id}
                className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-amber-500/20 border-amber-500 shadow-xl shadow-amber-500/10' 
                    : isReserved 
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-60' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80'
                }`}
              >
                
                {/* Table Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {table.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{table.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Users className="w-3 h-3 text-amber-500" />
                        <span>{table.capacity} نفر</span>
                      </div>
                    </div>
                  </div>

                  {table.isVip && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      <span>VIP</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {table.description}
                </p>

                {/* Table Actions: 360 View Button & Select Button */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  
                  {/* 360 View Trigger */}
                  <button
                    type="button"
                    onClick={() => open360View(table)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 text-[11px] font-semibold py-2 rounded-xl border border-amber-500/30 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>دید ۳۶۰°</span>
                  </button>

                  {/* Booking Selection Trigger */}
                  {isReserved ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-1 bg-slate-800 text-slate-500 text-[11px] py-2 rounded-xl cursor-not-allowed"
                    >
                      <Lock className="w-3 h-3" />
                      <span>رزرو شده</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectTable(table)}
                      className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-2 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{isSelected ? 'انتخاب شد' : 'رزرو این میز'}</span>
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
