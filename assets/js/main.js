/* ==========================================================================
   SkyVast Green Initiative — site interactions
   Vanilla JS, no dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav ---- */
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { body.classList.remove("nav-open"); });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var formatNum = function (n, decimals) {
    return Number(n).toLocaleString("en-US", {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals
    });
  };
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1600, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, decimals);
    };
    requestAnimationFrame(step);
  };
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---- Accordion (FAQ) ---- */
  document.querySelectorAll(".acc-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".acc-item");
      var ans = item.querySelector(".acc-a");
      var isOpen = item.classList.contains("open");
      // close siblings in same accordion
      var acc = item.closest(".accordion");
      if (acc) {
        acc.querySelectorAll(".acc-item.open").forEach(function (o) {
          if (o !== item) { o.classList.remove("open"); o.querySelector(".acc-a").style.maxHeight = null; o.querySelector(".acc-q").setAttribute("aria-expanded", "false"); }
        });
      }
      item.classList.toggle("open", !isOpen);
      q.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      ans.style.maxHeight = !isOpen ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---- Donation widget ---- */
  var give = document.querySelector("[data-give]");
  if (give) {
    var freqBtns = give.querySelectorAll("[data-freq]");
    var amtBtns = give.querySelectorAll("[data-amount]");
    var impactEl = give.querySelector("[data-give-impact]");
    var totalEl = give.querySelector("[data-give-total]");
    var freq = "once";

    var setActive = function (list, el) {
      list.forEach(function (b) { b.classList.remove("active"); });
      el.classList.add("active");
    };
    var render = function (btn) {
      var amt = parseInt(btn.getAttribute("data-amount"), 10);
      if (impactEl) impactEl.textContent = btn.getAttribute("data-impact") || "";
      if (totalEl) totalEl.textContent = "$" + amt.toLocaleString("en-US") + (freq === "monthly" ? " / month" : "");
    };
    freqBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        freq = b.getAttribute("data-freq"); setActive(freqBtns, b);
        var active = give.querySelector("[data-amount].active");
        if (active) render(active);
      });
    });
    amtBtns.forEach(function (b) {
      b.addEventListener("click", function () { setActive(amtBtns, b); render(b); });
    });
    var first = give.querySelector("[data-amount]");
    if (first) { first.classList.add("active"); render(first); }
  }

  /* ---- Forms: friendly fake-submit (static site, no backend) ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Sent ✓"; }
      if (note) { note.textContent = "Thank you — this is a demo form. Connect it to your email or CRM to go live."; note.style.color = "var(--green-600)"; }
      form.reset();
      setTimeout(function () { if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute("data-label") || "Submit"; } }, 2500);
    });
  });

  /* ---- Year stamp ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
