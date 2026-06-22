(function () {
  const roots = document.querySelectorAll("[data-home-showcase]");

  roots.forEach((root) => {
    const slides = Array.from(root.querySelectorAll("[data-home-showcase-slide]"));
    const previous = root.querySelector("[data-home-showcase-previous]");
    const next = root.querySelector("[data-home-showcase-next]");
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

    const show = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
    };

    previous?.addEventListener("click", () => show(activeIndex - 1));
    next?.addEventListener("click", () => show(activeIndex + 1));
  });
})();
