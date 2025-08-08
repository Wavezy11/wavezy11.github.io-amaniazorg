// Mobile menu toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")

mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active")
  const icon = mobileMenuToggle.querySelector("i")
  if (mobileMenu.classList.contains("active")) {
    icon.classList.remove("fa-bars")
    icon.classList.add("fa-times")
  } else {
    icon.classList.remove("fa-times")
    icon.classList.add("fa-bars")
  }
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    const icon = mobileMenuToggle.querySelector("i")
    icon.classList.remove("fa-times")
    icon.classList.add("fa-bars")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Enhanced Form Validation and Handling
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = document.getElementById("submit-btn")
    this.btnText = this.submitBtn.querySelector(".btn-text")
    this.btnLoader = this.submitBtn.querySelector(".btn-loader")
    this.successMessage = document.getElementById("form-success")
    this.errorMessage = document.getElementById("form-error")
    this.errorText = document.getElementById("error-text")

    this.init()
  }

  init() {
    if (!this.form) return

    // Add real-time validation
    this.addRealTimeValidation()

    // Handle form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  addRealTimeValidation() {
    const inputs = this.form.querySelectorAll("input, textarea")

    inputs.forEach((input) => {
      // Validate on blur (when user leaves field)
      input.addEventListener("blur", () => this.validateField(input))

      // Clear errors on input
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  validateField(field) {
    const value = field.value.trim()
    const fieldName = field.name
    let isValid = true
    let errorMessage = ""

    // Skip honeypot field
    if (fieldName === "website") return true

    switch (fieldName) {
      case "name":
        if (!value) {
          errorMessage = "Naam is verplicht"
          isValid = false
        } else if (value.length < 2) {
          errorMessage = "Naam moet minimaal 2 karakters bevatten"
          isValid = false
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errorMessage = "Naam mag alleen letters, spaties, apostrofes en koppeltekens bevatten"
          isValid = false
        }
        break

      case "email":
        if (!value) {
          errorMessage = "E-mailadres is verplicht"
          isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Voer een geldig e-mailadres in"
          isValid = false
        }
        break

      case "phone":
        if (value && !/^[+]?[0-9\s\-()]{8,}$/.test(value)) {
          errorMessage = "Voer een geldig telefoonnummer in"
          isValid = false
        }
        break

      case "message":
        if (!value) {
          errorMessage = "Bericht is verplicht"
          isValid = false
        } else if (value.length < 10) {
          errorMessage = "Bericht moet minimaal 10 karakters bevatten"
          isValid = false
        } else if (value.length > 2000) {
          errorMessage = "Bericht mag maximaal 2000 karakters bevatten"
          isValid = false
        }
        break
    }

    this.showFieldError(field, errorMessage)
    return isValid
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = message ? "block" : "none"
    }

    if (message) {
      field.classList.add("error")
      field.setAttribute("aria-invalid", "true")
    } else {
      field.classList.remove("error")
      field.setAttribute("aria-invalid", "false")
    }
  }

  clearFieldError(field) {
    this.showFieldError(field, "")
  }

  validateForm() {
    const requiredFields = this.form.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false
      }
    })

    // Check honeypot
    const honeypot = this.form.querySelector('input[name="website"]')
    if (honeypot && honeypot.value.trim() !== "") {
      // Likely spam - fail silently
      return false
    }

    return isValid
  }

  async handleSubmit(e) {
    e.preventDefault()

    // Validate form
    if (!this.validateForm()) {
      this.showError("Controleer de ingevoerde gegevens en probeer opnieuw.")
      return
    }

    // Show loading state
    this.setLoadingState(true)
    this.hideMessages()

    try {
      const formData = new FormData(this.form)

      const response = await fetch(this.form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      const result = await response.json()

      if (result.status === "success") {
        this.showSuccess(result.message)
        this.form.reset()
        this.clearAllErrors()
      } else {
        this.showError(result.message || "Er is een onbekende fout opgetreden.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      this.showError(
        "Netwerkfout: Kon geen verbinding maken met de server. Controleer je internetverbinding en probeer het opnieuw.",
      )
    } finally {
      this.setLoadingState(false)
    }
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitBtn.disabled = true
      this.btnText.style.display = "none"
      this.btnLoader.style.display = "inline-flex"
      this.submitBtn.classList.add("loading")
    } else {
      this.submitBtn.disabled = false
      this.btnText.style.display = "inline"
      this.btnLoader.style.display = "none"
      this.submitBtn.classList.remove("loading")
    }
  }

  showSuccess(message) {
    this.successMessage.querySelector("p").textContent = message
    this.successMessage.classList.remove("hidden")
    this.successMessage.scrollIntoView({ behavior: "smooth", block: "center" })

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.successMessage.classList.add("hidden")
    }, 8000)
  }

  showError(message) {
    this.errorText.textContent = message
    this.errorMessage.classList.remove("hidden")
    this.errorMessage.scrollIntoView({ behavior: "smooth", block: "center" })

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.errorMessage.classList.add("hidden")
    }, 10000)
  }

  hideMessages() {
    this.successMessage.classList.add("hidden")
    this.errorMessage.classList.add("hidden")
  }

  clearAllErrors() {
    const errorElements = this.form.querySelectorAll(".error-message")
    const inputElements = this.form.querySelectorAll("input, textarea")

    errorElements.forEach((el) => {
      el.textContent = ""
      el.style.display = "none"
    })

    inputElements.forEach((el) => {
      el.classList.remove("error")
      el.setAttribute("aria-invalid", "false")
    })
  }
}

// Initialize form handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactFormHandler()
})

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(0, 26, 13, 0.95)"
    navbar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.15)"
  } else {
    navbar.style.background = "rgba(0, 26, 13, 0.8)"
    navbar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)"
  }
})

// Add loading animation to CTA buttons (only for non-form buttons)
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("click", function (e) {
    if (this.getAttribute("href") === "#contact" || this.type === "submit") {
      return // Let normal scroll behavior work or form handler manage loading
    }

    // Add loading state for other CTA buttons if needed
    const originalText = this.textContent
    this.textContent = "Laden..."
    this.disabled = true

    setTimeout(() => {
      this.textContent = originalText
      this.disabled = false
    }, 2000)
  })
})

// Parallax effect for hero section (optional)
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroGlow = document.querySelector(".hero-glow")
  if (heroGlow && scrolled < window.innerHeight) {
    heroGlow.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.5}px)`
  }
})

// Add animation classes when elements come into view
const animateOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
)

// Apply animation to service cards, portfolio cards
document.querySelectorAll(".service-card, .portfolio-card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(30px)"
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  animateOnScroll.observe(card)
})

// Portfolio Modal Functionality
const portfolioModal = document.getElementById("portfolio-modal")
const modalClose = document.getElementById("modal-close")
const portfolioCards = document.querySelectorAll(".portfolio-card")

// Portfolio project data
const portfolioData = {
  "viral-tiktok": {
    title: "Aftermovie voor het Abu Tayyimah Event",
    description:
      "Voor het event van Abu Tayyimah maakte ik een korte recapvideo in vertical format. De video liet op een duidelijke en aantrekkelijke manier de sfeer en belangrijkste momenten van het event zien. Door de video slim op social media te delen met relevante hashtags kreeg het event extra aandacht en bereik ook na afloop.",
    mainImage: "img/abu taymiyyah/hero edit.jpg",
    imagePosition: "50% 3%",
    isVertical: true,
    gallery: [
      {
        type: "image",
        src: "img/abu taymiyyah/hero.jpg",
        isVertical: true,
      },
    ],
    projectLink: "https://www.tiktok.com/@barakahboost.nl/video/7523627234582646038",
  },
  "brand-identity": {
    title: "Nuurfades - Fotografie en Editwerk",
    description:
      "Voor Nuurfades mocht ik zowel de fotografie als het editwerk verzorgen. Ik ging op zoek naar beelden die passen bij de uitstraling van het merk: stijlvol, warm en persoonlijk. Tijdens het editen lette ik op de kleinste details om ervoor te zorgen dat alles klopt — van kleurgebruik tot compositie. Het resultaat is een reeks foto's die niet alleen mooi zijn, maar ook écht iets vertellen.",
    mainImage: "img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg",
    imagePosition: "center 20%",
    isVertical: true,
    gallery: ["img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg"],
  },
  "ecommerce-platform": {
    title: "Livzorg – Fotografie",
    description:
      "Voor Livzorg maakte ik een fotoserie waarin de mensen centraal staan. Geen afstandelijke beelden, maar echte momenten waarin warmte, rust en betrokkenheid voelbaar zijn. In de nabewerking heb ik de beelden zacht gehouden, zodat de natuurlijke sfeer behouden blijft. Dit sluit goed aan bij wie Livzorg is en waar ze voor staan.",
    mainImage: "img/liv zorg/main-foto.jpg",
    imagePosition: "right center",
    gallery: [
      { type: "image", src: "img/liv zorg/main-foto.jpg", isVertical: false },
      { type: "image", src: "img/liv zorg/verticale-foto.jpg", isVertical: true },
    ],
  },
}

// Open modal when portfolio card is clicked
portfolioCards.forEach((card) => {
  card.addEventListener("click", () => {
    const projectId = card.getAttribute("data-project")
    const project = portfolioData[projectId]
    if (project) {
      openPortfolioModal(project)
    }
  })

  // Apply image position to the main portfolio card image on load
  const projectId = card.getAttribute("data-project")
  const project = portfolioData[projectId]
  if (project && project.imagePosition) {
    const projectImage = card.querySelector(".project-image")
    if (projectImage) {
      projectImage.style.objectPosition = project.imagePosition
    }
  }
})

// Close modal
modalClose.addEventListener("click", closePortfolioModal)
portfolioModal.addEventListener("click", (e) => {
  if (e.target === portfolioModal) {
    closePortfolioModal()
  }
})

// ESC key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && portfolioModal.classList.contains("active")) {
    closePortfolioModal()
  }
})

function openPortfolioModal(project) {
  // Set title and description
  document.getElementById("modal-title").textContent = project.title
  document.getElementById("modal-description").textContent = project.description

  // Set main image or video in the modal header
  const modalImage = document.getElementById("modal-main-image")
  const modalVideo = document.getElementById("modal-main-video")

  // Always hide video in header and show image
  modalVideo.style.display = "none"
  modalImage.style.display = "block"
  modalImage.src = project.mainImage
  modalImage.alt = project.title

  // Apply custom object-position if available
  if (project.imagePosition) {
    modalImage.style.objectPosition = project.imagePosition
  } else {
    modalImage.style.objectPosition = "center"
  }

  // Add vertical class if needed
  if (project.isVertical) {
    modalImage.classList.add("is-vertical")
  } else {
    modalImage.classList.remove("is-vertical")
  }

  // Set gallery
  const galleryGrid = document.getElementById("gallery-grid")
  galleryGrid.innerHTML = ""

  const itemsToDisplayInGallery = []

  // Add all gallery items from the project.gallery array
  if (project.gallery) {
    project.gallery.forEach((item) => {
      if (typeof item === "string") {
        itemsToDisplayInGallery.push({ type: "image", src: item })
      } else {
        itemsToDisplayInGallery.push({ ...item })
      }
    })
  }

  // Populate the gallery grid
  itemsToDisplayInGallery.forEach((item) => {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"

    if (item.type === "video") {
      galleryItem.innerHTML = `
        <video class="gallery-video" controls poster="${item.thumbnail}">
          <source src="${item.src}" type="video/mp4">
        </video>
      `
    } else if (item.type === "image") {
      galleryItem.innerHTML = `<img src="${item.src}" alt="Project afbeelding" class="gallery-image">`
    }
    galleryGrid.appendChild(galleryItem)
  })

  // Set project link if available
  const projectLink = document.getElementById("modal-project-link")
  if (project.projectLink) {
    projectLink.href = project.projectLink
    projectLink.style.display = "inline-flex"
  } else {
    projectLink.style.display = "none"
  }

  // Add event listeners to CTA buttons in modal
  const modalCTAButtons = document.querySelectorAll('.modal-cta[href="#contact"]')
  modalCTAButtons.forEach((button) => {
    button.removeEventListener("click", handleModalCTA)
    button.addEventListener("click", handleModalCTA)
  })

  // Show modal
  portfolioModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closePortfolioModal() {
  portfolioModal.classList.remove("active")
  document.body.style.overflow = "auto"

  // Pause video if playing
  const modalVideo = document.getElementById("modal-main-video")
  if (!modalVideo.paused) {
    modalVideo.pause()
  }
}

// Handle CTA buttons in modal
function handleModalCTA(e) {
  e.preventDefault()

  // Close the modal first
  closePortfolioModal()

  // Small delay to ensure modal closes smoothly, then scroll to contact
  setTimeout(() => {
    const contactSection = document.querySelector("#contact")
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Optional: Focus on the first input field
      setTimeout(() => {
        const firstInput = document.querySelector('input[name="name"]')
        if (firstInput) {
          firstInput.focus()
        }
      }, 800)
    }
  }, 300)
}

// Process steps animation
const processSteps = document.querySelectorAll(".process-step")

processSteps.forEach((step, index) => {
  step.style.opacity = "0"
  step.style.transform = "translateY(40px)"
  step.style.transition = "opacity 0.6s ease, transform 0.6s ease"

  // Add delay based on index for staggered animation
  setTimeout(() => {
    animateOnScroll.observe(step)
  }, index * 100)
})

// Counter animation for stats section
const counterElement = document.getElementById("counter")
const targetValue = 20000000 // 20 million
const duration = 1500 // 1.5 seconds for animation

let animationStarted = false

function formatViews(num) {
  return Math.round(num).toLocaleString("nl-NL")
}

function animateCounter(timestamp) {
  if (!animateCounter.startTime) animateCounter.startTime = timestamp
  const progress = timestamp - animateCounter.startTime
  const percentage = Math.min(progress / duration, 1)
  const currentValue = percentage * targetValue

  counterElement.textContent = formatViews(currentValue)

  if (percentage < 1) {
    requestAnimationFrame(animateCounter)
  } else {
    counterElement.textContent = formatViews(targetValue)
  }
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animationStarted) {
        animationStarted = true
        animateCounter.startTime = null
        requestAnimationFrame(animateCounter)
        statsObserver.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  },
)

const statsSection = document.getElementById("stats")
if (statsSection) {
  statsObserver.observe(statsSection)
}

// Hero Slideshow Logic
const heroMockupSlideshowContainer = document.querySelector(".hero-mockup-slideshow")
const heroSlideshowItems = [
  {
    type: "image",
    src: "img/abu taymiyyah/hero.jpg",
    alt: "Event Recap Video",
  },
  {
    type: "image",
    src: "img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg",
    alt: "Nuurfades Fotografie Mockup",
  },
  { 
    type: "image", 
    src: "img/liv zorg/verticale-foto.jpg", 
    alt: "Livzorg Fotografie Mockup" 
  },
]
let currentHeroSlide = 0
const heroSlideIntervalTime = 3000

function createHeroSlideElement(item) {
  const slideDiv = document.createElement("div")
  slideDiv.classList.add("mobile-mockup-card")

  const mockupContentDiv = document.createElement("div")
  mockupContentDiv.classList.add("mockup-content")

  if (item.type === "image") {
    const imgElement = document.createElement("img")
    imgElement.src = item.src
    imgElement.alt = item.alt
    imgElement.classList.add("mockup-image-video")
    mockupContentDiv.appendChild(imgElement)
  } else if (item.type === "video") {
    const videoElement = document.createElement("video")
    videoElement.src = item.src
    videoElement.alt = item.alt
    videoElement.classList.add("mockup-image-video")
    videoElement.setAttribute("autoplay", "")
    videoElement.setAttribute("loop", "")
    videoElement.setAttribute("muted", "")
    videoElement.setAttribute("playsinline", "")
    if (item.poster) {
      videoElement.setAttribute("poster", item.poster)
    }
    mockupContentDiv.appendChild(videoElement)
  }

  slideDiv.appendChild(mockupContentDiv)
  return slideDiv
}

function initializeHeroSlideshow() {
  if (!heroMockupSlideshowContainer) return

  // Clear existing content
  heroMockupSlideshowContainer.innerHTML = ""

  // Add slides dynamically
  heroSlideshowItems.forEach((item) => {
    const slideElement = createHeroSlideElement(item)
    heroMockupSlideshowContainer.appendChild(slideElement)
  })

  const slides = heroMockupSlideshowContainer.querySelectorAll(".mobile-mockup-card")

  function showHeroSlide(index) {
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video")

      if (i === index) {
        slide.classList.add("active")
        if (video) {
          video.currentTime = 0
          video.play().catch((error) => {
            console.warn("Video autoplay geblokkeerd:", error)
          })
        }
      } else {
        slide.classList.remove("active")
        if (video) {
          video.pause()
        }
      }
    })
  }

  function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % slides.length
    showHeroSlide(currentHeroSlide)
  }

  if (slides.length > 0) {
    showHeroSlide(currentHeroSlide)
    setInterval(nextHeroSlide, heroSlideIntervalTime)
  }
}

// Initialize Logo Carousel - PROFESSIONELE SNELHEID MET BEDRIJFSNAMEN
function initializeLogoCarousel() {
  console.log('Initializing logo carousel...');

  if (typeof Swiper === 'undefined') {
    console.error('Swiper is not loaded');
    return;
  }

  try {
    const containerSelector = '.logo-carousel';
    const logoCarousel = new Swiper(containerSelector, {
      slidesPerView: 'auto',
      spaceBetween: 0,
      loop: true,
      centeredSlides: false,
      speed: 8000, // professionele, langzamere snelheid
      // voorkomen dat interacties autoplay pauzeren
      allowTouchMove: false,
      simulateTouch: false,
      preventClicks: true,
      preventClicksPropagation: true,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
        waitForTransition: false,
      },
      loopAdditionalSlides: 3,
      breakpoints: {
        320: { speed: 6000 },
        768: { speed: 8000 },
        1024: { speed: 10000 },
      },
    });

    const container = document.querySelector(containerSelector);
    const resume = () => {
      try {
        logoCarousel.autoplay.start();
      } catch (e) {
        console.warn('Could not resume autoplay:', e);
      }
    };

    // Herstart autoplay bij elke (aan)raak-/klik-/pointer-interactie
    ['click', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'mouseenter', 'mouseleave'].forEach((evt) => {
      container?.addEventListener(evt, resume, { passive: true });
    });

    // Herstart autoplay wanneer tab weer zichtbaar wordt
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resume();
    });

    // Force start autoplay
    setTimeout(() => {
      resume();
      console.log('Logo carousel autoplay enforced');
    }, 300);

    console.log('Logo carousel initialized successfully');
  } catch (error) {
    console.error('Error initializing logo carousel:', error);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log('DOM loaded, initializing components...');
  initializeHeroSlideshow();
  
  // Wait a bit longer for Swiper to be fully loaded
  setTimeout(() => {
    initializeLogoCarousel();
  }, 1000);
});
