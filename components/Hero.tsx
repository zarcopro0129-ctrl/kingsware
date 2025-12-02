import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  const scaleText = useTransform(scrollY, [0, 500], [1, 1.2]);
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Brand buttons fade out on scroll
  const opacityNav = useTransform(scrollY, [0, 100], [1, 0]);
  const yNav = useTransform(scrollY, [0, 100], [0, -20]);

  const [activeBrand, setActiveBrand] = useState<'fp' | 'dd'>('fp');

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
            key={activeBrand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className={`absolute inset-0 z-0 ${
                activeBrand === 'fp' 
                ? 'bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]' 
                : 'bg-[radial-gradient(circle_at_center,#222_0%,#000000_100%)]'
            }`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      {/* Brand Selector - Top */}
      <motion.div 
        className="fixed top-12 z-50 pointer-events-auto"
        style={{ opacity: opacityNav, y: yNav }}
      >
        <div className="flex gap-1 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button 
                onClick={() => setActiveBrand('fp')}
                className={`relative px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden ${activeBrand === 'fp' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
                Fisher & Paykel
            </button>
            <button 
                onClick={() => setActiveBrand('dd')}
                className={`relative px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden ${activeBrand === 'dd' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
                De Dietrich
            </button>
        </div>
      </motion.div>

      {/* Hero Text */}
      <motion.div 
        className="z-10 text-center relative mix-blend-difference"
        style={{ scale: scaleText, y: yText, opacity: opacityText }}
      >
        <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 select-none">
          KINGSWARE
        </h1>
        <div className="h-px w-24 bg-white/50 mx-auto my-8" />
        <p className="text-sm md:text-xl tracking-[0.8em] uppercase text-neutral-300 font-light pl-4">
          溫度與設計的極致掌控
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;