// JMB Handcrafted Cards - Main JavaScript

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
      }
    });
  }
}

// Set active navigation link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// Render product card HTML
function renderProductCard(product) {
  return `
    <div class="product-card fade-in" data-category="${product.category}">
      <div class="product-image">
        <div class="placeholder">Image</div>
      </div>
      <div class="product-info">
        <span class="product-category">${formatCategoryName(product.category)}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render featured products on homepage
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  const featured = getFeaturedProducts();
  container.innerHTML = featured.map(renderProductCard).join('');
}

// Render all products on shop page
function renderShopProducts(category = 'all') {
  const container = document.getElementById('shop-products');
  if (!container) return;

  const filteredProducts = getProductsByCategory(category);

  if (filteredProducts.length === 0) {
    container.innerHTML = '<p class="text-center">No products found in this category.</p>';
    return;
  }

  container.innerHTML = filteredProducts.map(renderProductCard).join('');
}

// Initialize category filter
function initCategoryFilter() {
  const filterContainer = document.getElementById('category-filter');
  if (!filterContainer) return;

  // Add "All" button
  let filterHTML = '<button class="filter-btn active" data-category="all">All</button>';

  // Add category buttons
  categories.forEach(category => {
    filterHTML += `<button class="filter-btn" data-category="${category}">${formatCategoryName(category)}</button>`;
  });

  filterContainer.innerHTML = filterHTML;

  // Add click handlers
  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter products
      renderShopProducts(btn.dataset.category);
    });
  });
}

// Contact form handling
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // In a real app, you'd send this to a server
    console.log('Form submitted:', data);

    // Show success message
    showToast('Thank you for your message! We\'ll get back to you soon.');
    form.reset();
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  setActiveNavLink();
  initSmoothScroll();

  // Page-specific initialization
  renderFeaturedProducts();
  initCategoryFilter();
  renderShopProducts();
  initContactForm();
});
