import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import BookingModal from './components/BookingModal.jsx'
import { CartProvider } from './lib/cart.jsx'
import './index.css'

const AdminPage = lazy(() => import('./routes/AdminPage.jsx'))
const AboutPage = lazy(() => import('./routes/AboutPage.jsx'))
const ThingsToDoPage = lazy(() => import('./routes/ThingsToDoPage.jsx'))
const BookingsPage = lazy(() => import('./routes/BookingsPage.jsx'))
const ContactPage = lazy(() => import('./routes/ContactPage.jsx'))

const routeFallback = (
  <div className="min-h-screen bg-sand text-ink flex items-center justify-center font-display italic">
    Loading…
  </div>
)

const wrapInterior = (Component) => (
  <CartProvider>
    <BookingModal />
    <Suspense fallback={routeFallback}>
      <Component />
    </Suspense>
  </CartProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-ink text-sand flex items-center justify-center">
                  Loading admin…
                </div>
              }
            >
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="/about" element={wrapInterior(AboutPage)} />
        <Route path="/things-to-do" element={wrapInterior(ThingsToDoPage)} />
        <Route path="/bookings" element={wrapInterior(BookingsPage)} />
        <Route path="/contact" element={wrapInterior(ContactPage)} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
