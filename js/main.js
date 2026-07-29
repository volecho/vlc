/* ==========================================================================
   INDIEFFERENTIAL — main.js
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Partial includes (header / footer / player) ---------- */
  function loadPartials() {
    const nodes = document.querySelectorAll("[data-include]");
    const base = document.body.getAttribute("data-root") || "";
    const promises = Array.from(nodes).map((node) => {
      const file = node.getAttribute("data-include");
      return fetch(base + "partials/" + file)
        .then((r) => r.text())
        .then((html) => {
          node.innerHTML = html;
        })
        .catch(() => {
          node.innerHTML = "";
        });
    });
    return Promise.all(promises);
  }

  /* ---------- Loader (vinyl) ---------- */
  function initLoader() {
    const loader = document.querySelector(".loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("is-hidden"), 450);
    });
    // fail-safe
    setTimeout(() => loader.classList.add("is-hidden"), 2600);
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    function raf() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .card, input, textarea, .filter-chip")) {
        ring.classList.add("is-active");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .card, input, textarea, .filter-chip")) {
        ring.classList.remove("is-active");
      }
    });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + "%";
    }, { passive: true });
  }

  /* ---------- Header show/hide + blur on scroll ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      if (y > lastY && y > 200) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    if (!toggle || !mobileNav) return;
    toggle.addEventListener("click", () => {
      mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-open");
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-open");
      })
    );
  }

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const btn = document.querySelector("[data-theme-toggle]");
    const root = document.documentElement;
    const saved = localStorage.getItem("indf-theme");
    if (saved) root.setAttribute("data-theme", saved);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      if (cur === "light") root.setAttribute("data-theme", "light");
      else root.removeAttribute("data-theme");
      localStorage.setItem("indf-theme", cur);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("is-visible"), (entry.target.dataset.delay || 0));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Hero title split-text reveal ---------- */
  function initTextReveal() {
    document.querySelectorAll(".hero-title .line span").forEach((span, i) => {
      setTimeout(() => {
        span.style.transition = "transform .9s cubic-bezier(.16,.84,.32,1)";
        span.style.transform = "translateY(0)";
      }, 200 + i * 110);
    });
  }

  /* ---------- Mouse-following gradient in hero ---------- */
  function initHeroGradient() {
    const hero = document.querySelector(".hero");
    const grad = document.querySelector(".hero-noise-grad");
    if (!hero || !grad) return;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      grad.style.setProperty("--mx", x + "%");
      grad.style.setProperty("--my", y + "%");
    });
  }

  /* ---------- Parallax on scroll ---------- */
  function initParallax() {
    const media = document.querySelector(".hero-media img");
    if (!media) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      media.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------- Hero slider index (image swap) ---------- */
  function initHeroIndex() {
    const btns = document.querySelectorAll(".hero-index button");
    const img = document.querySelector(".hero-media img");
    if (!btns.length || !img) return;
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
        const src = b.getAttribute("data-img");
        if (src) img.style.opacity = "0";
        setTimeout(() => {
          if (src) img.src = src;
          img.style.opacity = "1";
        }, 260);
      });
    });
  }

  /* ---------- Mini player ---------- */
  function initMiniPlayer() {
    const player = document.querySelector(".mini-player");
    if (!player) return;
    const playBtn = player.querySelector(".mp-play");
    const wave = player.querySelector(".mp-wave");
    const art = player.querySelector(".mp-art");
    const closeBtn = player.querySelector(".mp-close");
    const title = player.querySelector(".mp-title");
    const artist = player.querySelector(".mp-artist");
    let playing = false;

    function setPlaying(state) {
      playing = state;
      wave.classList.toggle("is-playing", playing);
      art.classList.toggle("is-playing", playing);
      playBtn.innerHTML = playing
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l14 8-14 8V4z"/></svg>';
    }
    setPlaying(false);

    playBtn.addEventListener("click", () => {
      if (!player.classList.contains("is-open")) player.classList.add("is-open");
      setPlaying(!playing);
    });
    if (closeBtn) closeBtn.addEventListener("click", () => player.classList.remove("is-open"));

    // Global hook: any element with data-play-track opens/plays the player
    document.querySelectorAll("[data-play-track]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        player.classList.add("is-open");
        setPlaying(true);
        const t = el.getAttribute("data-track-title");
        const a = el.getAttribute("data-track-artist");
        const i = el.getAttribute("data-track-art");
        if (t && title) title.textContent = t;
        if (a && artist) artist.textContent = a;
        if (i) art.querySelector("img").src = i;
        showToast("Now playing — " + (t || "Track"));
      });
    });
  }

  /* ---------- Bookmarks (localStorage) ---------- */
  function initBookmarks() {
    const saved = JSON.parse(localStorage.getItem("indf-bookmarks") || "[]");
    document.querySelectorAll(".bookmark-btn").forEach((btn) => {
      const id = btn.getAttribute("data-id");
      if (saved.includes(id)) btn.classList.add("is-active");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        let list = JSON.parse(localStorage.getItem("indf-bookmarks") || "[]");
        if (list.includes(id)) {
          list = list.filter((x) => x !== id);
          btn.classList.remove("is-active");
          showToast("Removed from saved");
        } else {
          list.push(id);
          btn.classList.add("is-active");
          showToast("Saved to your reading list");
        }
        localStorage.setItem("indf-bookmarks", JSON.stringify(list));
      });
    });
  }

  /* ---------- Follow artist buttons ---------- */
  function initFollow() {
    document.querySelectorAll(".artist-follow").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle("is-following");
        showToast(btn.classList.contains("is-following") ? "Following artist" : "Unfollowed");
      });
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }
  window.showToast = showToast;

  /* ---------- Newsletter form ---------- */
  function initNewsletter() {
    document.querySelectorAll(".newsletter-form, .contact-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Thanks — you're on the list.");
        form.reset();
      });
    });
  }

  /* ---------- Article reading progress + reading time ---------- */
  function initArticleProgress() {
    const bar = document.querySelector(".article-progress");
    const body = document.querySelector(".article-body");
    if (!bar || !body) return;
    window.addEventListener("scroll", () => {
      const rect = body.getBoundingClientRect();
      const total = body.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
    }, { passive: true });
  }

  /* ---------- Active nav link ---------- */
  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) a.classList.add("is-active");
    });
  }

  /* ---------- Filter chips (client-side show/hide) ---------- */
  function initFilters() {
    document.querySelectorAll(".filter-bar").forEach((bar) => {
      const chips = bar.querySelectorAll(".filter-chip");
      const targetSel = bar.getAttribute("data-target");
      const items = targetSel ? document.querySelectorAll(targetSel + " [data-cat]") : [];
      chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          chips.forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");
          const cat = chip.getAttribute("data-filter");
          items.forEach((item) => {
            const show = cat === "all" || item.getAttribute("data-cat") === cat;
            item.style.display = show ? "" : "none";
          });
        });
      });
    });
  }

  /* ---------- Comment form (front-end only) ---------- */
  function initComments() {
    const form = document.querySelector(".comment-form");
    const list = document.querySelector(".comment-list");
    if (!form || !list) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const textarea = form.querySelector("textarea");
      const nameInput = form.querySelector('input[name="name"]');
      const text = textarea.value.trim();
      if (!text) return;
      const name = (nameInput && nameInput.value.trim()) || "Anonymous";
      const el = document.createElement("div");
      el.className = "comment";
      el.innerHTML = `
        <img src="https://i.pravatar.cc/80?u=${encodeURIComponent(name + Date.now())}" alt="">
        <div>
          <span class="comment-name">${escapeHtml(name)}</span>
          <span class="comment-time"> · just now</span>
          <div class="comment-text">${escapeHtml(text)}</div>
        </div>`;
      list.prepend(el);
      form.reset();
      showToast("Comment posted");
    });
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Init everything ---------- */
  function initAll() {
    initLoader();
    initCursor();
    initScrollProgress();
    initHeader();
    initMobileNav();
    initTheme();
    initReveal();
    initTextReveal();
    initHeroGradient();
    initParallax();
    initMagnetic();
    initHeroIndex();
    initMiniPlayer();
    initBookmarks();
    initFollow();
    initNewsletter();
    initArticleProgress();
    markActiveNav();
    initFilters();
    initComments();
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadPartials().then(initAll);
  });
})();
