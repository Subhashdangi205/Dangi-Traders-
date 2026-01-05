// Admin login page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeAdminLogin()
})

function initializeAdminLogin() {
  initializePasswordToggle()
  initializeLoginForm()
}

// Password visibility toggle
function initializePasswordToggle() {
  const passwordToggle = document.getElementById("passwordToggle")
  const passwordInput = document.getElementById("password")

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", function () {
      const isPassword = passwordInput.type === "password"

      passwordInput.type = isPassword ? "text" : "password"
      this.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>'
    })
  }
}

// Login form handling
function initializeLoginForm() {
  const loginForm = document.getElementById("adminLoginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const credentials = {
        username: formData.get("username").trim(),
        password: formData.get("password").trim(),
        remember: formData.get("remember") === "on",
      }

      if (validateLoginForm(credentials)) {
        performLogin(credentials)
      }
    })
  }
}

// Validate login form
function validateLoginForm(credentials) {
  let isValid = true

  // Clear previous errors
  clearFormErrors()

  // Validate username
  if (!credentials.username) {
    showFieldError("username", "Username is required")
    isValid = false
  }

  // Validate password
  if (!credentials.password) {
    showFieldError("password", "Password is required")
    isValid = false
  } else if (credentials.password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters")
    isValid = false
  }

  return isValid
}

// Show field error
function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName)
  if (field) {
    field.classList.add("error")

    const inputContainer = field.closest(".input-with-icon")
    if (inputContainer) {
      // Remove existing error
      const existingError = inputContainer.parentNode.querySelector(".field-error")
      if (existingError) {
        existingError.remove()
      }

      // Add new error
      const errorDiv = document.createElement("div")
      errorDiv.className = "field-error"
      errorDiv.textContent = message
      errorDiv.style.cssText = `
                color: #F44336;
                font-size: 0.8rem;
                margin-top: 0.25rem;
            `

      inputContainer.parentNode.appendChild(errorDiv)
    }
  }
}

// Clear form errors
function clearFormErrors() {
  const errorFields = document.querySelectorAll(".error")
  const errorMessages = document.querySelectorAll(".field-error")

  errorFields.forEach((field) => field.classList.remove("error"))
  errorMessages.forEach((message) => message.remove())
}

// Perform login
function performLogin(credentials) {
  const submitButton = document.querySelector('#adminLoginForm button[type="submit"]')
  const originalText = submitButton.textContent

  // Show loading state
  submitButton.disabled = true
  submitButton.innerHTML = '<span class="spinner"></span>Signing In...'

  // Simulate authentication
  setTimeout(() => {
    // Reset button
    submitButton.disabled = false
    submitButton.textContent = originalText

    // Check credentials (demo purposes)
    if (credentials.username === "admin" && credentials.password === "admin123") {
      // Successful login
      showNotification("Login successful! Redirecting...", "success")

      // Store login state if remember me is checked
      if (credentials.remember) {
        localStorage.setItem("adminRemember", "true")
      }

      // Redirect to admin dashboard (simulate)
      setTimeout(() => {
        showNotification("Admin dashboard would load here", "info")
      }, 2000)
    } else {
      // Failed login
      showNotification("Invalid username or password", "error")

      // Add shake animation to form
      const loginCard = document.querySelector(".admin-login-card")
      if (loginCard) {
        loginCard.style.animation = "shake 0.5s ease-in-out"
        setTimeout(() => {
          loginCard.style.animation = ""
        }, 500)
      }
    }

    // Log attempt (in real app, this would be sent to server)
    console.log("Login attempt:", {
      username: credentials.username,
      timestamp: new Date().toISOString(),
      success: credentials.username === "admin" && credentials.password === "admin123",
    })
  }, 2000)
}

// Show notification
function showNotification(message, type = "info") {
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

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Check for remembered login on page load
document.addEventListener("DOMContentLoaded", () => {
  const rememberMe = localStorage.getItem("adminRemember")
  if (rememberMe === "true") {
    const rememberCheckbox = document.querySelector('input[name="remember"]')
    if (rememberCheckbox) {
      rememberCheckbox.checked = true
    }
  }
})

// Add shake animation CSS
const shakeStyles = document.createElement("style")
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .input-with-icon input.error {
        border-color: #F44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
    }
`
document.head.appendChild(shakeStyles)
