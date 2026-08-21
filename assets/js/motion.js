/*
 * Motion layer for spazio17.org: reveal-on-scroll, and the frosted masthead
 * once the page has scrolled under it.
 *
 * The stylesheet keeps the hidden state inside the keyframes, so this file can
 * only ever ADD an animation to something already visible. That is deliberate,
 * and it is the second attempt: the first version set opacity to zero and
 * cleared it on an IntersectionObserver callback, which makes one missing
 * callback into a page of invisible text. Now the worst case is a page that does
 * not animate, which is a page.
 *
 * Reduced motion is checked here as well as in CSS, so nothing is even marked.
 */
(function () {
  var root = document.documentElement;
  var still = false;

  try {
    still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* no matchMedia: treat as motion allowed */ }

  if (!still && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.reveal');

    // Stagger within each parent rather than across the whole page: a document
    // order delay would make the last card on a long page wait seconds.
    var seen = new Map();
    targets.forEach(function (el) {
      var n = seen.get(el.parentNode) || 0;
      seen.set(el.parentNode, n + 1);
      el.style.animationDelay = Math.min(n * 70, 350) + 'ms';
    });

    // Positive bottom margin: fire just before the element scrolls in, so the
    // rise is already running when it appears rather than starting after it is
    // already on screen.
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        watcher.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 10% 0px', threshold: 0 });

    targets.forEach(function (el) { watcher.observe(el); });
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
