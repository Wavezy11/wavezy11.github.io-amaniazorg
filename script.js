document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Adjust scroll position for fixed header
        const headerOffset = document.querySelector(".header").offsetHeight
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset - 20

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const mainNav = document.querySelector(".main-nav")
        const hamburgerMenu = document.querySelector(".hamburger-menu")
        if (mainNav.classList.contains("active")) {
          mainNav.classList.remove("active")
          hamburgerMenu.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }
      }
    })
  })

  const hamburgerMenu = document.querySelector(".hamburger-menu")
  const mainNav = document.querySelector(".main-nav")
  const navList = document.querySelector(".nav-list")
  const navLinks = document.querySelectorAll(".nav-list .nav-link")

  // Create overlay element for mobile menu
  let navOverlay = document.querySelector(".nav-overlay")
  if (!navOverlay) {
    navOverlay = document.createElement("div")
    navOverlay.className = "nav-overlay"
    document.body.appendChild(navOverlay)
  }

  if (hamburgerMenu && navList) {
    hamburgerMenu.addEventListener("click", () => {
      const isActive = navList.classList.contains("active")

      if (isActive) {
        // Close menu
        navList.classList.remove("active")
        navOverlay.classList.remove("active")
        hamburgerMenu.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      } else {
        // Open menu
        navList.classList.add("active")
        navOverlay.classList.add("active")
        hamburgerMenu.setAttribute("aria-expanded", "true")
        document.body.style.overflow = "hidden"
      }
    })

    // Close mobile menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navList.classList.contains("active")) {
          navList.classList.remove("active")
          navOverlay.classList.remove("active")
          hamburgerMenu.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }
      })
    })

    // Close menu when clicking on overlay
    navOverlay.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        navList.classList.remove("active")
        navOverlay.classList.remove("active")
        hamburgerMenu.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    })
  }

  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  const contactForm = document.querySelector(".contact-form")
  const signupForm = document.querySelector(".signup-form")

  // Enhanced email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Enhanced phone validation function - only digits, spaces, + and - with minimum 10 digits
  function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-+]/g, "")
    return /^\d{10,}$/.test(cleanPhone)
  }

  // Function to show error message
  function showError(input, message) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.add("error")

    // Remove existing error message
    const existingError = formGroup.querySelector(".form-error")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorElement = document.createElement("span")
    errorElement.className = "form-error"
    errorElement.textContent = message
    input.parentNode.appendChild(errorElement)
  }

  // Function to clear error message
  function clearError(input) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("error")
    const errorElement = formGroup.querySelector(".form-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let isValid = true

      const nameInput = contactForm.querySelector("#contact-name")
      const emailInput = contactForm.querySelector("#contact-email")
      const messageInput = contactForm.querySelector("#contact-message")

      // Clear previous errors
      clearError(nameInput)
      clearError(emailInput)
      clearError(messageInput)

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, "Naam is verplicht.")
        isValid = false
      }

      // Validate email
      if (!emailInput.value.trim()) {
        showError(emailInput, "E-mailadres is verplicht.")
        isValid = false
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, "Voer een geldig e-mailadres in.")
        isValid = false
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, "Bericht is verplicht.")
        isValid = false
      }

      if (isValid) {
        alert("Bedankt voor uw bericht! Wij nemen zo spoedig mogelijk contact met u op.")
        contactForm.reset()
      }
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let isValid = true

      const nameInput = signupForm.querySelector("#applicant-name")
      const emailInput = signupForm.querySelector("#applicant-email")
      const phoneInput = signupForm.querySelector("#applicant-phone")
      const checkboxes = signupForm.querySelectorAll('input[name="hulpvraag[]"]:checked')
      const messageInput = signupForm.querySelector("#applicant-message")

      // Clear previous errors
      signupForm.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error")
        const errorElement = group.querySelector(".form-error")
        if (errorElement) {
          errorElement.remove()
        }
      })

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, "Naam is verplicht.")
        isValid = false
      }

      // Validate email
      if (!emailInput.value.trim()) {
        showError(emailInput, "E-mailadres is verplicht.")
        isValid = false
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, "Voer een geldig e-mailadres in.")
        isValid = false
      }

      // Validate phone
      if (!phoneInput.value.trim()) {
        showError(phoneInput, "Telefoonnummer is verplicht.")
        isValid = false
      } else if (!validatePhone(phoneInput.value)) {
        showError(phoneInput, "Voer een geldig telefoonnummer in (minimaal 10 cijfers).")
        isValid = false
      }

      // Validate checkboxes
      if (checkboxes.length === 0) {
        const checkboxGroup = signupForm.querySelector(".checkbox-group")
        const formGroup = checkboxGroup.closest(".form-group")
        formGroup.classList.add("error")

        const errorElement = document.createElement("span")
        errorElement.className = "form-error"
        errorElement.textContent = "Selecteer minimaal één hulpvraag."
        checkboxGroup.parentNode.appendChild(errorElement)
        isValid = false
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, "Bericht is verplicht.")
        isValid = false
      }

      if (isValid) {
        alert("Bedankt voor uw aanmelding! Wij nemen zo spoedig mogelijk contact met u op.")
        signupForm.reset()
      }
    })
  }

  const sections = document.querySelectorAll(".section")
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.classList.add("fade-in")
    sectionObserver.observe(section)
  })
})
