function clickAndDrag(
  selector,
  scroll_speed = 1,
  classOnEvent = "grabbed_elem"
) {
  const sliders = document.querySelectorAll(selector);
  sliders.forEach((slider) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDown = true;
      slider.classList.add(classOnEvent);
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;

      // prevent default child behavior
      document.body.addEventListener("click", function (event) {
        if (slider.contains(event.target)) {
          event.preventDefault();
        }
      });
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove(classOnEvent);
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove(classOnEvent);
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * scroll_speed; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  });
}

// usage
clickAndDrag(".parent");
