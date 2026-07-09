import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ShoppingBag, Search, Heart, X, ChevronLeft,
  Star, Plus, Minus, Check, ArrowRight, Menu, Footprints,
  Shirt, Glasses, Truck, ShieldCheck, RotateCcw, CreditCard
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
const C = {
  bg:         "#ECEAE5",
  bgSoft:     "#F4F1EC",
  ink:        "#3E1A0B",
  inkSoft:    "#6B3A22",
  maroon:     "#4A1B0C",
  maroonDeep: "#2E0F05",
  line:       "rgba(62,26,11,0.12)",
};

const ACCENT_BAR  = "linear-gradient(90deg, #15c2c9 0%, #7c6cf0 50%, #b25cf0 100%)";
const FONT_BODY   = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_ACCENT = "'Playfair Display', serif";

function GlobalFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');
      @keyframes rackHang  { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
      @keyframes hintPulse { 0%, 100% { opacity: 0.5; transform: translateY(0); } 50% { opacity: 1; transform: translateY(4px); } }
    `}</style>
  );
}

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const CATEGORY_META = {
  shoes:       { label: "Shoes",       icon: Footprints, hue: 18  },
  apparel:     { label: "Apparel",     icon: Shirt,      hue: 265 },
  accessories: { label: "Accessories", icon: Glasses,    hue: 200 },
};

const PRODUCTS = [
  { id: 1,  category: "shoes",       name: "Vantage Runner",     price: 189, hue: 18,  desc: "Engineered knit upper with a responsive foam midsole built for all-day motion.",           sizes: ["7","8","9","10","11","12"], rating: 4.8, reviews: 214 },
  { id: 2,  category: "shoes",       name: "Drift Low",          price: 159, hue: 28,  desc: "A low-profile silhouette in premium nubuck, finished with a vulcanized rubber sole.",       sizes: ["7","8","9","10","11","12"], rating: 4.6, reviews: 132 },
  { id: 3,  category: "shoes",       name: "Apex Trail",         price: 215, hue: 10,  desc: "All-terrain grip and waterproof construction for the unpredictable.",                      sizes: ["7","8","9","10","11","12"], rating: 4.9, reviews: 301 },
  { id: 4,  category: "shoes",       name: "Sol Slide",          price: 95,  hue: 35,  desc: "Molded comfort sandal with a contoured footbed for recovery days.",                        sizes: ["S","M","L","XL"],           rating: 4.4, reviews: 88  },
  { id: 5,  category: "apparel",     name: "Form Hoodie",        price: 110, hue: 265, desc: "Brushed-back fleece in a relaxed cut, cut from heavyweight cotton.",                       sizes: ["S","M","L","XL"],           rating: 4.7, reviews: 176 },
  { id: 6,  category: "apparel",     name: "Motion Tee",         price: 48,  hue: 280, desc: "A second-skin performance tee with four-way stretch and breathable mesh panels.",          sizes: ["S","M","L","XL"],           rating: 4.5, reviews: 245 },
  { id: 7,  category: "apparel",     name: "Glacier Shell",      price: 240, hue: 250, desc: "Lightweight, packable shell with a fully taped seam construction.",                       sizes: ["S","M","L","XL"],           rating: 4.8, reviews: 97  },
  { id: 8,  category: "apparel",     name: "Studio Joggers",     price: 88,  hue: 290, desc: "Tapered fit joggers in a soft French terry for transitional weather.",                     sizes: ["S","M","L","XL"],           rating: 4.6, reviews: 154 },
  { id: 9,  category: "accessories", name: "Pulse Watch",        price: 320, hue: 200, desc: "Titanium case with a sapphire face and a 14-day battery cycle.",                          sizes: ["One Size"],                 rating: 4.9, reviews: 68  },
  { id: 10, category: "accessories", name: "Carry Tote",         price: 145, hue: 210, desc: "Full-grain leather tote with a structured base and brass hardware.",                      sizes: ["One Size"],                 rating: 4.7, reviews: 112 },
  { id: 11, category: "accessories", name: "Aero Cap",           price: 38,  hue: 190, desc: "Lightweight six-panel cap with a moisture-wicking sweatband.",                            sizes: ["One Size"],                 rating: 4.3, reviews: 59  },
  { id: 12, category: "accessories", name: "Halo Sunglasses",    price: 165, hue: 220, desc: "Polarized lenses set in a hand-finished acetate frame.",                                  sizes: ["One Size"],                 rating: 4.8, reviews: 84  },
];

const fmt = (n) => `$${n.toFixed(2)}`;

/* ══════════════════════════════════════════════════════════
   PRODUCT VISUAL
══════════════════════════════════════════════════════════ */
function ProductVisual({ hue, category, size = "normal" }) {
  const Icon = CATEGORY_META[category]?.icon ?? ShoppingBag;
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: `radial-gradient(circle at 30% 20%, hsl(${hue} 90% 80%) 0%, hsl(${hue} 70% 58%) 35%, hsl(${hue + 20} 55% 24%) 100%)`,
      }}
    >
      <div className="absolute rounded-full blur-3xl opacity-60" style={{ width: "60%", height: "60%", background: `hsl(${hue + 40} 90% 72%)`, top: "-10%", left: "-10%" }} />
      <div className="absolute rounded-full blur-3xl opacity-40" style={{ width: "50%", height: "50%", background: `hsl(${hue - 30} 85% 62%)`, bottom: "-15%", right: "-10%" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
      <Icon
        className="relative z-10 drop-shadow-2xl"
        style={{ color: "rgba(255,255,255,0.92)" }}
        size={size === "hero" ? 64 : size === "large" ? 96 : 44}
        strokeWidth={1.25}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCENES  (single scene — cloth pile reveal)
══════════════════════════════════════════════════════════ */
const SCENES = [
  {
    tag:   "CHAPTER ONE — THE START LINE",
    lines: ["Built for", "Motion."],
    sub:   "The Only Interactive Motion Website You Need",
  },
];

/* ══════════════════════════════════════════════════════════
   CLOUDINARY FRAME-SEQUENCE CONFIG
   ──────────────────────────────────────────────────────
   Two separate videos: 9:16 portrait for mobile,
   16:9 landscape for desktop — correct aspect ratio
   served to each device, no wasted pixels.

   120 frames over 3 s = 40 fps equivalent.
   isMobile captured ONCE per load session —
   not called 120× inside the loop.
══════════════════════════════════════════════════════════ */
const CLOUDINARY_BASE = "https://res.cloudinary.com/leu4dssl/video/upload";
const MOBILE_ID       = "v1782988492/lv_0_20260702132747_dz3imr";
const DESKTOP_ID      = "v1782990615/lv_0_20260702160728_bxppy7";
const VIDEO_DURATION  = 3;
const FRAME_COUNT     = 120; // ↑ from 90 — noticeably smoother inter-frame blend

// Build frame URL — mobile flag passed in, not re-computed every call
const FRAME_PATH = (n, mobile) => {
  const t  = ((n / (FRAME_COUNT - 1)) * VIDEO_DURATION).toFixed(3);
  const id = mobile ? MOBILE_ID : DESKTOP_ID;
  const tr = mobile
    ? "w_1080,h_1920,c_fill,g_center,e_brightness:8,q_auto:best"
    : "w_1920,h_1080,c_fill,g_center,e_brightness:8,q_auto:best";
  return `${CLOUDINARY_BASE}/${tr}/so_${t}/${id}.jpg`;
};

// Preload all frames — captures mobile flag ONCE, 12 s safety fallback
function preloadFrames(onProgress) {
  const mobile = window.innerWidth < 768; // captured once for this load session

  return new Promise((resolve) => {
    const images   = new Array(FRAME_COUNT);
    let   loaded   = 0;
    let   resolved = false;

    // Safety net: if network is slow or frames fail, dismiss loader after 12 s
    const fallback = setTimeout(() => {
      if (!resolved) { resolved = true; resolve(images); }
    }, 12000);

    const done = (i, img) => {
      images[i] = img;
      loaded++;
      onProgress(loaded / FRAME_COUNT);
      if (loaded === FRAME_COUNT && !resolved) {
        resolved = true;
        clearTimeout(fallback);
        resolve(images);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload  = () => done(i, img);
      img.onerror = () => done(i, null); // skip gracefully, don't block
      img.src     = FRAME_PATH(i, mobile);
    }
  });
}

// object-fit: cover — image drawn at natural cover scale.
// Canvas clipped to top 88% to hide Kling AI watermark without scaling.
function drawImageCover(ctx, img, W, H) {
  if (!img || !img.naturalWidth) return;
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dx    = (W - img.naturalWidth  * scale) / 2;
  // -8% nudges image up so it fills from the top
  const dy    = (H - img.naturalHeight * scale) / 2 - H * 0.08;
  // Clip: only paint the top 88% of the canvas, cutting the watermark strip
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, Math.round(H * 1.0));
  ctx.clip();
  ctx.drawImage(img, dx, dy, img.naturalWidth * scale, img.naturalHeight * scale);
  ctx.restore();
}

/* ══════════════════════════════════════════════════════════
   CINEMATIC HERO
   ──────────────────────────────────────────────────────
   Scroll timeline (0 → 1):
     0.00 → 1.00  video scrubs frame-by-frame (300 vh)
     0.80 → 0.88  "Built for Motion." fades in over pile
     0.88 → 1.00  text + CTAs stay permanently visible

   Canvas NEVER fades — last frame (cloth pile) holds
   as the permanent visual after scrolling ends.

   Bugs fixed vs previous version:
   ✓ ctx.setTransform(dpr,0,0,dpr,0,0) called EVERY tick
   ✓ isMobile captured once, not per-frame
   ✓ 12 s fallback timeout on loading overlay
   ✓ Dead code removed: MovingFigure, poses, lerp,
     figGroupRef, figWrapRef, dotsRef, hintRef,
     figure DOM mutations, storeSweep keyframe
   ✓ zIndex: 1 inline (not invalid Tailwind z-1)
   ✓ canvas.getContext("2d") cached per tick, not called 2×
   ✓ 120 frames (was 90)
   ✓ 300 vh scroll height (was 180 vh)
   ✓ Scroll hint with pulse animation
══════════════════════════════════════════════════════════ */

// Scroll thresholds
const VIDEO_END    = 1.00; // video scrubs full 100% of scroll
const TEXT_START   = 0.90; // text begins fading in when video nearly done
const TEXT_END     = 1.00; // text fully opaque at very end of scroll

function CinematicHero({ onNav }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const textWrapRef  = useRef(null); // single scene — no array needed
  const loadBarRef   = useRef(null);
  const loadWrapRef  = useRef(null);
  const hintRef      = useRef(null);

  const progressRef  = useRef(0);
  const framesRef    = useRef([]);
  const rafRef       = useRef(null);

  // ── Load frames on mount, reload if orientation crosses 768 px ──
  useEffect(() => {
    let cancelled = false;

    const load = () => {
      framesRef.current = [];
      if (loadWrapRef.current) loadWrapRef.current.style.display = "flex";
      if (loadBarRef.current)  loadBarRef.current.style.width    = "0%";

      preloadFrames((pct) => {
        if (cancelled) return;
        if (loadBarRef.current) loadBarRef.current.style.width = `${pct * 100}%`;
        if (pct >= 1 && loadWrapRef.current) loadWrapRef.current.style.display = "none";
      }).then((images) => {
        if (cancelled) return;
        framesRef.current = images;
        if (loadWrapRef.current) loadWrapRef.current.style.display = "none";
      });
    };

    load();

    // Reload frames when crossing the mobile/desktop breakpoint
    let lastMobile = window.innerWidth < 768;
    const onResize = () => {
      const nowMobile = window.innerWidth < 768;
      if (nowMobile !== lastMobile) { lastMobile = nowMobile; load(); }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelled = true; window.removeEventListener("resize", onResize); };
  }, []);

  // ── rAF render loop ──────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const p      = progressRef.current;
      const canvas = canvasRef.current;
      const frames = framesRef.current;

      // ── 1. Canvas: draw correct frame ──────────────────────────
      if (canvas && frames.length > 0) {
        // FIX: cap DPR at 2.5 (3× on some phones → wasteful, no visible gain)
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        const W   = canvas.clientWidth;
        const H   = canvas.clientHeight;
        const pw  = Math.round(W * dpr);
        const ph  = Math.round(H * dpr);

        if (canvas.width !== pw || canvas.height !== ph) {
          canvas.width  = pw;
          canvas.height = ph;
        }

        // FIX: ctx.setTransform every tick — not just on resize.
        // Previously ctx.scale() was only called when dimensions changed,
        // so subsequent frames drew at the wrong logical coordinates.
        const ctx = canvas.getContext("2d"); // cached by browser, no perf cost
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Sub-frame blending: interpolate between adjacent frames
        // for completely continuous motion (no integer-step jumps)
        const videoP  = Math.min(1, p / VIDEO_END);
        const rawPos  = videoP * (FRAME_COUNT - 1);
        const loIdx   = Math.floor(rawPos);
        const hiIdx   = Math.min(FRAME_COUNT - 1, loIdx + 1);
        const blend   = rawPos - loIdx; // 0.0 → 1.0

        if (frames[loIdx]?.naturalWidth) {
          ctx.globalAlpha = 1;
          drawImageCover(ctx, frames[loIdx], W, H);
        }
        if (hiIdx !== loIdx && frames[hiIdx]?.naturalWidth && blend > 0.001) {
          ctx.globalAlpha = blend;
          drawImageCover(ctx, frames[hiIdx], W, H);
          ctx.globalAlpha = 1;
        }
        // Canvas stays at opacity 1 — last frame holds permanently
      }

      // ── 2. Text: fade in at 2.4 s (80% scroll), lock at 88% ───
      const textVisible = Math.min(1, Math.max(0, (p - TEXT_START) / (TEXT_END - TEXT_START)));
      const tShift      = (1 - textVisible) * 20;

      if (textWrapRef.current) {
        textWrapRef.current.style.opacity   = textVisible.toFixed(4);
        textWrapRef.current.style.transform = `translateY(${tShift.toFixed(2)}px)`;
      }

      // ── 3. Scroll hint: visible until text appears ───────────────
      if (hintRef.current) {
        hintRef.current.style.opacity = Math.max(0, 1 - textVisible * 3).toFixed(3);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Passive scroll listener ──────────────────────────────────────
  useEffect(() => {
    // Container is 300vh. Subtract navbar height (64px) so animation
    // starts the moment the first pixel scrolls, not after navbar scrolls past.
    const NAV_H   = 64;
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight - NAV_H;
      progressRef.current = Math.min(1, Math.max(0, (window.scrollY) / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "220vh", position: "relative" }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: "100vh", fontFamily: FONT_BODY }}>

        <canvas ref={canvasRef} className="absolute inset-0 z-0"
          style={{ width: "100%", height: "100%", imageRendering: "auto" }} />

        {/* Bottom fade — starts above clothes base, covers Kling AI logo */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 2, height: "30%", background: `linear-gradient(to bottom, transparent 0%, ${C.bg} 75%)` }} />

        {/* Loading overlay */}
        <div ref={loadWrapRef} className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(0,0,0,0.88)" }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading</p>
          <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div ref={loadBarRef} style={{ height: "100%", width: "0%", background: "#5C3D2A", borderRadius: 2, transition: "width 0.08s linear" }} />
          </div>
        </div>

        {/* Text — shifted down slightly so it sits over the cloth pile */}
        <div className="relative h-full flex items-center justify-center" style={{ zIndex: 10, transform: "translateY(-5%)" }}>
          <div className="w-full max-w-2xl mx-auto text-center px-6">
            <div ref={textWrapRef} style={{ opacity: 0, willChange: "opacity, transform" }}>
              <h1 className="text-4xl sm:text-6xl font-black leading-[0.85] mx-auto" style={{ color: "#6B3A22" }}>
                {SCENES[0].lines.map((line, i) => {
                  const isAccent = line === "Motion.";
                  return (
                    <span key={i} className="block"
                      style={isAccent ? { fontFamily: FONT_ACCENT, fontStyle: "italic", fontWeight: 500, color: "#C8A882" } : undefined}>
                      {line}
                    </span>
                  );
                })}
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xs sm:text-sm font-medium" style={{ color: "#3D2E24" }}>
                {SCENES[0].sub}
              </p>
              <div className="mt-4 flex flex-row items-center justify-center gap-3">
                <button onClick={() => onNav("category", "shoes")}
                  className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "#3D2E24",
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
                    color: "#C8A882"
                  }}>
                  Order Now <ArrowRight size={16} />
                </button>
                <button onClick={() => onNav("category", "apparel")}
                  className="px-5 py-2.5 rounded-full text-sm font-medium border"
                  style={{ borderColor: "#3D2E24", color: "#3D2E24" }}>
                  Explore Apparel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5" style={{ zIndex: 10, opacity: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: C.inkSoft, textTransform: "uppercase", animation: "hintPulse 2s ease-in-out infinite" }}>Scroll slowly</span>
          <svg width="16" height="10" viewBox="0 0 16 10" style={{ animation: "hintPulse 2s ease-in-out infinite", color: C.inkSoft }}>
            <path d="M1 1l7 7 7-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TILT CARD
══════════════════════════════════════════════════════════ */
function TiltCard({ product, onOpen, isWishlisted, onToggleWish }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px   = (e.clientX - rect.left) / rect.width;
    const py   = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 10, glowX: px * 100, glowY: py * 100 });
  };
  const reset = () => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => onOpen(product.id)}
      className="group relative cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden transition-transform duration-200 ease-out shadow-lg"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, boxShadow: "0 12px 30px rgba(62,26,11,0.18)" }}
      >
        <ProductVisual hue={product.hue} category={product.category} size="large" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,255,255,0.25), transparent 60%)` }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWish(product.id); }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors"
          style={{ background: "rgba(74,27,12,0.35)" }}
        >
          <Heart size={16} fill={isWishlisted ? "#fff" : "none"} className="text-white" />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: C.ink }}>{product.name}</p>
          <p className="text-xs capitalize" style={{ color: C.inkSoft, opacity: 0.7 }}>{product.category}</p>
        </div>
        <p className="text-sm font-semibold" style={{ color: C.ink }}>{fmt(product.price)}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════ */
function Navbar({ cartCount, onNav, onCart, searchOpen, setSearchOpen, query, setQuery }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40" style={{
      background: "#3D2E24",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
    }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="text-xl font-bold tracking-[0.2em]" style={{ color: "#C8A882" }}>MBZ</button>

        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(200,168,130,0.7)" }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => onNav("category", key)} className="hover:opacity-100 transition-opacity" style={{ color: "inherit" }}>{meta.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen((s) => !s)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ color: "#C8A882" }}><Search size={18} /></button>
          <button onClick={onCart} className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: "#15c2c9", color: C.maroonDeep }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMobileOpen((m) => !m)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t px-5 sm:px-8 py-3" style={{ borderColor: "rgba(200,168,130,0.15)", background: "#2A1F17" }}>
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Search size={16} style={{ color: "rgba(200,168,130,0.5)" }} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none text-sm w-full" style={{ color: "#C8A882" }} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t px-5 py-4 flex flex-col gap-3" style={{ borderColor: "rgba(200,168,130,0.15)", background: "#2A1F17" }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => { onNav("category", key); setMobileOpen(false); }} className="text-left text-sm" style={{ color: "rgba(200,168,130,0.85)" }}>{meta.label}</button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY ILLUSTRATIONS  —  bespoke SVG per category
══════════════════════════════════════════════════════════ */
function ShoesIllustration() {
  // A pair of sneakers — left shoe faces right, right shoe faces left (mirrored), side by side
  const Shoe = ({ x, flip }) => {
    const s = flip ? -1 : 1;
    const ox = flip ? x + 118 : x; // origin x for flip transform
    return (
      <g transform={`translate(${ox}, 0) scale(${s}, 1)`}>
        {/* Outsole */}
        <rect x="0" y="98" width="118" height="12" rx="3" fill="rgba(251,246,236,0.28)" />
        {[6,18,30,42,54,66,78,90,104].map(tx => (
          <rect key={tx} x={tx} y={104} width={7} height={3} rx="1" fill="rgba(46,15,5,0.30)" />
        ))}
        {/* Midsole */}
        <rect x="3" y="87" width="112" height="11" rx="2" fill="rgba(251,246,236,0.18)" />
        <rect x="3" y="91" width="112" height="3" fill="rgba(251,246,236,0.12)" />
        {/* Heel block */}
        <rect x="0" y="50" width="28" height="37" rx="2" fill="rgba(251,246,236,0.28)" />
        {/* Heel pull tab */}
        <rect x="8" y="42" width="12" height="12" rx="2" fill="rgba(251,246,236,0.22)" stroke="rgba(251,246,236,0.40)" strokeWidth="1.5" />
        {/* Ankle collar */}
        <rect x="26" y="54" width="18" height="18" rx="9" fill="rgba(46,15,5,0.50)" stroke="rgba(251,246,236,0.25)" strokeWidth="1.5" />
        {/* Main upper */}
        <rect x="28" y="50" width="80" height="37" rx="2" fill="rgba(251,246,236,0.18)" />
        {/* Toe cap */}
        <rect x="104" y="60" width="14" height="27" rx="2" fill="rgba(251,246,236,0.26)" />
        {/* Tongue */}
        <rect x="58" y="42" width="18" height="45" rx="2" fill="rgba(251,246,236,0.22)" />
        <rect x="61" y="50" width="12" height="8" rx="1" fill="rgba(251,246,236,0.15)" stroke="rgba(251,246,236,0.30)" strokeWidth="1" />
        {/* Lace panels */}
        <rect x="32" y="50" width="26" height="37" rx="1" fill="rgba(251,246,236,0.07)" />
        <rect x="76" y="50" width="28" height="37" rx="1" fill="rgba(251,246,236,0.07)" />
        {/* Eyelets & laces */}
        {[0,1,2,3].map(i => {
          const ly = 55 + i * 7;
          return (
            <React.Fragment key={i}>
              <circle cx="42" cy={ly} r="2" fill="rgba(251,246,236,0.55)" />
              <circle cx="78" cy={ly} r="2" fill="rgba(251,246,236,0.55)" />
              <line x1="44" y1={ly} x2="76" y2={ly} stroke="rgba(251,246,236,0.28)" strokeWidth="1" />
            </React.Fragment>
          );
        })}
        {/* Side stripe */}
        <rect x="28" y="72" width="76" height="4" rx="1" fill="rgba(251,246,236,0.22)" />
        <rect x="28" y="78" width="76" height="2" rx="1" fill="rgba(251,246,236,0.12)" />
        {/* Top edge */}
        <line x1="28" y1="50" x2="108" y2="50" stroke="rgba(251,246,236,0.28)" strokeWidth="1.5" />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Ground shadow */}
      <ellipse cx="140" cy="132" rx="120" ry="6" fill="rgba(0,0,0,0.20)" />
      {/* Left shoe — heel on left, toe points right */}
      <Shoe x={4} flip={false} />
      {/* Right shoe — mirrored so toe points left, heel on right */}
      <Shoe x={158} flip={true} />
    </svg>
  );
}

function ApparelIllustration() {
  // Shirt (top half) + Pants (bottom half) — side by side flat lay
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Ground shadow */}
      <ellipse cx="140" cy="194" rx="110" ry="5" fill="rgba(0,0,0,0.18)" />

      {/* ══ SHIRT — left side ══ */}
      {/* Left sleeve */}
      <rect x="8" y="42" width="22" height="58" rx="3"
        transform="rotate(-10 19 71)"
        fill="rgba(251,246,236,0.20)" />
      <rect x="4" y="88" width="22" height="10" rx="2"
        transform="rotate(-10 15 93)"
        fill="rgba(251,246,236,0.32)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      {/* Right sleeve */}
      <rect x="108" y="42" width="22" height="58" rx="3"
        transform="rotate(10 119 71)"
        fill="rgba(251,246,236,0.20)" />
      <rect x="112" y="88" width="22" height="10" rx="2"
        transform="rotate(10 123 93)"
        fill="rgba(251,246,236,0.32)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      {/* Shirt body */}
      <rect x="30" y="40" width="82" height="110" rx="3" fill="rgba(251,246,236,0.18)" />
      {/* Collar stand */}
      <rect x="56" y="26" width="30" height="16" rx="2" fill="rgba(251,246,236,0.30)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      {/* Left collar point */}
      <rect x="38" y="24" width="24" height="18" rx="2"
        transform="rotate(-16 50 33)"
        fill="rgba(251,246,236,0.26)" stroke="rgba(251,246,236,0.38)" strokeWidth="1" />
      {/* Right collar point */}
      <rect x="80" y="24" width="24" height="18" rx="2"
        transform="rotate(16 92 33)"
        fill="rgba(251,246,236,0.26)" stroke="rgba(251,246,236,0.38)" strokeWidth="1" />
      {/* Placket */}
      <rect x="67" y="40" width="10" height="110" fill="rgba(251,246,236,0.10)" />
      <line x1="67" y1="40" x2="67" y2="150" stroke="rgba(251,246,236,0.22)" strokeWidth="1" />
      <line x1="77" y1="40" x2="77" y2="150" stroke="rgba(251,246,236,0.22)" strokeWidth="1" />
      {/* Buttons */}
      {[52, 68, 84, 100, 116, 132].map(y => (
        <circle key={y} cx="72" cy={y} r="3" fill="rgba(251,246,236,0.08)" stroke="rgba(251,246,236,0.48)" strokeWidth="1.2" />
      ))}
      {/* Chest pocket */}
      <rect x="38" y="56" width="20" height="18" rx="2" fill="rgba(251,246,236,0.10)" stroke="rgba(251,246,236,0.30)" strokeWidth="1" />
      <line x1="38" y1="64" x2="58" y2="64" stroke="rgba(251,246,236,0.28)" strokeWidth="1" />
      {/* Shoulder seams */}
      <line x1="30" y1="40" x2="56" y2="40" stroke="rgba(251,246,236,0.35)" strokeWidth="1.5" />
      <line x1="86" y1="40" x2="112" y2="40" stroke="rgba(251,246,236,0.35)" strokeWidth="1.5" />
      {/* Hem */}
      <line x1="30" y1="146" x2="112" y2="146" stroke="rgba(251,246,236,0.28)" strokeWidth="1.5" />

      {/* ══ PANTS — right side ══ */}
      {/* Waistband */}
      <rect x="152" y="28" width="110" height="18" rx="3" fill="rgba(251,246,236,0.30)" stroke="rgba(251,246,236,0.45)" strokeWidth="1.5" />
      {/* Belt loops */}
      {[164, 184, 207, 227, 247].map(x => (
        <rect key={x} x={x} y="24" width="6" height="10" rx="1.5" fill="rgba(251,246,236,0.40)" stroke="rgba(251,246,236,0.50)" strokeWidth="1" />
      ))}
      {/* Fly / center seam */}
      <line x1="207" y1="46" x2="207" y2="70" stroke="rgba(251,246,236,0.30)" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* Button */}
      <circle cx="207" cy="34" r="3.5" fill="rgba(251,246,236,0.12)" stroke="rgba(251,246,236,0.50)" strokeWidth="1.2" />
      {/* Main trouser body */}
      <rect x="152" y="46" width="110" height="90" rx="2" fill="rgba(251,246,236,0.16)" />
      {/* Center crotch seam */}
      <line x1="207" y1="70" x2="207" y2="136" stroke="rgba(251,246,236,0.25)" strokeWidth="1.5" />
      {/* Left leg */}
      <rect x="152" y="136" width="52" height="44" rx="4" fill="rgba(251,246,236,0.20)" />
      {/* Right leg */}
      <rect x="210" y="136" width="52" height="44" rx="4" fill="rgba(251,246,236,0.20)" />
      {/* Left cuff */}
      <rect x="152" y="170" width="52" height="10" rx="2" fill="rgba(251,246,236,0.30)" stroke="rgba(251,246,236,0.38)" strokeWidth="1" />
      {/* Right cuff */}
      <rect x="210" y="170" width="52" height="10" rx="2" fill="rgba(251,246,236,0.30)" stroke="rgba(251,246,236,0.38)" strokeWidth="1" />
      {/* Pocket left */}
      <path d="M158 50 Q158 74 174 76 L174 50" stroke="rgba(251,246,236,0.28)" strokeWidth="1" fill="rgba(251,246,236,0.06)" />
      {/* Pocket right */}
      <path d="M256 50 Q256 74 240 76 L240 50" stroke="rgba(251,246,236,0.28)" strokeWidth="1" fill="rgba(251,246,236,0.06)" />
      {/* Crease lines on legs */}
      <line x1="178" y1="136" x2="178" y2="176" stroke="rgba(251,246,236,0.18)" strokeWidth="1" />
      <line x1="236" y1="136" x2="236" y2="176" stroke="rgba(251,246,236,0.18)" strokeWidth="1" />
    </svg>
  );
}

function SunglassesIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Ground shadow */}
      <ellipse cx="140" cy="148" rx="100" ry="7" fill="rgba(0,0,0,0.18)" />

      {/* ── LEFT TEMPLE ARM — extends left ── */}
      <rect x="8" y="68" width="52" height="10" rx="5"
        transform="rotate(-4 8 73)"
        fill="rgba(251,246,236,0.28)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      {/* Left temple tip */}
      <rect x="6" y="70" width="14" height="7" rx="3"
        transform="rotate(-4 6 73)"
        fill="rgba(251,246,236,0.18)" />

      {/* ── RIGHT TEMPLE ARM — extends right ── */}
      <rect x="220" y="68" width="52" height="10" rx="5"
        transform="rotate(4 272 73)"
        fill="rgba(251,246,236,0.28)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      {/* Right temple tip */}
      <rect x="260" y="70" width="14" height="7" rx="3"
        transform="rotate(4 267 73)"
        fill="rgba(251,246,236,0.18)" />

      {/* ── LEFT LENS FRAME — large rounded rect ── */}
      <rect x="28" y="42" width="96" height="72" rx="22"
        fill="rgba(46,15,5,0.55)" stroke="rgba(251,246,236,0.40)" strokeWidth="2.5" />
      {/* Left lens tint / glare */}
      <rect x="34" y="48" width="84" height="60" rx="18"
        fill="rgba(21,194,201,0.08)" />
      {/* Left lens highlight */}
      <line x1="42" y1="55" x2="72" y2="55" stroke="rgba(251,246,236,0.18)" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="62" x2="58" y2="62" stroke="rgba(251,246,236,0.10)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── BRIDGE — connects the two lenses ── */}
      <path d="M124 73 Q140 58 156 73" stroke="rgba(251,246,236,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Bridge nose pads */}
      <circle cx="126" cy="74" r="3.5" fill="rgba(251,246,236,0.22)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />
      <circle cx="154" cy="74" r="3.5" fill="rgba(251,246,236,0.22)" stroke="rgba(251,246,236,0.40)" strokeWidth="1" />

      {/* ── RIGHT LENS FRAME ── */}
      <rect x="156" y="42" width="96" height="72" rx="22"
        fill="rgba(46,15,5,0.55)" stroke="rgba(251,246,236,0.40)" strokeWidth="2.5" />
      {/* Right lens tint */}
      <rect x="162" y="48" width="84" height="60" rx="18"
        fill="rgba(21,194,201,0.08)" />
      {/* Right lens highlight */}
      <line x1="170" y1="55" x2="200" y2="55" stroke="rgba(251,246,236,0.18)" strokeWidth="2" strokeLinecap="round" />
      <line x1="170" y1="62" x2="186" y2="62" stroke="rgba(251,246,236,0.10)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── HINGE left ── */}
      <rect x="120" y="67" width="8" height="16" rx="3" fill="rgba(251,246,236,0.35)" stroke="rgba(251,246,236,0.50)" strokeWidth="1" />
      {/* ── HINGE right ── */}
      <rect x="152" y="67" width="8" height="16" rx="3" fill="rgba(251,246,236,0.35)" stroke="rgba(251,246,236,0.50)" strokeWidth="1" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY SECTION  —  scroll-progress-driven, per-card tracking
   Mobile:  each card tracks its own viewport entry individually
            shoes ← left | apparel ↑ bottom | accessories → right
   Desktop: section-level trigger, staggered fade-up
══════════════════════════════════════════════════════════ */
const CATEGORY_CARDS = {
  accessories: { label: "Accessories Collection", tag: "The Detail",    img: "/Accessories_Collection_Panel.png", accent: "#C8A882" },
  apparel:     { label: "Clothing Collection",    tag: "The Detail",    img: "/Clothing_Collection_Panel.png",    accent: "#C8A882" },
  shoes:       { label: "Footwear Collection",    tag: "The Detail",    img: "/Shoes_Collection_Panel.png",       accent: "#C8A882" },
};

function CategorySection({ onNav }) {
  const sectionRef = useRef(null);
  const cardRefs   = useRef([]);
  const rafRef     = useRef(null);

  useEffect(() => {
    const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      const [acc, apparel, shoes] = cardRefs.current;
      if (!acc || !apparel || !shoes) return;

      if (isMobile) {
        const cp = (el) => {
          const { top } = el.getBoundingClientRect();
          return ease((vh - top) / (vh * 0.65));
        };
        const p0 = cp(acc), p1 = cp(apparel), p2 = cp(shoes);
        // clamp to avoid over-shooting which causes flicker
        const x0 = Math.max(-110, Math.min(0, (1 - p0) * -110));
        const y1 = Math.max(0, Math.min(80, (1 - p1) * 80));
        const x2 = Math.max(0, Math.min(110, (1 - p2) * 110));
        acc.style.transform     = `translateX(${x0}%)`;
        acc.style.opacity       = p0.toFixed(3);
        apparel.style.transform = `translateY(${y1}%)`;
        apparel.style.opacity   = p1.toFixed(3);
        shoes.style.transform   = `translateX(${x2}%)`;
        shoes.style.opacity     = p2.toFixed(3);
      } else {
        const { top } = sectionRef.current.getBoundingClientRect();
        const p = ease((vh - top) / (vh * 0.6));
        const x = Math.max(-110, Math.min(0, (1 - p) * -110));
        const y = Math.max(0, Math.min(80, (1 - p) * 80));
        const x2 = Math.max(0, Math.min(110, (1 - p) * 110));
        acc.style.transform     = `translateX(${x}%)`;
        acc.style.opacity       = p.toFixed(3);
        apparel.style.transform = `translateY(${y}%)`;
        apparel.style.opacity   = p.toFixed(3);
        shoes.style.transform   = `translateX(${x2}%)`;
        shoes.style.opacity     = p.toFixed(3);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(update);
        ticking = true;
      }
    };

    cardRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.willChange = "transform, opacity";
      }
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // run once immediately
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Clean up will-change when component unmounts
      cardRefs.current.forEach((el) => { if (el) el.style.willChange = "auto"; });
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <section ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(CATEGORY_CARDS).map(([key, card], i) => {
            const { label, img } = card;
            return (
              <button
                key={key}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => onNav("category", key)}
                className="group relative rounded-2xl overflow-hidden text-left"
                style={{ opacity: 0, background: "#5C3D2A", aspectRatio: "4/3" }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
function HomePage({ onNav, onOpenProduct, wishlist, toggleWish }) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div>
      <CinematicHero onNav={onNav} />

      <div style={{ position: "relative", zIndex: 10, marginTop: "-30vh", background: `linear-gradient(to bottom, transparent 0%, transparent 28%, ${C.bg} 38%)` }}>
        <CategorySection onNav={onNav} />

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-black" style={{ color: C.ink }}>Featured</h2>
            <button onClick={() => onNav("category", "shoes")} className="text-sm flex items-center gap-1" style={{ color: C.inkSoft }}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {featured.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} />))}
          </div>
        </section>

        <section style={{ background: C.bgSoft, borderTop: `1px solid ${C.line}` }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Truck,       title: "Free Shipping",   desc: "On all orders over $75"  },
              { icon: RotateCcw,   title: "30-Day Returns",  desc: "No questions asked"       },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted end-to-end"     },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <Icon size={22} strokeWidth={1.5} style={{ color: C.inkSoft }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: C.ink }}>{title}</p>
                  <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════ */
function CategoryPage({ category, onOpenProduct, wishlist, toggleWish, query }) {
  const [sort, setSort] = useState("featured");
  const meta = CATEGORY_META[category];

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === category);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, query]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "#8a6cf0" }}>Collection</p>
        <h1 className="text-4xl font-black" style={{ color: C.ink }}>{meta.label}</h1>
      </div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm" style={{ color: C.inkSoft }}>{products.length} products</p>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full px-4 py-2 text-sm outline-none" style={{ background: C.bgSoft, border: `1px solid ${C.line}`, color: C.ink }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      {products.length === 0
        ? <p className="text-sm" style={{ color: C.inkSoft }}>No products match your search.</p>
        : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} />))}
          </div>
        )
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PRODUCT PAGE
══════════════════════════════════════════════════════════ */
function ProductPage({ productId, onAddToCart, wishlist, toggleWish, onOpenProduct }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const [size,  setSize]  = useState(product?.sizes[0]);
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { setSize(product?.sizes[0]); setQty(1); setAdded(false); }, [productId]);
  if (!product) return null;

  const related   = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const handleAdd = () => { onAddToCart({ ...product, size, qty }); setAdded(true); setTimeout(() => setAdded(false), 1800); };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden">
          <ProductVisual hue={product.hue} category={product.category} size="hero" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-2 capitalize" style={{ color: "#8a6cf0" }}>{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: C.ink }}>{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={14} fill={i < Math.round(product.rating) ? "#d9a02e" : "none"} stroke="#d9a02e" />))}</div>
            <span className="text-xs" style={{ color: C.inkSoft }}>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <p className="text-2xl font-semibold mb-6" style={{ color: C.ink }}>{fmt(product.price)}</p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: C.inkSoft }}>{product.desc}</p>

          <div className="mb-6">
            <p className="text-xs mb-3 uppercase tracking-wide" style={{ color: C.inkSoft }}>Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s} onClick={() => setSize(s)}
                  className="px-4 py-2 rounded-full text-sm border transition-colors"
                  style={size === s ? { background: C.maroon, color: C.bgSoft, borderColor: C.maroon } : { borderColor: C.line, color: C.inkSoft }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center rounded-full" style={{ border: `1px solid ${C.line}` }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center" style={{ color: C.inkSoft }}><Minus size={14} /></button>
              <span className="w-8 text-center text-sm" style={{ color: C.ink }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center" style={{ color: C.inkSoft }}><Plus size={14} /></button>
            </div>
            <button
              onClick={() => toggleWish(product.id)}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ border: `1px solid ${C.line}`, color: C.inkSoft }}
            >
              <Heart size={16} fill={wishlist.has(product.id) ? C.maroon : "none"} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
            style={added ? { background: "#2f9e62", color: "#fff" } : { background: C.maroon, color: C.bgSoft }}
          >
            {added ? (<><Check size={16} /> Added to Cart</>) : (<><ShoppingBag size={16} /> Add to Cart</>)}
          </button>

          <div className="mt-8 pt-8 grid grid-cols-3 gap-4 text-xs" style={{ borderTop: `1px solid ${C.line}`, color: C.inkSoft }}>
            <div className="flex items-center gap-2"><Truck size={14} /> Free Shipping</div>
            <div className="flex items-center gap-2"><RotateCcw size={14} /> 30-Day Returns</div>
            <div className="flex items-center gap-2"><ShieldCheck size={14} /> Secure Checkout</div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-12" style={{ borderTop: `1px solid ${C.line}` }}>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: C.ink }}>Reviews</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: "Jordan M.", text: "Fits true to size and the cushioning held up over a full marathon block.", stars: 5 },
            { name: "Priya K.",  text: "Material feels premium, exactly like the photos. Shipping was fast too.",  stars: 5 },
            { name: "Sam R.",    text: "Great quality overall, sizing ran slightly large for me.",                  stars: 4 },
          ].map((r) => (
            <div key={r.name} className="rounded-xl p-5" style={{ background: C.bgSoft, border: `1px solid ${C.line}` }}>
              <div className="flex mb-2">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={12} fill={i < r.stars ? "#d9a02e" : "none"} stroke="#d9a02e" />))}</div>
              <p className="text-sm mb-3" style={{ color: C.inkSoft }}>{r.text}</p>
              <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.6 }}>{r.name}</p>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 pt-12" style={{ borderTop: `1px solid ${C.line}` }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: C.ink }}>You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} />))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════════ */
function CartDrawer({ open, onClose, cart, updateQty, removeItem, onCheckout }) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className={`fixed inset-0 z-50 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} style={{ background: C.bg, borderLeft: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${C.line}` }}>
          <h2 className="text-lg font-semibold" style={{ color: C.ink }}>Your Cart ({cart.length})</h2>
          <button onClick={onClose} style={{ color: C.inkSoft }}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 && <p className="text-sm text-center mt-12" style={{ color: C.inkSoft, opacity: 0.6 }}>Your cart is empty.</p>}
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"><ProductVisual hue={item.hue} category={item.category} /></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium" style={{ color: C.ink }}>{item.name}</p>
                  <button onClick={() => removeItem(item.id, item.size)} style={{ color: C.inkSoft }}><X size={14} /></button>
                </div>
                <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.7 }}>Size {item.size}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center rounded-full" style={{ border: `1px solid ${C.line}` }}>
                    <button onClick={() => updateQty(item.id, item.size, -1)} className="w-7 h-7 flex items-center justify-center" style={{ color: C.inkSoft }}><Minus size={12} /></button>
                    <span className="w-6 text-center text-xs" style={{ color: C.ink }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.size, 1)} className="w-7 h-7 flex items-center justify-center" style={{ color: C.inkSoft }}><Plus size={12} /></button>
                  </div>
                  <p className="text-sm" style={{ color: C.ink }}>{fmt(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-5" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="flex justify-between text-sm mb-2" style={{ color: C.inkSoft }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-sm mb-4" style={{ color: C.inkSoft }}><span>Shipping</span><span>{subtotal > 75 ? "Free" : fmt(8)}</span></div>
            <button onClick={onCheckout} className="w-full py-3.5 rounded-full font-medium transition-transform hover:scale-[1.02]" style={{ background: C.maroon, color: C.bgSoft }}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT
══════════════════════════════════════════════════════════ */
function CheckoutPage({ cart, onComplete, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "" });
  const subtotal    = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping    = subtotal > 75 ? 0 : 8;
  const tax         = subtotal * 0.08;
  const total       = subtotal + shipping + tax;
  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid       = form.name && form.email && form.address && form.city && form.zip && form.card.length >= 12;
  const inputStyle  = { background: C.bgSoft, border: `1px solid ${C.line}`, color: C.ink };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-8" style={{ color: C.inkSoft }}><ChevronLeft size={16} /> Back to cart</button>
      <h1 className="text-3xl font-bold mb-10" style={{ color: C.ink }}>Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: C.inkSoft }}>Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Full name" value={form.name}  onChange={handleChange("name")}  className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
              <input placeholder="Email"     value={form.email} onChange={handleChange("email")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            </div>
          </section>
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: C.inkSoft }}>Shipping Address</h2>
            <div className="space-y-4">
              <input placeholder="Street address" value={form.address} onChange={handleChange("address")} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="City"     value={form.city} onChange={handleChange("city")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                <input placeholder="ZIP code" value={form.zip}  onChange={handleChange("zip")}  className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: C.inkSoft }}><CreditCard size={14} /> Payment</h2>
            <input placeholder="Card number" value={form.card} onChange={handleChange("card")} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            <p className="text-xs mt-2" style={{ color: C.inkSoft, opacity: 0.6 }}>Demo checkout — payment architecture-ready, no real charge is made.</p>
          </section>
        </div>
        <div className="rounded-2xl p-6 h-fit" style={{ background: C.bgSoft, border: `1px solid ${C.line}` }}>
          <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: C.inkSoft }}>Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span style={{ color: C.inkSoft }}>{item.name} × {item.qty}</span>
                <span style={{ color: C.ink }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 space-y-2 text-sm" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="flex justify-between" style={{ color: C.inkSoft }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between" style={{ color: C.inkSoft }}><span>Shipping</span><span>{shipping === 0 ? "Free" : fmt(shipping)}</span></div>
            <div className="flex justify-between" style={{ color: C.inkSoft }}><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="flex justify-between font-semibold pt-2" style={{ color: C.ink, borderTop: `1px solid ${C.line}` }}><span>Total</span><span>{fmt(total)}</span></div>
          </div>
          <button
            disabled={!valid}
            onClick={() => onComplete(total)}
            className="w-full mt-6 py-3.5 rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-transform hover:scale-[1.02]"
            style={{ background: C.maroon, color: C.bgSoft }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUCCESS
══════════════════════════════════════════════════════════ */
function SuccessPage({ total, onContinue }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(47,158,98,0.15)", border: "1px solid rgba(47,158,98,0.4)" }}>
        <Check size={28} style={{ color: "#2f9e62" }} />
      </div>
      <h1 className="text-3xl font-black mb-3" style={{ color: C.ink }}>Order Confirmed</h1>
      <p className="text-sm mb-8" style={{ color: C.inkSoft }}>
        Thanks for shopping with MBZ. A confirmation has been sent to your email — your total was <span style={{ color: C.ink }}>{fmt(total)}</span>.
      </p>
      <button onClick={onContinue} className="px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105" style={{ background: C.maroon, color: C.bgSoft }}>
        Continue Shopping
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.line}`, marginTop: 40 }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-4 gap-10">
        <div>
          <p className="text-xl font-bold tracking-[0.2em] mb-3" style={{ color: C.ink }}>MBZ</p>
          <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.7 }}>Premium gear built for motion. Engineered, not assembled.</p>
        </div>
        {[
          { title: "Shop",    links: ["Shoes", "Apparel", "Accessories"]        },
          { title: "Support", links: ["Contact", "FAQ", "Shipping & Returns"]   },
          { title: "Company", links: ["About", "Careers", "Press"]              },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium mb-3" style={{ color: C.ink }}>{col.title}</p>
            <div className="flex flex-col gap-2">
              {col.links.map((l) => (<span key={l} className="text-xs cursor-pointer" style={{ color: C.inkSoft, opacity: 0.7 }}>{l}</span>))}
            </div>
          </div>
        ))}
      </div>
      <div className="py-5 text-center text-xs" style={{ borderTop: `1px solid ${C.line}`, color: C.inkSoft, opacity: 0.5 }}>© 2026 MBZ. All rights reserved.</div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════ */
export default function App() {
  const [view,       setView]       = useState("home");
  const [category,   setCategory]   = useState("shoes");
  const [productId,  setProductId]  = useState(null);
  const [cart,       setCart]       = useState([]);
  const [wishlist,   setWishlist]   = useState(new Set());
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  const handleNav = (v, cat) => {
    setView(v);
    if (cat) setCategory(cat);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (id) => { setProductId(id); setView("product"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const toggleWish = useCallback((id) => {
    setWishlist((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) return prev.map((i) => (i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + item.qty } : i));
      return [...prev, item];
    });
  };

  const updateQty  = (id, size, delta) => setCart((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  const removeItem = (id, size)        => setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  const cartCount  = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckoutComplete = (total) => {
    setOrderTotal(total);
    setCart([]);
    setView("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: C.bg, color: C.ink, fontFamily: FONT_BODY }}>
      <GlobalFonts />
      <Navbar cartCount={cartCount} onNav={handleNav} onCart={() => setCartOpen(true)} searchOpen={searchOpen} setSearchOpen={setSearchOpen} query={query} setQuery={setQuery} />

      {view === "home"     && <HomePage     onNav={handleNav} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} />}
      {view === "category" && <CategoryPage category={category} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} query={query} />}
      {view === "product"  && <ProductPage  productId={productId} onAddToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} onOpenProduct={openProduct} />}
      {view === "checkout" && <CheckoutPage cart={cart} onComplete={handleCheckoutComplete} onBack={() => { setView("home"); setCartOpen(true); }} />}
      {view === "success"  && <SuccessPage  total={orderTotal} onContinue={() => handleNav("home")} />}

      {view !== "success" && <Footer />}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem}
        onCheckout={() => { setCartOpen(false); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </div>
  );
}
