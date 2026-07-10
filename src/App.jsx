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
   COMING SOON CARD  (replaces ProductVisual)
══════════════════════════════════════════════════════════ */
function ProductVisual({ size = "normal" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "radial-gradient(ellipse at 30% 25%, #5C3D2A 0%, #3A2015 40%, #1E0E07 100%)",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")", opacity: 0.8 }} />
      {/* Warm light bleed top-left */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,140,70,0.18) 0%, transparent 70%)" }} />
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,4,2,0.55) 100%)" }} />

      {/* "Coming Soon" — fades out on hover */}
      <p style={{
        position: "absolute", fontFamily: FONT_ACCENT, fontStyle: "italic",
        fontSize: size === "hero" ? "2rem" : size === "large" ? "1.35rem" : "1rem",
        color: "#C8A882", letterSpacing: "0.04em", textAlign: "center",
        transition: "opacity 0.4s ease",
        opacity: hovered ? 0 : 1,
        pointerEvents: "none", zIndex: 2,
      }}>
        Coming Soon
      </p>

      {/* "Stay Tuned" — fades in on hover */}
      <p style={{
        position: "absolute", fontFamily: FONT_ACCENT, fontStyle: "italic",
        fontSize: size === "hero" ? "2rem" : size === "large" ? "1.35rem" : "1rem",
        color: "rgba(200,168,130,0.6)", letterSpacing: "0.06em", textAlign: "center",
        transition: "opacity 0.4s ease",
        opacity: hovered ? 1 : 0,
        pointerEvents: "none", zIndex: 2,
      }}>
        Stay Tuned
      </p>
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
// nudgeY: fraction of H added to dy (negative = shift up, positive = shift down).
// Hero canvas: nudgeY = -0.08 shifts up to hide Kling AI watermark at bottom.
// Panel cards: nudgeY = 0 — perfectly centred, no cropping.
function drawImageCover(ctx, img, W, H, nudgeY = 0) {
  if (!img || !img.naturalWidth) return;
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dx    = (W - img.naturalWidth  * scale) / 2;
  const dy    = (H - img.naturalHeight * scale) / 2 + H * nudgeY;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
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
          drawImageCover(ctx, frames[loIdx], W, H, -0.08);
        }
        if (hiIdx !== loIdx && frames[hiIdx]?.naturalWidth && blend > 0.001) {
          ctx.globalAlpha = blend;
          drawImageCover(ctx, frames[hiIdx], W, H, -0.08);
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
              <div className="mt-4 flex flex-row items-center justify-center">
                <button onClick={() => onNav("contact")}
                  className="px-10 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "#3D2E24",
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
                    color: "#C8A882"
                  }}>
                  Get Yours Now <ArrowRight size={16} />
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
   BACK BUTTON  (shared across all non-home pages)
══════════════════════════════════════════════════════════ */
function BackButton({ onBack }) {
  return (
    <button onClick={onBack}
      className="flex items-center gap-2 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "rgba(62,26,11,0.06)", border: "1px solid rgba(62,26,11,0.14)",
        padding: "0.55rem 0.95rem", cursor: "pointer", marginBottom: "1.5rem",
      }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M9 14c0 0-3-2.5-3-5s3-5 3-5" stroke={C.inkSoft} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9h9a4 4 0 0 1 0 8h-2" stroke={C.inkSoft} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>Back</span>
    </button>
  );
}


function TiltCard({ product, onOpen, isWishlisted, onToggleWish, darkBg = false }) {
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
        <ProductVisual size="large" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(200,168,130,0.12), transparent 60%)` }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWish(product.id); }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-xl transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "rgba(200,168,130,0.10)", border: "1px solid rgba(200,168,130,0.22)",
            padding: "0.35rem 0.6rem",
          }}
        >
          <Heart size={14} fill={isWishlisted ? "#C8A882" : "none"} stroke="#C8A882" />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: darkBg ? "#C8A882" : C.ink }}>{product.name}</p>
          <p className="text-xs capitalize" style={{ color: darkBg ? "rgba(200,168,130,0.55)" : C.inkSoft, opacity: darkBg ? 1 : 0.7 }}>{product.category}</p>
        </div>
        <p className="text-sm font-semibold" style={{ color: darkBg ? "#C8A882" : C.ink }}>{fmt(product.price)}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GLASS MODAL  (shared centered overlay)
══════════════════════════════════════════════════════════ */
function GlassModal({ onClose, title, children }) {
  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes gmFadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes gmScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(10,4,2,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "gmFadeIn 0.22s ease",
      }} />
      {/* Centered card */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 61,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        pointerEvents: "none",
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "rgba(38,16,6,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(200,140,60,0.18)",
          borderRadius: "1.75rem",
          boxShadow: "0 24px 64px rgba(5,2,1,0.7)",
          animation: "gmScaleIn 0.28s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "all",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.1rem 1.4rem",
            borderBottom: "1px solid rgba(200,140,60,0.10)",
          }}>
            <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8A882", opacity: 0.7 }}>{title}</span>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.18)",
              color: "#C8A882", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <X size={15} />
            </button>
          </div>
          {/* Body */}
          <div style={{ padding: "1.2rem 1.4rem 1.5rem" }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════ */
function Navbar({ cartCount, wishlist, onNav, onCart, onWishlist, query, setQuery }) {
  const [panel, setPanel] = useState(null); // null | "menu" | "search"
  const closePanel = () => setPanel(null);

  return (
    <>
      <header className="sticky top-0 z-40" style={{
        background: "radial-gradient(ellipse at 20% 0%, #4A2A14 0%, #2E1508 55%, #1E0D06 100%)",
        boxShadow: "0 1px 0 rgba(200,140,60,0.10), 0 4px 24px rgba(10,4,2,0.35)",
      }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button onClick={() => onNav("home")} className="text-xl font-bold tracking-[0.2em]" style={{ color: "#C8A882", fontFamily: FONT_ACCENT, fontStyle: "italic" }}>MBZ</button>

          <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(200,168,130,0.7)" }}>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <button key={key} onClick={() => onNav("category", key)} className="hover:opacity-100 transition-opacity" style={{ color: "inherit" }}>{meta.label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setPanel(p => p === "search" ? null : "search")}
              className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <button onClick={onWishlist} className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
              <Heart size={18} />
              {wishlist.size > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: "#C8A882", color: "#1E0D06" }}>{wishlist.size}</span>
              )}
            </button>

            {/* Cart */}
            <button onClick={onCart} className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: "#C8A882", color: "#1E0D06" }}>{cartCount}</span>
              )}
            </button>

            {/* Menu (mobile) */}
            <button onClick={() => setPanel(p => p === "menu" ? null : "menu")}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center" style={{ color: "#C8A882" }}>
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Menu modal ── */}
      {panel === "menu" && (
        <GlassModal onClose={closePanel} title="Navigate">
          <div className="flex flex-col gap-3">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <button key={key}
                onClick={() => { closePanel(); onNav("category", key); }}
                className="flex items-center gap-4 rounded-2xl text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={{ padding: "0.85rem 1.1rem", background: "rgba(200,168,130,0.06)", border: "1px solid rgba(200,168,130,0.12)" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#F5EFE6", fontFamily: FONT_ACCENT, fontStyle: "italic" }}>{meta.label}</span>
              </button>
            ))}
          </div>
        </GlassModal>
      )}

      {/* ── Search modal ── */}
      {panel === "search" && (
        <GlassModal onClose={closePanel} title="Search">
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(200,168,130,0.07)", border: "1px solid rgba(200,168,130,0.18)" }}>
            <Search size={16} style={{ color: "rgba(200,168,130,0.55)", flexShrink: 0 }} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: "#C8A882" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "rgba(200,168,130,0.5)", flexShrink: 0 }}><X size={14} /></button>
            )}
          </div>
        </GlassModal>
      )}
    </>
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
  accessories: { label: "Accessories Collection", tag: "The Detail", publicId: "v1783608999/lv_0_20260709194928_csaect", accent: "#C8A882", dur: 2.5  },
  apparel:     { label: "Clothing Collection",    tag: "The Detail", publicId: "v1783609030/lv_0_20260709173259_frn7xg", accent: "#C8A882", dur: 2.15 },
  shoes:       { label: "Footwear Collection",    tag: "The Detail", publicId: "v1783609018/lv_0_20260709194610_racjqr", accent: "#C8A882", dur: 2.5  },
};

/* ══════════════════════════════════════════════════════════
   PANEL FRAME SEQUENCE (Cloudinary jpg frames → canvas)
   ── Single canvas, no <video>, no mp4.
   ── Starts playing as soon as frame 0 arrives (streaming start).
   ── Ping-pong: forward → reverse → forward, no pause at either end.
   ── Mobile: runs always. Desktop: hover to play, reverses on leave.
══════════════════════════════════════════════════════════ */
const PANEL_FRAME_COUNT  = 45;
const PANEL_FALLBACK_DUR = 2.5; // seconds — clip playback duration

const panelFramePath = (publicId, n, dur) => {
  const t = ((n / (PANEL_FRAME_COUNT - 1)) * dur).toFixed(3);
  return `${CLOUDINARY_BASE}/w_1280,h_960,c_fit,q_auto:good/so_${t}/${publicId}.jpg`;
};

// Load frames one-by-one; calls onFrame(i, img) as each arrives so the
// animation can start on frame 0 without waiting for all 45.
function streamPanelFrames(publicId, dur, onFrame) {
  const images = new Array(PANEL_FRAME_COUNT).fill(null);
  for (let i = 0; i < PANEL_FRAME_COUNT; i++) {
    const img = new Image();
    const idx = i;
    img.onload  = () => { images[idx] = img; onFrame(idx, img, images); };
    img.onerror = () => {                    onFrame(idx, null, images); };
    img.src     = panelFramePath(publicId, i, dur);
  }
  return images;
}

function CategoryCard({ cardKey, card, index, cardRefs, onNav }) {
  const { publicId, dur = PANEL_FALLBACK_DUR } = card;

  const canvasRef    = useRef(null);
  const framesRef    = useRef(new Array(PANEL_FRAME_COUNT).fill(null));
  const posRef       = useRef(0);
  const directionRef = useRef("forward");
  // "idle" | "loop" | "leaving"
  const modeRef      = useRef("idle");
  const rafRef       = useRef(null);
  const lastTsRef    = useRef(0);
  const readyRef     = useRef(false); // true once frame 0 has arrived

  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768);

  const cancelRafRef = useRef(null);
  cancelRafRef.current = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  // ── Draw current pos to the single canvas ──────────────────────
  const drawRef = useRef(null);
  drawRef.current = () => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (W === 0 || H === 0) return;
    const pw = Math.round(W * dpr), ph = Math.round(H * dpr);
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rawPos = posRef.current;
    const loIdx  = Math.max(0, Math.min(frames.length - 1, Math.floor(rawPos)));
    const hiIdx  = Math.min(frames.length - 1, loIdx + 1);
    const blend  = rawPos - loIdx;
    if (!frames[loIdx]) return; // frame not loaded yet — skip draw
    ctx.globalAlpha = 1;
    drawImageCover(ctx, frames[loIdx], W, H, 0);
    if (hiIdx !== loIdx && frames[hiIdx] && blend > 0.001) {
      ctx.globalAlpha = blend;
      drawImageCover(ctx, frames[hiIdx], W, H, 0);
      ctx.globalAlpha = 1;
    }
  };

  // ── Tick — runs every RAF ───────────────────────────────────────
  const tickRef = useRef(null);
  tickRef.current = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
    lastTsRef.current = ts;

    const fps   = (PANEL_FRAME_COUNT - 1) / dur;
    const delta = dt * fps;
    const MAX   = PANEL_FRAME_COUNT - 1;

    if (directionRef.current === "forward") {
      posRef.current += delta;
      if (posRef.current >= MAX) {
        // Carry overshoot into the reverse direction — no dwell on last frame
        posRef.current       = MAX - (posRef.current - MAX);
        directionRef.current = "reverse";
      }
    } else {
      posRef.current -= delta;
      if (posRef.current <= 0) {
        if (modeRef.current === "leaving") {
          posRef.current    = 0;
          modeRef.current   = "idle";
          lastTsRef.current = 0;
          cancelRafRef.current();
          return;
        }
        // Carry overshoot into the forward direction — no dwell on frame 0
        posRef.current       = Math.abs(posRef.current);
        directionRef.current = "forward";
      }
    }

    drawRef.current();
    rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
  };

  // ── Start / resume loop ─────────────────────────────────────────
  const startLoopRef = useRef(null);
  startLoopRef.current = () => {
    if (!readyRef.current) return;
    modeRef.current = "loop";
    if (!rafRef.current) {
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
    }
  };

  // ── Stream frames; start animating on frame 0 ──────────────────
  useEffect(() => {
    let cancelled = false;
    posRef.current       = 0;
    directionRef.current = "forward";
    modeRef.current      = "idle";
    readyRef.current     = false;
    framesRef.current    = new Array(PANEL_FRAME_COUNT).fill(null);
    cancelRafRef.current();

    streamPanelFrames(publicId, dur, (idx, img, images) => {
      if (cancelled) return;
      framesRef.current[idx] = img;

      // As soon as frame 0 arrives — draw it and start loop on mobile
      if (idx === 0 && img) {
        readyRef.current = true;
        requestAnimationFrame(() => {
          if (cancelled) return;
          drawRef.current();
          if (isMobile.current) startLoopRef.current();
        });
      }
    });

    return () => { cancelled = true; cancelRafRef.current(); };
  }, [publicId]);

  // ── Desktop hover ───────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    if (isMobile.current) return;
    if (modeRef.current === "leaving") {
      modeRef.current = "loop"; // mid-reverse — keep going, just flip goal
      return;
    }
    startLoopRef.current();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isMobile.current) return;
    if (modeRef.current === "idle") return;
    directionRef.current = "reverse";
    modeRef.current      = "leaving";
    // Ensure RAF is running so it walks back to frame 0
    if (!rafRef.current) {
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
    }
  }, []);

  return (
    <button
      onClick={() => onNav("category", cardKey)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: "100%", aspectRatio: "4/3", touchAction: "pan-y",
        background: "#2E1A0E", border: "none", padding: 0,
        position: "relative", display: "block",
        borderRadius: "2rem", overflow: "hidden",
        isolation: "isolate",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        transform: "translateZ(0)",
      }}
    >
      {/* Canvas — 1px outset so sub-pixel anti-aliasing never shows background */}
      <canvas
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "absolute", inset: "-1px", width: "calc(100% + 2px)", height: "calc(100% + 2px)",
          touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none",
          display: "block",
        }}
      />
    </button>
  );
}

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
      }
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardRefs.current.forEach((el) => { if (el) el.style.willChange = ""; });
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <section ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(CATEGORY_CARDS).map(([key, card], i) => (
            <div key={key} ref={(el) => { cardRefs.current[i] = el; }} style={{ willChange: "transform, opacity" }}>
              <CategoryCard cardKey={key} card={card} index={i} cardRefs={{ current: [] }} onNav={onNav} />
            </div>
          ))}
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
            {featured.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} darkBg />))}
          </div>
        </section>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════ */
function CategoryPage({ category, onOpenProduct, wishlist, toggleWish, query, onBack }) {
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
        <BackButton onBack={onBack} />
        <h1 className="text-4xl font-black" style={{ color: C.ink, fontFamily: FONT_ACCENT, fontStyle: "italic" }}>{meta.label}</h1>
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
function ProductPage({ productId, onAddToCart, wishlist, toggleWish, onOpenProduct, onBack }) {
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
      <BackButton onBack={onBack} />
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden">
          <ProductVisual size="hero" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-2 capitalize" style={{ color: C.inkSoft, opacity: 0.6 }}>{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: C.ink, fontFamily: FONT_ACCENT, fontStyle: "italic" }}>{product.name}</h1>
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
              className="flex items-center gap-1.5 rounded-xl transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "rgba(62,26,11,0.06)", border: `1px solid rgba(62,26,11,0.14)`,
                padding: "0.55rem 0.85rem",
              }}
            >
              <Heart size={16} fill={wishlist.has(product.id) ? C.maroon : "none"} stroke={C.inkSoft} />
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
   CART MODAL  (glass centered)
══════════════════════════════════════════════════════════ */
function CartDrawer({ open, onClose, cart, updateQty, removeItem, onCheckout }) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (!open) return null;
  return (
    <GlassModal onClose={onClose} title={`Cart · ${cart.length} item${cart.length !== 1 ? "s" : ""}`}>
      <div style={{ maxHeight: "55vh", overflowY: "auto", marginBottom: cart.length > 0 ? "1rem" : 0 }}>
        {cart.length === 0 && (
          <p style={{ color: "rgba(200,168,130,0.5)", fontSize: 14, textAlign: "center", padding: "2rem 0" }}>Your cart is empty.</p>
        )}
        {cart.map((item) => (
          <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 12, marginBottom: 12, padding: "0.75rem", background: "rgba(200,168,130,0.05)", border: "1px solid rgba(200,168,130,0.10)", borderRadius: "1rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: "0.75rem", overflow: "hidden", flexShrink: 0 }}>
              <ProductVisual />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#F5EFE6" }}>{item.name}</p>
                <button onClick={() => removeItem(item.id, item.size)} style={{ color: "rgba(200,168,130,0.45)", cursor: "pointer" }}><X size={13} /></button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(200,168,130,0.5)", marginBottom: 6 }}>Size {item.size}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.15)", borderRadius: "999px", padding: "2px 8px" }}>
                  <button onClick={() => updateQty(item.id, item.size, -1)} style={{ color: "#C8A882", cursor: "pointer" }}><Minus size={11} /></button>
                  <span style={{ fontSize: 12, color: "#F5EFE6", minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.size, 1)} style={{ color: "#C8A882", cursor: "pointer" }}><Plus size={11} /></button>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#C8A882" }}>{fmt(item.price * item.qty)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(200,140,60,0.10)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(200,168,130,0.6)", marginBottom: 6 }}>
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(200,168,130,0.6)", marginBottom: 14 }}>
            <span>Shipping</span><span>{subtotal > 75 ? "Free" : fmt(8)}</span>
          </div>
          <button onClick={onCheckout}
            className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ padding: "0.85rem", borderRadius: "999px", background: "rgba(200,168,130,0.15)", border: "1px solid rgba(200,168,130,0.3)", color: "#F5EFE6", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Checkout → {fmt(subtotal + (subtotal > 75 ? 0 : 8))}
          </button>
        </div>
      )}
    </GlassModal>
  );
}

/* ══════════════════════════════════════════════════════════
   WISHLIST MODAL  (glass centered)
══════════════════════════════════════════════════════════ */
function WishlistModal({ open, onClose, wishlist, toggleWish, onOpenProduct }) {
  if (!open) return null;
  const wishlisted = PRODUCTS.filter(p => wishlist.has(p.id));
  return (
    <GlassModal onClose={onClose} title={`Wishlist · ${wishlisted.length}`}>
      <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
        {wishlisted.length === 0 && (
          <p style={{ color: "rgba(200,168,130,0.5)", fontSize: 14, textAlign: "center", padding: "2rem 0" }}>Nothing saved yet.</p>
        )}
        {wishlisted.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 12, padding: "0.75rem", background: "rgba(200,168,130,0.05)", border: "1px solid rgba(200,168,130,0.10)", borderRadius: "1rem", cursor: "pointer" }}
            onClick={() => { onClose(); onOpenProduct(item.id); }}>
            <div style={{ width: 56, height: 56, borderRadius: "0.75rem", overflow: "hidden", flexShrink: 0 }}>
              <ProductVisual />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#F5EFE6" }}>{item.name}</p>
                <button onClick={(e) => { e.stopPropagation(); toggleWish(item.id); }} style={{ color: "rgba(200,168,130,0.45)", cursor: "pointer" }}>
                  <Heart size={13} fill="#C8A882" stroke="#C8A882" />
                </button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(200,168,130,0.5)", marginTop: 2, textTransform: "capitalize" }}>{item.category}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#C8A882", marginTop: 4 }}>{fmt(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassModal>
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
    <footer style={{ position: "relative" }}>
      <div style={{
        background: `linear-gradient(to bottom, ${C.bg} 0%, #2E1508 35%, #1E0D06 100%)`,
        boxShadow: "0 -1px 0 rgba(200,140,60,0.10)",
      }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-4 gap-10">
        <div>
          <p className="text-xl font-bold tracking-[0.2em] mb-3" style={{ color: "#C8A882", fontFamily: FONT_ACCENT, fontStyle: "italic" }}>MBZ</p>
          <p className="text-xs" style={{ color: "rgba(200,168,130,0.55)" }}>Premium gear built for motion. Engineered, not assembled.</p>
        </div>
        {[
          { title: "Shop",    links: ["Shoes", "Apparel", "Accessories"]        },
          { title: "Support", links: ["Contact", "FAQ", "Shipping & Returns"]   },
          { title: "Company", links: ["About", "Careers", "Press"]              },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium mb-3" style={{ color: "#C8A882" }}>{col.title}</p>
            <div className="flex flex-col gap-2">
              {col.links.map((l) => (<span key={l} className="text-xs cursor-pointer" style={{ color: "rgba(200,168,130,0.45)" }}>{l}</span>))}
            </div>
          </div>
        ))}
      </div>
      <div className="py-5 text-center text-xs" style={{ borderTop: "1px solid rgba(200,140,60,0.10)", color: "rgba(200,168,130,0.35)" }}>© 2026 MBZ. All rights reserved.</div>
    </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════ */
function ContactPage({ onBack }) {
  // Flying logo particles — WhatsApp, Email, LinkedIn icons as SVG paths
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    type: ["whatsapp", "email", "linkedin"][i % 3],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 22 + Math.random() * 22,
    dur: 12 + Math.random() * 16,
    delay: -(Math.random() * 20),
    dx: (Math.random() - 0.5) * 60,
    dy: (Math.random() - 0.5) * 60,
    rot: Math.random() * 360,
    drot: (Math.random() - 0.5) * 180,
  })), []);

  const iconSvg = (type, size) => {
    if (type === "whatsapp") return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="rgba(200,168,130,0.25)"/>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.405A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="rgba(200,168,130,0.25)" strokeWidth="1.5" fill="none"/>
      </svg>
    );
    if (type === "email") return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(200,168,130,0.25)" strokeWidth="1.5"/>
        <path d="M2 7l10 7 10-7" stroke="rgba(200,168,130,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(200,168,130,0.25)" strokeWidth="1.5"/>
        <path d="M7 10v7M7 7v.01M12 17v-4c0-1.5.5-3 3-3s3 1.5 3 3v4M12 10v7" stroke="rgba(200,168,130,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 40% 40%, #3A1E10 0%, #2A1208 40%, #1A0A04 100%)` }}>

      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-2 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{
          position: "absolute", top: "1.25rem", left: "1.25rem", zIndex: 20,
          background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.18)",
          padding: "0.6rem 1rem", cursor: "pointer",
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 14c0 0-3-2.5-3-5s3-5 3-5" stroke="#C8A882" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 9h9a4 4 0 0 1 0 8h-2" stroke="#C8A882" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#C8A882" }}>Back</span>
      </button>

      {/* Animated background particles */}
      <style>{`
        @keyframes floatParticle {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--drot)); opacity: 0; }
        }
      `}</style>

      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--drot": `${p.drot}deg`,
          animation: `floatParticle ${p.dur}s ${p.delay}s ease-in-out infinite`,
          pointerEvents: "none",
          transform: `rotate(${p.rot}deg)`,
        }}>
          {iconSvg(p.type, p.size)}
        </div>
      ))}

      {/* Subtle radial vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,4,2,0.6) 100%)", pointerEvents: "none" }} />

      {/* Contact card */}
      <div className="relative z-10 flex flex-col items-center text-center px-8" style={{ maxWidth: 480, width: "100%" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C8A882", opacity: 0.7, marginBottom: 12 }}>Get In Touch</p>
        <h1 className="font-black mb-10" style={{ fontSize: "clamp(2rem,6vw,3rem)", color: "#F5EFE6", fontFamily: FONT_BODY, lineHeight: 1.1 }}>
          Let's Connect
        </h1>

        <div className="flex flex-col gap-5 w-full">
          {/* WhatsApp */}
          <a href="https://wa.me/923124919510" target="_blank" rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.18)", padding: "1rem 1.4rem", textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(200,168,130,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#C8A882"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.405A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#C8A882" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8A882", opacity: 0.6, marginBottom: 2 }}>WhatsApp</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#F5EFE6" }}>03124919510</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:muhammadbinzain123@gmail.com"
            className="flex items-center gap-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.18)", padding: "1rem 1.4rem", textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(200,168,130,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="#C8A882" strokeWidth="1.5"/>
                <path d="M2 7l10 7 10-7" stroke="#C8A882" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8A882", opacity: 0.6, marginBottom: 2 }}>Email</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#F5EFE6" }}>muhammadbinzain123@gmail.com</p>
            </div>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/muhammad-bin-zain-a8650a417?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.18)", padding: "1rem 1.4rem", textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(200,168,130,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#C8A882" strokeWidth="1.5"/>
                <path d="M7 10v7M7 7v.01M12 17v-4c0-1.5.5-3 3-3s3 1.5 3 3v4M12 10v7" stroke="#C8A882" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8A882", opacity: 0.6, marginBottom: 2 }}>LinkedIn</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#F5EFE6" }}>Muhammad Bin Zain</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════ */
export default function App() {
  const [view,       setView]       = useState("home");
  const [prevView,   setPrevView]   = useState("home");
  const [category,   setCategory]   = useState("shoes");
  const [productId,  setProductId]  = useState(null);
  const [cart,       setCart]       = useState([]);
  const [wishlist,   setWishlist]   = useState(new Set());
  const [cartOpen,      setCartOpen]      = useState(false);
  const [wishlistOpen,  setWishlistOpen]  = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [query,      setQuery]      = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  const handleNav = (v, cat) => {
    setPrevView(view);
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
      <Navbar cartCount={cartCount} wishlist={wishlist} onNav={handleNav} onCart={() => setCartOpen(true)} onWishlist={() => setWishlistOpen(true)} query={query} setQuery={setQuery} />

      {view === "home"     && <HomePage     onNav={handleNav} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} />}
      {view === "category" && <CategoryPage category={category} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} query={query} onBack={() => handleNav(prevView)} />}
      {view === "product"  && <ProductPage  productId={productId} onAddToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} onOpenProduct={openProduct} onBack={() => handleNav(prevView)} />}
      {view === "checkout" && <CheckoutPage cart={cart} onComplete={handleCheckoutComplete} onBack={() => { setView("home"); setCartOpen(true); }} />}
      {view === "success"  && <SuccessPage  total={orderTotal} onContinue={() => handleNav("home")} />}
      {view === "contact"  && <ContactPage onBack={() => handleNav(prevView)} />}

      {view !== "success" && view !== "contact" && <Footer />}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem}
        onCheckout={() => { setCartOpen(false); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      <WishlistModal open={wishlistOpen} onClose={() => setWishlistOpen(false)} wishlist={wishlist} toggleWish={toggleWish} onOpenProduct={(id) => { setWishlistOpen(false); openProduct(id); }} />
    </div>
  );
}
