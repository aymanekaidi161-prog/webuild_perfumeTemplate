import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const languages = ['EN', 'FR', 'AR']

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-sans text-[9px] font-semibold text-charcoal">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeLang, setActiveLang] = useState('EN')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { totalItems, totalWishlist, openCartDrawer, openWishlistDrawer } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'border-b border-charcoal-border bg-charcoal-card backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:h-20">
        {/* Left — Wordmark */}
        <Link to="/" id="nav-wordmark"
          className="font-display text-lg italic tracking-widest text-cream transition-colors hover:text-gold md:text-xl">
          Maison Aurel
        </Link>

        {/* Center — Nav links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} id={`nav-link-${link.label.toLowerCase()}`}
              className={`font-sans text-xs uppercase tracking-[0.15em] transition-colors ${
                location.pathname === link.href ? 'text-gold' : 'text-cream-muted hover:text-cream'
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — Lang switcher + Icons */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="hidden items-center gap-1 md:flex" aria-label="Language switcher">
            {languages.map((lang, i) => (
              <span key={lang} className="flex items-center">
                <button id={`lang-${lang.toLowerCase()}`} onClick={() => setActiveLang(lang)}
                  className={`font-sans text-xs tracking-wider transition-colors ${
                    activeLang === lang ? 'text-gold' : 'text-cream-muted hover:text-cream'
                  }`}>
                  {lang}
                </button>
                {i < languages.length - 1 && (
                  <span className="mx-1 select-none text-xs text-charcoal-border">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Wishlist icon + badge */}
          <button id="nav-wishlist-btn" aria-label="Wishlist" onClick={openWishlistDrawer}
            className="relative text-cream-muted transition-colors hover:text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <Badge count={totalWishlist} />
          </button>

          {/* Cart icon + badge */}
          <button id="nav-cart-btn" aria-label="Shopping bag" onClick={openCartDrawer}
            className="relative text-cream-muted transition-colors hover:text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <Badge count={totalItems} />
          </button>

          {/* Mobile hamburger */}
          <button id="nav-mobile-menu-btn" aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="text-cream-muted transition-colors hover:text-gold md:hidden">
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-charcoal-border bg-charcoal-card px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} id={`nav-mobile-link-${link.label.toLowerCase()}`}
                className={`font-sans text-sm uppercase tracking-[0.15em] transition-colors ${
                  location.pathname === link.href ? 'text-gold' : 'text-cream-muted hover:text-cream'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center gap-2 border-t border-charcoal-border pt-5">
            {languages.map((lang, i) => (
              <span key={lang} className="flex items-center">
                <button id={`lang-mobile-${lang.toLowerCase()}`} onClick={() => setActiveLang(lang)}
                  className={`font-sans text-xs tracking-wider ${activeLang === lang ? 'text-gold' : 'text-cream-muted'}`}>
                  {lang}
                </button>
                {i < languages.length - 1 && (
                  <span className="mx-2 select-none text-xs text-charcoal-border">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
