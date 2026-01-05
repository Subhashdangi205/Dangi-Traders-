// Cart page JavaScript

// Sample product data for cart items
const productDatabase = {
  1: {
    id: 1,
    name: "Basmati Rice (5kg)",
    price: 450,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop",
    inStock: true,
  },
  2: {
    id: 2,
    name: "NPK Fertilizer (50kg)",
    price: 1200,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
    inStock: true,
  },
  3: {
    id: 3,
    name: "Cattle Feed (25kg)",
    price: 800,
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=100&h=100&fit=crop",
    inStock: true,
  },
}

// Initialize cart page
document.addEventListener("DOMContentLoaded", () => {
  initializeCartPage()
})

function initializeCartPage() {
  loadCartItems()
  updateCartSummary()
  initializeCheckoutButton()
}

// Load cart items from localStorage
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartItemsList = document.getElementById("cartItemsList")
  const cartLayout = document.getElementById("cartLayout")
  const emptyCart = document.getElementById("emptyCart")
  const cartItemsCount = document.getElementById("cartItemsCount")

  if (cart.length === 0) {
    // Show empty cart state
    if (cartLayout) cartLayout.style.display = "none"
    if (emptyCart) emptyCart.style.display = "block"
    if (cartItemsCount) cartItemsCount.textContent = "0 items in your cart"
    return
  }

  // Show cart with items
  if (cartLayout) cartLayout.style.display = "grid"
  if (emptyCart) emptyCart.style.display = "none"
  if (cartItemsCount) cartItemsCount.textContent = `${cart.length} items in your cart`

  // Render cart items
  if (cartItemsList) {
    cartItemsList.innerHTML = ""

    cart.forEach((cartItem) => {
      const product = productDatabase[cartItem.id]
      if (product) {
        const cartItemElement = createCartItemElement(product, cartItem.quantity)
        cartItemsList.appendChild(cartItemElement)
      }
    })
  }
}

// Create cart item element
function createCartItemElement(product, quantity) {
  const cartItem = document.createElement("div")
  cartItem.className = "cart-item"
  cartItem.dataset.productId = product.id

  cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="item-details">
            <h3>${product.name}</h3>
            <div class="item-price">₹${product.price}</div>
            <div class="item-stock ${product.inStock ? "stock-available" : "stock-unavailable"}">
                ${product.inStock ? "In Stock" : "Out of Stock"}
            </div>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity - 1})">
                <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">${quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity + 1})">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="item-total">
            <div class="item-total-price">₹${product.price * quantity}</div>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `

  return cartItem
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemIndex = cart.findIndex((item) => item.id === productId)

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = newQuantity
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update the display
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`)
    if (cartItem) {
      const quantityDisplay = cartItem.querySelector(".quantity-display")
      const itemTotalPrice = cartItem.querySelector(".item-total-price")
      const product = productDatabase[productId]

      if (quantityDisplay) quantityDisplay.textContent = newQuantity
      if (itemTotalPrice && product) {
        itemTotalPrice.textContent = `₹${product.price * newQuantity}`
      }
    }

    updateCartSummary()
    updateCartCount()
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))

  // Remove item from display
  const cartItem = document.querySelector(`[data-product-id="${productId}"]`)
  if (cartItem) {
    cartItem.remove()
  }

  // Check if cart is empty
  if (cart.length === 0) {
    const cartLayout = document.getElementById("cartLayout")
    const emptyCart = document.getElementById("emptyCart")
    const cartItemsCount = document.getElementById("cartItemsCount")

    if (cartLayout) cartLayout.style.display = "none"
    if (emptyCart) emptyCart.style.display = "block"
    if (cartItemsCount) cartItemsCount.textContent = "0 items in your cart"
  } else {
    const cartItemsCount = document.getElementById("cartItemsCount")
    if (cartItemsCount) cartItemsCount.textContent = `${cart.length} items in your cart`
  }

  updateCartSummary()
  updateCartCount()
  showNotification("Item removed from cart", "info")
}

// Update cart summary
function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  let subtotal = 0

  cart.forEach((cartItem) => {
    const product = productDatabase[cartItem.id]
    if (product) {
      subtotal += product.price * cartItem.quantity
    }
  })

  const gst = subtotal * 0.18 // 18% GST
  const shipping = subtotal > 1000 ? 0 : 50
  const total = subtotal + gst + shipping

  // Update summary display
  const subtotalElement = document.getElementById("subtotal")
  const gstElement = document.getElementById("gst")
  const shippingElement = document.getElementById("shipping")
  const totalElement = document.getElementById("total")
  const freeShippingNotice = document.getElementById("freeShippingNotice")

  if (subtotalElement) subtotalElement.textContent = `₹${subtotal}`
  if (gstElement) gstElement.textContent = `₹${gst.toFixed(2)}`
  if (shippingElement) shippingElement.textContent = shipping === 0 ? "Free" : `₹${shipping}`
  if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`

  // Show/hide free shipping notice
  if (freeShippingNotice) {
    freeShippingNotice.style.display = shipping === 0 ? "block" : "none"
  }
}

// Initialize checkout button
function initializeCheckoutButton() {
  const checkoutBtn = document.querySelector(".checkout-btn")

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      const cart = JSON.parse(localStorage.getItem("cart")) || []

      if (cart.length === 0) {
        showNotification("Your cart is empty", "error")
        return
      }

      // Simulate checkout process
      this.disabled = true
      this.innerHTML = '<span class="spinner"></span>Processing...'

      setTimeout(() => {
        this.disabled = false
        this.textContent = "Proceed to Checkout"
        showNotification("Checkout functionality would be implemented here", "info")
      }, 2000)
    })
  }
}

// Update cart count in header (reuse from main.js)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartCounts = document.querySelectorAll(".cart-count")
  cartCounts.forEach((count) => {
    count.textContent = totalItems
    count.style.display = totalItems > 0 ? "flex" : "none"
  })
}

// Show notification (reuse from main.js)
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

// Initialize default cart items for demo
function initializeDemoCart() {
  const existingCart = localStorage.getItem("cart")
  if (!existingCart) {
    const demoCart = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 },
    ]
    localStorage.setItem("cart", JSON.stringify(demoCart))
  }
}

// Initialize demo cart on first visit
document.addEventListener("DOMContentLoaded", () => {
  initializeDemoCart()
})
