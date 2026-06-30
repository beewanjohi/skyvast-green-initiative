/* ==========================================================================
   SkyVast — "From Dust to Dawn" immersive experience
   GSAP + ScrollTrigger + Lenis. Degrades gracefully if libs/IO unavailable.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  doc.getElementById("yr") && (doc.getElementById("yr").textContent = new Date().getFullYear());

  /* ---------------- Interactive preloader (ASAL Gamechanger) ---------------- */
  var pre = doc.getElementById("preloader");
  var plBar = doc.getElementById("plBar"), plNum = doc.getElementById("plNum");
  var plTitle = doc.getElementById("plTitle"), plEnter = doc.getElementById("plEnter"), plHint = doc.getElementById("plHint");
  var noHover = window.matchMedia && window.matchMedia("(hover:none)").matches;
  var entered = false, autoEnterTimer = null;

  function startSite() {
    body.classList.add("ready");
    initSplitReveal();
    if (hasST) buildScroll(); else fallbackReveal();
    initHeroInteractions();
    initHeroAngles();
  }

  /* hero pointer parallax — orb follows cursor, title drifts opposite */
  function initHeroInteractions() {
    if (reduce) return;
    var hero = doc.querySelector(".hero"); if (!hero) return;
    var inner = doc.getElementById("heroBgInner"), title = doc.getElementById("heroTitle");
    var foot = hero.querySelector(".hero-foot"), cue = hero.querySelector(".scroll-cue");
    var tx = 0, ty = 0, ox = 0, oy = 0;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; });
    (function loop() {
      ox += (tx - ox) * 0.06; oy += (ty - oy) * 0.06;
      var hh = hero.offsetHeight || window.innerHeight;
      var sp = Math.min(Math.max((window.pageYOffset || 0) / hh, 0), 1);
      // multi-axis scroll movement + cursor parallax + subtle tilt for realism
      var sx = sp * 34, sy = sp * 58, sRot = sp * 1.4;
      if (inner) inner.style.transform =
        "translate3d(" + (ox * -28 + sx) + "px," + (oy * -24 + sy) + "px,0) scale(" + (1 + sp * 0.06) + ") rotate(" + (ox * 1.3 + sRot) + "deg)";
      if (title) title.style.transform = "translate(" + (ox * 18 + sx * 0.3) + "px," + (oy * 7 - sy * 0.55) + "px)";
      if (foot) { foot.style.transform = "translateY(" + (sy * 0.5) + "px)"; foot.style.opacity = String(1 - sp * 1.3); }
      if (cue) cue.style.opacity = String(0.6 - sp * 1.2);
      requestAnimationFrame(loop);
    })();
  }

  /* angle toggle — switch real photos, auto-advance, restart on manual pick */
  function initHeroAngles() {
    var wrap = doc.getElementById("heroAngles"); if (!wrap) return;
    var slides = doc.querySelectorAll(".hero-slide");
    var btns = wrap.querySelectorAll("button");
    var cap = doc.getElementById("heroCap");
    var caps = [
      "For millions in Kenya's drylands, the nearest water is a half-day's walk away.",
      "Every day, women and children carry the burden — kilometres for a single jerry can.",
      "So we catch the rains: water pans, sand dams and restored catchments that hold the year's life.",
      "Secure water turns bare, cracked ground into something living again.",
      "And living land becomes food, income and a future — led by women and youth."
    ];
    var i = 0, timer = null, DUR = 6000;
    function setCap(n) {
      if (!cap) return;
      cap.classList.remove("show");
      setTimeout(function () { cap.textContent = caps[n] || ""; cap.classList.add("show"); }, 280);
    }
    function show(n, manual) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      btns.forEach(function (b, k) { b.classList.toggle("active", k === i); });
      setCap(i);
      if (manual) restart();
    }
    function next() { show(i + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, DUR); }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { show(parseInt(b.getAttribute("data-angle"), 10), true); });
    });
    if (!reduce) restart();
  }

  /* cursor-driven spotlight + title/image parallax */
  function initPreloaderInteractions() {
    if (!pre || noHover || reduce) return;
    var w = innerWidth, h = innerHeight, tx = w / 2, ty = h * 0.42, cx = tx, cy = ty;
    var imgs = pre.querySelectorAll(".pl-img");
    var lines = plTitle ? plTitle.querySelectorAll(".t-line > span") : [];
    window.addEventListener("resize", function () { w = innerWidth; h = innerHeight; });
    pre.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      if (entered) return;
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      pre.style.setProperty("--mx", cx + "px");
      pre.style.setProperty("--my", cy + "px");
      var ox = cx / w - 0.5, oy = cy / h - 0.5;
      imgs.forEach(function (im) { im.style.transform = "translate(" + (-ox * 34) + "px," + (-oy * 30) + "px) scale(1.05)"; });
      lines.forEach(function (ln) {
        var d = parseFloat(ln.parentNode.getAttribute("data-depth")) || 0.06;
        ln.style.transform = "translate(" + (ox * d * 280) + "px," + (oy * d * 130) + "px)";
      });
      requestAnimationFrame(loop);
    })();
  }

  function runPreloader() {
    if (runPreloader._started) return; runPreloader._started = true;
    var p = 0;
    var t = setInterval(function () {
      p += Math.max(1.4, (100 - p) * 0.09);
      if (p >= 100) { p = 100; clearInterval(t); onLoaded(); }
      if (plBar) plBar.style.width = p + "%";
      if (plNum) plNum.textContent = Math.round(p);
    }, 55);
  }

  function onLoaded() {
    if (plHint) plHint.textContent = noHover ? "Tap to begin the journey" : "The story is ready";
    if (plEnter) { plEnter.querySelector("span").textContent = noHover ? "Tap to enter" : "Click to enter"; plEnter.classList.add("show"); }
    if (pre) pre.addEventListener("click", enterExperience);
    autoEnterTimer = setTimeout(enterExperience, 5000);
  }

  function enterExperience() {
    if (entered) return; entered = true;
    clearTimeout(autoEnterTimer);
    if (!pre) { startSite(); return; }
    pre.classList.add("entering");
    if (hasGSAP) {
      var tl = window.gsap.timeline({ onComplete: function () { pre.style.display = "none"; } });
      if (plEnter) tl.to(plEnter, { opacity: 0, duration: .3 }, 0);
      tl.to(plTitle ? plTitle.querySelectorAll(".t-line > span") : [], { yPercent: -125, duration: .7, ease: "power3.in", stagger: .06 }, 0);
      tl.to(pre.querySelectorAll(".pl-img"), { scale: 1.22, duration: 1.1, ease: "power2.inOut" }, 0);
      tl.to(pre, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, 0.35);
      window.gsap.delayedCall(0.9, startSite);
    } else {
      pre.style.transition = "opacity .6s, transform .6s"; pre.style.opacity = "0";
      setTimeout(function () { pre.style.display = "none"; startSite(); }, 600);
    }
  }

  /* ---------------- Split-line hero reveal ---------------- */
  function initSplitReveal() {
    if (reduce || !hasGSAP) {
      doc.querySelectorAll(".mega .ln > span").forEach(function (s) { s.style.transform = "none"; });
      return;
    }
  }
  function revealMega(scope) {
    if (!hasGSAP) return;
    var spans = (scope || doc).querySelectorAll(".mega .ln > span");
    window.gsap.to(spans, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08 });
  }

  /* ---------------- Counters ---------------- */
  function formatCount(v, el) {
    if (el.getAttribute("data-short") === "b") return (v / 1e9).toFixed(v >= 1e9 ? 0 : 1) + "B";
    return Math.round(v).toLocaleString("en-US");
  }
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    if (hasGSAP && !reduce) {
      var obj = { v: 0 };
      window.gsap.to(obj, { v: target, duration: 2.0, ease: "power2.out",
        onUpdate: function () { el.textContent = formatCount(obj.v, el); } });
    } else { el.textContent = formatCount(target, el); }
  }

  /* ---------------- Fallback (no ScrollTrigger) ---------------- */
  function fallbackReveal() {
    revealMega();
    doc.querySelectorAll("[data-fade]").forEach(function (el) { el.classList.remove("fu"); });
    doc.querySelectorAll("[data-counter]").forEach(animateCounter);
    var tw = doc.getElementById("tankWater"); if (tw) tw.style.height = "82%";
  }

  /* ---------------- Lenis smooth scroll ---------------- */
  var lenis = null;
  function initLenis() {
    if (!hasLenis || reduce) return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasST) { lenis.on("scroll", window.ScrollTrigger.update); }
  }

  /* ---------------- Build all scroll animations ---------------- */
  function buildScroll() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    initLenis();

    // Hero mega reveal on load
    revealMega(doc.querySelector(".hero"));

    // Parallax layers
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-parallax")) || 0.2;
      gsap.to(el, { yPercent: depth * 60, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Hero background motion is handled in the rAF loop (initHeroInteractions),
    // combining cursor parallax with multi-axis scroll movement.

    // Fade-up groups
    gsap.utils.toArray("[data-fade]").forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" } });
    });

    // Mega lines in later chapters
    gsap.utils.toArray(".chapter [data-split-lines]").forEach(function (m) {
      var spans = m.querySelectorAll(".ln > span");
      gsap.to(spans, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08,
        scrollTrigger: { trigger: m, start: "top 80%" } });
    });

    // Counters
    gsap.utils.toArray("[data-counter]").forEach(function (el) {
      ST.create({ trigger: el, start: "top 85%", once: true, onEnter: function () { animateCounter(el); } });
    });

    // Water tank fill
    var tank = doc.getElementById("tankWater");
    if (tank) gsap.fromTo(tank, { height: "6%" }, { height: "86%", ease: "none",
      scrollTrigger: { trigger: ".c-water", start: "top 70%", end: "bottom bottom", scrub: true } });

    // Horizontal pillars — pinned + scrubbed on desktop only.
    // On phones (<=760px) the panels stack vertically (see CSS), so we skip the
    // pin entirely: it was the main source of mobile scroll jank.
    var track = doc.getElementById("hTrack"), pin = doc.getElementById("hPin");
    var pillarsHorizontal = window.matchMedia("(min-width:761px)").matches;
    if (track && pin && pillarsHorizontal) {
      var getScroll = function () { return track.scrollWidth - pin.clientWidth + window.innerWidth * 0.16; };
      gsap.to(track, { x: function () { return -getScroll(); }, ease: "none",
        scrollTrigger: { trigger: ".c-pillars", start: "top top", end: function () { return "+=" + getScroll(); },
          pin: true, scrub: 1, invalidateOnRefresh: true } });
    }

    // Forest trees grow
    gsap.utils.toArray("#forestTrees .tree").forEach(function (tr, i) {
      gsap.fromTo(tr, { scaleY: 0.05, transformOrigin: "bottom center", opacity: 0.2 },
        { scaleY: 1, opacity: 0.5, ease: "power2.out", duration: 1,
          scrollTrigger: { trigger: ".c-forest", start: "top 70%", end: "center center", scrub: true } });
    });

    // Marquee drift
    var mq = doc.getElementById("marquee");
    if (mq) gsap.to(mq, { xPercent: -50, ease: "none",
      scrollTrigger: { trigger: ".c-econ", start: "top bottom", end: "bottom top", scrub: 1 } });

    // Progress water tube
    var fill = doc.getElementById("progFill");
    if (fill) ST.create({ start: 0, end: "max",
      onUpdate: function (self) { fill.style.height = (self.progress * 100) + "%"; } });

    ST.refresh();
  }

  /* ---------------- Custom cursor + magnetic ---------------- */
  function initCursor() {
    if (reduce || matchMedia("(hover:none)").matches) return;
    var ring = doc.querySelector(".cursor"), dot = doc.querySelector(".cursor-dot");
    if (!ring || !dot) return;
    var rx = innerWidth / 2, ry = innerHeight / 2, dx = rx, dy = ry, tx = rx, ty = ry;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; dot.style.transform = "translate(" + tx + "px," + ty + "px) translate(-50%,-50%)"; });
    (function loop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    doc.querySelectorAll("[data-cursor], a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        ring.classList.add("hot");
        ring.setAttribute("data-label", el.getAttribute("data-cursor") || "");
      });
      el.addEventListener("mouseleave", function () { ring.classList.remove("hot"); ring.removeAttribute("data-label"); });
    });

    // Magnetic
    if (hasGSAP) {
      doc.querySelectorAll("[data-magnetic]").forEach(function (btn) {
        var inner = btn.querySelector(".m-inner") || btn;
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          var mx = e.clientX - r.left - r.width / 2, my = e.clientY - r.top - r.height / 2;
          window.gsap.to(btn, { x: mx * 0.3, y: my * 0.4, duration: 0.4, ease: "power3.out" });
          window.gsap.to(inner, { x: mx * 0.15, y: my * 0.2, duration: 0.4, ease: "power3.out" });
        });
        btn.addEventListener("mouseleave", function () {
          window.gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
          window.gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
        });
      });
    }
  }

  /* ---------------- Go ---------------- */
  initCursor();
  if (noHover) body.classList.add("no-hover");
  if (reduce) {
    if (pre) pre.style.display = "none";
    startSite();
  } else {
    initPreloaderInteractions();
    window.addEventListener("load", runPreloader);
    setTimeout(function () { if (!runPreloader._started) runPreloader(); }, 1400);
  }
})();

/* ==========================================================================
   Restoration · BEFORE / AFTER comparison slider
   Self-contained: works with mouse, touch and keyboard; no GSAP needed.
   ========================================================================== */
(function () {
  "use strict";
  function init() {
    var fig = document.getElementById("baFigure");
    if (!fig) return;
    var range = fig.querySelector(".ba-range");
    function set(v) { fig.style.setProperty("--pos", v + "%"); }
    if (range) {
      var onMove = function () { fig.classList.add("touched"); set(range.value); };
      range.addEventListener("input", onMove);
      range.addEventListener("change", onMove);
      range.addEventListener("pointerdown", function () { fig.classList.add("touched"); });
      set(range.value);
    }
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
