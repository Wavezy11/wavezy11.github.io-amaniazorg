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

// Form handling
const contactForm = document.getElementById("contact-form")
const formSuccess = document.getElementById("form-success")
const successMessageTitle = formSuccess.querySelector("h3")
const successMessageParagraph = formSuccess.querySelector("p")
const successMessageIcon = formSuccess.querySelector("i")

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault() // Prevent default form submission (page reload)

  const formData = new FormData(this)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Basic validation
  if (!name || !email || !message) {
    alert("Vul alle verplichte velden in.")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Voer een geldig e-mailadres in.")
    return
  }

  const submitButton = this.querySelector('button[type="submit"]')
  const originalButtonText = submitButton.textContent

  // Show loading state
  submitButton.textContent = "Versturen..."
  submitButton.disabled = true
  submitButton.classList.add("opacity-50", "cursor-not-allowed") // Add Tailwind classes for disabled state

  try {
    const response = await fetch(this.action, {
      method: this.method,
      body: formData,
      headers: {
        Accept: "application/json", // Indicate that we expect a JSON response
      },
    })

    const result = await response.json()

    if (result.status === "success") {
      successMessageTitle.textContent = "Bedankt voor je aanvraag!"
      successMessageParagraph.textContent = result.message
      successMessageIcon.className = "fas fa-check-circle" // Green checkmark
      formSuccess.classList.remove("hidden")
      formSuccess.style.background = "rgba(26, 125, 68, 0.95)" // Green background for success
      contactForm.reset() // Clear the form
    } else {
      successMessageTitle.textContent = "Oeps, er ging iets mis!"
      successMessageParagraph.textContent = result.message || "Er is een onbekende fout opgetreden."
      successMessageIcon.className = "fas fa-exclamation-circle" // Red exclamation mark
      formSuccess.classList.remove("hidden")
      formSuccess.style.background = "rgba(220, 38, 38, 0.95)" // Red background for error
    }
  } catch (error) {
    console.error("Fout bij verzenden formulier:", error)
    successMessageTitle.textContent = "Netwerkfout!"
    successMessageParagraph.textContent = "Kon geen verbinding maken met de server. Probeer het later opnieuw."
    successMessageIcon.className = "fas fa-exclamation-triangle" // Yellow triangle
    formSuccess.classList.remove("hidden")
    formSuccess.style.background = "rgba(250, 170, 20, 0.95)" // Orange background for network error
  } finally {
    // Hide success/error message after a few seconds
    setTimeout(() => {
      formSuccess.classList.add("hidden")
      submitButton.textContent = originalButtonText
      submitButton.disabled = false
      submitButton.classList.remove("opacity-50", "cursor-not-allowed")
    }, 5000)
  }
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

// Apply animation to service cards, portfolio cards and collaboration cards
document.querySelectorAll(".service-card, .portfolio-card, .collaboration-card").forEach((card) => {
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
    title: "Aftermovie voor het Abu Tayyimah Event ",
    description:
      "Voor het event van Abu Tayyimah maakte ik een korte recapvideo in vertical format. De video liet op een duidelijke en aantrekkelijke manier de sfeer en belangrijkste momenten van het event zien. Door de video slim op social media te delen met relevante hashtags kreeg het event extra aandacht en bereik ook na afloop.",
    mainImage: "img/abu taymiyyah/hero edit.jpg",
    imagePosition: "50% 3%",
    isVertical: true, // Nieuwe vlag voor verticale afbeeldingen
    video: "videos/Recap-Abu Taymiyyah event.mp4", // Main video for the project
    gallery: [
      {
        type: "image", // Changed from "video" to "image"
        src: "img/abu taymiyyah/hero.jpg", // Changed to use the thumbnail as the image source
        isVertical: true, // Explicitly mark this gallery image as vertical
      },
    ],
    projectLink:
      "https://www.tiktok.com/@barakahboost.nl/video/7523627234582646038?is_from_webapp=1&sender_device=pc&web_id=7525483219611026977",
  },
  "brand-identity": {
    title: "Nuurfades - Fotografie en Editwerk",
    description:
      "Voor Nuurfades mocht ik zowel de fotografie als het editwerk verzorgen. Ik ging op zoek naar beelden die passen bij de uitstraling van het merk: stijlvol, warm en persoonlijk. Tijdens het editen lette ik op de kleinste details om ervoor te zorgen dat alles klopt — van kleurgebruik tot compositie. Het resultaat is een reeks foto's die niet alleen mooi zijn, maar ook écht iets vertellen. Deze beelden worden nu effectief ingezet op social media en andere kanalen, en dragen bij aan een sterke, herkenbare visuele identiteit.",
    mainImage: "img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg",
    imagePosition: "center 20%",
    isVertical: true, // Nieuwe vlag voor verticale afbeeldingen
    gallery: ["img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg"],
  },
  "ecommerce-platform": {
    title: "Livzorg - Fotografie",
    description:
      "Voor Livzorg maakte ik een fotoserie waarin de mensen centraal staan. Geen afstandelijke beelden, maar echte momenten waarin warmte, rust en betrokkenheid voelbaar zijn. In de nabewerking heb ik de beelden zacht gehouden, zodat de natuurlijke sfeer behouden blijft. Dit sluit goed aan bij wie Livzorg is en waar ze voor staan. In de toekomst zal ik ook de videografie voor Livzorg op me nemen, zodat we hun verhaal nog breder en dieper kunnen vertellen — in beeld én beweging.",
    mainImage: "img/liv zorg/main-foto.jpg",
    imagePosition: "right center",
    gallery: [
      { type: "image", src: "img/liv zorg/main-foto.jpg", isVertical: false }, // Explicitly mark as vertical
      { type: "image", src: "img/liv zorg/verticale-foto.jpg", isVertical: true }, // Explicitly mark as vertical
    ],
    projectLink: "https://example-store.com",
  },
  "instagram-growth": {
    title: "Instagram Growth Strategy",
    description:
      "Voor dit lifestyle merk ontwikkelden we een complete Instagram groeistrategie die resulteerde in explosieve groei. Door consistente, hoogwaardige content, strategische hashtag research, community engagement en influencer partnerships groeiden ze van 2K naar 12K volgers in 6 maanden met significant verhoogde engagement rates.",
    mainImage:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    gallery: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
  },
  "motion-graphics": {
    title: "Motion Graphics Explainer",
    description:
      "Deze dynamische animatie video werd ontwikkeld om complexe SaaS diensten op een eenvoudige en boeiende manier uit te leggen. Door gebruik van moderne motion graphics, duidelijke voice-over en strategische storytelling creëerden we content die meer dan 1 miljoen keer bekeken werd en de conversie rate met 45% verhoogde.",
    mainImage:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
  },
  "product-photography": {
    title: "Product Fotografie",
    description:
      "Voor deze premium sieraden collectie verzorgden we een complete productfotografie sessie. Met professionele studio setup, perfecte belichting en creatieve styling creëerden we beelden die de luxe uitstraling van de producten perfect vastleggen. Het resultaat was een 60% toename in online conversies en verhoogde merkperceptie.",
    mainImage:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    gallery: [
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
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
    modalImage.style.objectPosition = "center" // Default if not specified
  }

  // Voeg de 'is-vertical' klasse toe of verwijder deze
  if (project.isVertical) {
    modalImage.classList.add("is-vertical")
  } else {
    modalImage.classList.remove("is-vertical")
  }

  // Set gallery
  const galleryGrid = document.getElementById("gallery-grid")
  galleryGrid.innerHTML = "" // Clear previous gallery items

  const itemsToDisplayInGallery = []

  // Add the main project video to gallery if it exists
  if (project.video) {
    itemsToDisplayInGallery.push({
      type: "video",
      src: project.video,
      thumbnail: project.mainImage || "/img/placeholder-video.png", // Gebruik lokale placeholder
    })
  }

  // Add all other gallery items from the project.gallery array
  project.gallery.forEach((item) => {
    if (typeof item === "string") {
      // Assume string items are images and default to horizontal (cover)
      itemsToDisplayInGallery.push({ type: "image", src: item })
    } else {
      // Assume object items are already structured (e.g., {type: 'video', src: ..., thumbnail: ...})
      // Ensure isVertical is explicitly set, defaulting to false if not present
      itemsToDisplayInGallery.push({ ...item })
    }
  })

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
    button.removeEventListener("click", handleModalCTA) // Remove existing listener
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
        const firstInput = document.querySelector("#name")
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
const targetValue = 20000000000 // 20 billion
const duration = 1500 // 1.5 seconds for animation (was 3000)

let animationStarted = false

function formatViews(num) {
  return Math.round(num).toLocaleString("nl-NL") // Round to nearest integer and format with locale-specific thousands separators
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
    counterElement.textContent = formatViews(targetValue) // Ensure final value is exact
  }
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animationStarted) {
        animationStarted = true
        animateCounter.startTime = null // Reset startTime for a fresh animation
        requestAnimationFrame(animateCounter)
        statsObserver.unobserve(entry.target) // Stop observing once animated
      }
    })
  },
  {
    threshold: 0.5, // Trigger when 50% of the section is visible
    rootMargin: "0px 0px -100px 0px", // Adjust as needed
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
    poster: "img/abu taymiyyah/hero edit.png",
  },
  {
    type: "image",
    src: "img/nuurfades/e89b3b7a-a0da-461b-9dd8-69452b3c8713_rw_1200.jpg",
    alt: "Nuurfades Fotografie Mockup",
  },
  { type: "image", src: "img/liv zorg/main-foto.jpg", alt: "Livzorg Fotografie Mockup" },
]
let currentHeroSlide = 0
const heroSlideIntervalTime = 10000 // Change slide every 10 seconds (10000 ms)

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
          video.currentTime = 0 // Reset video to start
          video.play().catch((error) => {
            console.warn("Video autoplay geblokkeerd (zelfs gedempt):", error)
            // De browser staat autoplay niet toe zonder gebruikersinteractie.
            // De video zal de poster afbeelding tonen totdat de gebruiker interactie heeft.
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
    showHeroSlide(currentHeroSlide) // Show the first slide initially
    setInterval(nextHeroSlide, heroSlideIntervalTime)
  }
}

// Call initialize function when DOM is ready
document.addEventListener("DOMContentLoaded", initializeHeroSlideshow)
