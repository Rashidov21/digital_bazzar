/**
 * Uzgen Market — Presentation Controller
 * Fullpage.js + section animations + header theme
 */

(function () {
  "use strict";

  const DARK_SECTIONS = ["control", "security", "compare", "future", "final"];
  const TOTAL_SLIDES = 16;

  let fullpageInstance = null;
  let currentAnchor = "hero";

  function padNumber(n) {
    return String(n).padStart(2, "0");
  }

  function updateSlideCounter(index) {
    const current = document.querySelector(".slide-counter__current");
    if (current) {
      current.textContent = padNumber(index + 1);
    }
  }

  function updateHeaderTheme(anchor) {
    const header = document.querySelector(".presentation-header");
    if (!header) return;
    header.classList.toggle("is-dark", DARK_SECTIONS.includes(anchor));
  }

  function triggerSectionAnimations(sectionEl) {
    if (!sectionEl) return;

    const reveals = sectionEl.querySelectorAll(".reveal, .stagger-children, .draw-line, .ecosystem-diagram");
    reveals.forEach((el) => {
      el.classList.remove("is-visible");
      void el.offsetWidth;
      el.classList.add("is-visible");
    });
  }

  function resetSectionAnimations(sectionEl) {
    if (!sectionEl) return;
    sectionEl.querySelectorAll(".is-visible").forEach((el) => {
      if (el.classList.contains("reveal") ||
          el.classList.contains("stagger-children") ||
          el.classList.contains("draw-line") ||
          el.classList.contains("ecosystem-diagram")) {
        el.classList.remove("is-visible");
      }
    });
  }

  function showHeader() {
    const header = document.querySelector(".presentation-header");
    const triggerZone = document.querySelector(".header-trigger-zone");
    if (!header) return;
    header.classList.remove("is-hidden");
    header.classList.add("is-visible");
    if (triggerZone) triggerZone.classList.remove("is-disabled");
  }

  function hideHeader(force) {
    const header = document.querySelector(".presentation-header");
    const triggerZone = document.querySelector(".header-trigger-zone");
    if (!header) return;
    if (!force && header.matches(":hover")) return;
    header.classList.add("is-hidden");
    header.classList.remove("is-visible");
    if (triggerZone) triggerZone.classList.add("is-disabled");
  }

  function updateHeaderVisibility(anchor) {
    currentAnchor = anchor;
    updateHeaderTheme(anchor);
    document.body.classList.toggle("is-hero-slide", anchor === "hero");

    clearTimeout(window._headerHideTimer);

    if (anchor === "hero") {
      showHeader();
      window._headerHideTimer = setTimeout(() => hideHeader(false), 2500);
    } else {
      hideHeader(true);
    }
  }

  function initHeaderAutoHide() {
    const header = document.querySelector(".presentation-header");
    const triggerZone = document.querySelector(".header-trigger-zone");
    if (!header) return;

    let hideTimer = null;
    const HIDE_DELAY = 2500;
    const TOP_ZONE = 80;

    function scheduleHide() {
      if (currentAnchor !== "hero") return;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => hideHeader(false), HIDE_DELAY);
    }

    function revealHeader() {
      if (currentAnchor !== "hero") return;
      showHeader();
      scheduleHide();
    }

    document.addEventListener("mousemove", (e) => {
      if (currentAnchor !== "hero") return;
      if (e.clientY <= TOP_ZONE) {
        revealHeader();
      }
    });

    if (triggerZone) {
      triggerZone.addEventListener("mouseenter", revealHeader);
    }

    header.addEventListener("mouseenter", () => {
      if (currentAnchor !== "hero") return;
      clearTimeout(hideTimer);
      showHeader();
    });

    header.addEventListener("mouseleave", scheduleHide);

    document.addEventListener("keydown", () => {
      if (currentAnchor !== "hero") return;
      revealHeader();
    });

    updateHeaderVisibility("hero");
  }

  function preloadSectionImages(sectionEl) {
    if (!sectionEl) return;
    sectionEl.querySelectorAll("img[loading='lazy']").forEach((img) => {
      if (img.complete) return;
      const loader = new Image();
      loader.src = img.currentSrc || img.src;
    });
  }

  function preloadNearbySlides(index) {
    const sections = document.querySelectorAll("#fullpage .fp-section");
    [index - 1, index + 1, index + 2].forEach((i) => {
      if (i >= 0 && i < sections.length) {
        preloadSectionImages(sections[i]);
      }
    });
  }

  function initFullpage() {
    fullpageInstance = new fullpage("#fullpage", {
      licenseKey: "gplv3-license",
      navigation: true,
      navigationPosition: "right",
      scrollingSpeed: 900,
      css3: true,
      fitToSection: true,
      scrollOverflow: false,
      keyboardScrolling: true,
      animateAnchor: true,
      recordHistory: false,
      afterLoad: function (_origin, destination) {
        const anchor = destination.anchor;
        updateSlideCounter(destination.index);
        updateHeaderVisibility(anchor);
        triggerSectionAnimations(destination.item);
        preloadSectionImages(destination.item);
        preloadNearbySlides(destination.index);
      },
      onLeave: function (origin) {
        resetSectionAnimations(origin.item);
      }
    });

    const firstSection = document.querySelector(".fp-section.active");
    if (firstSection) {
      updateSlideCounter(0);
      updateHeaderVisibility("hero");
      setTimeout(() => {
        triggerSectionAnimations(firstSection);
        preloadNearbySlides(0);
      }, 300);
    }
  }

  function initRevealObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal, .stagger-children").forEach((el) => {
      observer.observe(el);
    });
  }

  function initParallax() {
    document.addEventListener("mousemove", (e) => {
      const parallaxEls = document.querySelectorAll(".parallax-bg");
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      parallaxEls.forEach((el) => {
        el.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      });
    });
  }

  function initKeyboardHints() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Home") {
        fullpageInstance.moveTo(1);
      }
      if (e.key === "End") {
        fullpageInstance.moveTo(TOTAL_SLIDES);
      }
    });
  }

  function init() {
    initFullpage();
    initRevealObserver();
    initParallax();
    initKeyboardHints();
    initHeaderAutoHide();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
