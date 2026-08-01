import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { RESTAURANT_PRESETS } from '../../data/mockData';
import { 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Palette, 
  QrCode, 
  Check, 
  Globe, 
  Coins, 
  Eye, 
  Layers,
  Sun,
  Moon
} from 'lucide-react';

export default function WhiteLabelPanel() {
  const { 
    currentPreset, 
    changePreset, 
    branding, 
    updateBranding, 
    presenterMode, 
    setPresenterMode,
    themeMode,
    toggleThemeMode,
    lang,
    toggleLanguage,
    t
  } = useTheme();

  const { isWhiteLabelOpen: appWhiteLabelOpen, setIsWhiteLabelOpen: setAppWhiteLabelOpen } = useApp();

  const isOpen = appWhiteLabelOpen;

  const [activeTab, setActiveTab] = useState('branding');
  const [tableQrNum, setTableQrNum] = useState('4');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 max-w-full flex">
        <div className={`w-screen max-w-md border-l border-amber-500/30 flex flex-col justify-between shadow-2xl ${
          themeMode === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}>
          
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between ${
            themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('whiteLabelTitle')}</h3>
                <p className="text-xs text-slate-400">{t('presenterBannerDesc')}</p>
              </div>
            </div>

            <button
              onClick={() => setAppWhiteLabelOpen(false)}
              className="p-2 rounded-full hover:bg-slate-800/40 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className={`flex border-b text-xs font-bold ${
            themeMode === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-100'
          }`}>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'branding' ? 'border-amber-500 text-amber-500 font-black' : 'border-transparent text-slate-400'
              }`}
            >
              1. Branding & Color System
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'qr' ? 'border-amber-500 text-amber-500 font-black' : 'border-transparent text-slate-400'
              }`}
            >
              2. Table Stand QR Generator
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6">

            {activeTab === 'branding' && (
              <>
                {/* Theme Palette Switcher (Dark vs Light) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-500" />
                    <span>{t('themeMode')}:</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleThemeMode('dark')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        themeMode === 'dark' 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-amber-400" />
                      <span>{t('darkThemeLabel')}</span>
                    </button>

                    <button
                      onClick={() => toggleThemeMode('light')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        themeMode === 'light' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-rose-600" />
                      <span>{t('lightThemeLabel')}</span>
                    </button>
                  </div>
                </div>

                {/* Language Selector (EN / FA) */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Language / زبان:</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleLanguage('en')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        lang === 'en' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      English (LTR)
                    </button>

                    <button
                      onClick={() => toggleLanguage('fa')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        lang === 'fa' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      فارسی (RTL)
                    </button>
                  </div>
                </div>

                {/* Preset Switcher */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>{t('presets')}:</span>
                  </label>

                  <div className="grid grid-cols-1 gap-2.5">
                    {RESTAURANT_PRESETS.map(preset => {
                      const isSelected = currentPreset.id === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => changePreset(preset.id)}
                          className={`p-3 rounded-2xl border text-left rtl:text-right transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-amber-500/20 border-amber-500 font-bold' 
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{preset.name}</div>
                            <div className="text-[10px] text-slate-400">{preset.type}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Inputs */}
                <div className="space-y-4 pt-3 border-t border-slate-800">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t('clientName')}:</label>
                    <input 
                      type="text" 
                      value={branding.name}
                      onChange={(e) => updateBranding({ name: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 font-bold bg-slate-950 text-white border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t('tagline')}:</label>
                    <textarea 
                      rows={2}
                      value={branding.tagline}
                      onChange={(e) => updateBranding({ tagline: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 bg-slate-950 text-white border-slate-800"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-6 text-center py-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm">{t('qrGenerator')}</h4>
                  <p className="text-xs text-slate-400">
                    Demonstrate how printed table QR code stands work for instant dine-in guest ordering.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <label className="text-xs">Table Number:</label>
                  <input 
                    type="text" 
                    value={tableQrNum}
                    onChange={(e) => setTableQrNum(e.target.value)}
                    className="w-16 bg-slate-950 border border-amber-500/40 rounded-xl p-2 text-center text-amber-400 font-bold text-sm focus:outline-none"
                  />
                </div>

                {/* QR Table Standup Card */}
                <div className="max-w-xs mx-auto bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 p-1 rounded-3xl shadow-2xl">
                  <div className="bg-slate-950 rounded-[22px] p-6 space-y-4 text-center">
                    <div className="font-black text-amber-400 text-lg font-serif">{branding.name}</div>
                    <div className="text-xs text-slate-300">Scan for Digital Menu & Table Ordering</div>
                    
                    <div className="p-4 bg-white rounded-2xl shadow-inner inline-block">
                      <QrCode className="w-36 h-36 text-slate-950" />
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-bold text-amber-300">
                      Table #{tableQrNum}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
            {t('copyright')}
          </div>

        </div>
      </div>
    </div>
  );
}
