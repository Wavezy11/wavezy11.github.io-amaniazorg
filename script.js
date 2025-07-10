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

// Counter animation
function animateCounter() {
  const counter = document.getElementById("counter")
  const target = 20000000000 // 20 billion
  const duration = 1500 // 1.5 seconds (faster)
  const increment = target / (duration / 16) // 60fps
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Format number with dots as thousand separators
    const formatted = Math.floor(current).toLocaleString("nl-NL")
    counter.textContent = formatted
  }, 16)
}

// Intersection Observer for counter animation
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.id === "stats") {
      animateCounter()
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe the stats section
const statsSection = document.getElementById("stats")
if (statsSection) {
  observer.observe(statsSection)
}

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

// Apply animation to service cards and collaboration cards
document.querySelectorAll(".service-card, .collaboration-card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(30px)"
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  animateOnScroll.observe(card)
})
