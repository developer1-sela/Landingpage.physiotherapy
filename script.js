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

  function initHeroTilt() {
    if (reducedMotion) return;
    var visual = document.getElementById('heroVisual');
    var card = visual && visual.querySelector('.hero-photo-card');
    if (!visual || !card) return;
    var maxTilt = 8;
    visual.addEventListener('mousemove', function (e) {
      var rect = visual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'rotateY(' + (x * maxTilt) + 'deg) rotateX(' + (-y * maxTilt) + 'deg)';
    });
    visual.addEventListener('mouseleave', function () {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCountUp();
    initHeroTilt();
  });
})();
