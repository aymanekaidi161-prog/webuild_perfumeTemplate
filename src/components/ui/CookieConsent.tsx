import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import useReducedMotion from '../../hooks/useReducedMotion'

const STORAGE_KEY = 'maison-aurel-cookie-consent'

export default function CookieConsent() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if user hasn't made a choice yet
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Small delay for a polished entrance after page loads
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleChoice = (choice: 'accepted' | 'denied') => {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  const bannerVariants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
        exit: {
          opacity: 0,
          y: 16,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
      }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t('cookie.label')}
          aria-live="polite"
          id="cookie-consent-banner"
          className="fixed bottom-4 end-4 start-4 z-[200] sm:start-auto sm:max-w-sm"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Card */}
          <div className="border border-charcoal-border bg-charcoal-card px-5 py-5 shadow-2xl shadow-black/40">
            {/* Gold accent line at top */}
            <div className="mb-4 h-px w-8 bg-gold opacity-50" />

            {/* Brand mark */}
            <p className="mb-1 font-display text-sm font-normal italic text-gold">Maison Aurel</p>

            {/* Message */}
            <p className="mb-5 font-sans text-xs leading-relaxed text-cream-muted">
              {t('cookie.text')}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                id="cookie-accept-btn"
                onClick={() => handleChoice('accepted')}
                className="btn-gold-filled flex-1 justify-center py-2.5 text-[11px]"
                aria-label={t('cookie.accept')}
              >
                {t('cookie.accept')}
              </button>
              <button
                id="cookie-deny-btn"
                onClick={() => handleChoice('denied')}
                className="btn-gold flex-1 justify-center py-2.5 text-[11px]"
                aria-label={t('cookie.deny')}
              >
                {t('cookie.deny')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
