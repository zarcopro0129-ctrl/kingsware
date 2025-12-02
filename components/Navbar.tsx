
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-2xl' : 'py-6 bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        <div className="flex flex-col group cursor-pointer">
            <span className="text-white font-bold text-xl tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all duration-500 drop-shadow-sm">Kingsware</span>
            <span className="text-[10px] text-neutral-400 tracking-widest uppercase hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">Fisher & Paykel • De Dietrich</span>
        </div>
        
        <div className="hidden md:flex gap-12 text-xs font-bold tracking-widest uppercase text-white/80">
            <button className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">產品系列</button>
            <button className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">預約展廳</button>
            <button className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">尊榮服務</button>
        </div>

        <button className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
