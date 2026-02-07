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
  const displayCategory = product.subcategory
    ? formatCategoryName(product.subcategory)
    : formatCategoryName(product.category);

  return `
    <div class="product-card fade-in" data-category="${product.category}" data-subcategory="${product.subcategory || ''}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <span class="product-category">${displayCategory}</span>
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

// Render empty state
function renderEmptyState(categoryName) {
  return `
    <div class="empty-state">
      <p>No ${categoryName} cards available right now.</p>
      <p>Check back soon for new designs!</p>
    </div>
  `;
}

// Render featured products on homepage
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  const featured = getFeaturedProducts();
  if (featured.length === 0) {
    container.innerHTML = renderEmptyState('featured');
  } else {
    container.innerHTML = featured.map(renderProductCard).join('');
  }
}

// Current filter state
let currentCategory = 'all';
let currentSubcategory = null;

// Render all products on shop page
function renderShopProducts(category = 'all', subcategory = null) {
  const container = document.getElementById('shop-products');
  if (!container) return;

  let filteredProducts;
  let categoryName = 'cards';

  if (subcategory) {
    filteredProducts = getProductsBySubcategory(subcategory);
    categoryName = formatCategoryName(subcategory);
  } else if (category && category !== 'all') {
    filteredProducts = getProductsByCategory(category);
    categoryName = formatCategoryName(category);
  } else {
    filteredProducts = products;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = renderEmptyState(categoryName);
  } else {
    container.innerHTML = filteredProducts.map(renderProductCard).join('');
  }
}

// Initialize category filter
function initCategoryFilter() {
  const filterContainer = document.getElementById('category-filter');
  const subFilterContainer = document.getElementById('subcategory-filter');
  if (!filterContainer) return;

  // Build main category buttons
  let filterHTML = '<button class="filter-btn active" data-category="all">All</button>';
  mainCategories.forEach(cat => {
    filterHTML += `<button class="filter-btn" data-category="${cat.id}">${cat.name}</button>`;
  });
  filterContainer.innerHTML = filterHTML;

  // Add click handlers for main categories
  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.dataset.category;
      currentSubcategory = null;

      // Show/hide subcategory filter for Holiday
      if (subFilterContainer) {
        if (currentCategory === 'holiday') {
          renderSubcategoryFilter(subFilterContainer);
          subFilterContainer.style.display = 'flex';
        } else {
          subFilterContainer.style.display = 'none';
        }
      }

      // Filter products
      renderShopProducts(currentCategory, null);
    });
  });
}

// Render subcategory filter for holidays
function renderSubcategoryFilter(container) {
  let html = '<button class="filter-btn sub active" data-subcategory="all">All Holidays</button>';
  holidaySubcategories.forEach(sub => {
    html += `<button class="filter-btn sub" data-subcategory="${sub.id}">${sub.name}</button>`;
  });
  container.innerHTML = html;

  // Add click handlers
  const subBtns = container.querySelectorAll('.filter-btn');
  subBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const subcategory = btn.dataset.subcategory;
      currentSubcategory = subcategory === 'all' ? null : subcategory;

      renderShopProducts('holiday', currentSubcategory);
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

// Newsletter form handling
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('newsletter-email').value;

    // Store signup (can be sent to a backend later)
    console.log('Newsletter signup:', email);

    showToast('Thanks for subscribing! You\'ll hear from us soon.');
    form.reset();
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', async function() {
  initMobileMenu();
  setActiveNavLink();
  initSmoothScroll();

  // Load products first, then render
  await loadProducts();

  // Page-specific initialization
  renderFeaturedProducts();
  initCategoryFilter();
  renderShopProducts();
  initContactForm();
  initNewsletterForm();
});
