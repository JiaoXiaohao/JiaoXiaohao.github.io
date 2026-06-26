(function () {
  const roots = document.querySelectorAll("[data-home-showcase]");

  roots.forEach((root) => {
    const slides = Array.from(root.querySelectorAll("[data-home-showcase-slide]"));
    const previous = root.querySelector("[data-home-showcase-previous]");
    const next = root.querySelector("[data-home-showcase-next]");
    if (!slides.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let pendingFrame;

    const show = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      const applyActiveSlide = () => {
        pendingFrame = null;
        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));
        });
      };

      if (pendingFrame) {
        window.cancelAnimationFrame(pendingFrame);
      }

      if (prefersReducedMotion) {
        applyActiveSlide();
        return;
      }

      pendingFrame = window.requestAnimationFrame(applyActiveSlide);
    };

    show(activeIndex);

    previous?.addEventListener("click", () => show(activeIndex - 1));
    next?.addEventListener("click", () => show(activeIndex + 1));
  });
})();
