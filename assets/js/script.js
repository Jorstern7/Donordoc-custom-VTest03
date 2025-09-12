/* 
Template Name: DONORDOC-B01 
Author: FRONTLENS LLC 
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly prohibited without written consent. 
Copyright (c) 2025 FRONTLENS LLC. All rights reserved. 
*/

// Preloader: show secondary background with primary-colored spinner until all assets are loaded
(function initPreloader() {
  try {
    const body = document.body;
    if (!body) return;
    body.classList.add("loading");

    const preloader = document.createElement("div");
    preloader.id = "preloader";
    preloader.innerHTML =
      '<div class="preloader-spinner" role="status" aria-label="Loading"></div>';
    body.appendChild(preloader);

    window.addEventListener("load", () => {
      // Hide overlay after load; allow CSS transition to finish before removal
      preloader.classList.add("preloader-hidden");
      body.classList.remove("loading");
      setTimeout(() => preloader.remove(), 450);
    });
  } catch (err) {
    // Fail-safe: never block load if something goes wrong
    console.error("Preloader init error:", err);
  }
})();

// Throttle function to limit how often a function can fire
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  initStickyHeader();
  initMobileMenu();
  initSwipers();
  initFlipCards();
  initBackToTop();
  initCustomSelects();
  initBlogSection();
  initDropdownBehaviors();
  initNavLinkEffects();
  initLazyImages();
  initImageBlurUp();
});

function initStickyHeader() {
  const header = document.getElementById("header");
  const hero = document.querySelector(".section-health");

  if (!header || !hero) return;

  const updateHeroPadding = () => {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  };

  window.addEventListener("load", updateHeroPadding);

  // Use throttled version for scroll performance
  const throttledUpdate = throttle(updateHeroPadding, 100);

  const obs = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;

      header.classList.toggle("sticky", !entry.isIntersecting);
      if (!entry.isIntersecting) throttledUpdate();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    }
  );

  obs.observe(hero);
}

function initMobileMenu() {
  const toggler = document.querySelector(".navbar-toggler");
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const offcanvasInstance = offcanvasElement
    ? bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement)
    : null;

  if (toggler) {
    toggler.addEventListener("click", () => {
      toggler.classList.toggle("opened");
    });
  }

  const offcanvasLinks = document.querySelectorAll(
    '.offcanvas-body li:not(.dropdown) a[href^="#"]'
  );
  offcanvasLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }

      if (toggler) {
        toggler.classList.remove("opened");
      }
    });
  });

  if (offcanvasElement) {
    offcanvasElement.addEventListener("hidden.bs.offcanvas", () => {
      if (toggler) {
        toggler.classList.remove("opened");
      }
    });
  }
}

function initSwipers() {
  // Header swiper - optimized with passive events for better scroll performance
  const headerSwiper = new Swiper(".header-swiper", {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: true,
    speed: 5000,
    autoplay: {
      delay: 0,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
    },
    grabCursor: true,
    allowTouchMove: true,
    passiveListeners: true, // Improve scroll performance
    on: {
      init: scaleMiddleSlide,
      slideChangeTransitionEnd: throttle(scaleMiddleSlide, 100), // Throttle expensive operation
    },
  });

  // Featured swiper
  new Swiper(".featured-swiper", {
    slidesPerView: 4,
    spaceBetween: 0,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 0,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
    },
    grabCursor: true,
    allowTouchMove: true,
    passiveListeners: true,
    breakpoints: {
      500: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
      1199: { slidesPerView: 4 },
    },
  });

  // Doctors swiper - disable autoplay by default to improve performance
  const doctorsSwiper = new Swiper(".doctors-swiper", {
    slidesPerView: 2,
    spaceBetween: 40,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 800, // Reduced from 3000 for better UX
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      enabled: false, // Disabled by default to prevent scroll jank
    },
    navigation: {
      nextEl: ".doctors-next",
      prevEl: ".doctors-prev",
    },
    passiveListeners: true,
    breakpoints: {
      0: { slidesPerView: 1 },
      800: { slidesPerView: 2 },
      992: { slidesPerView: 2 },
    },
  });

  // Pricing swiper - disable autoplay by default
  const pricingSwiper = new Swiper(".pricing-swiper", {
    slidesPerView: 3,
    spaceBetween: 10,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 800, // Reduced from 3000
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      enabled: false, // Disabled by default
    },
    navigation: {
      nextEl: ".pricing-next",
      prevEl: ".pricing-prev",
    },
    passiveListeners: true,
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
    },
  });

  // Testimonials swiper
  const testimonialsSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 800, // Reduced from 3000
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      enabled: false, // Disabled by default
    },
    pagination: {
      el: ".testimonial-swiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".testimonials-next",
      prevEl: ".testmonials-prev",
    },
    passiveListeners: true,
  });

  // Enable autoplay only when swipers are in viewport for better performance
  initSwiperAutoplayInView([doctorsSwiper, pricingSwiper, testimonialsSwiper]);
}

// Enable swiper autoplay only when in viewport
function initSwiperAutoplayInView(swipers) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const swiper = swipers.find((s) => s.el === entry.target);
        if (swiper) {
          if (entry.isIntersecting) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.stop();
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  swipers.forEach((swiper) => {
    observer.observe(swiper.el);
  });
}

function initFlipCards() {
  const flips = document.querySelectorAll(".flip");
  if (!flips.length) return;

  flips.forEach((flip) => {
    const card = flip.querySelector(".card");
    const learnMoreBtn = flip.querySelector(".learn-more-btn");

    if (!learnMoreBtn) return;

    learnMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetOtherFlipCards(flips, card);
      flipCard(card, learnMoreBtn);
    });

    document.addEventListener("click", (e) => {
      if (!flip.contains(e.target) && card.classList.contains("flipped")) {
        resetCard(card, learnMoreBtn);
      }
    });
  });

  function resetOtherFlipCards(allFlips, currentCard) {
    allFlips.forEach((otherFlip) => {
      const otherCard = otherFlip.querySelector(".card");
      const otherBtn = otherFlip.querySelector(".learn-more-btn");
      if (
        otherCard !== currentCard &&
        otherCard.classList.contains("flipped")
      ) {
        resetCard(otherCard, otherBtn);
      }
    });
  }

  function flipCard(card, btn) {
    btn.style.opacity = "0";
    setTimeout(() => card.classList.add("flipped"), 200);
  }

  function resetCard(card, btn) {
    card.classList.remove("flipped");
    if (btn) btn.style.opacity = "1";
  }
}

function initBackToTop() {
  const goTopButton = document.getElementById("up-arrow");
  if (!goTopButton) return;

  // Use throttled scroll event for better performance
  window.addEventListener(
    "scroll",
    throttle(function () {
      goTopButton.classList.toggle("show", window.scrollY > 300);
    }, 100)
  );

  goTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initCustomSelects() {
  const handleCustomSelect = (containerClass, selectedClass, optionsClass) => {
    document.querySelectorAll(containerClass).forEach((select) => {
      const selected = select.querySelector(selectedClass);
      const options = select.querySelector(optionsClass);
      const optionItems = select.querySelectorAll(".option, .option-popup");

      selected.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(optionsClass).forEach((opt) => {
          if (opt !== options) opt.classList.remove("show-drop", "active");
        });
        options.classList.toggle("show-drop");
        select.classList.toggle("active");
      });

      optionItems.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          selected.textContent = option.textContent;
          options.classList.remove("show-drop");
          select.classList.remove("active");
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(optionsClass).forEach((options) => {
        options.classList.remove("show-drop");
      });
      document.querySelectorAll(containerClass).forEach((select) => {
        select.classList.remove("active");
      });
    });
  };

  const handleCustomPopup = (containerClass, selectedClass, optionsClass) => {
    document.querySelectorAll(containerClass).forEach((select) => {
      const selected = select.querySelector(selectedClass);
      const options = select.querySelector(optionsClass);
      const optionItems = select.querySelectorAll(".option, .option-popup");

      selected.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(optionsClass).forEach((opt) => {
          if (opt !== options) opt.classList.remove("show-drop", "active");
        });
        options.classList.toggle("show-drop");
        select.classList.toggle("active");

        if (select.classList.contains("active")) {
          document.body.classList.add("no-scroll");
        } else {
          document.body.classList.remove("no-scroll");
        }
      });

      optionItems.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          selected.textContent = option.textContent;
          options.classList.remove("show-drop");
          select.classList.remove("active");
          document.body.classList.remove("no-scroll");
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(optionsClass).forEach((options) => {
        options.classList.remove("show-drop");
      });
      document.querySelectorAll(containerClass).forEach((select) => {
        select.classList.remove("active");
      });
      document.body.classList.remove("no-scroll");
    });
  };

  handleCustomSelect(".custom-select", ".selected", ".options");
  handleCustomPopup(".custom-popup", ".popup", ".options-popup");
}

function initBlogSection() {
  const container = document.querySelector(".blog-section .row");
  if (!container) return;

  const cards = container.querySelectorAll(":scope > .blog-card");
  const toggleBtn = document.getElementById("toggleBlogBtn");
  if (!cards.length || !toggleBtn) return;

  const cardsToShow = 3;
  const SCROLL_OFFSET = 113;
  let visibleCount = cardsToShow;

  cards.forEach((card) => {
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  });

  const updateCardsVisibility = () => {
    cards.forEach((card, index) => {
      if (index < visibleCount) {
        card.style.display = "block";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.addEventListener(
          "transitionend",
          function handler() {
            if (card.style.opacity === "0") {
              card.style.display = "none";
              card.removeEventListener("transitionend", handler);
            }
          },
          { once: true }
        );
      }
    });

    toggleBtn.textContent =
      visibleCount >= cards.length ? "Show Less" : "Show More";
    toggleBtn.style.display =
      cards.length <= cardsToShow ? "none" : "inline-block";
  };

  const scrollToWithOffset = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  toggleBtn.addEventListener("click", () => {
    toggleBtn.disabled = true;
    const expanding = visibleCount < cards.length;
    visibleCount = expanding
      ? Math.min(visibleCount + cardsToShow, cards.length)
      : cardsToShow;

    updateCardsVisibility();

    if (expanding) {
      const target = cards[Math.min(visibleCount - 1, cards.length - 1)];
      setTimeout(() => {
        scrollToWithOffset(target);
        toggleBtn.disabled = false;
      }, 400);
    } else {
      setTimeout(() => {
        scrollToWithOffset(container);
        toggleBtn.disabled = false;
      }, 400);
    }
  });

  updateCardsVisibility();
}

function initDropdownBehaviors() {
  const navDropdownToggle = document.querySelector(
    ".nav-item.dropdown .nav-link.dropdown-toggle"
  );
  const navDropdownMenu = document.querySelector(
    ".nav-item.dropdown .dropdown-menu"
  );

  if (navDropdownToggle && navDropdownMenu) {
    navDropdownToggle.addEventListener("click", function (e) {
      if (window.innerWidth < 1024) {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
          if (menu !== navDropdownMenu) menu.classList.remove("show");
        });
        navDropdownMenu.classList.toggle("show");
      }
    });

    setupDropdownCloseBehavior(navDropdownToggle, navDropdownMenu);
  }

  const appointmentSection = document.querySelector("#appointment-cta");
  if (appointmentSection) {
    const appointmentSelects =
      appointmentSection.querySelectorAll(".custom-select");
    let activeAppointmentSelect = null;

    appointmentSelects.forEach((select) => {
      const selected = select.querySelector(".selected");
      const options = select.querySelector(".options");

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        if (select === activeAppointmentSelect) {
          options.classList.remove("show-drop");
          activeAppointmentSelect = null;
          return;
        }

        closeAllDropdowns(appointmentSelects, select);
        options.classList.add("show-drop");
        activeAppointmentSelect = select;
      });

      select.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          activeAppointmentSelect = null;
        });
      });
    });
  }

  const findDoctorSection = document.querySelector("#find-doctor-cta");
  if (findDoctorSection) {
    const doctorSelect = findDoctorSection.querySelector(".custom-select");
    if (doctorSelect) {
      const selected = doctorSelect.querySelector(".selected");
      const options = doctorSelect.querySelector(".options");
      let hideTimeout;

      selected.addEventListener("click", function () {
        options.classList.add("show-drop");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          options.classList.remove("show-drop");
        }, 2600);
      });

      doctorSelect.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function () {
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          clearTimeout(hideTimeout);
        });
      });
    }
  }
}

function initNavLinkEffects() {
  const allLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .navbar-nav .dropdown-item"
  );
  const dropdown = document.querySelector(".nav-item.dropdown");
  if (!allLinks.length || !dropdown) return;

  if (window.innerWidth >= 992) {
    const dropdownToggle = dropdown.querySelector(".nav-link");

    allLinks.forEach((link) => {
      link.style.transition = "opacity 0.3s ease";
    });

    const handleLinkHover = (hoveredLink) => {
      allLinks.forEach((other) => {
        if (hoveredLink.classList.contains("dropdown-item")) {
          other.style.opacity =
            other === hoveredLink || other === dropdownToggle ? "1" : "0.3";
        } else if (hoveredLink === dropdownToggle) {
          other.style.opacity =
            other === dropdownToggle ||
            other.classList.contains("dropdown-item")
              ? "1"
              : "0.3";
        } else {
          other.style.opacity = other === hoveredLink ? "1" : "0.3";
        }
      });
    };

    allLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => handleLinkHover(link));
      link.addEventListener("mouseleave", () => {
        allLinks.forEach((l) => (l.style.opacity = "1"));
      });
    });

    dropdown.addEventListener("mouseleave", () => {
      allLinks.forEach((link) => (link.style.opacity = "1"));
    });
  }
}

function scaleMiddleSlide(swiper) {
  swiper.slides.forEach((slide) => slide.classList.remove("is-scaled"));

  const visibleSlides = Array.from(swiper.slides).filter((slide) =>
    slide.classList.contains("swiper-slide-visible")
  );

  if (visibleSlides.length === 3) {
    visibleSlides[1].classList.add("is-scaled");
  }
}

function setupDropdownCloseBehavior(toggle, menu) {
  document.addEventListener("click", function (e) {
    const isClickInside = toggle.contains(e.target) || menu.contains(e.target);
    if (!isClickInside) menu.classList.remove("show");
  });

  const links = menu.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("show"));
  });
}

function closeAllDropdowns(allDropdowns, exceptThis = null) {
  allDropdowns.forEach((select) => {
    if (select !== exceptThis) {
      const options = select.querySelector(".options");
      options.classList.remove("show-drop");
    }
  });
}

// Lazy-load all images except those inside <header>. Supports data-src/data-srcset and dynamic content.
function initLazyImages() {
  const isInHeader = (el) => !!el.closest("header");

  // 1) Eager-load header images to preserve LCP
  document.querySelectorAll("header img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
    if (!img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "high");
    }
  });

  // 2) Observer for data-src / data-srcset swap (for full control when desired)
  const ioSwap =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const img = entry.target;

              // Swap sources when about to enter viewport
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute("data-srcset");
              }

              // Let browser pick the right candidate after swap
              if (!img.hasAttribute("sizes") && img.parentElement) {
                // no-op: keep author control; add sizes in markup if needed
              }

              obs.unobserve(img);
            });
          },
          { rootMargin: "200px 0px" }
        )
      : null;

  // 3) Upgrade every <img> outside header
  const upgradeImg = (img) => {
    if (isInHeader(img)) return; // skip header
    if (img.hasAttribute("data-no-lazy")) return; // per-image opt-out

    // Prefer native lazy for simple cases
    img.decoding = "async";
    if (!img.hasAttribute("loading")) {
      img.loading = "lazy";
    }

    // If developer provided data-src/srcset, use IO swap for precise timing
    if (ioSwap && (img.dataset.src || img.dataset.srcset)) {
      ioSwap.observe(img);
    }
  };

  document.querySelectorAll("img").forEach(upgradeImg);

  // 4) Handle dynamically injected images (e.g., Swiper slides, CMS content)
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        if (node.matches?.("img")) upgradeImg(node);
        node.querySelectorAll?.("img").forEach(upgradeImg);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

// Blur-up image loader: apply blur + skeleton until image fully decoded
function initImageBlurUp() {
  try {
    const images = Array.from(document.querySelectorAll("img"));
    if (!images.length) return;

    const isInHeader = (el) => !!el.closest("header"); // <— add this

    const applyLoaded = (img) => {
      img.classList.add("is-loaded");
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                img.classList.add("blur-up");

                const onLoad = () => {
                  if (img.decode) {
                    img
                      .decode()
                      .catch(() => {})
                      .finally(() => applyLoaded(img));
                  } else {
                    applyLoaded(img);
                  }
                  img.removeEventListener("load", onLoad);
                };

                if (img.complete && img.naturalWidth > 0) {
                  applyLoaded(img);
                } else {
                  img.addEventListener("load", onLoad, { once: true });
                }

                obs.unobserve(img);
              });
            },
            { rootMargin: "200px 0px", threshold: 0.01 }
          )
        : null;

    images.forEach((img) => {
      if (img.classList.contains("no-blur")) return; // opt-out
      if (isInHeader(img)) return; // NEW: don't blur header/LCP images

      // Ensure placeholder styles apply before image paints
      img.classList.add("blur-up");

      if (img.complete && img.naturalWidth > 0) {
        applyLoaded(img);
        return;
      }

      if (observer) {
        observer.observe(img);
      } else {
        const onLoad = () => {
          applyLoaded(img);
          img.removeEventListener("load", onLoad);
        };
        img.addEventListener("load", onLoad, { once: true });
      }
    });
  } catch (e) {
    console.error("initImageBlurUp error:", e);
  }
}
