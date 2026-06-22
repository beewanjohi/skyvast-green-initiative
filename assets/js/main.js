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

  /* ---- Splash intro ---- */
  var splash = document.querySelector(".splash");
  if (splash) {
    var dismiss = function () { body.classList.add("splash-done"); };
    setTimeout(dismiss, 3300);
    splash.addEventListener("click", dismiss);
  }

  /* ---- Team bio modal ---- */
  var modal = document.querySelector("[data-bio-modal]");
  if (modal) {
    var mPhoto = modal.querySelector("[data-m-photo]");
    var mName = modal.querySelector("[data-m-name]");
    var mRole = modal.querySelector("[data-m-role]");
    var mBody = modal.querySelector("[data-m-body]");
    var mContact = modal.querySelector("[data-m-contact]");
    var lastFocus = null;

    var openModal = function (card) {
      lastFocus = card;
      var photoNode = card.querySelector(".team-photo").cloneNode(true);
      var vb = photoNode.querySelector(".view-bio");
      if (vb) vb.remove();
      mPhoto.innerHTML = photoNode.innerHTML;
      mName.textContent = card.getAttribute("data-name") || "";
      mRole.textContent = card.getAttribute("data-role") || "";
      mBody.innerHTML = card.querySelector("[data-bio]").innerHTML;
      var ln = card.getAttribute("data-linkedin");
      var tel = card.getAttribute("data-tel");
      var mail = card.getAttribute("data-email");
      var html = "";
      if (ln) html += '<a href="' + ln + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" width="15"><path d="M4.98 3.5A2.5 2.5 0 102.5 6 2.5 2.5 0 004.98 3.5zM3 8h4v13H3zM10 8h3.8v1.8h.05A4.2 4.2 0 0118 8c4 0 4 2.6 4 6v7h-4v-6c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21h-4z"/></svg>LinkedIn</a>';
      if (tel) html += '<a href="tel:' + tel.replace(/[^+0-9]/g, "") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15"><path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 6a2 2 0 012-2z"/></svg>' + tel + '</a>';
      if (mail) html += '<a href="mailto:' + mail + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15"><path d="M4 5h16v14H4z"/><path d="M4 6l8 6 8-6"/></svg>' + mail + '</a>';
      mContact.innerHTML = html;
      modal.classList.add("open");
      body.style.overflow = "hidden";
      modal.querySelector(".modal-close").focus();
    };
    var closeModal = function () {
      modal.classList.remove("open");
      body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll(".team-card").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", function () { openModal(card); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
      });
    });
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }
})();
