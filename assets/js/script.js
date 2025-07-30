// ====================================================================================
// ============================== MAIN DOCUMENT READY =================================
// ====================================================================================

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initStickyHeader();
  initMobileMenu();
  initSwipers();
  initFlipCards();
  initBackToTop();
  initSmoothScrolling();
  initCustomSelects();
  initBlogSection();
  initDropdownBehaviors();
  initNavLinkEffects();
});

// ====================================================================================
// ============================== COMPONENT INITIALIZERS ==============================
// ====================================================================================

/**
 * Sticky Header with Intersection Observer
 */
function initStickyHeader() {
  const header = document.getElementById("header");
  const hero = document.querySelector(".section-health");

  if (!header || !hero) return;

  // Set initial padding
  const updateHeroPadding = () => {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  };

  window.addEventListener("load", updateHeroPadding);

  // Intersection Observer for sticky behavior
  const obs = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;

      header.classList.toggle("sticky", !entry.isIntersecting);
      if (!entry.isIntersecting) updateHeroPadding();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    }
  );

  obs.observe(hero);
}

/**
 * Mobile Menu Toggle with Offcanvas Integration
 */
function initMobileMenu() {
  const toggler = document.querySelector(".navbar-toggler");
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const offcanvasInstance = offcanvasElement ? 
    bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement) : null;

  if (toggler) {
    toggler.addEventListener("click", () => {
      toggler.classList.toggle("opened");
    });
  }

  // Handle all navigation link clicks in the offcanvas
  const offcanvasLinks = document.querySelectorAll('.offcanvas-body li:not(.dropdown) a[href^="#"]');
  offcanvasLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Close the offcanvas
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
      
      // Remove opened class from toggler
      if (toggler) {
        toggler.classList.remove("opened");
      }
    });
  });

  // Backup: Listen for when offcanvas actually closes
  if (offcanvasElement) {
    offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      if (toggler) {
        toggler.classList.remove("opened");
      }
    });
  }
}

/**
 * Initialize all Swiper instances
 */
function initSwipers() {
  // Header Swiper
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
    on: {
      init: scaleMiddleSlide,
      slideChangeTransitionEnd: scaleMiddleSlide,
    },
  });

  // Featured Swiper
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
    breakpoints: {
      500: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
      1199: { slidesPerView: 4 },
    },
  });

  // Doctors Swiper
  const doctorsSwiper = new Swiper(".doctors-swiper", {
    slidesPerView: 2,
    spaceBetween: 40,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 2200,
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      enabled: false,
    },
    navigation: {
      nextEl: ".doctors-next",
      prevEl: ".doctors-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      800: { slidesPerView: 2 },
      992: { slidesPerView: 2 },
    },
  });

  // Pricing Swiper
  const pricingSwiper = new Swiper(".pricing-swiper", {
    slidesPerView: 3,
    spaceBetween: 10,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 2200,
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      enabled: false,
    },
    navigation: {
      nextEl: ".pricing-next",
      prevEl: ".pricing-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
    },
  });

  // Testimonials Swiper
  const testimonialsSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 3000,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
      enabled: false,
    },
    pagination: {
      el: ".testimonial-swiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".testimonials-next",
      prevEl: ".testmonials-prev",
    },
  });

  // Setup swiper navigation autoplay triggers
  setupSwiperNavigation(doctorsSwiper, ".doctors-next", ".doctors-prev");
  setupSwiperNavigation(pricingSwiper, ".pricing-next", ".pricing-prev");
  
  // Setup pagination bullets for testimonials
  document.querySelectorAll(".testimonial-swiper .swiper-pagination .swiper-pagination-bullet").forEach(bullet => {
    bullet.addEventListener("click", () => {
      testimonialsSwiper.autoplay.start();
    });
  });
}

/**
 * Flip Cards functionality
 */
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
      if (otherCard !== currentCard && otherCard.classList.contains("flipped")) {
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

/**
 * Back to Top Button
 */
function initBackToTop() {
  const goTopButton = document.getElementById("up-arrow");
  if (!goTopButton) return;

  window.addEventListener("scroll", function () {
    goTopButton.classList.toggle("show", window.scrollY > 300);
  });

  goTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * Smooth Scrolling for Navigation
 */
function initSmoothScrolling() {
  const header = document.getElementById("header");
  if (!header) return;

  // Target all nav links, dropdown toggles, and also offcanvas links
  const navLinks = document.querySelectorAll(
    '.navbar-nav a[href^="#"], .offcanvas-body a[href^="#"]'
  );
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const offcanvasInstance = offcanvasElement ? 
    bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement) : null;

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Update active states
      updateActiveStates(this, navLinks, dropdownToggles);

      // Smooth scroll to the section
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - header.offsetHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }

      // Close the offcanvas if open (for mobile)
      if (offcanvasInstance && offcanvasElement.classList.contains("show")) {
        offcanvasInstance.hide();
      }
    });
  });

  function updateActiveStates(clickedLink, allLinks, allToggles) {
    // Remove 'active' from all links and dropdown toggles
    allLinks.forEach((l) => l.classList.remove("active"));
    allToggles.forEach((t) => t.classList.remove("active"));

    // Add 'active' to the clicked link
    clickedLink.classList.add("active");

    // If inside dropdown, activate parent toggle too
    const dropdown = clickedLink.closest(".dropdown-menu");
    if (dropdown) {
      const toggle = dropdown.previousElementSibling;
      if (toggle && toggle.classList.contains("dropdown-toggle")) {
        toggle.classList.add("active");
      }
    }
  }
}

/**
 * Custom Select Dropdowns
 */
function initCustomSelects() {
  // Generic select handler
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
        
        // Disable scrolling on body when popup is active
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
          document.body.classList.remove("no-scroll"); // Re-enable scrolling
        });
      });
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(optionsClass).forEach((options) => {
        options.classList.remove("show-drop");
      });
      document.querySelectorAll(containerClass).forEach((select) => {
        select.classList.remove("active");
      });
      document.body.classList.remove("no-scroll"); // Re-enable scrolling
    });
  };

  // Initialize different types of selects
  handleCustomSelect(".custom-select", ".selected", ".options");
  handleCustomSelect(".custom-popup", ".popup", ".options-popup");
}

/**
 * Blog Section with Show More/Less functionality
 */
function initBlogSection() {
  const container = document.querySelector(".blog-section .row");
  if (!container) return;

  const cards = container.querySelectorAll(":scope > .blog-card");
  const toggleBtn = document.getElementById("toggleBlogBtn");
  if (!cards.length || !toggleBtn) return;

  const cardsToShow = 3;
  const SCROLL_OFFSET = 113;
  let visibleCount = cardsToShow;

  // Add CSS transition class to all cards
  cards.forEach(card => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const updateCardsVisibility = () => {
    cards.forEach((card, index) => {
      if (index < visibleCount) {
        // Show card with animation
        card.style.display = "block";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        // Hide card with animation
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        // After animation completes, set display:none
        card.addEventListener('transitionend', function handler() {
          if (card.style.opacity === "0") {
            card.style.display = "none";
            card.removeEventListener('transitionend', handler);
          }
        }, { once: true });
      }
    });

    toggleBtn.textContent = visibleCount >= cards.length ? "Show Less" : "Show More";
    toggleBtn.style.display = cards.length <= cardsToShow ? "none" : "inline-block";
  };

  const scrollToWithOffset = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  toggleBtn.addEventListener("click", () => {
    toggleBtn.disabled = true;
    const expanding = visibleCount < cards.length;
    visibleCount = expanding ? 
      Math.min(visibleCount + cardsToShow, cards.length) : 
      cardsToShow;

    updateCardsVisibility();

    // Scroll to the newly shown cards
    if (expanding) {
      const target = cards[Math.min(visibleCount - 1, cards.length - 1)];
      setTimeout(() => {
        scrollToWithOffset(target);
        toggleBtn.disabled = false;
      }, 400); // Match this with CSS transition duration
    } else {
      // When collapsing, scroll to the section header
      setTimeout(() => {
        scrollToWithOffset(container);
        toggleBtn.disabled = false;
      }, 400);
    }
  });

  // Initial state
  updateCardsVisibility();
}

/**
 * Dropdown Behaviors for different sections
 */
function initDropdownBehaviors() {
  // Navbar dropdown
  const navDropdownToggle = document.querySelector('.nav-item.dropdown .nav-link.dropdown-toggle');
  const navDropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');

  if (navDropdownToggle && navDropdownMenu) {
    navDropdownToggle.addEventListener('click', function (e) {
      if (window.innerWidth < 1024) {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          if (menu !== navDropdownMenu) menu.classList.remove('show');
        });
        navDropdownMenu.classList.toggle('show');
      }
    });

    // Close when clicking outside or selecting item
    setupDropdownCloseBehavior(navDropdownToggle, navDropdownMenu);
  }

  // Appointment section dropdowns
  const appointmentSection = document.querySelector("#appointment-cta");
  if (appointmentSection) {
    const appointmentSelects = appointmentSection.querySelectorAll(".custom-select");
    let activeAppointmentSelect = null;

    appointmentSelects.forEach(select => {
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

      select.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          activeAppointmentSelect = null;
        });
      });
    });
  }

  // Find Doctor section dropdown
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

      doctorSelect.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", function () {
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          clearTimeout(hideTimeout);
        });
      });
    }
  }
}

/**
 * Nav Link Hover Effects
 */
function initNavLinkEffects() {
  const allLinks = document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .dropdown-item");
  const dropdown = document.querySelector(".nav-item.dropdown");
  if (!allLinks.length || !dropdown) return;

  // Only apply on desktop
  if (window.innerWidth >= 992) {
    const dropdownToggle = dropdown.querySelector(".nav-link");
    
    // Smooth transitions
    allLinks.forEach(link => {
      link.style.transition = "opacity 0.3s ease";
    });

    const handleLinkHover = (hoveredLink) => {
      allLinks.forEach(other => {
        if (hoveredLink.classList.contains('dropdown-item')) {
          // Case 1: Hovering a dropdown item
          other.style.opacity = 
            (other === hoveredLink || other === dropdownToggle) ? "1" : "0.3";
        } else if (hoveredLink === dropdownToggle) {
          // Case 2: Hovering the dropdown toggle
          other.style.opacity = 
            (other === dropdownToggle || other.classList.contains('dropdown-item')) ? "1" : "0.3";
        } else {
          // Case 3: Hovering a normal top-level nav item
          other.style.opacity = other === hoveredLink ? "1" : "0.3";
        }
      });
    };

    allLinks.forEach(link => {
      link.addEventListener("mouseenter", () => handleLinkHover(link));
      link.addEventListener("mouseleave", () => {
        allLinks.forEach(l => (l.style.opacity = "1"));
      });
    });

    dropdown.addEventListener("mouseleave", () => {
      allLinks.forEach(link => (link.style.opacity = "1"));
    });
  }
}

// ====================================================================================
// ============================== HELPER FUNCTIONS ====================================
// ====================================================================================

/**
 * Scale middle slide in header swiper
 */
function scaleMiddleSlide(swiper) {
  // Remove from all
  swiper.slides.forEach(slide => slide.classList.remove("is-scaled"));

  // Get all visible slides
  const visibleSlides = Array.from(swiper.slides).filter(slide =>
    slide.classList.contains("swiper-slide-visible")
  );

  // Scale middle one only if exactly 3 are visible
  if (visibleSlides.length === 3) {
    visibleSlides[1].classList.add("is-scaled");
  }
}

/**
 * Setup swiper navigation with autoplay
 */
function setupSwiperNavigation(swiper, nextSelector, prevSelector) {
  const nextBtn = document.querySelector(nextSelector);
  const prevBtn = document.querySelector(prevSelector);

  if (nextBtn) nextBtn.addEventListener("click", () => swiper.autoplay.start());
  if (prevBtn) prevBtn.addEventListener("click", () => swiper.autoplay.start());
}

/**
 * Setup dropdown close behavior
 */
function setupDropdownCloseBehavior(toggle, menu) {
  document.addEventListener('click', function (e) {
    const isClickInside = toggle.contains(e.target) || menu.contains(e.target);
    if (!isClickInside) menu.classList.remove('show');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('show'));
  });
}

/**
 * Close all dropdowns except the specified one
 */
function closeAllDropdowns(allDropdowns, exceptThis = null) {
  allDropdowns.forEach(select => {
    if (select !== exceptThis) {
      const options = select.querySelector(".options");
      options.classList.remove("show-drop");
    }
  });
}
