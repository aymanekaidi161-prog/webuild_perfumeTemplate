import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductGrid from '../components/shop/ProductGrid'
import type { Product } from '../data/types'
import useReducedMotion from '../hooks/useReducedMotion'
import { useCart } from '../hooks/useCart'
import { heartBounce, heartBounceReduced } from '../data/motion'
import rawProducts from '../data/products.json'

const products = rawProducts as Product[]

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, addToCart, openBuyNow } = useCart()
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  
  const product = products.find(p => p.slug === slug)
  
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [justAdded, setJustAdded] = useState(false)
  
  useEffect(() => {
    setActiveImageIndex(0)
    setJustAdded(false)
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-charcoal pt-24 flex flex-col items-center justify-center">
          <p className="text-cream-muted font-sans mb-4">Product not found.</p>
          <button onClick={() => navigate('/shop')} className="btn-gold">Return to Shop</button>
        </main>
        <Footer />
      </>
    )
  }

  const wishlisted = wishlist.includes(product.id)
  
  const handleAddToCart = () => {
    addToCart(product.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1000)
  }

  const relatedProducts = products
    .filter((p) => p.genderTag === product.genderTag && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal pt-24 pb-20">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => navigate('/shop')} 
            className="text-cream-muted hover:text-gold transition-colors font-sans text-xs uppercase tracking-[0.1em] mb-8 flex items-center gap-2"
          >
            <span>&larr;</span> {t('product.backToShop', { defaultValue: 'Back to Shop' })}
          </button>
          
          <div className="flex flex-col md:flex-row border border-charcoal-border bg-charcoal-card mb-20 overflow-hidden">
            {/* Left — Image */}
            <div className="relative flex aspect-[3/4] md:aspect-auto md:min-h-[600px] w-full shrink-0 items-center justify-center bg-charcoal md:w-1/2">
              <img src={product.images[activeImageIndex]} alt={product.name} className="h-full w-full object-cover" />
              <span className="absolute start-4 top-4 border border-gold/30 bg-charcoal/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold backdrop-blur-sm">
                {t(`filter.${product.genderTag}`)}
              </span>
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImageIndex(i)} aria-label={`View image ${i + 1}`}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeImageIndex ? 'bg-gold' : 'bg-cream-muted/30'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="flex flex-1 flex-col p-6 md:p-12">
              <h1 className="font-display text-3xl font-normal text-cream md:text-5xl mb-4">{t(`products.${product.id}.name`, { defaultValue: product.name })}</h1>
              <p className="font-sans text-xl font-medium text-gold mb-8">
                {product.currency === 'USD' ? '$' : product.currency}{product.price}
              </p>
              
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px flex-1 bg-charcoal-border" />
                <span className="h-1 w-1 rotate-45 bg-gold opacity-30" />
                <span className="h-px w-12 bg-charcoal-border" />
              </div>
              
              <p className="font-sans text-base leading-relaxed text-cream-muted mb-8">{t(`products.${product.id}.longDescription`, { defaultValue: product.longDescription })}</p>
              
              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-3 py-1 font-sans text-[10px] uppercase tracking-[0.1em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-cream-muted">{t('modal.tagsLabel')}:</span>
                {product.tags.map((tag) => (
                  <span key={tag} className="border border-charcoal-border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.1em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-cream-muted">{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto pt-8 border-t border-charcoal-border">
                <motion.button
                  id={`page-wishlist-btn-${product.slug}`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => toggleWishlist(product.id)}
                  animate={wishlisted ? (reduced ? heartBounceReduced : heartBounce) : {}}
                  className={`flex h-14 w-14 sm:w-auto sm:px-6 shrink-0 items-center justify-center border transition-colors ${
                    wishlisted ? 'border-gold text-gold' : 'border-charcoal-border text-cream-muted hover:border-gold hover:text-gold'
                  }`}>
                  <HeartIcon filled={wishlisted} />
                </motion.button>
                <button id={`page-add-to-cart-${product.slug}`}
                  className="btn-gold flex-1 justify-center h-14"
                  onClick={handleAddToCart}>
                  {justAdded ? t('modal.added') : t('modal.addToCart')}
                </button>
                <button id={`page-buy-now-${product.slug}`}
                  className="btn-gold-filled flex-1 justify-center h-14"
                  onClick={() => openBuyNow(product)}>
                  {t('modal.buyNow')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <div className="mb-10 text-center">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <span className="h-px w-12 bg-gold opacity-30" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-60">{t('product.youMightAlsoLike', { defaultValue: 'You Might Also Like' })}</span>
                  <span className="h-px w-12 bg-gold opacity-30" />
                </div>
              </div>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
