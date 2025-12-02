import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Sparkles, Waves, Droplets, Snowflake, ArrowUpRight, Calendar, Scan, Activity, ChevronRight } from 'lucide-react';
import Hero from './components/Hero';
import DustBackground from './components/DustBackground';
import { NoiseOverlay, CustomCursor, VelocityScrollWrapper } from './components/VisualEffects';

// --- Sub-Components (Inline for cohesion) ---

const GlassCard = ({ children, className = "", noPadding = false }: { children: React.ReactNode; className?: string, noPadding?: boolean }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] ${className} ${noPadding ? '' : 'p-8'}`}
  >
    {/* Specular Highlight */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

const FridgeControl = () => {
    const presets = [
        { temp: -25, label: '深度冷凍', code: 'DP-FRZ' },
        { temp: -18, label: '冷凍', code: 'FREEZE' },
        { temp: 0, label: '微冷凍', code: 'S-CHILL' },
        { temp: 3, label: '冷藏', code: 'FRIDGE' },
        { temp: 12, label: '蔬果', code: 'FRESH' },
        { temp: 15, label: '酒類', code: 'WINE' },
    ];
    const [presetIndex, setPresetIndex] = useState(3);
    const [status, setStatus] = useState<'off' | 'booting' | 'scanning' | 'on'>('on');

    const current = presets[presetIndex];
    const isWarm = current.temp > 0;
    
    // Aesthetic Logic
    const themeColor = isWarm ? '#fb923c' : '#38bdf8'; // Orange vs Sky Blue
    
    const handlePower = () => {
        if (status === 'off') {
            setStatus('booting');
            setTimeout(() => setStatus('scanning'), 800);
            setTimeout(() => setStatus('on'), 2000);
        } else {
            setStatus('off');
        }
    };

    const handleStep = (dir: number) => {
        if (status !== 'on') return;
        setPresetIndex(prev => Math.min(Math.max(prev + dir, 0), presets.length - 1));
    };

    return (
        <div className="h-full flex flex-col justify-between relative z-10 select-none">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Activity className={`w-3 h-3 ${status === 'on' ? 'text-green-400' : 'text-neutral-600'}`} />
                        <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase">VTZ SYSTEM</h3>
                    </div>
                    <p className="text-[9px] text-neutral-500 font-mono mt-1">PATENT NO. 884-X2</p>
                </div>
                <button 
                    onClick={handlePower}
                    className={`group relative p-3 rounded-full transition-all duration-500 ${status !== 'off' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-neutral-500 hover:bg-white/10'}`}
                >
                    <Power className="w-4 h-4 relative z-10" />
                    {status !== 'off' && <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />}
                </button>
            </div>

            {/* Main Interface */}
            <div className="flex-1 flex items-center justify-center relative my-2">
                {/* Background Tech Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <motion.div 
                        animate={{ rotate: status === 'on' ? 360 : 0 }} 
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-56 h-56 border border-dashed border-white/30 rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: status === 'on' ? -360 : 0 }} 
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 border-[0.5px] border-white/20 rounded-full"
                    />
                </div>

                <div className="relative w-48 h-48 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {status === 'off' && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="text-neutral-700 font-mono text-xs tracking-widest"
                            >
                                SYSTEM STANDBY
                            </motion.div>
                        )}
                        
                        {status === 'booting' && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin" />
                                <span className="absolute mt-24 text-[10px] text-white font-mono animate-pulse">INITIALIZING...</span>
                            </motion.div>
                        )}

                        {status === 'scanning' && (
                            <motion.div className="absolute inset-0 flex items-center justify-center">
                                <Scan className="w-24 h-24 text-white/50 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] animate-[scan_1.5s_ease-in-out_infinite]" />
                            </motion.div>
                        )}

                        {status === 'on' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10 text-center"
                            >
                                {/* Digital Ring Overlay */}
                                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 -rotate-90 pointer-events-none">
                                    <circle cx="96" cy="96" r="88" stroke="white" strokeOpacity="0.1" strokeWidth="1" fill="none" />
                                    <motion.circle 
                                        cx="96" cy="96" r="88" 
                                        stroke={themeColor} 
                                        strokeWidth="2" 
                                        fill="none" 
                                        strokeDasharray={553}
                                        strokeDashoffset={553 - ((presetIndex + 1) / presets.length) * 553}
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 553 }}
                                        animate={{ strokeDashoffset: 553 - ((presetIndex + 1) / presets.length) * 553 }}
                                        transition={{ type: "spring", stiffness: 60 }}
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    />
                                </svg>

                                <motion.div 
                                    key={current.temp}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ type: "spring" }}
                                >
                                    <div className="flex items-start justify-center">
                                        <span className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                            {current.temp > 0 ? '+' : ''}{current.temp}
                                        </span>
                                        <span className="text-xl mt-2 font-light text-neutral-400">°C</span>
                                    </div>
                                    <div className="mt-2 flex flex-col items-center gap-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 border border-white/10 text-white tracking-wider uppercase">
                                            {current.code}
                                        </span>
                                        <span style={{ color: themeColor }} className="text-sm font-bold tracking-[0.2em] uppercase drop-shadow-lg">
                                            {current.label}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/5">
                <button 
                    onClick={() => handleStep(-1)} 
                    disabled={status !== 'on' || presetIndex === 0} 
                    className="py-4 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                    <span className="text-2xl font-light group-hover:scale-125 transition-transform">-</span>
                </button>
                <button 
                    onClick={() => handleStep(1)} 
                    disabled={status !== 'on' || presetIndex === presets.length - 1} 
                    className="py-4 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                    <span className="text-2xl font-light group-hover:scale-125 transition-transform">+</span>
                </button>
            </div>
        </div>
    );
};

const WashCycleSelector = () => {
    const cycles = [
        { name: '自動洗', icon: Sparkles, time: '智慧感測', desc: 'Auto Sense' },
        { name: '強力洗', icon: Waves, time: '131 min', desc: 'Intensive' },
        { name: '快洗', icon: Droplets, time: '33 min', desc: 'Express' },
    ];
    const [active, setActive] = useState(0);

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">DishDrawer™</h3>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">洗程選擇模式</p>
                </div>
                <div className="px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-300">
                    SERIES 9
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cycles.map((c, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActive(idx)}
                        className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${active === idx ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400'}`}
                    >
                        <c.icon className={`w-6 h-6 mb-3 ${active === idx ? 'text-black' : 'text-neutral-500'}`} />
                        <span className="text-sm font-bold">{c.name}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-60 mt-1">{c.desc}</span>
                        
                        {active === idx && (
                            <motion.div layoutId="washActive" className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-neutral-400 uppercase tracking-widest">預估時間</span>
                </div>
                <span className="text-3xl font-light text-white font-mono tracking-tight">{cycles[active].time}</span>
            </div>
        </div>
    )
};

const ProductShowcase = () => {
    const products = [
        { name: "專業級烤箱", en: "Professional Oven", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80", url: "https://kingsware.com.tw/p/412-1148-3161.php" },
        { name: "嵌入式冰箱", en: "Integrated Column", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80", url: "https://kingsware.com.tw/p/412-1148-3087.php" },
        { name: "抽屜洗碗機", en: "DishDrawer™", img: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80", url: "https://kingsware.com.tw/p/412-1148-3086.php" },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">精選系列 Collection</h3>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">2025 Edition</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p, i) => (
                    <a 
                        key={i} 
                        href={p.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="relative group block rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
                    >
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                        <img 
                            src={p.img} 
                            alt={p.name} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out grayscale group-hover:grayscale-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                        
                        <div className="absolute bottom-0 left-0 p-5 w-full">
                            <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{p.en}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-white tracking-wide">{p.name}</p>
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                    <ArrowUpRight className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const NewProductFeature = () => {
    return (
        <a href="https://kingsware.com.tw/p/412-1148-3087.php" target="_blank" rel="noreferrer" className="block h-full relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626245672228-22a013c751a0?w=1200&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-700" />
            
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Snowflake className="w-5 h-5 text-blue-200" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">New Arrival</span>
                </div>

                <div className="max-w-md">
                    <h3 className="text-4xl font-bold text-white mb-4 leading-none tracking-tight">新品上市<br/><span className="text-2xl font-light opacity-70">極致冷藏工藝</span></h3>
                    <p className="text-sm text-neutral-300 opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed border-l-2 border-blue-500 pl-4">
                        探索 Fisher & Paykel 全新嵌入式冷藏系列，完美融入您的奢華廚房設計。
                    </p>
                    <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white group/btn">
                        <span className="pb-1 border-b border-white/30 group-hover/btn:border-white transition-colors">了解更多</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </a>
    );
};

const BookingForm = () => {
    return (
        <div className="h-full flex flex-col justify-between items-center text-center relative overflow-hidden group">
             {/* Background Image */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
             <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500" />

             {/* Decor */}
             <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <div className="w-20 h-20 border border-dashed border-white rounded-full animate-[spin_10s_linear_infinite]" />
             </div>

            <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-full mb-2 mt-4 ring-1 ring-white/20">
                <Calendar className="w-6 h-6 text-white" />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">預約展廳</h3>
                <p className="text-[10px] text-neutral-300 uppercase tracking-widest">Book a Visit</p>
            </div>
            
            <a 
                href="https://service-747736031914.us-west1.run.app"
                target="_blank"
                rel="noreferrer"
                className="relative z-10 w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group/btn"
            >
                立即預約
                <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
        </div>
    );
};

// --- Main App ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white cursor-default">
        <NoiseOverlay />
        <CustomCursor />
        <DustBackground />

        <Hero />

        <VelocityScrollWrapper>
            <main className="max-w-[1400px] mx-auto px-6 py-24 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min"
                >
                    {/* Bento Grid Layout - Updated Order */}
                    
                    {/* 1. Collection (Top - Span 2) */}
                    <GlassCard className="col-span-1 md:col-span-2 min-h-[400px]">
                        <ProductShowcase />
                    </GlassCard>

                    {/* 2. New Product (Top - Span 2) */}
                    <GlassCard className="col-span-1 md:col-span-2 min-h-[400px]" noPadding>
                        <NewProductFeature />
                    </GlassCard>

                    {/* 3. Booking (Row 2 - Span 1) */}
                    <GlassCard className="col-span-1 min-h-[350px]" noPadding>
                        <BookingForm />
                    </GlassCard>

                    {/* 4. Dishwasher (Row 2 - Span 2) */}
                    <GlassCard className="col-span-1 md:col-span-2 min-h-[350px]">
                        <WashCycleSelector />
                    </GlassCard>

                    {/* 5. VTZ Control (Row 2 - Span 1) */}
                    <GlassCard className="col-span-1 min-h-[350px]">
                        <FridgeControl />
                    </GlassCard>

                </motion.div>

                <div className="mt-24 text-center opacity-30">
                    <p className="text-[10px] uppercase tracking-[0.8em]">Designed for Kingsware</p>
                </div>
            </main>
        </VelocityScrollWrapper>
    </div>
  );
};

export default App;