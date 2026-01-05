// Products page JavaScript

// Sample products data
const productsData = [
  {
    id: 1,
    name: "Basmati Rice (5kg)",
    category: "grocery",
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
    category: "grocery",
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
    category: "fertilizers",
    price: 1200,
    originalPrice: 1300,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=250&h=250&fit=crop",
    rating: 4.8,
    reviews: 45,
    inStock: true,
  },
  {
    id: 4,
    name: "Urea (45kg)",
    category: "fertilizers",
    price: 800,
    originalPrice: 850,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=250&h=250&fit=crop",
    rating: 4.6,
    reviews: 32,
    inStock: false,
  },
  {
    id: 5,
    name: "Cattle Feed (25kg)",
    category: "animal-feed",
    price: 800,
    originalPrice: 900,
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=250&h=250&fit=crop",
    rating: 4.7,
    reviews: 28,
    inStock: true,
  },
  {
    id: 6,
    name: "Poultry Feed (20kg)",
    category: "animal-feed",
    price: 650,
    originalPrice: 700,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=250&h=250&fit=crop",
    rating: 4.4,
    reviews: 15,
    inStock: true,
  },
  {
    id: 7,
    name: "Jute Storage Bag (Large)",
    category: "storage-bags",
    price: 150,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=250&h=250&fit=crop",
    rating: 4.2,
    reviews: 12,
    inStock: true,
  },
  {
    id: 8,
    name: "PP Storage Bag (Medium)",
    category: "storage-bags",
    price: 80,
    originalPrice: 100,
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=250&h=250&fit=crop",
    rating: 4.0,
    reviews: 8,
    inStock: true,
  },
]

// Function to get URL parameter
function getUrlParameter(name) {
  name = name.replace(/[[\]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(window.location.href)
  if (!results) return null
  if (!results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

// Current filters and sorting
const currentFilters = {
  category: "all",
  priceRange: 5000,
  search: "",
}

let currentSort = "popularity"

// Initialize products page
document.addEventListener("DOMContentLoaded", () => {
  initializeProductsPage()
})

function initializeProductsPage() {
  initializeFilters()
  initializeSorting()
  initializePriceRange()
  loadUrlFilters()
  renderFilteredProducts()
}

// Initialize filter functionality
function initializeFilters() {
  // Category filters
  const categoryRadios = document.querySelectorAll('input[name="category"]')
  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      currentFilters.category = this.value
      renderFilteredProducts()
    })
  })

  // Search filter
  const filterSearch = document.getElementById("filterSearch")
  if (filterSearch) {
    filterSearch.addEventListener("input", function () {
      currentFilters.search = this.value.trim()
      renderFilteredProducts()
    })
  }

  // Product search in header
  const productSearch = document.getElementById("productSearch")
  if (productSearch) {
    productSearch.addEventListener("input", function () {
      currentFilters.search = this.value.trim()
      renderFilteredProducts()
    })

    productSearch.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        currentFilters.search = this.value.trim()
        renderFilteredProducts()
      }
    })
  }
}

// Initialize sorting
function initializeSorting() {
  const sortSelect = document.getElementById("sortBy")
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      currentSort = this.value
      renderFilteredProducts()
    })
  }
}

// Initialize price range slider
function initializePriceRange() {
  const priceRange = document.getElementById("priceRange")
  const priceValue = document.getElementById("priceValue")

  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      const value = Number.parseInt(this.value)
      currentFilters.priceRange = value
      priceValue.textContent = `0 - ${value}`
      renderFilteredProducts()
    })
  }
}

// Load filters from URL parameters
function loadUrlFilters() {
  const urlCategory = getUrlParameter("category")
  const urlSearch = getUrlParameter("search")

  if (urlCategory) {
    currentFilters.category = urlCategory
    const categoryRadio = document.querySelector(`input[name="category"][value="${urlCategory}"]`)
    if (categoryRadio) {
      categoryRadio.checked = true
    }
  }

  if (urlSearch) {
    currentFilters.search = urlSearch
    const searchInputs = document.querySelectorAll("#filterSearch, #productSearch")
    searchInputs.forEach((input) => {
      if (input) input.value = urlSearch
    })
  }
}

// Filter and sort products
function getFilteredProducts() {
  let filtered = [...productsData]

  // Apply category filter
  if (currentFilters.category !== "all") {
    filtered = filtered.filter((product) => product.category === currentFilters.category)
  }

  // Apply price filter
  filtered = filtered.filter((product) => product.price <= currentFilters.priceRange)

  // Apply search filter
  if (currentFilters.search) {
    const searchTerm = currentFilters.search.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm),
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (currentSort) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "popularity":
      default:
        return b.reviews - a.reviews
    }
  })

  return filtered
}

// Render filtered products
function renderFilteredProducts() {
  const productsGrid = document.getElementById("productsGrid")
  const resultsCount = document.getElementById("resultsCount")

  if (!productsGrid) return

  const filteredProducts = getFilteredProducts()

  // Update results count
  if (resultsCount) {
    resultsCount.textContent = filteredProducts.length
  }

  // Clear existing products
  productsGrid.innerHTML = ""

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `
    productsGrid.style.gridColumn = "1 / -1"
    productsGrid.style.textAlign = "center"
    productsGrid.style.padding = "3rem"
    return
  }

  // Reset grid styles
  productsGrid.style.gridColumn = ""
  productsGrid.style.textAlign = ""
  productsGrid.style.padding = ""

  // Render products
  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card (reuse from main.js but with modifications for products page)
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
        <img src="${product.image}" alt="${product.name}" loading="lazy">
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

// Generate stars (same as main.js)
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

// Add responsive filter toggle for mobile
function initializeMobileFilters() {
  const filterToggle = document.createElement("button")
  filterToggle.className = "filter-toggle mobile-only"
  filterToggle.innerHTML = '<i class="fas fa-filter"></i> Filters'
  filterToggle.style.cssText = `
        display: none;
        width: 100%;
        padding: 1rem;
        background-color: var(--primary-green);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        cursor: pointer;
    `

  const productsSection = document.querySelector(".products-section .container")
  if (productsSection) {
    productsSection.insertBefore(filterToggle, productsSection.firstChild)
  }

  filterToggle.addEventListener("click", () => {
    const sidebar = document.querySelector(".filters-sidebar")
    if (sidebar) {
      sidebar.classList.toggle("mobile-active")
    }
  })
}

// Add mobile styles
const mobileStyles = document.createElement("style")
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .filter-toggle.mobile-only {
            display: block !important;
        }
        
        .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background-color: white;
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
            padding: 2rem 1rem;
        }
        
        .filters-sidebar.mobile-active {
            left: 0;
        }
        
        .filters-sidebar::before {
            content: '';
            position: fixed;
            top: 0;
            right: 0;
            width: 20%;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }
        
        .no-products {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: var(--gray-600);
        }
    }
`
document.head.appendChild(mobileStyles)

// Initialize mobile filters
document.addEventListener("DOMContentLoaded", () => {
  initializeMobileFilters()
})
