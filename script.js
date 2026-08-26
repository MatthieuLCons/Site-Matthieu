(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Theme toggle (persists in localStorage, falls back to system preference) */
  var themeToggle = document.getElementById("theme-toggle");
  var root = document.documentElement;

  function currentTheme() {
    try {
      var saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) { /* localStorage unavailable — ignore */ }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  applyTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });

    /* Safety net: if an element never intersects (e.g. it starts already
       visible above the fold, or the observer stalls in an unusual
       environment) reveal it anyway after a short delay so content can
       never stay hidden indefinitely. */
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
      observer.disconnect();
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
