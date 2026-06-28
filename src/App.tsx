import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import useLenis from './hooks/useLenis'
import useDir from './hooks/useDir'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import CartDrawer from './components/ui/CartDrawer'
import WishlistDrawer from './components/ui/WishlistDrawer'
import CookieConsent from './components/ui/CookieConsent'
import ScrollToTop from './components/ui/ScrollToTop'

// AppInner is inside BrowserRouter so routing context is available if needed
function AppInner() {
  useLenis()
  useDir() // sets html[dir] + html[lang] whenever language changes
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppInner />
        {/* Global overlays rendered at root — float above all pages */}
        <CartDrawer />
        <WishlistDrawer />
        <CookieConsent />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
