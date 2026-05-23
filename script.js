"use strict";



const APP_NAME  = "BookNGo";   
const MAX_SEATS = 6;          
let   currentUser = null;      

// localStorage keys — used to save/read data from browser storage
const AUTH_KEY     = "bookngo_users";
const SESSION_KEY  = "bookngo_session";
const BOOKINGS_KEY = "bookngo_bookings";

// All events stored as an Array of Objects
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


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 2 — HELPER / UTILITY FUNCTIONS             ║
// ║  (Small reusable tools used throughout the whole project)   ║
// ╚══════════════════════════════════════════════════════════════╝

// Formats a number into Indian currency — e.g. 1500 → "₹1,500"
function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Formats a date string — e.g. "2026-05-15" → "15 May 2026"
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 3 — LOCALSTORAGE FUNCTIONS                 ║
// ║  (Read and write users, sessions, bookings to browser)      ║
// ╚══════════════════════════════════════════════════════════════╝

// Reads all registered users from localStorage
// If nothing saved yet → returns empty array []
function getUsers() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Saves the updated users array back to localStorage
function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

// Reads the currently logged-in user's session
// Returns null if no one is logged in
function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Saves session when user logs in (only username & email, NOT password)
function saveSession(user) {
  const { username, email } = user; // destructuring — pull only what we need
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, email }));
}

// Deletes session when user logs out
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 4 — SIGNUP PAGE                            ║
// ║  (Validates form, saves new user to localStorage)           ║
// ╚══════════════════════════════════════════════════════════════╝

function signup() {
  // Step 1 — grab all input fields from the HTML
  const nameEl  = document.getElementById("signup-name");
  const emailEl = document.getElementById("signup-email");
  const pwdEl   = document.getElementById("signup-pwd");
  const cpwdEl  = document.getElementById("signup-cpwd");
  const errEl   = document.getElementById("signup-err");
  const okEl    = document.getElementById("signup-ok");

  // Step 2 — read what the user typed (.trim removes accidental spaces)
  const username = nameEl.value.trim();
  const email    = emailEl.value.trim();
  const password = pwdEl.value;
  const confirm  = cpwdEl.value;

  // Step 3 — clear any old messages before showing new ones
  errEl.textContent = "";
  okEl.textContent  = "";

  // Step 4 — Validation checks (if any fail, show error and stop)
  if (!username || !email || !password || !confirm) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return; // stop function here
  }
  if (username.length < 3) {
    errEl.textContent = "⚠ Username must be at least 3 characters.";
    return;
  }
  // Regex — checks that email has the format: something@something.something
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

  // Step 5 — check if username or email is already taken
  const users  = getUsers();
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    errEl.textContent = "⚠ Username or email already registered.";
    return;
  }

  // Step 6 — create new user object and save to localStorage
  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);

  // Step 7 — show success message and redirect to login after 1.5 seconds
  okEl.textContent = "✅ Account created! Redirecting to login…";
  setTimeout(() => { window.location.href = "login.html"; }, 1500);
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 5 — LOGIN PAGE                             ║
// ║  (Checks credentials, saves session, redirects to home)     ║
// ╚══════════════════════════════════════════════════════════════╝

function login() {
  // Step 1 — grab inputs
  const userEl = document.getElementById("login-user");
  const pwdEl  = document.getElementById("login-pwd");
  const errEl  = document.getElementById("login-err");

  const identifier = userEl.value.trim(); // username or email
  const password   = pwdEl.value;

  errEl.textContent = "";

  // Step 2 — basic empty check
  if (!identifier || !password) {
    errEl.textContent = "⚠ Please fill in all fields.";
    return;
  }

  // Step 3 — find matching user in localStorage
  // .find() checks: does username OR email match AND does password match?
  const users   = getUsers();
  const matched = users.find(
    u => (u.username === identifier || u.email === identifier) && u.password === password
  );

  // Step 4 — if no match found, show error
  if (!matched) {
    errEl.textContent = "⚠ Invalid credentials. Try again.";
    return;
  }

  // Step 5 — login successful: save session and go to home page
  saveSession(matched);
  currentUser = matched;
  window.location.href = "index.html";
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 6 — LOGOUT                                 ║
// ║  (Clears session and sends user back to login)              ║
// ╚══════════════════════════════════════════════════════════════╝

function logout() {
  clearSession();
  currentUser = null;
  window.location.href = "login.html";
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 7 — NAVBAR (runs on every page)            ║
// ║  (Shows username if logged in, shows Login button if not)   ║
// ╚══════════════════════════════════════════════════════════════╝

function updateNavNew() {
  const session  = getSession();
  const loginLi  = document.getElementById("nav-login-li");
  const userLi   = document.getElementById("nav-user-li");
  const logoutLi = document.getElementById("logout-li");
  const userSpan = document.getElementById("nav-username");

  if (!loginLi) return; // page doesn't have this navbar, skip

  if (session) {
    // User is logged in — hide Login, show username + Logout
    loginLi.style.display = "none";
    userLi.style.display  = "flex";
    if (logoutLi) logoutLi.style.display = "flex";
    userSpan.textContent  = session.username;
  } else {
    // Not logged in — show Login, hide username + Logout
    loginLi.style.display = "list-item";
    userLi.style.display  = "none";
    if (logoutLi) logoutLi.style.display = "none";
  }
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 8 — HOME PAGE: COUNTDOWN TIMERS            ║
// ║  (Finds all event cards with a date and ticks down live)    ║
// ╚══════════════════════════════════════════════════════════════╝

function startCountdownTimers() {
  // Find all elements in HTML that have a data-countdown attribute
  const timers = document.querySelectorAll("[data-countdown]");

  timers.forEach(el => {
    const eventDate = new Date(el.dataset.countdown); // the event's date
    const now       = new Date();
    let diff        = Math.floor((eventDate - now) / 1000); // difference in seconds

    if (diff <= 0) { el.textContent = "Event Started!"; return; }

    // setInterval runs every 1000ms (1 second) to update the display
    const interval = setInterval(() => {
      if (diff <= 0) {
        el.textContent = "🔴 Live Now!";
        clearInterval(interval); // stop the timer
        return;
      }

      // Break total seconds into days, hours, minutes, seconds
      const days    = Math.floor(diff / 86400);
      const hours   = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      diff--;
    }, 1000);
  });
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 9 — EVENTS PAGES (concerts/sports/movies)  ║
// ║  (Reads data-category from body tag, renders matching cards) ║
// ╚══════════════════════════════════════════════════════════════╝

// Filters eventsData by category (concert / sports / movies)
function filterEvents(category = "all") {
  let result = [...eventsData]; // spread = make a copy so original stays safe

  if (category !== "all") {
    result = result.filter(e => e.category === category); // HOF: filter
  }

  return result;
}

// Builds and displays the event cards on concerts/sports/movies pages
function renderCategoryPage() {
  const category  = document.body.dataset.category; // reads data-category from <body>
  if (!category) return; // not a category page, skip

  const container = document.getElementById("filtered-cards");
  if (!container) return;

  const events = filterEvents(category);

  if (events.length === 0) {
    container.innerHTML = `<p class="no-results">No events found.</p>`;
    return;
  }

  // .map() turns each event object into an HTML string, .join("") combines them
  container.innerHTML = events.map(e => `
    <div class="big-card">
      <h3>${e.name}</h3>
      <p>📅 ${formatDate(e.date)}</p>
      <p>📍 ${e.city}</p>
      <div class="tickets">
        <div class="ticket-type">Silver   <span>${formatCurrency(e.price)}</span></div>
        <div class="ticket-type">Gold     <span>${formatCurrency(Math.round(e.price * 1.67))}</span></div>
        <div class="ticket-type">Platinum <span>${formatCurrency(Math.round(e.price * 3))}</span></div>
      </div>
      <a href="booking.html?id=${e.id}" class="btn">Book Now</a>
    </div>
  `).join("");
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 10 — BOOKING PAGE: LOAD EVENT INFO         ║
// ║  (Reads ?id= from URL, finds that event, fills the page)    ║
// ╚══════════════════════════════════════════════════════════════╝

let currentBookingEvent = null; // stores the event being booked

function loadBookingEvent() {
  // URLSearchParams reads the ?id=1 part from the browser URL
  const params  = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id")); // convert "1" string → 1 number
  if (!eventId) return;

  // Find the matching event from our data array
  const foundEvent = eventsData.find(e => e.id === eventId);
  if (!foundEvent) return;

  currentBookingEvent = foundEvent; // save it so confirmBooking() can use it

  // Fill in the event details on the booking page HTML
  const eventName    = document.getElementById("event-name");
  const eventDate    = document.getElementById("event-date");
  const eventCity    = document.getElementById("event-city");
  const summaryEvent = document.getElementById("summary-event");
  const summaryDate  = document.getElementById("summary-date");
  const summaryCity  = document.getElementById("summary-city");

  if (eventName) {
    eventName.textContent    = foundEvent.name;
    eventDate.textContent    = "📅 " + formatDate(foundEvent.date);
    eventCity.textContent    = "📍 " + foundEvent.city;
    summaryEvent.textContent = foundEvent.name;
    summaryDate.textContent  = formatDate(foundEvent.date);
    summaryCity.textContent  = foundEvent.city;
  }
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 11 — BOOKING PAGE: SEAT MAP                ║
// ║  (Builds the seat grid with JS, handles seat selection)     ║
// ╚══════════════════════════════════════════════════════════════╝

// Seat layout config — 3 sections, each with rows, columns and price
const seatConfig = {
  sections: [
    { name: "Platinum", rows: 3, cols: 10, price: 4500, color: "#a78bfa" },
    { name: "Gold",     rows: 4, cols: 12, price: 2500, color: "#fbbf24" },
    { name: "Silver",   rows: 5, cols: 14, price: 1500, color: "#94a3b8" },
  ]
};

let selectedSeats = []; // tracks which seats the user has clicked

// Pre-booked seats — randomly mark ~25% of seats as already taken
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
})(); // IIFE — runs immediately when page loads

// Builds the entire seat map by creating HTML elements with JavaScript
function buildSeatMap() {
  const container = document.getElementById("seat-map");
  if (!container) return; // not on booking page, skip

  container.innerHTML = ""; // clear any existing content

  for (const section of seatConfig.sections) {
    // Create section wrapper div
    const secDiv = document.createElement("div");
    secDiv.className = "seat-section";

    // Section label (e.g. "Platinum — ₹4,500")
    const label = document.createElement("div");
    label.className   = "section-label";
    label.textContent = `${section.name} — ${formatCurrency(section.price)}`;
    label.style.color = section.color;
    secDiv.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "seat-grid";

    // Nested loop — r = row, c = column
    for (let r = 0; r < section.rows; r++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      // Row letter label — A, B, C... using ASCII code 65 = 'A'
      const rowLabel = document.createElement("span");
      rowLabel.className   = "row-label";
      rowLabel.textContent = String.fromCharCode(65 + r);
      rowDiv.appendChild(rowLabel);

      for (let c = 0; c < section.cols; c++) {
        const seatId  = `${section.name}-${r}-${c}`;
        const seatBtn = document.createElement("button");
        seatBtn.className      = "seat";
        seatBtn.dataset.id      = seatId;
        seatBtn.dataset.section = section.name;
        seatBtn.dataset.price   = section.price;
        seatBtn.title = `${section.name} | Row ${String.fromCharCode(65+r)} | Seat ${c+1}`;

        if (bookedSeats.includes(seatId)) {
          // Already booked — mark grey and disable click
          seatBtn.classList.add("booked");
          seatBtn.disabled = true;
        } else {
          // Available — add color and click handler
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

// Runs when user clicks a seat — adds or removes it from selectedSeats
function toggleSeat(btn, seatId, section) {
  const isSelected = selectedSeats.includes(seatId);

  if (isSelected) {
    // Deselect — remove from array using filter
    selectedSeats = selectedSeats.filter(id => id !== seatId);
    btn.classList.remove("selected");
  } else {
    // Select — but first check max limit
    if (selectedSeats.length >= MAX_SEATS) {
      showAlert("⚠ You can select a maximum of 6 seats.", "warn");
      return;
    }
    selectedSeats.push(seatId);
    btn.classList.add("selected");
  }

  updateBookingSummary(); // refresh the order summary on the right
}

// Updates the order summary panel whenever seats change
function updateBookingSummary() {
  const countEl = document.getElementById("selected-count");
  const totalEl = document.getElementById("booking-total");
  const listEl  = document.getElementById("selected-seats-list");

  if (!countEl) return;

  // reduce — adds up prices of all selected seats
  const total = selectedSeats.reduce((sum, id) => {
    const btn   = document.querySelector(`[data-id="${id}"]`);
    const price = btn ? Number(btn.dataset.price) : 0;
    return sum + price;
  }, 0);

  countEl.textContent = selectedSeats.length;
  totalEl.textContent = formatCurrency(total);

  // map — converts each seat id into a readable label tag
  listEl.innerHTML = selectedSeats
    .map(id => {
      const [section, r, c] = id.split("-");
      return `<span class="seat-tag">${section} ${String.fromCharCode(65+Number(r))}${Number(c)+1}</span>`;
    })
    .join("");
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 12 — BOOKING PAGE: FORM VALIDATION         ║
// ║  (Checks name, email, phone and seat selection before pay)  ║
// ╚══════════════════════════════════════════════════════════════╝

function validateBooking() {
  const name  = document.getElementById("b-name")?.value.trim();
  const email = document.getElementById("b-email")?.value.trim();
  const phone = document.getElementById("b-phone")?.value.trim();
  const errEl = document.getElementById("booking-err");

  if (!errEl) return;
  errEl.textContent = "";

  if (!name || !email || !phone) {
    errEl.textContent = "⚠ Please fill in all your details.";
    return false;
  }
  if (selectedSeats.length === 0) {
    errEl.textContent = "⚠ Please select at least one seat.";
    return false;
  }
  // Indian mobile number — must start with 6-9 and be exactly 10 digits
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    errEl.textContent = "⚠ Enter a valid 10-digit Indian mobile number.";
    return false;
  }
  return true; // all checks passed
}

// Runs when user clicks "Confirm Booking"
// Uses a Promise to simulate a payment gateway delay
function confirmBooking() {
  if (!validateBooking()) return; // stop if validation fails

  const name  = document.getElementById("b-name").value.trim();
  const email = document.getElementById("b-email").value.trim();

  showAlert("⏳ Processing your booking…", "info");

  // Promise — simulates waiting for payment confirmation (1.8 seconds)
  const bookingPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      success
        ? resolve({ name, email, seats: selectedSeats, ref: "BNG" + Date.now() })
        : reject(new Error("Payment gateway timeout. Please retry."));
    }, 1800);
  });

  bookingPromise
    .then(data => {
      // Payment succeeded
      const { name, seats, ref } = data;

      const total = selectedSeats.reduce((sum, id) => {
        const btn = document.querySelector(`[data-id="${id}"]`);
        return sum + Number(btn.dataset.price);
      }, 0);

      saveBookingData(total);          // save to localStorage
      document.getElementById("conf-total").textContent = formatCurrency(total);
      showBookingConfirmation(name, seats, ref); // show success modal
    })
    .catch(err => {
      // Payment failed
      showAlert("❌ " + err.message, "error");
    });
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 13 — BOOKING PAGE: SAVE & CONFIRM          ║
// ║  (Saves completed booking to localStorage, shows modal)     ║
// ╚══════════════════════════════════════════════════════════════╝

// Saves the booking details to localStorage under BOOKINGS_KEY
function saveBookingData(total) {
  if (!currentBookingEvent) return;

  const raw      = localStorage.getItem(BOOKINGS_KEY);
  const bookings = raw ? JSON.parse(raw) : [];

  bookings.push({
    event: currentBookingEvent.name,
    date:  currentBookingEvent.date,
    city:  currentBookingEvent.city,
    seats: [...selectedSeats],       // spread = copy array
    total: total,
  });

  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// Shows the booking confirmation popup modal
function showBookingConfirmation(name, seats, ref) {
  const overlay = document.getElementById("confirm-overlay");
  if (!overlay) return;

  document.getElementById("conf-name").textContent  = name;
  document.getElementById("conf-seats").textContent = seats.join(", ");
  overlay.style.display = "flex"; // make modal visible
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 14 — MY BOOKINGS PAGE                      ║
// ║  (Shows past bookings split into Upcoming / Completed tabs)  ║
// ╚══════════════════════════════════════════════════════════════╝

function showBookings(type, btn) {
  const container = document.getElementById("bookings-container");
  if (!container) return;

  // Switch active tab highlight
  document.querySelectorAll(".booking-tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // Read bookings from localStorage
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

  // Compare booking date with today to split upcoming vs completed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = bookings.filter(item => {
    const eventDate = new Date(item.date);
    eventDate.setHours(0, 0, 0, 0);
    return type === "upcoming" ? eventDate >= today : eventDate < today;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-booking"><h3>No ${type} bookings</h3></div>`;
    return;
  }

  // Render a card for each booking using .map()
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


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 15 — CONTACT PAGE                          ║
// ║  (Validates contact form and simulates message send)        ║
// ╚══════════════════════════════════════════════════════════════╝

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

  // Promise — simulates sending message to server (1 second delay)
  new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      okEl.textContent = "✅ Message sent! We'll get back to you soon.";
      // Clear all fields after success using for...of loop
      for (const id of ["c-name", "c-email", "c-phone", "c-msg"]) {
        const el = document.getElementById(id);
        if (el) el.value = "";
      }
    });
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 16 — ALERT / POPUP SYSTEM (utility)        ║
// ║  (Shows a temporary floating message on screen)             ║
// ╚══════════════════════════════════════════════════════════════╝

function showAlert(message, type = "info") {
  // Remove any existing alert first
  const old = document.getElementById("bng-alert");
  if (old) old.remove();

  // Create new alert div dynamically
  const alert = document.createElement("div");
  alert.id        = "bng-alert";
  alert.className = `bng-alert bng-alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);

  // Auto-remove after 3 seconds
  setTimeout(() => alert.remove(), 3000);
}


// ╔══════════════════════════════════════════════════════════════╗
// ║          SECTION 17 — DOMContentLoaded (Entry Point)        ║
// ║  (Runs once when page fully loads — connects everything)    ║
// ╚══════════════════════════════════════════════════════════════╝

window.addEventListener("DOMContentLoaded", () => {

  // Always runs on every page — update navbar login/logout state
  updateNavNew();

  // Logout button — present on all pages
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // ── Signup & Login pages ──
  const loginBtn  = document.getElementById("login-btn-id");
  const signupBtn = document.getElementById("signup-btn-id");
  if (loginBtn)  loginBtn.addEventListener("click", login);
  if (signupBtn) signupBtn.addEventListener("click", signup);

  // ── Home page ──
  startCountdownTimers(); // starts all event countdowns on index.html

  // ── Concerts / Sports / Movies pages ──
  renderCategoryPage(); // only runs if body has data-category attribute

  // ── Booking page ──
  loadBookingEvent();       // fills event info from URL id
  buildSeatMap();           // draws the seat grid
  updateBookingSummary();   // sets initial summary (0 seats, ₹0)
  const confirmBtn = document.getElementById("confirm-btn");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmBooking);

  // ── My Bookings page ──
  if (document.getElementById("bookings-container")) {
    const firstBtn = document.querySelector(".booking-tabs button");
    if (firstBtn) showBookings("upcoming", firstBtn); // show upcoming tab by default
  }

  // ── Contact page ──
  const sendMsgBtn = document.getElementById("send-msg-btn");
  if (sendMsgBtn) sendMsgBtn.addEventListener("click", validateContact);

});