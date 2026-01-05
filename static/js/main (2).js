// Main JavaScript file for Dangi Traders website

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite()
})

// Initialize website functionality
function initializeWebsite() {
  initializeMobileMenu()
  initializeSearch()
  initializeNewsletterForm()
  initializeFeaturedProducts()
  initializeScrollAnimations()
  initializeFormValidation()
}

// Mobile Menu Functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isActive = mobileMenu.classList.contains("active")

      if (isActive) {
        mobileMenu.classList.remove("active")
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
      } else {
        mobileMenu.classList.add("active")
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>'
      }
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("active")
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
      }
    })
  }
}

// Search Functionality
function initializeSearch() {
  const searchInputs = document.querySelectorAll("#searchInput, .search-box input")

  searchInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        const searchTerm = this.value.trim()
        if (searchTerm) {
          // Redirect to products page with search query
          window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`
        }
      }
    })
  })
}

// Newsletter Form
function initializeNewsletterForm() {
  const newsletterForm = document.getElementById("newsletterForm")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      const email = emailInput.value.trim()

      if (validateEmail(email)) {
        // Simulate newsletter subscription
        showNotification("Thank you for subscribing to our newsletter!", "success")
        emailInput.value = ""
      } else {
        showNotification("Please enter a valid email address.", "error")
      }
    })
  }
}

// Featured Products (for home page)
function initializeFeaturedProducts() {
  const featuredProductsContainer = document.getElementById("featuredProducts")

  if (featuredProductsContainer) {
    const featuredProducts = [
      {
        id: 1,
        name: "Basmati Rice (5kg)",
        price: 450,
        originalPrice: 500,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=250&h=250&fit=crop",
        rating: 4.5,
        reviews: 23,
        inStock: true,
      },
      {
        id: 2,
        name: "Toor Dal (1kg)",
        price: 120,
        originalPrice: 130,
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=250&h=250&fit=crop",
        rating: 4.3,
        reviews: 18,
        inStock: true,
      },
      {
        id: 3,
        name: "NPK Fertilizer (50kg)",
        price: 1200,
        originalPrice: 1300,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=250&h=250&fit=crop",
        rating: 4.8,
        reviews: 45,
        inStock: true,
      },
      {
        id: 4,
        name: "Cattle Feed (25kg)",
        price: 800,
        originalPrice: 900,
        image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=250&h=250&fit=crop",
        rating: 4.7,
        reviews: 28,
        inStock: true,
      },
    ]

    renderProducts(featuredProducts, featuredProductsContainer)
  }
}

// Render products function
function renderProducts(products, container) {
  container.innerHTML = ""

  products.forEach((product) => {
    const productCard = createProductCard(product)
    container.appendChild(productCard)
  })
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  card.innerHTML = `
        ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ""}
        ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ""}
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">(${product.rating}) • ${product.reviews} reviews</span>
            </div>
            <div class="product-footer">
                <div class="product-prices">
                    <span class="product-price">₹${product.price}</span>
                    ${
                      product.originalPrice > product.price
                        ? `<span class="original-price">₹${product.originalPrice}</span>`
                        : ""
                    }
                </div>
                <button class="add-to-cart" ${!product.inStock ? "disabled" : ""} 
                        onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    `

  return card
}

// Generate star rating HTML
function generateStars(rating) {
  let starsHTML = ""
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

// Add to cart functionality
function addToCart(productId) {
  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      quantity: 1,
      addedAt: new Date().toISOString(),
    })
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count in header
  updateCartCount()

  // Show notification
  showNotification("Product added to cart!", "success")
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartCounts = document.querySelectorAll(".cart-count")
  cartCounts.forEach((count) => {
    count.textContent = totalItems
    count.style.display = totalItems > 0 ? "flex" : "none"
  })
}

// Initialize scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".category-card, .product-card, .feature-card, .testimonial-card")
  animateElements.forEach((el) => observer.observe(el))
}

// Form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input[required], textarea[required]")

    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this)
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this)
        }
      })
    })
  })
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim()
  const fieldType = field.type
  let isValid = true
  let errorMessage = ""

  // Remove existing error styling
  field.classList.remove("error")
  removeErrorMessage(field)

  // Check if required field is empty
  if (field.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = "This field is required."
  }
  // Validate email
  else if (fieldType === "email" && value && !validateEmail(value)) {
    isValid = false
    errorMessage = "Please enter a valid email address."
  }
  // Validate phone
  else if (fieldType === "tel" && value && !validatePhone(value)) {
    isValid = false
    errorMessage = "Please enter a valid phone number."
  }

  if (!isValid) {
    field.classList.add("error")
    showErrorMessage(field, errorMessage)
  }

  return isValid
}

// Show error message for field
function showErrorMessage(field, message) {
  removeErrorMessage(field)

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.textContent = message
  errorDiv.style.color = "#F44336"
  errorDiv.style.fontSize = "0.8rem"
  errorDiv.style.marginTop = "0.25rem"

  field.parentNode.appendChild(errorDiv)
}

// Remove error message for field
function removeErrorMessage(field) {
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#2196F3"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `

  const notificationContent = notification.querySelector(".notification-content")
  notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `

  const closeButton = notification.querySelector(".notification-close")
  closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Utility function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// Utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
})

// Add CSS for notifications
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .field-error {
        color: #F44336 !important;
        font-size: 0.8rem !important;
        margin-top: 0.25rem !important;
    }
    
    input.error,
    textarea.error {
        border-color: #F44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
    }
`
document.head.appendChild(notificationStyles)
