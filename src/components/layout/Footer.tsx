import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Navigates to a path and scrolls to a hash anchor after navigation settles
function useHashNavigate() {
  const navigate = useNavigate()
  return useCallback((path: string, hash?: string) => {
    navigate(path)
    if (hash) {
      // Give the new page a tick to mount, then scroll to the anchor
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [navigate])
}

interface FooterLink {
  label: string
  href: string
  path: string
  hash?: string
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const navigate = useHashNavigate()
  return (
    <div>
      <h3 className="mb-5 font-sans text-xs uppercase tracking-[0.2em] text-gold">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <button
              onClick={() => navigate(link.path, link.hash)}
              className="font-sans text-sm font-light text-cream transition-colors hover:text-gold text-start"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const { t } = useTranslation()

  const shopLinks: FooterLink[] = [
    { label: t('footer.allFragrances'), href: '/shop', path: '/shop' },
    { label: t('footer.forHim'), href: '/shop?filter=men', path: '/shop?filter=men' },
    { label: t('footer.forHer'), href: '/shop?filter=women', path: '/shop?filter=women' },
    { label: t('footer.unisex'), href: '/shop?filter=unisex', path: '/shop?filter=unisex' },
  ]
  const aboutLinks: FooterLink[] = [
    { label: t('footer.ourStory'), href: '/about#story', path: '/about', hash: 'story' },
    { label: t('footer.ingredients'), href: '/about#ingredients', path: '/about', hash: 'ingredients' },
    { label: t('footer.sustainability'), href: '/about#sustainability', path: '/about', hash: 'sustainability' },
  ]
  const contactLinks: FooterLink[] = [
    { label: t('footer.contactUs'), href: '/contact', path: '/contact' },
    { label: t('footer.faq'), href: '/contact#faq', path: '/contact', hash: 'faq' },
    { label: t('footer.stores'), href: '/contact#stores', path: '/contact', hash: 'stores' },
  ]
  const legalLinks = [t('footer.privacy'), t('footer.terms'), t('footer.cookies')]

  return (
    <footer className="border-t border-charcoal-border bg-charcoal-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-xl italic tracking-widest text-cream transition-colors hover:text-gold" id="footer-wordmark">
              Maison Aurel
            </Link>
            <p className="mt-4 font-sans text-sm leading-relaxed text-cream-muted">{t('footer.tagline')}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-gold opacity-40" />
              <span className="h-1 w-1 rotate-45 bg-gold opacity-40" />
            </div>
          </div>
          <FooterColumn title={t('footer.shopTitle')} links={shopLinks} />
          <FooterColumn title={t('footer.aboutTitle')} links={aboutLinks} />
          <FooterColumn title={t('footer.contactTitle')} links={contactLinks} />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-charcoal-border pt-8 md:flex-row">
          <p className="font-sans text-xs text-cream-muted">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            {legalLinks.map((item) => (
              <a key={item} href="#" className="font-sans text-xs text-cream-muted transition-colors hover:text-cream">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
