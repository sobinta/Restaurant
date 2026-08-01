import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  RotateCcw, 
  Maximize2, 
  Compass, 
  CheckCircle2, 
  Users, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';

export default function Panorama360Viewer() {
  const { selectedTableFor360, close360View, setIsReservationOpen, setSelectedTableForBooking } = useApp();
  
  const [rotationX, setRotationX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Auto-rotate effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationX(prev => (prev + 0.2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  if (!selectedTableFor360) return null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    setRotationX(prev => (prev - deltaX * 0.4) % 360);
    startXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSelectTableAndBook = () => {
    setSelectedTableForBooking(selectedTableFor360);
    close360View();
    setIsReservationOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Bar */}
        <div className="z-20 bg-slate-950/80 backdrop-blur-md p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base sm:text-lg">
                  {selectedTableFor360.view360Title || `دید ۳۶۰ درجه صندلی ${selectedTableFor360.name}`}
                </h3>
                {selectedTableFor360.isVip && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    VIP ویژه
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-light">
                ماوس را بکشید یا لمس کنید تا زاویه دید ۳۶۰ درجه صندلی را تغییر دهید
              </p>
            </div>
          </div>

          <button
            onClick={close360View}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive 360 Panorama Viewport */}
        <div 
          className="relative flex-1 bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            setIsDragging(true);
            setIsAutoRotating(false);
            startXRef.current = e.touches[0].clientX;
          }}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const deltaX = e.touches[0].clientX - startXRef.current;
            setRotationX(prev => (prev - deltaX * 0.4) % 360);
            startXRef.current = e.touches[0].clientX;
          }}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Panoramic Image Shift simulation */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75"
            style={{
              backgroundImage: `url(${selectedTableFor360.view360Image || selectedTableFor360.image})`,
              backgroundPosition: `${rotationX}% center`,
              filter: 'brightness(0.9) contrast(1.05)'
            }}
          />

          {/* Vignette Overlay & Perspective Grid */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

          {/* Compass Angle Badge */}
          <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-2 pointer-events-none">
            <Compass className="w-4 h-4" />
            <span>زاویه دید: {Math.round(rotationX)}°</span>
          </div>

          {/* Auto Rotate Control */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md border ${
                isAutoRotating 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-950/80 text-slate-400 border-slate-700'
              }`}
            >
              {isAutoRotating ? '↺ گردش خودکار فعال' : '▷ توقف گردش'}
            </button>
          </div>

          {/* Center 360 Hint Overlay (Fades out after drag) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-950/60 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-white text-xs font-bold flex items-center gap-3 animate-pulse">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>برای چرخش کامل ۳۶۰ درجه کشیده و بچرخانید</span>
            </div>
          </div>

        </div>

        {/* Bottom Control & Booking Bar */}
        <div className="z-20 bg-slate-950/90 backdrop-blur-md p-4 px-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Users className="w-4 h-4 text-amber-400" />
              <span>ظرفیت: {selectedTableFor360.capacity} نفر</span>
            </div>
            <div className="border-r border-slate-800 pr-4">
              <span className="text-slate-400">موقعیت: </span>
              <span className="text-amber-400 font-semibold">{selectedTableFor360.description}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={close360View}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              انصراف
            </button>
            
            <button
              onClick={handleSelectTableAndBook}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>رزرو همین میز ({selectedTableFor360.name})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
