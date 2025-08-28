;(() => {
  console.log("[Logo Carousel] Script geladen")

  // Configuratie
  const CONFIG = {
    AUTOPLAY_DELAY: 2500, // 2.5 seconden per slide
    TRANSITION_SPEED: 800, // Vloeiende overgang
    SLIDES_PER_VIEW: 3, // 3 slides tegelijk zichtbaar
    SPACE_BETWEEN: 30, // Ruimte tussen slides
    LOOP_ADDITIONAL_SLIDES: 7, // Alle 7 slides als extra voor perfecte loop
  }

  // Wacht tot DOM geladen is
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCarousel)
  } else {
    initializeCarousel()
  }

  function initializeCarousel() {
    console.log("[Logo Carousel] DOM geladen, start initialisatie")

    // Check of Swiper beschikbaar is
    if (window.Swiper) {
      initializeSwiper()
    } else {
      console.log("[Logo Carousel] Swiper niet gevonden, gebruik CSS fallback")
      initializeCSSFallback()
    }
  }

  function initializeSwiper() {
    const swiperContainer = document.querySelector(".swiper-container")
    if (!swiperContainer) {
      console.error("[Logo Carousel] Swiper container niet gevonden")
      return
    }

    // Tel het aantal slides
    const slides = document.querySelectorAll(".swiper-slide")
    console.log(`[Logo Carousel] Aantal slides gevonden: ${slides.length}`)

    if (slides.length < 3) {
      console.warn("[Logo Carousel] Te weinig slides voor loop mode")
      return
    }

    try {
      const swiper = new window.Swiper(".swiper-container", {
        // Loop configuratie voor perfecte oneindige loop
        loop: true,
        loopAdditionalSlides: CONFIG.LOOP_ADDITIONAL_SLIDES,

        // Slide configuratie
        slidesPerView: CONFIG.SLIDES_PER_VIEW,
        spaceBetween: CONFIG.SPACE_BETWEEN,
        centeredSlides: false,

        // Autoplay voor continue beweging
        autoplay: {
          delay: CONFIG.AUTOPLAY_DELAY,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: false,
        },

        // Vloeiende overgangen
        speed: CONFIG.TRANSITION_SPEED,
        effect: "slide",

        // Responsive breakpoints
        breakpoints: {
          320: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 35,
          },
        },

        // Toegankelijkheid
        a11y: {
          enabled: true,
          prevSlideMessage: "Vorige partner",
          nextSlideMessage: "Volgende partner",
        },

        // Keyboard navigatie
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },

        // Event handlers
        on: {
          init: function () {
            console.log("[Logo Carousel] Swiper succesvol geïnitialiseerd")
            console.log(`[Logo Carousel] Loop mode: ${this.loopCreate ? "actief" : "inactief"}`)
          },
          slideChange: function () {
            console.log(`[Logo Carousel] Slide veranderd naar: ${this.realIndex + 1}`)
          },
          reachEnd: () => {
            console.log("[Logo Carousel] Einde bereikt, loop naar begin")
          },
        },
      })

      // Pause autoplay bij hover
      swiperContainer.addEventListener("mouseenter", () => {
        if (swiper.autoplay) {
          swiper.autoplay.stop()
        }
      })

      swiperContainer.addEventListener("mouseleave", () => {
        if (swiper.autoplay) {
          swiper.autoplay.start()
        }
      })
    } catch (error) {
      console.error("[Logo Carousel] Fout bij initialiseren Swiper:", error)
      initializeCSSFallback()
    }
  }

  function initializeCSSFallback() {
    console.log("[Logo Carousel] Start CSS fallback animatie")

    const logoContainer = document.querySelector(".logo-carousel, .swiper-wrapper")
    if (!logoContainer) {
      console.error("[Logo Carousel] Logo container niet gevonden voor fallback")
      return
    }

    // Voeg CSS klassen toe voor animatie
    logoContainer.classList.add("css-carousel-active")

    // Voeg CSS animatie toe
    const style = document.createElement("style")
    style.textContent = `
            .css-carousel-active {
                display: flex;
                animation: logoScroll 20s linear infinite;
                width: max-content;
            }
            
            .css-carousel-active .swiper-slide,
            .css-carousel-active .logo-item {
                flex-shrink: 0;
                margin-right: 30px;
                animation: none;
            }
            
            @keyframes logoScroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-100%);
                }
            }
            
            .css-carousel-active:hover {
                animation-play-state: paused;
            }
            
            @media (max-width: 768px) {
                .css-carousel-active .swiper-slide,
                .css-carousel-active .logo-item {
                    margin-right: 20px;
                }
                
                @keyframes logoScroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            }
        `

    document.head.appendChild(style)
    console.log("[Logo Carousel] CSS fallback animatie geactiveerd")
  }
})()
