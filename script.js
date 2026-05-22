<<<<<<< HEAD

"use strict";

// ── SECTION 1: Data & State (Variables, Objects, Arrays) ──────
const APP_NAME = "BookNGo";          // const — never reassigned
let currentUser = null;              // let — changes on login/logout

// Primitive types demo
const VERSION   = "2.0";            // String
const MAX_SEATS = 80;               // Number
const IS_OPEN   = true;             // Boolean
let   notFound  = null;             // null
let   pending;                      // undefined

// Event data stored as Array of Objects (Reference Types)
// Theatre category removed
const eventsData = [
  { id: 1,  name: "Arijit Singh Live",       category: "concert", city: "Mumbai",    date: "2026-05-15", price: 1500 },
  { id: 2,  name: "AP Dhillon",              category: "concert", city: "Delhi",     date: "2026-06-02", price: 2000 },
  { id: 3,  name: "Diljit Dosanjh",          category: "concert", city: "Bangalore", date: "2026-06-20", price: 1800 },
  { id: 4,  name: "Shreya Ghoshal",          category: "concert", city: "Chennai",   date: "2026-07-15", price: 1200 },
  { id: 5,  name: "Badshah",                 category: "concert", city: "Hyderabad", date: "2026-07-28", price: 1600 },
  { id: 6,  name: "India vs Pakistan",       category: "sports",  city: "Mumbai",    date: "2026-06-10", price: 500  },
  { id: 7,  name: "IPL Final",               category: "sports",  city: "Ahmedabad", date: "2026-05-25", price: 1000 },
  { id: 8,  name: "Pro Kabaddi League",      category: "sports",  city: "Delhi",     date: "2026-07-05", price: 300  },
  { id: 9,  name: "Pushpa 2",                category: "movies",  city: "PAN India", date: "2026-01-01", price: 200  },
  { id: 10, name: "War 2",                   category: "movies",  city: "PAN India", date: "2026-05-01", price: 250  },
  { id: 14, name: "Divine India Tour",       category: "concert", city: "Pune",      date: "2026-09-01", price: 2200 },
  { id: 15, name: "ISL Final",               category: "sports",  city: "Kolkata",   date: "2026-08-01", price: 400  },
  { id: 16, name: "Tennis Masters",          category: "sports",  city: "Chennai",   date: "2026-09-15", price: 1200 },
  { id: 17, name: "Ramayana",                category: "movies",  city: "PAN India", date: "2026-06-15", price: 180  },
  { id: 18, name: "Singham Returns",         category: "movies",  city: "PAN India", date: "2026-04-05", price: 150  },
  { id: 21, name: "Hockey Champions Trophy", category: "sports",  city: "Lucknow",   date: "2026-11-12", price: 650  },
  { id: 22, name: "Avengers Secret Wars",    category: "movies",  city: "PAN India", date: "2026-10-20", price: 350  },
  { id: 23, name: "KGF Chapter 3",           category: "movies",  city: "PAN India", date: "2026-08-12", price: 280  },
];

// ── SECTION 2: Helper Utility Functions ───────────────────────

// Function Declaration
function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Arrow Function — single-line return
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// Arrow Function with default argument
const getGreeting = (name = "Guest") => `Welcome back, ${name}!`;

// Closure — creates a counter with private state
function makeCounter(start = 0) {
  let count = start;                   // private via closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}
const cartCounter = makeCounter(0);

// Recursive Function — countdown (used in timer)
function countdown(seconds, callback) {
  if (seconds < 0) return;            // base case
  callback(seconds);
  setTimeout(() => countdown(seconds - 1, callback), 1000);
}

// ── SECTION 3: LocalStorage — Auth Helpers ────────────────────

const AUTH_KEY    = "bookngo_users";
const SESSION_KEY = "bookngo_session";
const BOOKINGS_KEY = "bookngo_bookings";

// Shallow copy of users array from storage
function getUsers() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : [];   // JSON.parse
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users)); // JSON.stringify
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(user) {
  // Destructuring — pull only what we need to store
  const { username, email } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, email }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── SECTION 4: Signup ─────────────────────────────────────────

function signup() {
  // DOM selectors
  const nameEl  = document.getElementById("signup-name");
  const emailEl = document.getElementById("signup-email");
  const pwdEl   = document.getElementById("signup-pwd");
  const cpwdEl  = document.getElementById("signup-cpwd");
  const errEl   = document.getElementById("signup-err");
  const okEl    = document.getElementById("signup-ok");

  // Read values
  const username = nameEl.value.trim();
  const email    = emailEl.value.trim();
  const password = pwdEl.value;
  const confirm  = cpwdEl.value;

  // Reset messages
  errEl.textContent = "";
  okEl.textContent  = "";

  // ── Validation using if/else + logical operators ──
  if (!username || !email || !password || !confirm) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return;
  }
  if (username.length < 3) {
    errEl.textContent = "⚠ Username must be at least 3 characters.";
    return;
  }
  // Regex email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errEl.textContent = "⚠ Enter a valid email address.";
    return;
  }
  if (password.length < 6) {
    errEl.textContent = "⚠ Password must be at least 6 characters.";
    return;
  }
  if (password !== confirm) {
    errEl.textContent = "⚠ Passwords do not match.";
    return;
  }

  const users = getUsers();

  // Higher-Order Function: find existing user
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    errEl.textContent = "⚠ Username or email already registered.";
    return;
  }

  // Object Destructuring — build new user object
  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);

  okEl.textContent = "✅ Account created! Redirecting to login…";

  // BOM: timer redirect
  setTimeout(() => { window.location.href = "login.html"; }, 1500);
}

// ── SECTION 5: Login ──────────────────────────────────────────

function login() {
  const userEl = document.getElementById("login-user");
  const pwdEl  = document.getElementById("login-pwd");
  const errEl  = document.getElementById("login-err");

  const identifier = userEl.value.trim();
  const password   = pwdEl.value;

  errEl.textContent = "";

  if (!identifier || !password) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return;
  }

  const users = getUsers();

  // filter (HOF) then ternary
  const matched = users.find(
    u => (u.username === identifier || u.email === identifier) && u.password === password
  );

  if (!matched) {
    errEl.textContent = "⚠ Invalid credentials. Try again.";
    return;
  }

  saveSession(matched);
  currentUser = matched;

  // BOM — redirect
  window.location.href = "index.html";
}

// ── SECTION 6: Logout ─────────────────────────────────────────

function logout() {
  clearSession();
  currentUser = null;
  window.location.href = "login.html";
}

// ── SECTION 7: Nav — show username or Login button ────────────

function updateNavNew() {
  const session   = getSession();
  const loginLi   = document.getElementById("nav-login-li");
  const userLi    = document.getElementById("nav-user-li");
  const logoutLi  = document.getElementById("logout-li");
  const userSpan  = document.getElementById("nav-username");

  if (!loginLi) return; // not on a page with this nav

  if (session) {
    loginLi.style.display  = "none";
    userLi.style.display   = "flex";
    if (logoutLi) logoutLi.style.display = "flex";
    userSpan.textContent   = session.username;
  } else {
    loginLi.style.display  = "list-item";
    userLi.style.display   = "none";
    if (logoutLi) logoutLi.style.display = "none";
  }
}

// ── SECTION 8: Event Filtering (HOF: filter, sort, map) ───────

function filterEvents(category = "all", city = "all", sortBy = "date") {
  let result = [...eventsData]; // shallow copy via spread

  // filter — HOF
  if (category !== "all") {
    result = result.filter(e => e.category === category);
  }
  if (city !== "all") {
    result = result.filter(e => e.city === city);
  }

  // sort — HOF
  result = result.sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return new Date(a.date) - new Date(b.date); // default date sort
  });

  return result;
}

// reduce — total value of all events
const totalEventValue = eventsData.reduce((sum, e) => sum + e.price, 0);

// map — list of all unique cities
const allCities = [...new Set(eventsData.map(e => e.city))];

// ── SECTION 9: Countdown Timer on Cards ───────────────────────

function startCountdownTimers() {
  const timers = document.querySelectorAll("[data-countdown]");

  timers.forEach(el => {
    const eventDate = new Date(el.dataset.countdown);
    const now       = new Date();
    let diff        = Math.floor((eventDate - now) / 1000); // seconds

    if (diff <= 0) { el.textContent = "Event Started!"; return; }

    // setInterval (BOM)
    const interval = setInterval(() => {
      if (diff <= 0) {
        el.textContent = "🔴 Live Now!";
        clearInterval(interval);
        return;
      }

      // Math operators & control flow
      const days    = Math.floor(diff / 86400);
      const hours   = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      // Template literals
      el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      diff--;
    }, 1000);
  });
}

// ── SECTION 10: Seat Selection ────────────────────────────────

// Object — seat config
const seatConfig = {
  sections: [
    { name: "Platinum", rows: 3, cols: 10, price: 4500, color: "#a78bfa" },
    { name: "Gold",     rows: 4, cols: 12, price: 2500, color: "#fbbf24" },
    { name: "Silver",   rows: 5, cols: 14, price: 1500, color: "#94a3b8" },
  ]
};

// Array to track selected seats (Reference Type)
let selectedSeats = [];

// Pre-booked seats — randomly generated using Array.from + HOF
const bookedSeats = (() => {
  const pool = [];
  seatConfig.sections.forEach(sec => {
    for (let r = 0; r < sec.rows; r++) {
      for (let c = 0; c < sec.cols; c++) {
        if (Math.random() < 0.25) pool.push(`${sec.name}-${r}-${c}`);
      }
    }
  });
  return pool;
})(); // IIFE

function buildSeatMap() {
  const container = document.getElementById("seat-map");
  if (!container) return;

  container.innerHTML = "";

  // for...of loop over sections
  for (const section of seatConfig.sections) {
    const secDiv = document.createElement("div");
    secDiv.className = "seat-section";

    const label = document.createElement("div");
    label.className = "section-label";
    label.textContent = `${section.name} — ${formatCurrency(section.price)}`;
    label.style.color = section.color;
    secDiv.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "seat-grid";

    // Nested for loop — rows & cols
    for (let r = 0; r < section.rows; r++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      // Row label
      const rowLabel = document.createElement("span");
      rowLabel.className = "row-label";
      rowLabel.textContent = String.fromCharCode(65 + r); // A, B, C…
      rowDiv.appendChild(rowLabel);

      for (let c = 0; c < section.cols; c++) {
        const seatId  = `${section.name}-${r}-${c}`;
        const seatBtn = document.createElement("button");
        seatBtn.className = "seat";
        seatBtn.dataset.id      = seatId;
        seatBtn.dataset.section = section.name;
        seatBtn.dataset.price   = section.price;
        seatBtn.title = `${section.name} | Row ${String.fromCharCode(65+r)} | Seat ${c+1}`;

        // switch for seat status
        switch (true) {
          case bookedSeats.includes(seatId):
            seatBtn.classList.add("booked");
            seatBtn.disabled = true;
            break;
          default:
            seatBtn.style.setProperty("--seat-color", section.color);
            seatBtn.addEventListener("click", () => toggleSeat(seatBtn, seatId, section));
        }

        rowDiv.appendChild(seatBtn);
      }
      grid.appendChild(rowDiv);
    }

    secDiv.appendChild(grid);
    container.appendChild(secDiv);
  }
}

function toggleSeat(btn, seatId, section) {
  // Logical operators
  const isSelected = selectedSeats.includes(seatId);

  if (isSelected) {
    // Remove from array — filter HOF
    selectedSeats = selectedSeats.filter(id => id !== seatId);
    btn.classList.remove("selected");
  } else {
    if (selectedSeats.length >= 6) {
      showAlert("⚠ You can select a maximum of 6 seats.", "warn");
      return;
    }
    selectedSeats.push(seatId);
    btn.classList.add("selected");
  }

  updateBookingSummary();
}

function updateBookingSummary() {
  const countEl = document.getElementById("selected-count");
  const totalEl = document.getElementById("booking-total");
  const listEl  = document.getElementById("selected-seats-list");

  if (!countEl) return;

  // reduce to get total price
  const total = selectedSeats.reduce((sum, id) => {
    const btn   = document.querySelector(`[data-id="${id}"]`);
    const price = btn ? Number(btn.dataset.price) : 0;
    return sum + price;
  }, 0);

  cartCounter; // closure counter still in scope
  countEl.textContent = selectedSeats.length;
  totalEl.textContent = formatCurrency(total);

  // map to build seat labels
  listEl.innerHTML = selectedSeats
    .map(id => {
      const [section, r, c] = id.split("-");
      return `<span class="seat-tag">${section} ${String.fromCharCode(65+Number(r))}${Number(c)+1}</span>`;
    })
    .join("");
}

// ── SECTION 11: Booking Form Validation ───────────────────────

function validateBooking() {
  const name  = document.getElementById("b-name")?.value.trim();
  const email = document.getElementById("b-email")?.value.trim();
  const phone = document.getElementById("b-phone")?.value.trim();
  const errEl = document.getElementById("booking-err");

  if (!errEl) return;
  errEl.textContent = "";

  // Chain of if/else if
  if (!name || !email || !phone) {
    errEl.textContent = "⚠ Please fill in all your details.";
    return false;
  }
  if (selectedSeats.length === 0) {
    errEl.textContent = "⚠ Please select at least one seat.";
    return false;
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    errEl.textContent = "⚠ Enter a valid 10-digit Indian mobile number.";
    return false;
  }
  return true;
}

// Promise — simulates async booking confirmation
function confirmBooking() {
  if (!validateBooking()) return;

  const name  = document.getElementById("b-name").value.trim();
  const email = document.getElementById("b-email").value.trim();

  showAlert("⏳ Processing your booking…", "info");

  const bookingPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.05;
      success
        ? resolve({ name, email, seats: selectedSeats, ref: "BNG" + Date.now() })
        : reject(new Error("Payment gateway timeout. Please retry."));
    }, 1800);
  });

  bookingPromise
    .then(data => {
      const { name, seats, ref } = data;

      // TOTAL PRICE
      const total = selectedSeats.reduce((sum, id) => {
        const btn = document.querySelector(`[data-id="${id}"]`);
        return sum + Number(btn.dataset.price);
      }, 0);

      // SAVE BOOKING
      saveBookingData(total);

      // UPDATE MODAL
      document.getElementById("conf-total").textContent = formatCurrency(total);

      // SHOW CONFIRMATION
      showBookingConfirmation(name, seats, ref);
    })
    .catch(err => {
      console.error("Booking failed:", err.message);
      showAlert("❌ " + err.message, "error");
    });
}

// ── SECTION 12: Contact Form Validation ───────────────────────

function validateContact() {
  const name    = document.getElementById("c-name")?.value.trim();
  const email   = document.getElementById("c-email")?.value.trim();
  const message = document.getElementById("c-msg")?.value.trim();
  const errEl   = document.getElementById("contact-err");
  const okEl    = document.getElementById("contact-ok");

  if (!errEl) return;
  errEl.textContent = "";
  okEl.textContent  = "";

  if (!name || !email || !message) {
    errEl.textContent = "⚠ All fields are required.";
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errEl.textContent = "⚠ Enter a valid email address.";
    return;
  }
  if (message.length < 10) {
    errEl.textContent = "⚠ Message must be at least 10 characters.";
    return;
  }

  // Simulate send — Promise
  new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      okEl.textContent = "✅ Message sent! We'll get back to you soon.";
      // Reset using for...of
      for (const id of ["c-name","c-email","c-phone","c-msg"]) {
        const el = document.getElementById(id);
        if (el) el.value = "";
      }
    });
}

// ── SECTION 13: Modal / Alert System ─────────────────────────

function showAlert(message, type = "info") {
  // Remove existing
  const old = document.getElementById("bng-alert");
  if (old) old.remove();

  const alert = document.createElement("div");
  alert.id = "bng-alert";
  alert.className = `bng-alert bng-alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);

  // BOM: auto-remove after 3s
  setTimeout(() => alert.remove(), 3000);
}

// ── SECTION 14: My Bookings Page ─────────────────────────────

function showBookings(type, btn) {
  const container = document.getElementById("bookings-container");
  if (!container) return;

  const buttons = document.querySelectorAll(".booking-tabs button");
  buttons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // FIX: safely parse bookings — getItem returns null when empty
  const raw      = localStorage.getItem(BOOKINGS_KEY);
  const bookings = raw ? JSON.parse(raw) : [];

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-booking">
        <h3>No bookings yet</h3>
        <p>Book your first event now.</p>
      </div>
    `;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = bookings.filter(item => {
    const eventDate = new Date(item.date);
    eventDate.setHours(0, 0, 0, 0);
    return type === "upcoming" ? eventDate >= today : eventDate < today;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-booking">
        <h3>No ${type} bookings</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="booking-card">
      <h3>${item.event}</h3>
      <p>📍 ${item.city}</p>
      <p>📅 ${formatDate(item.date)}</p>
      <p>🎟 Seats: ${item.seats.join(", ")}</p>
      <p>💰 Total: ${formatCurrency(item.total)}</p>
    </div>
  `).join("");
}

// ── SECTION 15: Render Category Pages (concerts/sports/movies) ─

function renderCategoryPage() {
  const body    = document.body;
  const category = body.dataset.category;
  if (!category) return;

  const citySelect = document.getElementById("filter-city");
  const sortSelect = document.getElementById("filter-sort");
  const container  = document.getElementById("filtered-cards");
  if (!citySelect || !container) return;

  // Build city dropdown from events in this category
  const cities = [...new Set(
    eventsData.filter(e => e.category === category).map(e => e.city)
  )];
  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  function render() {
    const city   = citySelect.value;
    const sortBy = sortSelect.value;
    const events = filterEvents(category, city, sortBy);

    if (events.length === 0) {
      container.innerHTML = `<p class="no-results">No events found for the selected filters.</p>`;
      return;
    }

    container.innerHTML = events.map(e => `
      <div class="big-card">
        <h3>${e.name}</h3>
        <p>📅 ${formatDate(e.date)}</p>
        <p>📍 ${e.city}</p>
        <div class="tickets">
          <div class="ticket-type">Silver <span>${formatCurrency(e.price)}</span></div>
          <div class="ticket-type">Gold <span>${formatCurrency(Math.round(e.price * 1.67))}</span></div>
          <div class="ticket-type">Platinum <span>${formatCurrency(Math.round(e.price * 3))}</span></div>
        </div>
        <a href="booking.html?id=${e.id}" class="btn">Book Now</a>
      </div>
    `).join("");
  }

  render();
  citySelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);
}

// ── SECTION 16: Booking Page — Load Event from URL ────────────

let currentBookingEvent = null;

function loadBookingEvent() {
  const params  = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));
  if (!eventId) return;

  const foundEvent = eventsData.find(e => e.id === eventId);
  if (!foundEvent) return;

  currentBookingEvent = foundEvent;

  const eventName   = document.getElementById("event-name");
  const eventDate   = document.getElementById("event-date");
  const eventCity   = document.getElementById("event-city");
  const summaryEvent = document.getElementById("summary-event");
  const summaryDate  = document.getElementById("summary-date");
  const summaryCity  = document.getElementById("summary-city");

  if (eventName) {
    eventName.textContent  = foundEvent.name;
    eventDate.textContent  = "📅 " + formatDate(foundEvent.date);
    eventCity.textContent  = "📍 " + foundEvent.city;
    summaryEvent.textContent = foundEvent.name;
    summaryDate.textContent  = formatDate(foundEvent.date);
    summaryCity.textContent  = foundEvent.city;
  }
}

// ── SECTION 17: Save Booking Data ────────────────────────────

function saveBookingData(total) {
  if (!currentBookingEvent) return;

  const raw      = localStorage.getItem(BOOKINGS_KEY);
  const bookings = raw ? JSON.parse(raw) : [];

  bookings.push({
    event: currentBookingEvent.name,
    date:  currentBookingEvent.date,
    city:  currentBookingEvent.city,
    seats: [...selectedSeats],
    total: total,
  });

  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// ── SECTION 18: Show Booking Confirmation Modal ───────────────

function showBookingConfirmation(name, seats, ref) {
  const overlay = document.getElementById("confirm-overlay");
  if (!overlay) return;

  document.getElementById("conf-name").textContent  = name;
  document.getElementById("conf-seats").textContent = seats.join(", ");
  overlay.style.display = "flex";
}

// ── SINGLE DOMContentLoaded ───────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {

  // Nav
  updateNavNew();

  // Logout button (present on all pages)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Auth pages
  const loginBtn  = document.getElementById("login-btn-id");
  const signupBtn = document.getElementById("signup-btn-id");
  if (loginBtn)  loginBtn.addEventListener("click", login);
  if (signupBtn) signupBtn.addEventListener("click", signup);

  // Contact page
  const sendMsgBtn = document.getElementById("send-msg-btn");
  if (sendMsgBtn) sendMsgBtn.addEventListener("click", validateContact);

  // Category pages (concerts / sports / movies)
  renderCategoryPage();

  // Booking page
  loadBookingEvent();
  buildSeatMap();
  updateBookingSummary();

  const confirmBtn = document.getElementById("confirm-btn");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmBooking);

  // Home page countdown timers
  startCountdownTimers();

  // My Bookings page
  if (document.getElementById("bookings-container")) {
    const firstBtn = document.querySelector(".booking-tabs button");
    if (firstBtn) showBookings("upcoming", firstBtn);
  }

=======

"use strict";

// ── SECTION 1: Data & State (Variables, Objects, Arrays) ──────
const APP_NAME = "BookNGo";          // const — never reassigned
let currentUser = null;              // let — changes on login/logout

// Primitive types demo
const VERSION   = "2.0";            // String
const MAX_SEATS = 80;               // Number
const IS_OPEN   = true;             // Boolean
let   notFound  = null;             // null
let   pending;                      // undefined

// Event data stored as Array of Objects (Reference Types)
// Theatre category removed
const eventsData = [
  { id: 1,  name: "Arijit Singh Live",       category: "concert", city: "Mumbai",    date: "2026-05-15", price: 1500 },
  { id: 2,  name: "AP Dhillon",              category: "concert", city: "Delhi",     date: "2026-06-02", price: 2000 },
  { id: 3,  name: "Diljit Dosanjh",          category: "concert", city: "Bangalore", date: "2026-06-20", price: 1800 },
  { id: 4,  name: "Shreya Ghoshal",          category: "concert", city: "Chennai",   date: "2026-07-15", price: 1200 },
  { id: 5,  name: "Badshah",                 category: "concert", city: "Hyderabad", date: "2026-07-28", price: 1600 },
  { id: 6,  name: "India vs Pakistan",       category: "sports",  city: "Mumbai",    date: "2026-06-10", price: 500  },
  { id: 7,  name: "IPL Final",               category: "sports",  city: "Ahmedabad", date: "2026-05-25", price: 1000 },
  { id: 8,  name: "Pro Kabaddi League",      category: "sports",  city: "Delhi",     date: "2026-07-05", price: 300  },
  { id: 9,  name: "Pushpa 2",                category: "movies",  city: "PAN India", date: "2026-01-01", price: 200  },
  { id: 10, name: "War 2",                   category: "movies",  city: "PAN India", date: "2026-05-01", price: 250  },
  { id: 14, name: "Divine India Tour",       category: "concert", city: "Pune",      date: "2026-09-01", price: 2200 },
  { id: 15, name: "ISL Final",               category: "sports",  city: "Kolkata",   date: "2026-08-01", price: 400  },
  { id: 16, name: "Tennis Masters",          category: "sports",  city: "Chennai",   date: "2026-09-15", price: 1200 },
  { id: 17, name: "Ramayana",                category: "movies",  city: "PAN India", date: "2026-06-15", price: 180  },
  { id: 18, name: "Singham Returns",         category: "movies",  city: "PAN India", date: "2026-04-05", price: 150  },
  { id: 21, name: "Hockey Champions Trophy", category: "sports",  city: "Lucknow",   date: "2026-11-12", price: 650  },
  { id: 22, name: "Avengers Secret Wars",    category: "movies",  city: "PAN India", date: "2026-10-20", price: 350  },
  { id: 23, name: "KGF Chapter 3",           category: "movies",  city: "PAN India", date: "2026-08-12", price: 280  },
];

// ── SECTION 2: Helper Utility Functions ───────────────────────

// Function Declaration
function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Arrow Function — single-line return
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// Arrow Function with default argument
const getGreeting = (name = "Guest") => `Welcome back, ${name}!`;

// Closure — creates a counter with private state
function makeCounter(start = 0) {
  let count = start;                   // private via closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}
const cartCounter = makeCounter(0);

// Recursive Function — countdown (used in timer)
function countdown(seconds, callback) {
  if (seconds < 0) return;            // base case
  callback(seconds);
  setTimeout(() => countdown(seconds - 1, callback), 1000);
}

// ── SECTION 3: LocalStorage — Auth Helpers ────────────────────

const AUTH_KEY    = "bookngo_users";
const SESSION_KEY = "bookngo_session";
const BOOKINGS_KEY = "bookngo_bookings";

// Shallow copy of users array from storage
function getUsers() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : [];   // JSON.parse
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users)); // JSON.stringify
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(user) {
  // Destructuring — pull only what we need to store
  const { username, email } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, email }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── SECTION 4: Signup ─────────────────────────────────────────

function signup() {
  // DOM selectors
  const nameEl  = document.getElementById("signup-name");
  const emailEl = document.getElementById("signup-email");
  const pwdEl   = document.getElementById("signup-pwd");
  const cpwdEl  = document.getElementById("signup-cpwd");
  const errEl   = document.getElementById("signup-err");
  const okEl    = document.getElementById("signup-ok");

  // Read values
  const username = nameEl.value.trim();
  const email    = emailEl.value.trim();
  const password = pwdEl.value;
  const confirm  = cpwdEl.value;

  // Reset messages
  errEl.textContent = "";
  okEl.textContent  = "";

  // ── Validation using if/else + logical operators ──
  if (!username || !email || !password || !confirm) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return;
  }
  if (username.length < 3) {
    errEl.textContent = "⚠ Username must be at least 3 characters.";
    return;
  }
  // Regex email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errEl.textContent = "⚠ Enter a valid email address.";
    return;
  }
  if (password.length < 6) {
    errEl.textContent = "⚠ Password must be at least 6 characters.";
    return;
  }
  if (password !== confirm) {
    errEl.textContent = "⚠ Passwords do not match.";
    return;
  }

  const users = getUsers();

  // Higher-Order Function: find existing user
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    errEl.textContent = "⚠ Username or email already registered.";
    return;
  }

  // Object Destructuring — build new user object
  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);

  okEl.textContent = "✅ Account created! Redirecting to login…";

  // BOM: timer redirect
  setTimeout(() => { window.location.href = "login.html"; }, 1500);
}

// ── SECTION 5: Login ──────────────────────────────────────────

function login() {
  const userEl = document.getElementById("login-user");
  const pwdEl  = document.getElementById("login-pwd");
  const errEl  = document.getElementById("login-err");

  const identifier = userEl.value.trim();
  const password   = pwdEl.value;

  errEl.textContent = "";

  if (!identifier || !password) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return;
  }

  const users = getUsers();

  // filter (HOF) then ternary
  const matched = users.find(
    u => (u.username === identifier || u.email === identifier) && u.password === password
  );

  if (!matched) {
    errEl.textContent = "⚠ Invalid credentials. Try again.";
    return;
  }

  saveSession(matched);
  currentUser = matched;

  // BOM — redirect
  window.location.href = "index.html";
}

// ── SECTION 6: Logout ─────────────────────────────────────────

function logout() {
  clearSession();
  currentUser = null;
  window.location.href = "login.html";
}

// ── SECTION 7: Nav — show username or Login button ────────────

function updateNavNew() {
  const session   = getSession();
  const loginLi   = document.getElementById("nav-login-li");
  const userLi    = document.getElementById("nav-user-li");
  const logoutLi  = document.getElementById("logout-li");
  const userSpan  = document.getElementById("nav-username");

  if (!loginLi) return; // not on a page with this nav

  if (session) {
    loginLi.style.display  = "none";
    userLi.style.display   = "flex";
    if (logoutLi) logoutLi.style.display = "flex";
    userSpan.textContent   = session.username;
  } else {
    loginLi.style.display  = "list-item";
    userLi.style.display   = "none";
    if (logoutLi) logoutLi.style.display = "none";
  }
}

// ── SECTION 8: Event Filtering (HOF: filter, sort, map) ───────

function filterEvents(category = "all", city = "all", sortBy = "date") {
  let result = [...eventsData]; // shallow copy via spread

  // filter — HOF
  if (category !== "all") {
    result = result.filter(e => e.category === category);
  }
  if (city !== "all") {
    result = result.filter(e => e.city === city);
  }

  // sort — HOF
  result = result.sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return new Date(a.date) - new Date(b.date); // default date sort
  });

  return result;
}

// reduce — total value of all events
const totalEventValue = eventsData.reduce((sum, e) => sum + e.price, 0);

// map — list of all unique cities
const allCities = [...new Set(eventsData.map(e => e.city))];

// ── SECTION 9: Countdown Timer on Cards ───────────────────────

function startCountdownTimers() {
  const timers = document.querySelectorAll("[data-countdown]");

  timers.forEach(el => {
    const eventDate = new Date(el.dataset.countdown);
    const now       = new Date();
    let diff        = Math.floor((eventDate - now) / 1000); // seconds

    if (diff <= 0) { el.textContent = "Event Started!"; return; }

    // setInterval (BOM)
    const interval = setInterval(() => {
      if (diff <= 0) {
        el.textContent = "🔴 Live Now!";
        clearInterval(interval);
        return;
      }

      // Math operators & control flow
      const days    = Math.floor(diff / 86400);
      const hours   = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      // Template literals
      el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      diff--;
    }, 1000);
  });
}

// ── SECTION 10: Seat Selection ────────────────────────────────

// Object — seat config
const seatConfig = {
  sections: [
    { name: "Platinum", rows: 3, cols: 10, price: 4500, color: "#a78bfa" },
    { name: "Gold",     rows: 4, cols: 12, price: 2500, color: "#fbbf24" },
    { name: "Silver",   rows: 5, cols: 14, price: 1500, color: "#94a3b8" },
  ]
};

// Array to track selected seats (Reference Type)
let selectedSeats = [];

// Pre-booked seats — randomly generated using Array.from + HOF
const bookedSeats = (() => {
  const pool = [];
  seatConfig.sections.forEach(sec => {
    for (let r = 0; r < sec.rows; r++) {
      for (let c = 0; c < sec.cols; c++) {
        if (Math.random() < 0.25) pool.push(`${sec.name}-${r}-${c}`);
      }
    }
  });
  return pool;
})(); // IIFE

function buildSeatMap() {
  const container = document.getElementById("seat-map");
  if (!container) return;

  container.innerHTML = "";

  // for...of loop over sections
  for (const section of seatConfig.sections) {
    const secDiv = document.createElement("div");
    secDiv.className = "seat-section";

    const label = document.createElement("div");
    label.className = "section-label";
    label.textContent = `${section.name} — ${formatCurrency(section.price)}`;
    label.style.color = section.color;
    secDiv.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "seat-grid";

    // Nested for loop — rows & cols
    for (let r = 0; r < section.rows; r++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      // Row label
      const rowLabel = document.createElement("span");
      rowLabel.className = "row-label";
      rowLabel.textContent = String.fromCharCode(65 + r); // A, B, C…
      rowDiv.appendChild(rowLabel);

      for (let c = 0; c < section.cols; c++) {
        const seatId  = `${section.name}-${r}-${c}`;
        const seatBtn = document.createElement("button");
        seatBtn.className = "seat";
        seatBtn.dataset.id      = seatId;
        seatBtn.dataset.section = section.name;
        seatBtn.dataset.price   = section.price;
        seatBtn.title = `${section.name} | Row ${String.fromCharCode(65+r)} | Seat ${c+1}`;

        // switch for seat status
        switch (true) {
          case bookedSeats.includes(seatId):
            seatBtn.classList.add("booked");
            seatBtn.disabled = true;
            break;
          default:
            seatBtn.style.setProperty("--seat-color", section.color);
            seatBtn.addEventListener("click", () => toggleSeat(seatBtn, seatId, section));
        }

        rowDiv.appendChild(seatBtn);
      }
      grid.appendChild(rowDiv);
    }

    secDiv.appendChild(grid);
    container.appendChild(secDiv);
  }
}

function toggleSeat(btn, seatId, section) {
  // Logical operators
  const isSelected = selectedSeats.includes(seatId);

  if (isSelected) {
    // Remove from array — filter HOF
    selectedSeats = selectedSeats.filter(id => id !== seatId);
    btn.classList.remove("selected");
  } else {
    if (selectedSeats.length >= 6) {
      showAlert("⚠ You can select a maximum of 6 seats.", "warn");
      return;
    }
    selectedSeats.push(seatId);
    btn.classList.add("selected");
  }

  updateBookingSummary();
}

function updateBookingSummary() {
  const countEl = document.getElementById("selected-count");
  const totalEl = document.getElementById("booking-total");
  const listEl  = document.getElementById("selected-seats-list");

  if (!countEl) return;

  // reduce to get total price
  const total = selectedSeats.reduce((sum, id) => {
    const btn   = document.querySelector(`[data-id="${id}"]`);
    const price = btn ? Number(btn.dataset.price) : 0;
    return sum + price;
  }, 0);

  cartCounter; // closure counter still in scope
  countEl.textContent = selectedSeats.length;
  totalEl.textContent = formatCurrency(total);

  // map to build seat labels
  listEl.innerHTML = selectedSeats
    .map(id => {
      const [section, r, c] = id.split("-");
      return `<span class="seat-tag">${section} ${String.fromCharCode(65+Number(r))}${Number(c)+1}</span>`;
    })
    .join("");
}

// ── SECTION 11: Booking Form Validation ───────────────────────

function validateBooking() {
  const name  = document.getElementById("b-name")?.value.trim();
  const email = document.getElementById("b-email")?.value.trim();
  const phone = document.getElementById("b-phone")?.value.trim();
  const errEl = document.getElementById("booking-err");

  if (!errEl) return;
  errEl.textContent = "";

  // Chain of if/else if
  if (!name || !email || !phone) {
    errEl.textContent = "⚠ Please fill in all your details.";
    return false;
  }
  if (selectedSeats.length === 0) {
    errEl.textContent = "⚠ Please select at least one seat.";
    return false;
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    errEl.textContent = "⚠ Enter a valid 10-digit Indian mobile number.";
    return false;
  }
  return true;
}

// Promise — simulates async booking confirmation
function confirmBooking() {
  if (!validateBooking()) return;

  const name  = document.getElementById("b-name").value.trim();
  const email = document.getElementById("b-email").value.trim();

  showAlert("⏳ Processing your booking…", "info");

  const bookingPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.05;
      success
        ? resolve({ name, email, seats: selectedSeats, ref: "BNG" + Date.now() })
        : reject(new Error("Payment gateway timeout. Please retry."));
    }, 1800);
  });

  bookingPromise
    .then(data => {
      const { name, seats, ref } = data;

      // TOTAL PRICE
      const total = selectedSeats.reduce((sum, id) => {
        const btn = document.querySelector(`[data-id="${id}"]`);
        return sum + Number(btn.dataset.price);
      }, 0);

      // SAVE BOOKING
      saveBookingData(total);

      // UPDATE MODAL
      document.getElementById("conf-total").textContent = formatCurrency(total);

      // SHOW CONFIRMATION
      showBookingConfirmation(name, seats, ref);
    })
    .catch(err => {
      console.error("Booking failed:", err.message);
      showAlert("❌ " + err.message, "error");
    });
}

// ── SECTION 12: Contact Form Validation ───────────────────────

function validateContact() {
  const name    = document.getElementById("c-name")?.value.trim();
  const email   = document.getElementById("c-email")?.value.trim();
  const message = document.getElementById("c-msg")?.value.trim();
  const errEl   = document.getElementById("contact-err");
  const okEl    = document.getElementById("contact-ok");

  if (!errEl) return;
  errEl.textContent = "";
  okEl.textContent  = "";

  if (!name || !email || !message) {
    errEl.textContent = "⚠ All fields are required.";
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errEl.textContent = "⚠ Enter a valid email address.";
    return;
  }
  if (message.length < 10) {
    errEl.textContent = "⚠ Message must be at least 10 characters.";
    return;
  }

  // Simulate send — Promise
  new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      okEl.textContent = "✅ Message sent! We'll get back to you soon.";
      // Reset using for...of
      for (const id of ["c-name","c-email","c-phone","c-msg"]) {
        const el = document.getElementById(id);
        if (el) el.value = "";
      }
    });
}

// ── SECTION 13: Modal / Alert System ─────────────────────────

function showAlert(message, type = "info") {
  // Remove existing
  const old = document.getElementById("bng-alert");
  if (old) old.remove();

  const alert = document.createElement("div");
  alert.id = "bng-alert";
  alert.className = `bng-alert bng-alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);

  // BOM: auto-remove after 3s
  setTimeout(() => alert.remove(), 3000);
}

// ── SECTION 14: My Bookings Page ─────────────────────────────

function showBookings(type, btn) {
  const container = document.getElementById("bookings-container");
  if (!container) return;

  const buttons = document.querySelectorAll(".booking-tabs button");
  buttons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // FIX: safely parse bookings — getItem returns null when empty
  const raw      = localStorage.getItem(BOOKINGS_KEY);
  const bookings = raw ? JSON.parse(raw) : [];

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-booking">
        <h3>No bookings yet</h3>
        <p>Book your first event now.</p>
      </div>
    `;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = bookings.filter(item => {
    const eventDate = new Date(item.date);
    eventDate.setHours(0, 0, 0, 0);
    return type === "upcoming" ? eventDate >= today : eventDate < today;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-booking">
        <h3>No ${type} bookings</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="booking-card">
      <h3>${item.event}</h3>
      <p>📍 ${item.city}</p>
      <p>📅 ${formatDate(item.date)}</p>
      <p>🎟 Seats: ${item.seats.join(", ")}</p>
      <p>💰 Total: ${formatCurrency(item.total)}</p>
    </div>
  `).join("");
}

// ── SECTION 15: Render Category Pages (concerts/sports/movies) ─

function renderCategoryPage() {
  const body    = document.body;
  const category = body.dataset.category;
  if (!category) return;

  const citySelect = document.getElementById("filter-city");
  const sortSelect = document.getElementById("filter-sort");
  const container  = document.getElementById("filtered-cards");
  if (!citySelect || !container) return;

  // Build city dropdown from events in this category
  const cities = [...new Set(
    eventsData.filter(e => e.category === category).map(e => e.city)
  )];
  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  function render() {
    const city   = citySelect.value;
    const sortBy = sortSelect.value;
    const events = filterEvents(category, city, sortBy);

    if (events.length === 0) {
      container.innerHTML = `<p class="no-results">No events found for the selected filters.</p>`;
      return;
    }

    container.innerHTML = events.map(e => `
      <div class="big-card">
        <h3>${e.name}</h3>
        <p>📅 ${formatDate(e.date)}</p>
        <p>📍 ${e.city}</p>
        <div class="tickets">
          <div class="ticket-type">Silver <span>${formatCurrency(e.price)}</span></div>
          <div class="ticket-type">Gold <span>${formatCurrency(Math.round(e.price * 1.67))}</span></div>
          <div class="ticket-type">Platinum <span>${formatCurrency(Math.round(e.price * 3))}</span></div>
        </div>
        <a href="booking.html?id=${e.id}" class="btn">Book Now</a>
      </div>
    `).join("");
  }

  render();
  citySelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);
}

// ── SECTION 16: Booking Page — Load Event from URL ────────────

let currentBookingEvent = null;

function loadBookingEvent() {
  const params  = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));
  if (!eventId) return;

  const foundEvent = eventsData.find(e => e.id === eventId);
  if (!foundEvent) return;

  currentBookingEvent = foundEvent;

  const eventName   = document.getElementById("event-name");
  const eventDate   = document.getElementById("event-date");
  const eventCity   = document.getElementById("event-city");
  const summaryEvent = document.getElementById("summary-event");
  const summaryDate  = document.getElementById("summary-date");
  const summaryCity  = document.getElementById("summary-city");

  if (eventName) {
    eventName.textContent  = foundEvent.name;
    eventDate.textContent  = "📅 " + formatDate(foundEvent.date);
    eventCity.textContent  = "📍 " + foundEvent.city;
    summaryEvent.textContent = foundEvent.name;
    summaryDate.textContent  = formatDate(foundEvent.date);
    summaryCity.textContent  = foundEvent.city;
  }
}

// ── SECTION 17: Save Booking Data ────────────────────────────

function saveBookingData(total) {
  if (!currentBookingEvent) return;

  const raw      = localStorage.getItem(BOOKINGS_KEY);
  const bookings = raw ? JSON.parse(raw) : [];

  bookings.push({
    event: currentBookingEvent.name,
    date:  currentBookingEvent.date,
    city:  currentBookingEvent.city,
    seats: [...selectedSeats],
    total: total,
  });

  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// ── SECTION 18: Show Booking Confirmation Modal ───────────────

function showBookingConfirmation(name, seats, ref) {
  const overlay = document.getElementById("confirm-overlay");
  if (!overlay) return;

  document.getElementById("conf-name").textContent  = name;
  document.getElementById("conf-seats").textContent = seats.join(", ");
  overlay.style.display = "flex";
}

// ── SINGLE DOMContentLoaded ───────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {

  // Nav
  updateNavNew();

  // Logout button (present on all pages)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Auth pages
  const loginBtn  = document.getElementById("login-btn-id");
  const signupBtn = document.getElementById("signup-btn-id");
  if (loginBtn)  loginBtn.addEventListener("click", login);
  if (signupBtn) signupBtn.addEventListener("click", signup);

  // Contact page
  const sendMsgBtn = document.getElementById("send-msg-btn");
  if (sendMsgBtn) sendMsgBtn.addEventListener("click", validateContact);

  // Category pages (concerts / sports / movies)
  renderCategoryPage();

  // Booking page
  loadBookingEvent();
  buildSeatMap();
  updateBookingSummary();

  const confirmBtn = document.getElementById("confirm-btn");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmBooking);

  // Home page countdown timers
  startCountdownTimers();

  // My Bookings page
  if (document.getElementById("bookings-container")) {
    const firstBtn = document.querySelector(".booking-tabs button");
    if (firstBtn) showBookings("upcoming", firstBtn);
  }

>>>>>>> 0bb84b028c90b44417479d01c62c50d44865bcf9
});