/* Page-specific behavior — العلاج الطبيعي (physiotherapy service landing page) */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCountUp() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function render(el, target, decimals, suffix) {
      el.textContent = target.toFixed(decimals) + suffix;
    }

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) { render(el, target, decimals, suffix); return; }
      var start = null;
      var duration = 1100;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else render(el, target, decimals, suffix);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        animate(el);
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    els.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCountUp();
  });
})();
