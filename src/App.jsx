import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ShoppingBag, Search, Heart, X, ChevronLeft,
  Star, Plus, Minus, Check, ArrowRight, Menu, Footprints,
  Shirt, Watch, Truck, ShieldCheck, RotateCcw, CreditCard
} from "lucide-react";

/* ============================== THEME ============================== */
/* Cream / maroon premium palette, cyan->purple accent line */
const C = {
  bg: "#F4ECE0",
  bgSoft: "#FBF6EC",
  ink: "#3E1A0B",
  inkSoft: "#6B3A22",
  maroon: "#4A1B0C",
  maroonDeep: "#2E0F05",
  line: "rgba(62,26,11,0.12)",
};

const ACCENT_BAR = "linear-gradient(90deg, #15c2c9 0%, #7c6cf0 50%, #b25cf0 100%)";
const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_ACCENT = "'Playfair Display', serif";

function GlobalFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');
      @keyframes storeSweep { 0% { transform: translateX(-15%); } 100% { transform: translateX(15%); } }
      @keyframes rackHang { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    `}</style>
  );
}

/* ============================== DATA ============================== */

const CATEGORY_META = {
  shoes:       { label: "Shoes",       icon: Footprints, hue: 18  },
  apparel:     { label: "Apparel",     icon: Shirt,       hue: 265 },
  accessories: { label: "Accessories", icon: Watch,        hue: 200 },
};

const PRODUCTS = [
  { id: 1,  category: "shoes",       name: "Vantage Runner",     price: 189, hue: 18,  desc: "Engineered knit upper with a responsive foam midsole built for all-day motion.",  sizes: ["7","8","9","10","11","12"], rating: 4.8, reviews: 214 },
  { id: 2,  category: "shoes",       name: "Drift Low",          price: 159, hue: 28,  desc: "A low-profile silhouette in premium nubuck, finished with a vulcanized rubber sole.", sizes: ["7","8","9","10","11","12"], rating: 4.6, reviews: 132 },
  { id: 3,  category: "shoes",       name: "Apex Trail",         price: 215, hue: 10,  desc: "All-terrain grip and waterproof construction for the unpredictable.",  sizes: ["7","8","9","10","11","12"], rating: 4.9, reviews: 301 },
  { id: 4,  category: "shoes",       name: "Sol Slide",          price: 95,  hue: 35,  desc: "Molded comfort sandal with a contoured footbed for recovery days.",  sizes: ["S","M","L","XL"], rating: 4.4, reviews: 88 },
  { id: 5,  category: "apparel",     name: "Form Hoodie",        price: 110, hue: 265, desc: "Brushed-back fleece in a relaxed cut, cut from heavyweight cotton.",  sizes: ["S","M","L","XL"], rating: 4.7, reviews: 176 },
  { id: 6,  category: "apparel",     name: "Motion Tee",         price: 48,  hue: 280, desc: "A second-skin performance tee with four-way stretch and breathable mesh panels.", sizes: ["S","M","L","XL"], rating: 4.5, reviews: 245 },
  { id: 7,  category: "apparel",     name: "Glacier Shell",      price: 240, hue: 250, desc: "Lightweight, packable shell with a fully taped seam construction.",  sizes: ["S","M","L","XL"], rating: 4.8, reviews: 97 },
  { id: 8,  category: "apparel",     name: "Studio Joggers",     price: 88,  hue: 290, desc: "Tapered fit joggers in a soft French terry for transitional weather.",  sizes: ["S","M","L","XL"], rating: 4.6, reviews: 154 },
  { id: 9,  category: "accessories", name: "Pulse Watch",        price: 320, hue: 200, desc: "Titanium case with a sapphire face and a 14-day battery cycle.",  sizes: ["One Size"], rating: 4.9, reviews: 68 },
  { id: 10, category: "accessories", name: "Carry Tote",         price: 145, hue: 210, desc: "Full-grain leather tote with a structured base and brass hardware.", sizes: ["One Size"], rating: 4.7, reviews: 112 },
  { id: 11, category: "accessories", name: "Aero Cap",           price: 38,  hue: 190, desc: "Lightweight six-panel cap with a moisture-wicking sweatband.",  sizes: ["One Size"], rating: 4.3, reviews: 59 },
  { id: 12, category: "accessories", name: "Halo Sunglasses",    price: 165, hue: 220, desc: "Polarized lenses set in a hand-finished acetate frame.",  sizes: ["One Size"], rating: 4.8, reviews: 84 },
];

const fmt = (n) => `$${n.toFixed(2)}`;

/* ========================= PRODUCT VISUAL (CSS) ========================= */

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
      <Icon className="relative z-10 drop-shadow-2xl" style={{ color: "rgba(255,255,255,0.92)" }} size={size === "hero" ? 64 : size === "large" ? 96 : 44} strokeWidth={1.25} />
    </div>
  );
}

/* ===================== SCROLL-PINNED CINEMATIC HERO ===================== */
/* The figure + headline move together through 3 "scenes" as the user
   scrolls; the section stays pinned (sticky) so it reads as one continuous
   motion sequence instead of the page scrolling past static content. */

const SCENES = [
  {
    tag: "CHAPTER ONE — THE START LINE",
    lines: ["Built for", "Motion."],
    sub: "The Only Interactive Motion Website You Need",
  },
];

function MovingFigure({ progress }) {
  // progress 0..1 across the whole pinned section
  const sceneFloat = progress * (SCENES.length - 1);
  const scene = Math.floor(sceneFloat);
  const local = sceneFloat - scene; // 0..1 within current scene transition

  // pose presets per scene: [hipX, hipY, rotate, armSwing, legSwing, scale]
  const poses = [
    { x: -8,  y: 0,   rot: -3, arm: 18,  leg: 14, scale: 1.0 },
    { x: 4,   y: -14, rot: 4,  arm: -22, leg: -16, scale: 1.05 },
    { x: 0,   y: -4,  rot: 0,  arm: 6,   leg: 2,  scale: 1.12 },
  ];
  const a = poses[Math.min(scene, poses.length - 1)];
  const b = poses[Math.min(scene + 1, poses.length - 1)];
  const lerp = (p, q) => p + (q - p) * local;

  const x = lerp(a.x, b.x);
  const y = lerp(a.y, b.y);
  const rot = lerp(a.rot, b.rot);
  const arm = lerp(a.arm, b.arm);
  const leg = lerp(a.leg, b.leg);
  const scale = lerp(a.scale, b.scale);

  return (
    <svg viewBox="0 0 200 380" width="280" height="532" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="figGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c6cf0" />
          <stop offset="55%" stopColor="#b25cf0" />
          <stop offset="100%" stopColor="#15c2c9" />
        </linearGradient>
      </defs>
      <g
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
          transformOrigin: "100px 190px",
          transition: "transform 0.05s linear",
        }}
      >
        {/* head */}
        <circle cx="100" cy="46" r="22" fill="none" stroke="url(#figGrad)" strokeWidth="4.5" />
        {/* spine */}
        <path d={`M100,68 L${100 - rot * 0.3},170`} stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* back arm */}
        <path d={`M100,95 L${100 - arm * 1.1},150`} stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.55" />
        {/* front arm */}
        <path d={`M100,95 L${100 + arm * 1.3},150`} stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* hips */}
        <line x1="78" y1="172" x2="122" y2="172" stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" />
        {/* back leg */}
        <path d={`M88,172 L${88 - leg * 1.4},230 L${88 - leg * 1.1},300`} stroke="url(#figGrad)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55" />
        {/* front leg */}
        <path d={`M112,172 L${112 + leg * 1.4},230 L${112 + leg * 1.1},300`} stroke="url(#figGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/* ============================================================
   CANVAS FRAME-SEQUENCE SCROLL SCRUB (Cloudinary edition)
   ============================================================
   Cloudinary serves each frame as a JPEG on-the-fly using the
   so_ (start offset) URL parameter — no ffmpeg, no terminal,
   no extra files. The browser preloads all frames as Image
   objects, then the rAF loop draws the right one to <canvas>
   on every scroll tick. Instant seeking, works on any CDN.
   ============================================================ */

// ── Cloudinary frame extraction ──────────────────────────────────────
// Cloudinary generates JPEG screenshots on-the-fly via the `so_` (start offset)
// parameter — no ffmpeg, no file uploads, no terminal needed.
// URL format: /video/upload/so_<seconds>/<public_id>.jpg
//
// HOW TO RECALIBRATE:
//   1. Open your video and note its duration in seconds
//   2. Set VIDEO_DURATION to that value
//   3. FRAME_COUNT controls smoothness (60 = good, 90 = very smooth)
//   Cloudinary free tier has generous transformation limits.

const CLOUDINARY_BASE = "https://res.cloudinary.com/leu4dssl/video/upload";

// Separate videos: 9:16 for mobile, 16:9 for desktop
const MOBILE_ID      = "v1782988492/lv_0_20260702132747_dz3imr";
const DESKTOP_ID     = "v1782988509/lv_0_20260702153131_zuafdg";
const VIDEO_DURATION = 3;
const FRAME_COUNT    = 60;

const isMobile = () => window.innerWidth < 768;

const FRAME_PATH = (n) => {
  const t         = ((n / (FRAME_COUNT - 1)) * VIDEO_DURATION).toFixed(2);
  const mob       = isMobile();
  const id        = mob ? MOBILE_ID : DESKTOP_ID;
  // g_north anchors to top, cropping bottom where KlingAI watermark sits
  const transform = mob
    ? "w_1080,h_1920,c_fill,g_north,q_auto:best"
    : "w_1920,h_1080,c_fill,g_north,q_auto:best";
  return `${CLOUDINARY_BASE}/${transform}/so_${t}/${id}.jpg`;
};

/* Preload all frames and report progress */
function preloadFrames(onProgress) {
  return new Promise((resolve) => {
    const images = new Array(FRAME_COUNT);
    let loaded = 0;

    const done = () => {
      loaded++;
      onProgress(loaded / FRAME_COUNT);
      if (loaded === FRAME_COUNT) resolve(images);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload  = done;
      img.onerror = done; // skip missing frames gracefully
      img.src = FRAME_PATH(i); // 0-indexed, evenly spread across VIDEO_DURATION
      images[i] = img;
    }
  });
}

/* Draw one Image onto a canvas with object-fit:cover math */
function drawImageCover(ctx, img, cw, ch) {
  if (!img || !img.naturalWidth) return;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const dx = (cw - iw * scale) / 2;
  const dy = (ch - ih * scale) / 2;
  ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
}

function CinematicHero({ onNav }) {
  const containerRef  = useRef(null);
  const canvasRef     = useRef(null);
  const figGroupRef   = useRef(null);
  const figWrapRef    = useRef(null);
  const textWrapsRef  = useRef([]);
  const dotsRef       = useRef([]);
  const hintRef       = useRef(null);
  const loadBarRef    = useRef(null);
  const loadWrapRef   = useRef(null);

  const progressRef   = useRef(0);
  const lastSceneRef  = useRef(-1);
  const framesRef     = useRef([]);   // Image[] once loaded
  const rafRef        = useRef(null);

  const poses = [
    { x: -8,  y: 0,   rot: -3, arm: 18,  leg: 14,  scale: 1.0  },
    { x: 4,   y: -14, rot: 4,  arm: -22, leg: -16, scale: 1.05 },
    { x: 0,   y: -4,  rot: 0,  arm: 6,   leg: 2,   scale: 1.12 },
  ];
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── preload frames on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      framesRef.current = [];
      if (loadWrapRef.current) loadWrapRef.current.style.display = "flex";
      if (loadBarRef.current)  loadBarRef.current.style.width = "0%";
      preloadFrames((pct) => {
        if (loadBarRef.current) loadBarRef.current.style.width = `${pct * 100}%`;
        if (loadWrapRef.current && pct >= 1) loadWrapRef.current.style.display = "none";
      }).then((images) => {
        if (!cancelled) framesRef.current = images;
      });
    };
    load();
    // Reload frames if user rotates phone or resizes to cross the 768px breakpoint
    let lastMobile = isMobile();
    const onResize = () => {
      const nowMobile = isMobile();
      if (nowMobile !== lastMobile) { lastMobile = nowMobile; load(); }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelled = true; window.removeEventListener("resize", onResize); };
  }, []);

  // ── rAF loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const VIDEO_END      = 1.00; // scrub video across full scroll
    const VIDEO_FADE_END = 1.00; // canvas never fades — final frame stays
    // Text trigger: 2.3s / 3.0s = 76.7% of video = 76.7% of scroll
    const TEXT_START     = 0.833; // 2.5s / 3s = text appears when clothes are fully on ground
    const TEXT_END       = 0.85;  // fully visible by this point, stays forever

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const p = progressRef.current;

      // ── canvas frame draw ────────────────────────────────────────
      const canvas = canvasRef.current;
      const frames = framesRef.current;
      if (canvas && frames.length > 0) {
        const dpr = window.devicePixelRatio || 1;
        const cw = canvas.clientWidth, ch = canvas.clientHeight;
        // Use physical pixels for sharp rendering on mobile retina screens
        const pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
        if (canvas.width !== pw || canvas.height !== ph) {
          canvas.width = pw; canvas.height = ph;
          canvas.getContext("2d").scale(dpr, dpr);
        }
        const videoScrubProgress = Math.min(1, p / VIDEO_END);
        const frameIndex = Math.min(frames.length - 1,
          Math.floor(videoScrubProgress * frames.length));
        const ctx = canvas.getContext("2d");
        // Draw current frame — for smoother blending between frames,
        // paint previous frame first then overlay current at full opacity.
        // This removes the "jump" between frames caused by integer rounding.
        const prevIndex = Math.max(0, frameIndex - 1);
        if (prevIndex !== frameIndex && frames[prevIndex]?.naturalWidth) {
          drawImageCover(ctx, frames[prevIndex], cw, ch);
          ctx.globalAlpha = Math.min(1, (videoScrubProgress * frames.length) % 1 + 0.5);
          drawImageCover(ctx, frames[frameIndex], cw, ch);
          ctx.globalAlpha = 1;
        } else {
          drawImageCover(ctx, frames[frameIndex], cw, ch);
        }

        // canvas opacity: full during scrub, fade after
        const canvasOpacity = p < VIDEO_END
          ? 1
          : Math.max(0, 1 - (p - VIDEO_END) / (VIDEO_FADE_END - VIDEO_END));
        canvas.style.opacity = canvasOpacity;
      }

      // ── figure pose ──────────────────────────────────────────────
      const sceneProgress = Math.max(0, (p - TEXT_START) / (1 - TEXT_START));
      const sceneFloat    = sceneProgress * (SCENES.length - 1);
      const scene         = Math.min(SCENES.length - 1, Math.floor(sceneFloat));
      const local         = sceneFloat - scene;
      const sceneIndex    = Math.min(SCENES.length - 1, Math.round(sceneFloat));

      const a = poses[Math.min(scene, poses.length - 1)];
      const b = poses[Math.min(scene + 1, poses.length - 1)];
      const rot   = lerp(a.rot,   b.rot,   local);

      const g = figGroupRef.current;
      if (g) {
        g.style.transform = `translate(${lerp(a.x,b.x,local)}px,${lerp(a.y,b.y,local)}px) rotate(${rot}deg) scale(${lerp(a.scale,b.scale,local)})`;
        const arm = lerp(a.arm, b.arm, local);
        const leg = lerp(a.leg, b.leg, local);
        const paths = g.querySelectorAll("path,line");
        if (paths[0]) paths[0].setAttribute("d", `M100,68 L${100 - rot * 0.3},170`);
        if (paths[1]) paths[1].setAttribute("d", `M100,95 L${100 - arm * 1.1},150`);
        if (paths[2]) paths[2].setAttribute("d", `M100,95 L${100 + arm * 1.3},150`);
        if (paths[4]) paths[4].setAttribute("d", `M88,172 L${88 - leg * 1.4},230 L${88 - leg * 1.1},300`);
        if (paths[5]) paths[5].setAttribute("d", `M112,172 L${112 + leg * 1.4},230 L${112 + leg * 1.1},300`);
      }

      const figureOpacity = 0; // hidden — text over cloth pile is the hero moment
      if (figWrapRef.current) figWrapRef.current.style.opacity = figureOpacity;

      // ── text scenes ──────────────────────────────────────────────
      const onVideo = false; // use dark text — video bg is light cream
      const textColor    = onVideo ? "#ffffff" : C.maroon;
      const subColor     = onVideo ? "rgba(255,255,255,0.8)" : C.inkSoft;
      const tagColor     = onVideo ? "rgba(255,255,255,0.75)" : "#8a6cf0";

      if (sceneIndex !== lastSceneRef.current) {
        lastSceneRef.current = sceneIndex;
        textWrapsRef.current.forEach((el, i) => {
          if (el) el.style.display = i === sceneIndex ? "block" : "none";
        });
        dotsRef.current.forEach((dot, i) => {
          if (!dot) return;
          dot.style.opacity    = i === sceneIndex ? "1" : "0.4";
          dot.style.background = i === sceneIndex ? (onVideo ? "#fff" : C.maroon) : "transparent";
          dot.style.borderColor = onVideo ? "#fff" : C.maroon;
        });
        if (hintRef.current) {
          hintRef.current.textContent = sceneIndex < SCENES.length - 1 ? "Keep scrolling" : "Scroll to browse";
          hintRef.current.style.color = onVideo ? "rgba(255,255,255,0.6)" : C.inkSoft;
        }
      }

      // per-frame text transition
      // Text fades in at 2.3s mark (~76.7% scroll), stays visible forever after
      // Fade in at 2.5s mark, lock permanently at full opacity after that
      const textVisible = Math.min(1, Math.max(0, (p - TEXT_START) / 0.08));
      const tOp    = textVisible; // fades in at 2.5s, stays permanently
      const tShift = (1 - textVisible) * 20; // subtle rise on fade-in, then locks
      const activeWrap = textWrapsRef.current[sceneIndex];
      if (activeWrap) {
        activeWrap.style.opacity   = tOp;
        activeWrap.style.transform = `translateY(${tShift}px)`;
        // update text colors
        const tag = activeWrap.querySelector(".scene-tag");
        const h1  = activeWrap.querySelector(".scene-h1");
        const sub = activeWrap.querySelector(".scene-sub");
        if (tag) tag.style.color = tagColor;
        if (h1)  h1.style.color  = textColor;
        if (sub) sub.style.color = subColor;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── passive scroll listener ────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progressRef.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.bgSoft} 0%, ${C.bg} 100%)`, fontFamily: FONT_BODY }}
      >
        {/* ACCENT BAR */}
        <div className="absolute top-0 left-0 w-full h-[6px] z-30" style={{ background: ACCENT_BAR }} />

        {/* CANVAS — frames drawn here */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{
            opacity: 1,
            width: "100%",
            height: "100%",
            // Prevent canvas from being CSS-scaled on mobile which causes blur
            imageRendering: "auto",
          }}
        />
        {/* Dark gradient overlay on top of canvas */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)" }}
        />

        {/* LOADING BAR — shown while frames download */}
        <div
          ref={loadWrapRef}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Loading
          </p>
          <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div ref={loadBarRef} style={{ height: "100%", width: "0%", background: ACCENT_BAR, borderRadius: 2, transition: "width 0.1s linear" }} />
          </div>
        </div>

        {/* TEXT SCENES — pre-rendered, toggled by rAF */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full text-center px-6">
            {SCENES.map((scene, si) => (
              <div
                key={si}
                ref={(el) => { textWrapsRef.current[si] = el; }}
                style={{ display: si === 0 ? "block" : "none", willChange: "opacity, transform" }}
              >

                <h1 className="scene-h1 text-5xl sm:text-7xl font-black leading-[0.9] mx-auto"
                  style={{ color: "#ffffff" }}>
                  {scene.lines.map((line, i) => {
                    const isAccent = si === 0 && line === "Motion.";
                    return (
                      <span key={i} className="block"
                        style={isAccent ? { fontFamily: FONT_ACCENT, fontStyle: "italic", fontWeight: 500, color: C.maroon } : undefined}>
                        {line}
                      </span>
                    );
                  })}
                </h1>
                <p className="scene-sub mt-5 max-w-md text-sm sm:text-base font-medium"
                  style={{ color: "rgba(255,255,255,0.8)" }}>
                  {scene.sub}
                </p>
                {si === SCENES.length - 1 && (
                  <div className="mt-8 flex flex-row items-center justify-center gap-4">
                    <button onClick={() => onNav("category", "shoes")}
                      className="px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105"
                      style={{ background: C.maroon, color: C.bgSoft }}>
                      Order Now <ArrowRight size={16} />
                    </button>
                    <button onClick={() => onNav("category", "apparel")}
                      className="px-6 py-3 rounded-full text-sm font-medium border"
                      style={{ borderColor: C.maroon, color: C.maroon }}>
                      Explore Apparel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ANIMATED FIGURE */}
        <div
          ref={figWrapRef}
          className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 z-10 hidden sm:block"
          style={{ opacity: 0 }}
        >
          <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #b25cf0, transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <svg viewBox="0 0 200 380" width="280" height="532" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="figGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c6cf0" />
                <stop offset="55%" stopColor="#b25cf0" />
                <stop offset="100%" stopColor="#15c2c9" />
              </linearGradient>
            </defs>
            <g ref={figGroupRef} style={{ transformOrigin: "100px 190px" }}>
              <circle cx="100" cy="46" r="22" fill="none" stroke="url(#figGrad)" strokeWidth="4.5" />
              <path d="M100,68 L100,170"   stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M100,95 L80,150"    stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.55" />
              <path d="M100,95 L120,150"   stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <line x1="78" y1="172" x2="122" y2="172" stroke="url(#figGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M88,172 L68,230 L68,300"    stroke="url(#figGrad)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55" />
              <path d="M112,172 L132,230 L132,300"  stroke="url(#figGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>

        {/* SCROLL HINT — subtle down arrow while video is playing */}
        <div ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          style={{ color: C.inkSoft, opacity: 0.5 }}>
          <div style={{ width: 1, height: 32, background: C.inkSoft, opacity: 0.4 }} />
        </div>


      </div>
    </div>
  );
}

/* ========================= TILT PRODUCT CARD ========================= */

function TiltCard({ product, onOpen, isWishlisted, onToggleWish }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 10, glowX: px * 100, glowY: py * 100 });
  };
  const reset = () => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} onClick={() => onOpen(product.id)} className="group relative cursor-pointer" style={{ perspective: "1000px" }}>
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden transition-transform duration-200 ease-out shadow-lg" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, boxShadow: "0 12px 30px rgba(62,26,11,0.18)" }}>
        <ProductVisual hue={product.hue} category={product.category} size="large" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,255,255,0.25), transparent 60%)` }} />
        <button onClick={(e) => { e.stopPropagation(); onToggleWish(product.id); }} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors" style={{ background: "rgba(74,27,12,0.35)" }}>
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

/* ============================== NAVBAR ============================== */

function Navbar({ cartCount, onNav, onCart, searchOpen, setSearchOpen, query, setQuery }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40" style={{ background: C.maroon }}>
      <div className="h-[3px]" style={{ background: ACCENT_BAR }} />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="text-xl font-bold tracking-[0.2em]" style={{ color: C.bgSoft }}>MBZ</button>

        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(251,246,236,0.7)" }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => onNav("category", key)} className="hover:opacity-100 transition-opacity" style={{ color: "inherit" }}>{meta.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen((s) => !s)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ color: C.bgSoft }}><Search size={18} /></button>
          <button onClick={onCart} className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ color: C.bgSoft }}>
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: "#15c2c9", color: C.maroonDeep }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMobileOpen((m) => !m)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center" style={{ color: C.bgSoft }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t px-5 sm:px-8 py-3" style={{ borderColor: "rgba(251,246,236,0.15)", background: C.maroonDeep }}>
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Search size={16} style={{ color: "rgba(251,246,236,0.5)" }} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none text-sm w-full" style={{ color: C.bgSoft }} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t px-5 py-4 flex flex-col gap-3" style={{ borderColor: "rgba(251,246,236,0.15)", background: C.maroonDeep }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => { onNav("category", key); setMobileOpen(false); }} className="text-left text-sm" style={{ color: "rgba(251,246,236,0.85)" }}>{meta.label}</button>
          ))}
        </div>
      )}
    </header>
  );
}


/* ============================== HOME PAGE ============================== */

function HomePage({ onNav, onOpenProduct, wishlist, toggleWish }) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div>
      <CinematicHero onNav={onNav} />

      {/* CATEGORY STRIP */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <button key={key} onClick={() => onNav("category", key)} className="group relative h-56 rounded-2xl overflow-hidden text-left">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ background: `radial-gradient(circle at 70% 30%, hsl(${meta.hue} 80% 58%), hsl(${meta.hue} 55% 18%))` }} />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <Icon size={28} className="text-white/90" strokeWidth={1.25} />
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-semibold">{meta.label}</span>
                    <ArrowRight size={18} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED GRID */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: C.ink }}>Featured</h2>
          <button onClick={() => onNav("category", "shoes")} className="text-sm flex items-center gap-1" style={{ color: C.inkSoft }}>View all <ArrowRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {featured.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} />))}
        </div>
      </section>

      {/* TRUST BAND */}
      <section style={{ background: C.bgSoft, borderTop: `1px solid ${C.line}` }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On all orders over $75" },
            { icon: RotateCcw, title: "30-Day Returns", desc: "No questions asked" },
            { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted end-to-end" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon size={22} strokeWidth={1.5} style={{ color: "#8a6cf0" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: C.ink }}>{title}</p>
                <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.75 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================== CATEGORY PAGE ============================== */

function CategoryPage({ category, onOpenProduct, wishlist, toggleWish, query }) {
  const [sort, setSort] = useState("featured");
  const meta = CATEGORY_META[category];

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === category);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
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

      {products.length === 0 ? (
        <p className="text-sm" style={{ color: C.inkSoft }}>No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (<TiltCard key={p.id} product={p} onOpen={onOpenProduct} isWishlisted={wishlist.has(p.id)} onToggleWish={toggleWish} />))}
        </div>
      )}
    </div>
  );
}

/* ============================== PRODUCT PAGE ============================== */

function ProductPage({ productId, onAddToCart, wishlist, toggleWish, onOpenProduct }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const [size, setSize] = useState(product?.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { setSize(product?.sizes[0]); setQty(1); setAdded(false); }, [productId]);
  if (!product) return null;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
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
                <button key={s} onClick={() => setSize(s)} className="px-4 py-2 rounded-full text-sm border transition-colors"
                  style={size === s ? { background: C.maroon, color: C.bgSoft, borderColor: C.maroon } : { borderColor: C.line, color: C.inkSoft }}>
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
            <button onClick={() => toggleWish(product.id)} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}`, color: C.inkSoft }}>
              <Heart size={16} fill={wishlist.has(product.id) ? C.maroon : "none"} />
            </button>
          </div>

          <button onClick={handleAdd} className="w-full py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
            style={added ? { background: "#2f9e62", color: "#fff" } : { background: C.maroon, color: C.bgSoft }}>
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
            { name: "Priya K.", text: "Material feels premium, exactly like the photos. Shipping was fast too.", stars: 5 },
            { name: "Sam R.", text: "Great quality overall, sizing ran slightly large for me.", stars: 4 },
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

/* ============================== CART DRAWER ============================== */

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

/* ============================== CHECKOUT ============================== */

function CheckoutPage({ cart, onComplete, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "" });
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 75 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name && form.email && form.address && form.city && form.zip && form.card.length >= 12;
  const inputStyle = { background: C.bgSoft, border: `1px solid ${C.line}`, color: C.ink };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-8" style={{ color: C.inkSoft }}><ChevronLeft size={16} /> Back to cart</button>
      <h1 className="text-3xl font-bold mb-10" style={{ color: C.ink }}>Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: C.inkSoft }}>Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Full name" value={form.name} onChange={handleChange("name")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
              <input placeholder="Email" value={form.email} onChange={handleChange("email")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            </div>
          </section>
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: C.inkSoft }}>Shipping Address</h2>
            <div className="space-y-4">
              <input placeholder="Street address" value={form.address} onChange={handleChange("address")} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="City" value={form.city} onChange={handleChange("city")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                <input placeholder="ZIP code" value={form.zip} onChange={handleChange("zip")} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
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
          <button disabled={!valid} onClick={() => onComplete(total)} className="w-full mt-6 py-3.5 rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-transform hover:scale-[1.02]" style={{ background: C.maroon, color: C.bgSoft }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== SUCCESS ============================== */

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

/* ============================== FOOTER ============================== */

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.line}`, marginTop: 40 }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-4 gap-10">
        <div>
          <p className="text-xl font-bold tracking-[0.2em] mb-3" style={{ color: C.ink }}>MBZ</p>
          <p className="text-xs" style={{ color: C.inkSoft, opacity: 0.7 }}>Premium gear built for motion. Engineered, not assembled.</p>
        </div>
        {[
          { title: "Shop", links: ["Shoes", "Apparel", "Accessories"] },
          { title: "Support", links: ["Contact", "FAQ", "Shipping & Returns"] },
          { title: "Company", links: ["About", "Careers", "Press"] },
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

/* ============================== APP ROOT ============================== */

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("shoes");
  const [productId, setProductId] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const updateQty = (id, size, delta) => {
    setCart((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  };

  const removeItem = (id, size) => setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

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

      {view === "home" && <HomePage onNav={handleNav} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} />}
      {view === "category" && <CategoryPage category={category} onOpenProduct={openProduct} wishlist={wishlist} toggleWish={toggleWish} query={query} />}
      {view === "product" && <ProductPage productId={productId} onAddToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} onOpenProduct={openProduct} />}
      {view === "checkout" && <CheckoutPage cart={cart} onComplete={handleCheckoutComplete} onBack={() => { setView("home"); setCartOpen(true); }} />}
      {view === "success" && <SuccessPage total={orderTotal} onContinue={() => handleNav("home")} />}

      {view !== "success" && <Footer />}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem}
        onCheckout={() => { setCartOpen(false); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </div>
  );
}
