import React, { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity } from 'framer-motion';

export const NoiseOverlay: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

export const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference hidden lg:block backdrop-blur-sm"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

export const VelocityScrollWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewY = useTransform(smoothVelocity, [-1000, 1000], [1, -1]); // Subtle skew

  return (
    <motion.div style={{ skewY }}>
      {children}
    </motion.div>
  );
};