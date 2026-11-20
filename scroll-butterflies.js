(() => {
  const butterflies = Array.from(document.querySelectorAll('.scroll-butterfly'));
  if (!butterflies.length) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    butterflies.forEach((butterfly) => {
      butterfly.style.opacity = '.42';
      butterfly.style.visibility = 'visible';
    });
    return;
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(butterflies, { autoAlpha: 0, y: 34, x: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: document.body,
        start: 140,
        end: () => Math.max(700, ScrollTrigger.maxScroll(window) - 80),
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    butterflies.forEach((butterfly, index) => {
      const isRight = butterfly.classList.contains('right');
      const targetOpacity = Number(butterfly.dataset.opacity || .5);
      const drift = innerWidth < 1400 ? 0 : gsap.utils.random(-18, 18, 1);
      const turn = isRight ? -6 : 6;
      const position = index * .17 + (isRight ? .06 : 0);

      timeline
        .to(butterfly, {
          autoAlpha: targetOpacity,
          y: -38,
          x: drift,
          rotation: turn,
          duration: .32
        }, position)
        .to(butterfly, {
          y: -86,
          x: drift * .45,
          rotation: -turn * .55,
          duration: .58
        }, position + .32);
    });

    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    return;
  }

  document.documentElement.classList.add('butterflies-fallback');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: .1 });

  butterflies.forEach((butterfly) => observer.observe(butterfly));
})();
