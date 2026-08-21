/*
 * Motion layer for spazio17.org: reveal-on-scroll, and the frosted masthead
 * once the page has scrolled under it. Both are enhancements, so the rule here
 * is that the page has to be complete and readable if this file never runs.
 *
 * That is why the hidden-until-revealed state lives behind an `.reveals` class
 * that only this file sets. Putting `opacity: 0` in the stylesheet directly
 * would mean a reader with JavaScript off, or a fetch that failed, gets a page
 * of invisible text.
 *
 * Reduced motion is honoured here as well as in CSS. The stylesheet already
 * kills the transitions, but without this check the elements would still be
 * flipped from hidden to shown, which is a flash rather than a movement.
 */
(function () {
  var root = document.documentElement;
  var still = false;

  try {
    still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* no matchMedia: treat as motion allowed */ }

  // ------------------------------------------------------------ reveal on scroll
  if (!still && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.reveal');
    if (targets.length) {
      root.classList.add('reveals');

      // Stagger within each parent rather than across the whole page: a document
      // order delay would make the last card on a long page wait seconds.
      var seen = new Map();
      targets.forEach(function (el) {
        var n = seen.get(el.parentNode) || 0;
        seen.set(el.parentNode, n + 1);
        el.style.transitionDelay = Math.min(n * 70, 350) + 'ms';
      });

      var watcher = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          watcher.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

      targets.forEach(function (el) { watcher.observe(el); });
    }
  }

  // --------------------------------------------------------- masthead on scroll
  // Read once per frame at most: the handler runs on every scroll event, and
  // touching scrollY without the rAF gate is the classic way to make a cheap
  // effect feel expensive.
  var queued = false;
  function mast() {
    queued = false;
    root.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(mast);
  }, { passive: true });
  mast();
})();
