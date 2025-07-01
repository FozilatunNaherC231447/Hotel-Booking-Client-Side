# 🏨 Hotel Booking Platform (Client Side)

Welcome to the **client-side** of the Hotel Booking Platform! This responsive and dynamic web application is designed to help users easily **browse, book, and review** hotel rooms with a smooth, modern user experience.

🌐 **Live Site**: [https://hotel-booking-platform-3ff8b.web.app/](https://hotel-booking-platform-3ff8b.web.app/)

---

## 📋 Project Purpose

This project was built as part of an assignment to demonstrate:
- Responsive web design
- Firebase-based authentication
- REST API integration
- Secure booking and review systems
- JWT-based private route handling
- Modern React UI/UX practices

---

## ✨ Key Features

### ✅ User Experience
- Fully responsive design for **mobile**, **tablet**, and **desktop**
- Smooth navigation and clean layout with accessible contrast and spacing
- Animation effects using `framer-motion` for a lively UI
- Helmet integration for dynamic tab titles and SEO meta-data

### 🛏 Room Features
- Homepage with slider banner, featured rooms, map using `react-leaflet`
- "Book Now" functionality leading to individual room detail pages
- User can **filter rooms by price** from the "Rooms" page
- Bookings are tracked, modifiable, and cancelable (with restrictions)

### 🧑‍💻 Authentication
- Firebase email/password login & registration
- Google sign-in with Firebase social login
- Validations on register form (uppercase, lowercase, length)
- Toast notifications for login/register events

### 🔒 Private Routes & Access Control
- JWT-based route protection using `react-router-dom`
- Only logged-in users can book rooms, update/cancel bookings, or leave reviews
- Guest users can browse only

### 💬 Review System
- Authenticated users can submit **room reviews**
- Reviews show **username**, **rating (1-5)**, **text**, and **timestamp**
- Reviews appear in descending order of timestamp
- Testimonials carousel on homepage with user reviews from DB

### 📅 Booking Management
- Single-day date picker for selecting booking date
- Booking modal shows room summary before confirming
- Logged-in users can:
  - See "My Bookings" page with all bookings
  - Cancel bookings (must be done at least 1 day in advance)
  - Update booking date with confirmation prompt
  - Leave a review from the booking list

### 🎁 Extras
- Homepage popup for **Special Offers and Promotions**
- 404 Page with GIF and "Back to Home" button
- Toggle view option: Switch between Card view and Table view (optional)
- Helmet for browser tab control
- Optional: Gallery, Contact Us, and About Us pages

---

## 🚀 Tech Stack

- **React** – Frontend framework
- **React Router DOM** – Routing & private routes
- **Firebase** – Authentication & hosting
- **Tailwind CSS / DaisyUI** – Styling
- **Framer Motion** – Animation
- **React-Leaflet** – Interactive map
- **React Hot Toast / SweetAlert2** – Alerts and notifications
- **Moment.js** – Time comparison for booking/cancellation
- **React Helmet** – Meta data and SEO
- **JWT** – Auth token for private API access

---



---

## 📁 Project Structure

```bash
hotel-booking-platform-client/
├── public
├── src/
│   ├── assets/
│   ├── components/
│   ├── firebase/
│   ├── pages/
│   ├── routes/
│   ├── providers/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env               # Firebase credentials (secured)
├── tailwind.config.js
├── package.json
├── README.md
└── firebase.config.js # Config imported from .env

