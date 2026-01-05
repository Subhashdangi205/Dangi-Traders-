// Contact page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeContactForm()
})

function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form data
      const formData = new FormData(this)
      const data = {
        name: formData.get("name").trim(),
        phone: formData.get("phone").trim(),
        email: formData.get("email").trim(),
        message: formData.get("message").trim(),
      }

      // Validate form
      if (validateContactForm(data)) {
        // Simulate form submission
        submitContactForm(data)
      }
    })
  }
}

function validateContactForm(data) {
  let isValid = true

  // Validate name
  if (!data.name) {
    showFieldError("name", "Name is required")
    isValid = false
  }

  // Validate phone
  if (!data.phone) {
    showFieldError("phone", "Phone number is required")
    isValid = false
  } else if (!validatePhone(data.phone)) {
    showFieldError("phone", "Please enter a valid phone number")
    isValid = false
  }

  // Validate email (optional but if provided, must be valid)
  if (data.email && !validateEmail(data.email)) {
    showFieldError("email", "Please enter a valid email address")
    isValid = false
  }

  // Validate message
  if (!data.message) {
    showFieldError("message", "Message is required")
    isValid = false
  }

  return isValid
}

function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName)
  if (field) {
    field.classList.add("error")

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "field-error"
    errorDiv.textContent = message
    field.parentNode.appendChild(errorDiv)
  }
}

function clearFieldErrors() {
  const errorFields = document.querySelectorAll(".error")
  const errorMessages = document.querySelectorAll(".field-error")

  errorFields.forEach((field) => field.classList.remove("error"))
  errorMessages.forEach((message) => message.remove())
}

function submitContactForm(data) {
  const submitButton = document.querySelector('#contactForm button[type="submit"]')
  const originalText = submitButton.textContent

  // Show loading state
  submitButton.disabled = true
  submitButton.innerHTML = '<span class="spinner"></span>Sending...'

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitButton.disabled = false
    submitButton.textContent = originalText

    // Clear form
    document.getElementById("contactForm").reset()
    clearFieldErrors()

    // Show success message
    showNotification("Thank you for your message! We will get back to you soon.", "success")

    // Log form data (in real app, this would be sent to server)
    console.log("Contact form submitted:", data)
  }, 2000)
}

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation function
function validatePhone(phone) {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "")

  // Check if it's a valid Indian phone number (10 digits) or international format
  return cleanPhone.length >= 10 && cleanPhone.length <= 15
}

// Show notification function (reuse from main.js)
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
