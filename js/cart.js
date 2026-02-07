// JMB Handcrafted Cards - Cart Functionality

// Cart stored in localStorage
const CART_KEY = 'jmb_cart';

// Shipping
const SHIPPING_FLAT_RATE = 4.99;
const FREE_SHIPPING_THRESHOLD = 35;

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = getProductById(productId);

  if (!product) return false;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
  return true;
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

// Get cart subtotal (items only)
function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get shipping cost
function getShippingCost() {
  const subtotal = getCartSubtotal();
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

// Get cart total (subtotal + shipping)
function getCartTotal() {
  return getCartSubtotal() + getShippingCost();
}

// Get cart item count
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

// Update cart count in header
function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const count = getCartItemCount();

  countElements.forEach(el => {
    el.textContent = count;
    if (count === 0) {
      el.classList.add('hidden');
    } else {
      el.classList.remove('hidden');
    }
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);

  // Hide and remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Render cart items on cart page
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');

  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any cards yet.</p>
        <a href="shop.html" class="btn btn-primary mt-2">Browse Cards</a>
      </div>
    `;
    if (cartSummary) {
      cartSummary.style.display = 'none';
    }
    return;
  }

  if (cartSummary) {
    cartSummary.style.display = 'block';
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)} each</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const shippingNoteEl = document.getElementById('shipping-note');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl && totalEl) {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(total);

    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    }

    if (shippingNoteEl) {
      if (shipping > 0) {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        shippingNoteEl.textContent = `Add $${remaining} more for free shipping!`;
        shippingNoteEl.style.display = 'block';
      } else if (subtotal > 0) {
        shippingNoteEl.textContent = 'You qualify for free shipping!';
        shippingNoteEl.style.display = 'block';
      } else {
        shippingNoteEl.style.display = 'none';
      }
    }
  }
}

// Change quantity handler
function changeQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    const newQuantity = item.quantity + change;
    updateQuantity(productId, newQuantity);
    renderCartItems();
  }
}

// Remove item handler
function removeItem(productId) {
  removeFromCart(productId);
  renderCartItems();
  showToast('Item removed from cart');
}

// Initialize PayPal
function initPayPal() {
  const paypalContainer = document.getElementById('paypal-button-container');

  if (!paypalContainer || typeof paypal === 'undefined') return;

  // Check if cart is empty
  if (getCart().length === 0) return;

  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    },

    createOrder: function(data, actions) {
      const total = getCartTotal();

      return actions.order.create({
        purchase_units: [{
          description: 'JMB Handcrafted Cards Order',
          amount: {
            value: total.toFixed(2)
          }
        }]
      });
    },

    onApprove: function(data, actions) {
      return actions.order.capture().then(async function(details) {
        // Get cart items before clearing
        const cartItems = getCart();
        const orderSubtotal = getCartSubtotal().toFixed(2);
        const orderShipping = getShippingCost().toFixed(2);
        const orderTotal = getCartTotal().toFixed(2);
        const mailingListOptIn = document.getElementById('cart-mailing-list')?.checked || false;

        // Send order notification
        try {
          await fetch('/api/order-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              items: cartItems,
              subtotal: orderSubtotal,
              shipping: orderShipping,
              total: orderTotal,
              customerEmail: details.payer.email_address,
              customerName: details.payer.name ?
                `${details.payer.name.given_name} ${details.payer.name.surname}` : null,
              transactionId: details.id,
              mailingListOptIn: mailingListOptIn
            })
          });
        } catch (error) {
          // Log error but don't block the success flow
          console.error('Failed to send order notification:', error);
        }

        // Clear cart on successful payment
        clearCart();

        // Show success message
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
          cartContainer.innerHTML = `
            <div class="cart-empty" style="grid-column: 1 / -1;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-accent);">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Thank you for your order!</h3>
              <p>Order confirmation has been sent to ${details.payer.email_address}</p>
              <a href="shop.html" class="btn btn-primary mt-2">Continue Shopping</a>
            </div>
          `;
        }
      });
    },

    onError: function(err) {
      console.error('PayPal Error:', err);
      showToast('Payment failed. Please try again.', 'error');
    }
  }).render('#paypal-button-container');
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();

  // If on cart page, render cart items and init PayPal
  if (document.getElementById('cart-items')) {
    renderCartItems();
    initPayPal();
  }
});
