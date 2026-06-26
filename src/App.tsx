import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import useLenis from './hooks/useLenis'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CartDrawer from './components/ui/CartDrawer'
import WishlistDrawer from './components/ui/WishlistDrawer'
import BuyModal from './components/ui/BuyModal'

// AppInner is inside BrowserRouter so routing context is available if needed
function AppInner() {
  useLenis() // initialize Lenis smooth scroll + GSAP ticker sync once at root
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
    </Routes>
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
        <BuyModal />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
