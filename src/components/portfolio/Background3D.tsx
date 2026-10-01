import { useEffect, useRef } from 'react';

/**
 * Premium animated background with aurora gradients, floating geometric shapes,
 * particle dot grid, and mouse-parallax. Pure CSS — no WebGL needed.
 */
export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => { window.removeEventListener('mousemove', handleMouse); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: 'rgb(var(--color-bg))' }}
    >
      {/* Aurora gradient layers */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full blur-[120px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          transform: 'translate(var(--mx, 0), var(--my, 0))',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[65%] rounded-full blur-[120px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          transform: 'translate(calc(var(--mx, 0) * -0.8), calc(var(--my, 0) * -0.8))',
          animationDelay: '1.5s',
        }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[35%] h-[40%] rounded-full blur-[100px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          transform: 'translate(calc(var(--mx, 0) * 0.5), calc(var(--my, 0) * 0.5))',
          animationDelay: '2.5s',
        }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dots opacity-50 mask-fade-b" />

      {/* Fine grid lines */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Floating geometric shapes with parallax */}
      <div className="absolute top-[15%] right-[12%] animate-float" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-20 h-20 border border-brand-400/15 rounded-3xl rotate-12 preserve-3d" />
      </div>
      <div className="absolute top-[55%] left-[8%] animate-float-slow" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-14 h-14 border border-accent-400/15 rounded-full preserve-3d" />
      </div>
      <div className="absolute top-[35%] right-[42%] animate-float-delayed" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-12 h-12 border border-brand-300/15 preserve-3d" style={{ transform: 'rotate(45deg)' }} />
      </div>
      <div className="absolute bottom-[25%] right-[18%] animate-float" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-16 h-16 border border-accent-300/15 rounded-xl rotate-12 preserve-3d" />
      </div>
      <div className="absolute top-[75%] left-[35%] animate-float-slow" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-8 h-8 border border-purple-400/10 rounded-full preserve-3d" />
      </div>
      <div className="absolute top-[10%] left-[40%] animate-float-delayed" style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}>
        <div className="w-10 h-10 border border-brand-400/10 preserve-3d" style={{ transform: 'rotate(30deg)' }} />
      </div>

      {/* Subtle top vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center top, transparent 0%, rgb(var(--color-bg) / 0.4) 80%)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, rgb(var(--color-bg) / 0.8))' }}
      />
    </div>
  );
}
