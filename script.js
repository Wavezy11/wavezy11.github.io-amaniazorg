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

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  }

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    alert("Vul alle verplichte velden in.")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    alert("Voer een geldig e-mailadres in.")
    return
  }

  try {
    // Simulate form submission (replace with actual endpoint)
    await simulateFormSubmission(data)

    // Show success message
    formSuccess.classList.remove("hidden")
    contactForm.reset()

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.add("hidden")
    }, 5000)
  } catch (error) {
    alert("Er is een fout opgetreden. Probeer het later opnieuw.")
    console.error("Form submission error:", error)
  }
})

// Simulate form submission (replace with actual API call)
async function simulateFormSubmission(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Form submitted:", data)
      resolve()
    }, 1000)
  })
}

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

// Add loading animation to CTA buttons
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("click", function (e) {
    if (this.getAttribute("href") === "#contact") {
      return // Let normal scroll behavior work
    }

    // Add loading state for form submission
    if (this.type === "submit") {
      const originalText = this.textContent
      this.textContent = "Versturen..."
      this.disabled = true

      setTimeout(() => {
        this.textContent = originalText
        this.disabled = false
      }, 2000)
    }
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

// Portfolio project data (reverted to all 6 projects)
const portfolioData = {
  "viral-tiktok": {
    title: "Tiktok Recap Video voor het Abu Tayyimah Event",
    description:
      "Voor het event van Abu Tayyimah maakte ik een korte recapvideo in vertical format. De video liet op een duidelijke en aantrekkelijke manier de sfeer en belangrijkste momenten van het event zien. Door de video slim op social media te delen met relevante hashtags kreeg het event extra aandacht en bereik ook na afloop.",
    mainImage:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    video: "videos/Recap-Abu Taymiyyah event.mp4",
    gallery: [
      {
        type: "video",
        src: "videos/abu-taymiyyah-vertical-1.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      },
      {
        type: "video",
        src: "videos/abu-taymiyyah-vertical-2.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      },
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
    projectLink: "https://tiktok.com/@example",
  },
  "brand-identity": {
    title: "Complete Brand Identity",
    description:
      "Voor deze ambitieuze tech startup ontwikkelden we een complete merkidentiteit van de grond af. Het project omvatte logo ontwerp, kleurenpalet, typografie, brandrichtlijnen en alle marketing materialen. Door diepgaand onderzoek naar de doelgroep en concurrentieanalyse creëerden we een unieke visuele identiteit die perfect de innovatieve geest van het bedrijf weergeeft.",
    mainImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
  },
  "ecommerce-platform": {
    title: "E-commerce Platform",
    description:
      "Deze moderne webshop werd volledig opnieuw ontworpen met focus op gebruikerservaring en conversie optimalisatie. Door implementatie van een intuïtieve navigatie, snelle laadtijden, mobiele optimalisatie en strategische call-to-actions bereikten we een 300% toename in online verkopen binnen slechts 3 maanden na de lancering.",
    mainImage:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
    projectLink: "https://example-store.com",
  },
  "instagram-growth": {
    title: "Instagram Growth Strategy",
    description:
      "Voor dit lifestyle merk ontwikkelden we een complete Instagram groeistrategie die resulteerde in explosieve groei. Door consistente, hoogwaardige content, strategische hashtag research, community engagement en influencer partnerships groeiden ze van 2K naar 12K volgers in 6 maanden met significant verhoogde engagement rates.",
    mainImage:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

  // Set main image or video
  const modalImage = document.getElementById("modal-main-image")
  const modalVideo = document.getElementById("modal-main-video")

  // Always hide video in header and show image
  modalVideo.style.display = "none"
  modalImage.style.display = "block"
  modalImage.src = project.mainImage
  modalImage.alt = project.title

  // Set gallery
  const galleryGrid = document.getElementById("gallery-grid")

  galleryGrid.innerHTML = ""

  // Add video as first item in gallery if it exists
  if (project.video) {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"
    galleryItem.innerHTML = `
    <video class="gallery-video" controls>
      <source src="${project.video}" type="video/mp4">
    </video>
  `
    galleryGrid.appendChild(galleryItem)
  }

  // Then add all other gallery items
  project.gallery.forEach((item) => {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"

    if (typeof item === "object" && item.type === "video") {
      galleryItem.innerHTML = `
    <video class="gallery-video" controls poster="${item.thumbnail}">
      <source src="${item.src}" type="video/mp4">
    </video>
  `
    } else {
      const imageSrc = typeof item === "string" ? item : item.src
      galleryItem.innerHTML = `<img src="${imageSrc}" alt="Project afbeelding" class="gallery-image">`
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
