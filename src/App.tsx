import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CartDrawer from './components/ui/CartDrawer'
import WishlistDrawer from './components/ui/WishlistDrawer'
import BuyModal from './components/ui/BuyModal'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
        {/* Global overlays rendered at root so they float above all pages */}
        <CartDrawer />
        <WishlistDrawer />
        <BuyModal />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
