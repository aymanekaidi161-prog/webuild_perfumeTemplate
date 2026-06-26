import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../../hooks/useCart'
import useReducedMotion from '../../hooks/useReducedMotion'
import {
  modalOverlay, modalPanel, modalPanelReduced,
  successCheckmark, successCheckmarkReduced,
} from '../../data/motion'
import rawProducts from '../../data/products.json'
import type { Product } from '../../data/types'

/**
 * DEMO ONLY — BuyModal
 * Reads buyMode from CartContext. No backend — logs payload to console, shows success state.
 * buyMode.type === 'single' → single product express checkout
 * buyMode.type === 'cart'   → full cart checkout with line items
 */

const productMap = Object.fromEntries((rawProducts as Product[]).map((p) => [p.id, p]))

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialForm = { fullName: '', phone: '', email: '', language: 'English', address: '', message: '' }
type FormData = typeof initialForm
type FormErrors = { fullName?: string; phone?: string; email?: string }
type Touched = Record<string, boolean>

function validate(f: FormData): FormErrors {
  const e: FormErrors = {}
  if (!f.fullName.trim()) e.fullName = 'Full name is required'
  if (!f.phone.trim())    e.phone    = 'Phone number is required'
  if (!f.email.trim())    e.email    = 'Email is required'
  else if (!EMAIL_REGEX.test(f.email.trim())) e.email = 'Please enter a valid email address'
  return e
}

function MiniBottle() {
  return (
    <svg viewBox="0 0 80 120" className="h-14 w-10 opacity-25" xmlns="http://www.w3.org/2000/svg">
      <rect x="32" y="0" width="16" height="8" rx="2" fill="#C9A96E" />
      <rect x="28" y="8" width="24" height="6" rx="1" fill="#C9A96E" />
      <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="#C9A96E" opacity="0.15" />
      <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

function CheckmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function FormField({ id, label, required, error, touched, ...props }: {
  id: string; label: string; required?: boolean; error?: string; touched?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const showError = touched && error
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">
        {label}{required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      <input id={id}
        className={`w-full border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/30 ${
          showError ? 'border-red-500/60' : 'border-charcoal-border focus:border-gold'
        }`}
        {...props} />
      {showError && <p className="mt-1 font-sans text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Textarea({ id, label, ...props }: { id: string; label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">{label}</label>
      <textarea id={id} rows={3} className="w-full resize-none border border-charcoal-border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" {...props} />
    </div>
  )
}

export default function BuyModal() {
  const reduced = useReducedMotion()
  const { buyMode, closeBuy, cartItems, clearCart } = useCart()
  const isOpen = buyMode !== null

  const [view, setView] = useState<'form' | 'success'>('form')
  const [form, setForm] = useState<FormData>(initialForm)
  const [touched, setTouched] = useState<Touched>({})
  const [errors, setErrors] = useState<FormErrors>({})

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeBuy()
  }, [closeBuy])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = '' }
  }, [isOpen, handleKeyDown])

  // Reset on open
  useEffect(() => {
    if (isOpen) { setForm(initialForm); setTouched({}); setErrors({}); setView('form') }
  }, [isOpen])

  const handleChange = (field: keyof FormData, value: string) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) setErrors(validate(next))
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(form))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ fullName: true, phone: true, email: true })
    if (Object.keys(errs).length > 0) return

    // DEMO ONLY — no backend, no real order
    console.log('──── DEMO ORDER ────')
    if (buyMode?.type === 'single') {
      console.log('Product:', { id: buyMode.product.id, name: buyMode.product.name, price: buyMode.product.price })
    } else {
      const items = cartItems.map((i) => ({ ...productMap[i.productId], quantity: i.quantity }))
      console.log('Cart:', items)
    }
    console.log('Customer:', form)
    console.log('────────────────────')
    clearCart() // clear cart after successful submission (wishlist is preserved)
    setView('success')
  }

  // Build cart summary for 'cart' mode
  const cartSummary = buyMode?.type === 'cart'
    ? cartItems.map((i) => ({ product: productMap[i.productId], quantity: i.quantity })).filter((i) => i.product)
    : []
  const cartTotal = cartSummary.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const panelVars = reduced ? modalPanelReduced : modalPanel

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="buy-modal-overlay"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          variants={modalOverlay}
          initial="hidden" animate="visible" exit="exit"
          transition={{ duration: 0.25 }}
          onClick={closeBuy}
        >
          <div className="absolute inset-0 bg-charcoal/85 backdrop-blur-sm" />

          <motion.div
            id="buy-modal-panel"
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto border border-charcoal-border bg-charcoal-card"
            variants={panelVars}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button id="buy-modal-close" onClick={closeBuy} aria-label="Close"
              className="absolute right-4 top-4 z-20 text-cream-muted transition-colors hover:text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {view === 'form' ? (
              <div className="p-6 md:p-8">
                {/* Product / Cart summary */}
                <div className="mb-6 border-b border-charcoal-border pb-6">
                  {buyMode?.type === 'single' ? (
                    /* Single product */
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-charcoal"><MiniBottle /></div>
                      <div>
                        <h2 className="font-display text-lg font-normal text-cream">{buyMode.product.name}</h2>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="font-sans text-sm font-medium text-gold">${buyMode.product.price}</span>
                          <span className="border border-gold/30 px-1.5 font-sans text-[9px] uppercase tracking-[0.1em] text-gold">{buyMode.product.genderTag}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Cart summary */
                    <div>
                      <h2 className="font-display mb-3 text-lg font-normal text-cream">Cart Summary ({cartSummary.length} item{cartSummary.length !== 1 ? 's' : ''})</h2>
                      <ul className="space-y-2">
                        {cartSummary.map(({ product, quantity }) => (
                          <li key={product.id} className="flex items-center justify-between font-sans text-sm">
                            <span className="text-cream-muted">{product.name} <span className="text-cream-muted/50">× {quantity}</span></span>
                            <span className="text-cream">${product.price * quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between border-t border-charcoal-border pt-3">
                        <span className="font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">Total</span>
                        <span className="font-sans text-lg font-medium text-gold">${cartTotal}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    <FormField id="buy-full-name" label="Full Name" required type="text" placeholder="Your full name"
                      value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')} error={errors.fullName} touched={touched.fullName} />
                    <FormField id="buy-phone" label="Phone" required type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')} error={errors.phone} touched={touched.phone} />
                    <FormField id="buy-email" label="Email" required type="email" placeholder="your@email.com"
                      value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')} error={errors.email} touched={touched.email} />
                    <div>
                      <label htmlFor="buy-language" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">Language Preference</label>
                      <select id="buy-language" value={form.language} onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full appearance-none border border-charcoal-border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">
                        <option value="English">English</option>
                        <option value="French">Français</option>
                        <option value="Arabic">العربية</option>
                      </select>
                    </div>
                    <Textarea id="buy-address" label="Address (optional)" placeholder="Shipping address"
                      value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                    <Textarea id="buy-message" label="Message (optional)" placeholder="Any special requests"
                      value={form.message} onChange={(e) => handleChange('message', e.target.value)} />
                  </div>
                  <button type="submit" id="buy-submit-btn" className="btn-gold-filled mt-6 w-full justify-center">
                    Place Order (Demo)
                  </button>
                  <p className="mt-3 text-center font-sans text-[10px] text-cream-muted/50">
                    This is a demo — no payment will be processed.
                  </p>
                </form>
              </div>
            ) : (
              /* Success state */
              <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
                <motion.div animate={reduced ? successCheckmarkReduced : successCheckmark}>
                  <CheckmarkIcon />
                </motion.div>
                <h2 className="font-display mt-6 text-2xl font-normal text-cream">
                  Thank you, {form.fullName.trim().split(' ')[0]}
                </h2>
                <p className="mt-2 font-sans text-sm text-cream-muted">We'll be in touch shortly.</p>
                <div className="my-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold opacity-30" />
                  <span className="h-1 w-1 rotate-45 bg-gold opacity-30" />
                  <span className="h-px w-8 bg-gold opacity-30" />
                </div>
                <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.15em] text-cream-muted/50">Demo only — no order was placed</p>
                <button id="buy-success-close" onClick={closeBuy} className="btn-gold">Close</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
