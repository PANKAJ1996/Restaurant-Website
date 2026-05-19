const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const orderButtons = document.querySelectorAll('.menu-item button');
const contactForm = document.getElementById('contactForm');
const reservationForm = document.getElementById('reservationForm');
const cartContainer = document.getElementById('cartContent');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const reservationSummary = document.getElementById('reservationSummary');
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const paymentDetails = document.getElementById('paymentDetails');
const dbKey = 'bubuDuduDB';
const cartKey = 'foodCart';
const reservationKey = 'foodReservation';

function loadCart() {
  try {
    const stored = window.localStorage.getItem(cartKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  window.localStorage.setItem(cartKey, JSON.stringify(cart));
}

function loadReservation() {
  try {
    const stored = window.localStorage.getItem(reservationKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

function initDatabase() {
  const stored = window.localStorage.getItem(dbKey);
  if (!stored) {
    const db = {
      orders: [],
      reservations: [],
      cancellations: [],
      totalCollected: 0,
    };
    window.localStorage.setItem(dbKey, JSON.stringify(db));
    return db;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    const db = {
      orders: [],
      reservations: [],
      cancellations: [],
      totalCollected: 0,
    };
    window.localStorage.setItem(dbKey, JSON.stringify(db));
    return db;
  }
}

function loadDatabase() {
  const db = initDatabase();
  return db;
}

function saveDatabase(db) {
  window.localStorage.setItem(dbKey, JSON.stringify(db));
}

function addOrderToDatabase(order) {
  const db = loadDatabase();
  db.orders.push(order);
  db.totalCollected += order.total;
  saveDatabase(db);
}

function addReservationToDatabase(reservation) {
  const db = loadDatabase();
  db.reservations.push(reservation);
  saveDatabase(db);
}

function addCancellationToDatabase(cancellation) {
  const db = loadDatabase();
  db.cancellations.push(cancellation);
  saveDatabase(db);
}

function updateReservationStatus(reservationId, status) {
  const db = loadDatabase();
  const reservation = db.reservations.find((item) => item.id === reservationId);
  if (!reservation) return null;
  reservation.status = status;
  reservation.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return reservation;
}

function getDatabaseSummary() {
  const db = loadDatabase();
  return {
    orders: db.orders.length,
    reservations: db.reservations.filter((item) => item.status === 'confirmed').length,
    cancellations: db.cancellations.length,
    totalCollected: db.totalCollected,
  };
}

function getCartCount() {
  return loadCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  countElements.forEach((el) => {
    el.textContent = getCartCount();
  });
}

function addToCart(product) {
  const cart = loadCart();
  const existing = cart.find((item) => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function formatPrice(amount) {
  return `₹${amount.toFixed(2)}`;
}

function renderCartPage() {
  if (!cartContainer || !cartTotal) return;

  const cart = loadCart();

  if (!cart.length) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Start picking your favorite dishes from our <a href="menu.html">menu</a>.</p>
      </div>
    `;
    cartTotal.textContent = '₹0.00';
    checkoutButton?.setAttribute('disabled', '');
    renderDatabaseSummary();
    return;
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(subtotal);
  checkoutButton?.removeAttribute('disabled');

  cartContainer.innerHTML = cart
    .map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <strong>${formatPrice(item.price)}</strong>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button type="button" data-action="decrease" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-index="${index}">+</button>
          </div>
          <button class="btn btn-secondary" type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `)
    .join('');
  renderDatabaseSummary();
}

function renderDatabaseSummary() {
  const summary = getDatabaseSummary();
  const orderCount = document.getElementById('orderCount');
  const reservationCount = document.getElementById('reservationCount');
  const cancellationCount = document.getElementById('cancellationCount');
  const totalCollected = document.getElementById('totalCollected');

  if (orderCount) orderCount.textContent = String(summary.orders);
  if (reservationCount) reservationCount.textContent = String(summary.reservations);
  if (cancellationCount) cancellationCount.textContent = String(summary.cancellations);
  if (totalCollected) totalCollected.textContent = formatPrice(summary.totalCollected);
}

function updateCartItem(index, delta) {
  const cart = loadCart();
  const item = cart[index];
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function removeCartItem(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function handleCartActions(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;

  if (action === 'increase') {
    updateCartItem(index, 1);
  }

  if (action === 'decrease') {
    updateCartItem(index, -1);
  }

  if (action === 'remove') {
    removeCartItem(index);
  }
}

function getSelectedPaymentMethod() {
  const selected = Array.from(paymentMethods).find((input) => input.checked);
  return selected ? selected.value : null;
}

function validatePaymentFields(method) {
  if (method === 'upi') {
    const upiId = document.getElementById('upiId')?.value.trim() || '';
    if (!upiId || !upiId.includes('@')) {
      return { valid: false, message: 'Please enter a valid UPI ID, like example@bank.' };
    }
  }

  if (method === 'credit' || method === 'debit') {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s+/g, '');
    const cardExpiry = document.getElementById('cardExpiry')?.value.trim();
    const cardCvv = document.getElementById('cardCvv')?.value.trim();
    if (!cardNumber || cardNumber.length < 12 || cardNumber.length > 19 || !/^[0-9]+$/.test(cardNumber)) {
      return { valid: false, message: 'Please enter a valid card number between 12 and 19 digits.' };
    }
    if (!cardExpiry || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExpiry)) {
      return { valid: false, message: 'Please enter the card expiry in MM/YY format.' };
    }
    if (!cardCvv || !/^[0-9]{3}$/.test(cardCvv)) {
      return { valid: false, message: 'Please enter a valid 3-digit CVV.' };
    }
  }

  return { valid: true };
}

function updatePaymentDetails() {
  const method = getSelectedPaymentMethod();
  const groups = paymentDetails?.querySelectorAll('.payment-details-group');
  groups?.forEach((group) => {
    const targetMethod = group.dataset.method;
    const visible = targetMethod === method || (targetMethod === 'card' && (method === 'credit' || method === 'debit'));
    group.style.display = visible ? 'block' : 'none';
  });
}

function handleCheckout() {
  const cart = loadCart();
  if (!cart.length) return;
  const selectedMethod = getSelectedPaymentMethod();
  if (!selectedMethod) {
    alert('Please choose a payment option before checking out.');
    return;
  }

  const validation = validatePaymentFields(selectedMethod);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const order = {
    id: `order-${Date.now()}`,
    items: cart,
    total: subtotal,
    paymentMethod: selectedMethod,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  addOrderToDatabase(order);
  window.localStorage.removeItem(cartKey);
  renderCartPage();
  updateCartCount();
  alert(`Checkout complete! Payment received via ${selectedMethod.toUpperCase()}. Your order is confirmed.`);
}

function handleFormSubmit(form, statusElement, onSuccess) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll('input, textarea'));
    const isValid = fields.every((field) => {
      if (!field.required) return true;
      return String(field.value).trim().length > 0;
    });

    if (!isValid) {
      statusElement.textContent = 'Please complete all required fields before submitting.';
      return;
    }

    onSuccess(form, statusElement);
  });
}

function submitContactForm(form, statusElement) {
  statusElement.textContent = 'Thanks! Your message has been received.';
  form.reset();
}

function submitReservationForm(form, statusElement) {
  const reservationData = {
    id: `reservation-${Date.now()}`,
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    date: form.date.value,
    time: form.time.value,
    guests: form.guests.value,
    notes: form.notes.value.trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(reservationKey, JSON.stringify(reservationData));
  addReservationToDatabase(reservationData);
  window.location.href = 'reservation-confirmation.html';
}

function renderReservationConfirmation() {
  if (!reservationSummary) return;
  const reservationData = loadReservation();
  if (!reservationData) {
    reservationSummary.innerHTML = `
      <div class="confirmation-card">
        <h2>No reservation found</h2>
        <p>Please return to the <a href="reservation.html">reservation page</a> to book your table.</p>
      </div>
    `;
    return;
  }

  const statusLabel = reservationData.status === 'cancelled' ? 'Reservation Cancelled' : 'Reservation Confirmed';
  const buttonHtml = reservationData.status === 'confirmed' ? '<button id="cancelReservationButton" class="btn btn-secondary" type="button">Cancel Reservation</button>' : '';

  reservationSummary.innerHTML = `
    <section class="confirmation-card">
      <span class="eyebrow">${statusLabel}</span>
      <h2>Thanks, ${reservationData.name}!</h2>
      <p>Your table is ${reservationData.status === 'cancelled' ? 'no longer reserved' : 'reserved'} for ${reservationData.guests} guest(s) on <strong>${reservationData.date}</strong> at <strong>${reservationData.time}</strong>.</p>
      <p>We will follow up at <strong>${reservationData.email}</strong> or by phone at <strong>${reservationData.phone}</strong> if there are any updates.</p>
      <p>${reservationData.notes ? `Special requests: ${reservationData.notes}` : 'No special requests were submitted.'}</p>
      <p>${reservationData.status === 'cancelled' ? 'Your cancellation has been recorded.' : 'We look forward to welcoming you at Bubu Dudu ki Duniya.'}</p>
      ${buttonHtml}
      <a class="btn btn-primary" href="index.html">Back to Home</a>
    </section>
  `;
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
  });
});

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = Number(button.dataset.price);
    const description = button.dataset.description || '';
    if (!item || Number.isNaN(price)) return;
    addToCart({ name: item, price, description });
    alert(`Great choice! ${item} has been added to your cart.`);
  });
});

if (contactForm) {
  const statusElement = document.getElementById('formStatus');
  if (statusElement) {
    handleFormSubmit(contactForm, statusElement, submitContactForm);
  }
}

if (reservationForm) {
  const reservationStatus = document.getElementById('reservationStatus');
  if (reservationStatus) {
    handleFormSubmit(reservationForm, reservationStatus, submitReservationForm);
  }
}

if (cartContainer) {
  cartContainer.addEventListener('click', handleCartActions);
}

if (paymentMethods.length) {
  paymentMethods.forEach((input) => {
    input.addEventListener('change', updatePaymentDetails);
  });
}

if (checkoutButton) {
  checkoutButton.addEventListener('click', handleCheckout);
}

document.addEventListener('click', (event) => {
  if (event.target && event.target.id === 'cancelReservationButton') {
    const reservation = loadReservation();
    if (!reservation || reservation.status !== 'confirmed') return;
    updateReservationStatus(reservation.id, 'cancelled');
    addCancellationToDatabase({
      id: `cancel-${Date.now()}`,
      type: 'reservation',
      refId: reservation.id,
      reason: 'Customer cancelled the reservation',
      amount: 0,
      date: new Date().toISOString(),
    });
    reservation.status = 'cancelled';
    reservation.updatedAt = new Date().toISOString();
    window.localStorage.setItem(reservationKey, JSON.stringify(reservation));
    renderReservationConfirmation();
  }
});

updateCartCount();
renderCartPage();
updatePaymentDetails();
renderReservationConfirmation();
