import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { useCart } from '../../hooks/useCart'
import useReducedMotion from '../../hooks/useReducedMotion'
import {
  modalOverlay, modalPanel, modalPanelReduced,
  successCheckmark, successCheckmarkReduced,
} from '../../data/motion'
import rawProducts from '../../data/products.json'
import type { Product } from '../../data/types'

const productMap = Object.fromEntries((rawProducts as Product[]).map((p) => [p.id, p]))
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialForm = { fullName: '', phone: '', email: '', language: 'English', address: '', message: '' }
type FormData = typeof initialForm
type FormErrors = { fullName?: string; phone?: string; email?: string }
type Touched = Record<string, boolean>

function validate(f: FormData, t: TFunction): FormErrors {
  const e: FormErrors = {}
  if (!f.fullName.trim()) e.fullName = t('buy.errorFullName')
  if (!f.phone.trim())    e.phone    = t('buy.errorPhone')
  if (!f.email.trim())    e.email    = t('buy.errorEmail')
  else if (!EMAIL_REGEX.test(f.email.trim())) e.email = t('buy.errorEmailInvalid')
  return e
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
        {label}{required && <span className="ms-0.5 text-gold">*</span>}
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
  const { t } = useTranslation()
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

  useEffect(() => {
    if (isOpen) { setForm(initialForm); setTouched({}); setErrors({}); setView('form') }
  }, [isOpen])

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
    console.log('──── DEMO ORDER ────')
    if (buyMode?.type === 'single') {
      console.log('Product:', { id: buyMode.product.id, name: buyMode.product.name, price: buyMode.product.price })
    } else {
      const items = cartItems.map((i) => ({ ...productMap[i.productId], quantity: i.quantity }))
      console.log('Cart:', items)
    }
    console.log('Customer:', form)
    console.log('────────────────────')
    clearCart()
    setView('success')
  }

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
            data-lenis-prevent
          >
            <button id="buy-modal-close" onClick={closeBuy} aria-label="Close"
              className="absolute end-4 top-4 z-20 text-cream-muted transition-colors hover:text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {view === 'form' ? (
              <div className="p-6 md:p-8">
                {/* Product / Cart summary */}
                <div className="mb-6 border-b border-charcoal-border pb-6">
                  {buyMode?.type === 'single' ? (
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-charcoal">
                        <img src={buyMode.product.images[0]} alt={buyMode.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h2 className="font-display text-lg font-normal text-cream">{t(`products.${buyMode.product.id}.name`, { defaultValue: buyMode.product.name })}</h2>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="font-sans text-sm font-medium text-gold">${buyMode.product.price}</span>
                          <span className="border border-gold/30 px-1.5 font-sans text-[9px] uppercase tracking-[0.1em] rtl:tracking-normal rtl:text-[10px] rtl:font-medium text-gold">{t(`filter.${buyMode.product.genderTag}`)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-display mb-3 text-lg font-normal text-cream">
                        {t('buy.cartSummary')} ({t('buy.item', { count: cartSummary.length })})
                      </h2>
                      <ul className="space-y-2">
                        {cartSummary.map(({ product, quantity }) => (
                          <li key={product.id} className="flex items-center justify-between font-sans text-sm">
                            <span className="text-cream-muted">{t(`products.${product.id}.name`, { defaultValue: product.name })} <span className="text-cream-muted/50">× {quantity}</span></span>
                            <span className="text-cream">${product.price * quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between border-t border-charcoal-border pt-3">
                        <span className="font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">{t('buy.total')}</span>
                        <span className="font-sans text-lg font-medium text-gold">${cartTotal}</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    <FormField id="buy-full-name" label={t('buy.fullName')} required type="text" placeholder={t('buy.fullNamePlaceholder')}
                      value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')} error={errors.fullName} touched={touched.fullName} />
                    <FormField id="buy-phone" label={t('buy.phone')} required type="tel" placeholder={t('buy.phonePlaceholder')}
                      value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')} error={errors.phone} touched={touched.phone} />
                    <FormField id="buy-email" label={t('buy.email')} required type="email" placeholder={t('buy.emailPlaceholder')}
                      value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')} error={errors.email} touched={touched.email} />
                    <div>
                      <label htmlFor="buy-language" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">{t('buy.language')}</label>
                      <select id="buy-language" value={form.language} onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full appearance-none border border-charcoal-border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">
                        <option value="English">{t('buy.langEn')}</option>
                        <option value="French">{t('buy.langFr')}</option>
                        <option value="Arabic">{t('buy.langAr')}</option>
                      </select>
                    </div>
                    <Textarea id="buy-address" label={t('buy.address')} placeholder={t('buy.addressPlaceholder')}
                      value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                    <Textarea id="buy-message" label={t('buy.message')} placeholder={t('buy.messagePlaceholder')}
                      value={form.message} onChange={(e) => handleChange('message', e.target.value)} />
                  </div>
                  <button type="submit" id="buy-submit-btn" className="btn-gold-filled mt-6 w-full justify-center">
                    {t('buy.placeOrder')}
                  </button>
                  <p className="mt-3 text-center font-sans text-[10px] text-cream-muted/50">{t('buy.demoNote')}</p>
                </form>
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
                <motion.div animate={reduced ? successCheckmarkReduced : successCheckmark}>
                  <CheckmarkIcon />
                </motion.div>
                <h2 className="font-display mt-6 text-2xl font-normal text-cream">
                  {t('buy.successTitle', { name: form.fullName.trim().split(' ')[0] })}
                </h2>
                <p className="mt-2 font-sans text-sm text-cream-muted">{t('buy.successSubtext')}</p>
                <div className="my-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold opacity-30" />
                  <span className="h-1 w-1 rotate-45 bg-gold opacity-30" />
                  <span className="h-px w-8 bg-gold opacity-30" />
                </div>
                <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.15em] text-cream-muted/50">{t('buy.successDemoNote')}</p>
                <button id="buy-success-close" onClick={closeBuy} className="btn-gold">{t('buy.successClose')}</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
