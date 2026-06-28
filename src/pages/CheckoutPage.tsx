import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useCart } from '../hooks/useCart'
import useReducedMotion from '../hooks/useReducedMotion'
import { successCheckmark, successCheckmarkReduced } from '../data/motion'
import rawProducts from '../data/products.json'
import type { Product } from '../data/types'
import type { BuyMode } from '../context/CartContext'

const productMap = Object.fromEntries((rawProducts as Product[]).map((p) => [p.id, p]))
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  language: 'English',
  address: '',
  message: '',
}
type FormData = typeof initialForm
type FormErrors = { fullName?: string; phone?: string; email?: string }
type Touched = Record<string, boolean>

function validate(f: FormData, t: TFunction): FormErrors {
  const e: FormErrors = {}
  if (!f.fullName.trim()) e.fullName = t('buy.errorFullName')
  if (!f.phone.trim()) e.phone = t('buy.errorPhone')
  if (!f.email.trim()) e.email = t('buy.errorEmail')
  else if (!EMAIL_REGEX.test(f.email.trim())) e.email = t('buy.errorEmailInvalid')
  return e
}

function CheckmarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-14 w-14 text-gold"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function FormField({
  id,
  label,
  required,
  error,
  touched,
  ...props
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  touched?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const showError = touched && error
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-[10px] uppercase tracking-[0.12em] text-cream-muted"
      >
        {label}
        {required && <span className="ms-1 text-gold">*</span>}
      </label>
      <input
        id={id}
        className={`w-full border bg-charcoal px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gold/30 ${
          showError
            ? 'border-red-500/60 focus:border-red-500/60'
            : 'border-charcoal-border focus:border-gold hover:border-charcoal-border/80'
        }`}
        {...props}
      />
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 font-sans text-[11px] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Textarea({
  id,
  label,
  ...props
}: {
  id: string
  label: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-[10px] uppercase tracking-[0.12em] text-cream-muted"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className="w-full resize-none border border-charcoal-border bg-charcoal px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-all duration-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        {...props}
      />
    </div>
  )
}

// ─── Order Summary Sub-Component ────────────────────────────────────────────

interface OrderSummaryProps {
  buyMode: BuyMode
  cartSummary: { product: Product; quantity: number }[]
  orderTotal: number
  t: TFunction
}

function OrderSummaryContent({ buyMode, cartSummary, orderTotal, t }: OrderSummaryProps) {
  return (
    <>
      {/* Heading */}
      <div className="mb-6 border-b border-charcoal-border pb-5">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold opacity-70">
          {t('checkout.summaryHeading')}
        </span>
        <p className="mt-1 font-display text-xl font-normal text-cream">
          {buyMode?.type === 'cart'
            ? t('checkout.item', { count: cartSummary.length })
            : t('checkout.singleItem')}
        </p>
      </div>

      {/* Items */}
      <ul className="space-y-4">
        {cartSummary.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="h-16 w-12 shrink-0 overflow-hidden bg-charcoal">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Info */}
            <div className="flex flex-1 flex-col justify-between py-0.5">
              <p className="font-display text-sm font-normal leading-snug text-cream">
                {product.name}
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-sans text-[11px] text-cream-muted">
                  {t('checkout.qty')} {quantity}
                </span>
                <span className="font-sans text-sm font-medium text-cream">
                  ${product.price * quantity}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="mt-6 space-y-3 border-t border-charcoal-border pt-5">
        {cartSummary.length > 1 && (
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-cream-muted">{t('checkout.subtotal')}</span>
            <span className="font-sans text-sm text-cream">${orderTotal}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-cream-muted">
            {t('checkout.total')}
          </span>
          <span className="font-display text-2xl font-normal text-gold">${orderTotal}</span>
        </div>
      </div>

      {/* Trust badge */}
      <div className="mt-6 flex items-center gap-2.5 border border-charcoal-border bg-charcoal px-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 shrink-0 text-gold opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-cream-muted/60">
          Secure Demo Checkout
        </span>
      </div>
    </>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const { buyMode, cartItems, clearCart, closeBuy } = useCart()

  const [view, setView] = useState<'form' | 'success'>('form')
  const [form, setForm] = useState<FormData>(initialForm)
  const [touched, setTouched] = useState<Touched>({})
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset form whenever buyMode changes (new order session)
  useEffect(() => {
    setForm(initialForm)
    setTouched({})
    setErrors({})
    setView('form')
  }, [buyMode])

  const handleChange = (field: keyof FormData, value: string) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) setErrors(validate(next, t))
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate(form, t))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form, t)
    setErrors(errs)
    setTouched({ fullName: true, phone: true, email: true })
    if (Object.keys(errs).length > 0) return

    console.log('──── MAISON AUREL DEMO ORDER ────')
    if (buyMode?.type === 'single') {
      console.log('Product:', {
        id: buyMode.product.id,
        name: buyMode.product.name,
        price: buyMode.product.price,
      })
    } else {
      const items = cartItems.map((i) => ({ ...productMap[i.productId], quantity: i.quantity }))
      console.log('Cart:', items)
    }
    console.log('Customer:', form)
    console.log('─────────────────────────────────')

    clearCart()
    closeBuy()
    setView('success')
  }

  // Build order summary
  const cartSummary: { product: Product; quantity: number }[] =
    buyMode?.type === 'cart'
      ? cartItems
          .map((i) => ({ product: productMap[i.productId], quantity: i.quantity }))
          .filter((i) => i.product)
      : buyMode?.type === 'single'
        ? [{ product: buyMode.product, quantity: 1 }]
        : []

  const orderTotal = cartSummary.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const isEmpty = buyMode === null && cartItems.length === 0

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal pt-20 md:pt-24 pb-24">
        <div className="container mx-auto px-6">
          {/* Back link */}
          <button
            onClick={() => navigate('/shop')}
            className="mt-8 mb-10 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.12em] text-cream-muted transition-colors hover:text-gold"
          >
            <span aria-hidden="true">←</span>
            {t('checkout.backToShop')}
          </button>

          {/* Page heading */}
          <div className="mb-12 text-center">
            <div className="mb-3 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gold opacity-30" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold opacity-60">
                {t('checkout.eyebrow')}
              </span>
              <span className="h-px w-10 bg-gold opacity-30" />
            </div>
            <h1 className="font-display text-4xl font-normal text-cream md:text-5xl">
              {t('checkout.title')}
            </h1>
          </div>

          {/* ─── Empty State ─────────────────────────────────── */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                viewBox="0 0 80 120"
                className="mb-8 h-20 w-14 opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="32" y="0" width="16" height="8" rx="2" fill="#C9A96E" />
                <rect x="28" y="8" width="24" height="6" rx="1" fill="#C9A96E" />
                <path
                  d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z"
                  fill="#C9A96E"
                  opacity="0.15"
                />
                <path
                  d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z"
                  fill="none"
                  stroke="#C9A96E"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </svg>
              <h2 className="font-display mb-3 text-2xl font-normal text-cream">
                {t('checkout.emptyTitle')}
              </h2>
              <p className="mb-8 max-w-sm font-sans text-sm leading-relaxed text-cream-muted">
                {t('checkout.emptySubtext')}
              </p>
              <Link to="/shop" className="btn-gold-filled">
                {t('checkout.emptyBrowse')}
              </Link>
            </div>
          )}

          {/* ─── Success State ────────────────────────────────── */}
          {view === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <motion.div animate={reduced ? successCheckmarkReduced : successCheckmark}>
                <CheckmarkIcon />
              </motion.div>
              <h2 className="font-display mt-8 text-3xl font-normal text-cream md:text-4xl">
                {t('buy.successTitle', { name: form.fullName.trim().split(' ')[0] })}
              </h2>
              <p className="mt-3 font-sans text-sm text-cream-muted">{t('buy.successSubtext')}</p>
              <div className="my-8 flex items-center gap-3">
                <span className="h-px w-10 bg-gold opacity-30" />
                <span className="h-1 w-1 rotate-45 bg-gold opacity-30" />
                <span className="h-px w-10 bg-gold opacity-30" />
              </div>
              <p className="mb-8 font-sans text-[10px] uppercase tracking-[0.15em] text-cream-muted/50">
                {t('buy.successDemoNote')}
              </p>
              <Link to="/shop" className="btn-gold-filled">
                {t('checkout.continueShopping')}
              </Link>
            </div>
          )}

          {/* ─── Checkout Form Layout ─────────────────────────── */}
          {!isEmpty && view === 'form' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-14 xl:gap-20">
              {/* ── LEFT: Contact Form ── */}
              <div>
                <div className="mb-8 border-b border-charcoal-border pb-5">
                  <h2 className="font-display text-2xl font-normal text-cream">
                    {t('checkout.contactHeading')}
                  </h2>
                  <p className="mt-1.5 font-sans text-xs text-cream-muted">
                    {t('checkout.contactSubheading')}
                  </p>
                </div>

                {/* Mobile-only order summary (shows above form) */}
                <div className="mb-8 border border-charcoal-border bg-charcoal-card p-6 lg:hidden">
                  <OrderSummaryContent
                    buyMode={buyMode}
                    cartSummary={cartSummary}
                    orderTotal={orderTotal}
                    t={t}
                  />
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      id="checkout-full-name"
                      label={t('buy.fullName')}
                      required
                      type="text"
                      placeholder={t('buy.fullNamePlaceholder')}
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      error={errors.fullName}
                      touched={touched.fullName}
                      autoComplete="name"
                    />
                    <FormField
                      id="checkout-phone"
                      label={t('buy.phone')}
                      required
                      type="tel"
                      placeholder={t('buy.phonePlaceholder')}
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      error={errors.phone}
                      touched={touched.phone}
                      autoComplete="tel"
                    />
                  </div>

                  <FormField
                    id="checkout-email"
                    label={t('buy.email')}
                    required
                    type="email"
                    placeholder={t('buy.emailPlaceholder')}
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    autoComplete="email"
                  />

                  <div>
                    <label
                      htmlFor="checkout-language"
                      className="mb-2 block font-sans text-[10px] uppercase tracking-[0.12em] text-cream-muted"
                    >
                      {t('buy.language')}
                    </label>
                    <select
                      id="checkout-language"
                      value={form.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full appearance-none border border-charcoal-border bg-charcoal px-4 py-3 font-sans text-sm text-cream transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                    >
                      <option value="English">{t('buy.langEn')}</option>
                      <option value="French">{t('buy.langFr')}</option>
                      <option value="Arabic">{t('buy.langAr')}</option>
                    </select>
                  </div>

                  <Textarea
                    id="checkout-address"
                    label={t('buy.address')}
                    placeholder={t('buy.addressPlaceholder')}
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />

                  <Textarea
                    id="checkout-message"
                    label={t('buy.message')}
                    placeholder={t('buy.messagePlaceholder')}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />

                  <div className="pt-2">
                    <div className="mb-6 h-px bg-charcoal-border" />
                    <button
                      type="submit"
                      id="checkout-submit-btn"
                      className="btn-gold-filled w-full justify-center py-4 text-sm"
                    >
                      {t('buy.placeOrder')}
                    </button>
                    <p className="mt-3 text-center font-sans text-[10px] text-cream-muted/50">
                      {t('buy.demoNote')}
                    </p>
                  </div>
                </form>
              </div>

              {/* ── RIGHT: Sticky Order Summary (desktop only) ── */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <div className="border border-charcoal-border bg-charcoal-card p-8">
                    <OrderSummaryContent
                      buyMode={buyMode}
                      cartSummary={cartSummary}
                      orderTotal={orderTotal}
                      t={t}
                    />
                  </div>
                  {/* Decorative accent below card */}
                  <div className="mt-6 flex items-center gap-3 px-1">
                    <span className="h-px flex-1 bg-charcoal-border" />
                    <span className="h-1 w-1 rotate-45 bg-gold opacity-20" />
                    <span className="h-px w-8 bg-charcoal-border" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
