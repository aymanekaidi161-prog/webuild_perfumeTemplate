import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useScrollReveal from '../hooks/useScrollReveal'

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, heading, subheading }: { eyebrow: string; heading: string; subheading?: string }) {
  return (
    <div className="mb-14 text-center">
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-gold opacity-30" />
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-60">{eyebrow}</span>
        <span className="h-px w-12 bg-gold opacity-30" />
      </div>
      <h2 className="font-display text-3xl font-normal text-cream md:text-4xl">{heading}</h2>
      {subheading && <p className="mt-3 font-sans text-sm text-cream-muted">{subheading}</p>}
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-charcoal-border last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-start"
        aria-expanded={open}
      >
        <span className="font-sans text-sm font-medium text-cream pe-6">{q}</span>
        <span className={`shrink-0 text-gold transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-64 pb-5' : 'max-h-0'}`}>
        <p className="font-sans text-sm leading-relaxed text-cream-muted">{a}</p>
      </div>
    </div>
  )
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { t } = useTranslation()
  const faqRef = useRef<HTMLDivElement>(null)
  const storesRef = useRef<HTMLDivElement>(null)
  useScrollReveal(storesRef as React.RefObject<HTMLElement | null>, { stagger: 0.1, y: 24 })

  // Form state
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = t('contact.errorName')
    if (!form.email.trim()) e.email = t('contact.errorEmail')
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = t('contact.errorEmailInvalid')
    if (!form.message.trim()) e.message = t('contact.errorMessage')
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t2 = { name: true, email: true, message: true }
    setTouched(t2)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      console.log('[ContactPage] Form submitted:', form)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
      setTouched({})
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [1, 2, 3, 4, 5].map((n) => ({ q: t(`contact.faq${n}Q`), a: t(`contact.faq${n}A`) }))

  const stores = [1, 2, 3].map((n) => ({
    name: t(`contact.store${n}Name`),
    address: t(`contact.store${n}Address`),
    hours: t(`contact.store${n}Hours`),
    phone: t(`contact.store${n}Phone`),
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="contact-hero"
          className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden pt-20 text-center"
          style={{ background: 'linear-gradient(180deg,#1A1A1A 0%,#222020 40%,#1A1A1A 100%)' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,169,110,0.05) 0%,transparent 100%)' }}
          />
          <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gold opacity-40" />
              <span className="font-sans text-[10px] uppercase tracking-[0.35em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-70">{t('contact.eyebrow')}</span>
              <span className="h-px w-16 bg-gold opacity-40" />
            </div>
            <h1 className="font-display mb-6 text-4xl font-normal leading-tight text-cream md:text-5xl">
              {t('contact.heroHeading')}
            </h1>
            <p className="mx-auto max-w-lg font-sans text-base font-light leading-relaxed text-cream-muted">
              {t('contact.heroSubheading')}
            </p>
          </div>
        </section>

        {/* ── Contact Form ──────────────────────────────────────────────── */}
        <section id="contact-form" className="section-padding bg-charcoal-card">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-xl">
              <SectionHeader
                eyebrow={t('contact.formEyebrow')}
                heading={t('contact.formHeading')}
              />

              {success ? (
                <div className="border border-gold/30 bg-charcoal p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display mb-2 text-xl font-normal text-cream">{t('contact.successTitle')}</h3>
                  <p className="font-sans text-sm text-cream-muted">{t('contact.successBody')}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-gold mt-6 text-xs"
                  >
                    {t('modal.close')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] rtl:tracking-normal text-cream-muted">
                      {t('contact.name')} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      onBlur={() => handleBlur('name')}
                      placeholder={t('contact.namePlaceholder')}
                      className={`w-full border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/30 ${touched.name && errors.name ? 'border-red-500/60' : 'border-charcoal-border focus:border-gold'}`}
                    />
                    {touched.name && errors.name && <p className="mt-1 font-sans text-xs text-red-400">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] rtl:tracking-normal text-cream-muted">
                      {t('contact.email')} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={() => handleBlur('email')}
                      placeholder={t('contact.emailPlaceholder')}
                      className={`w-full border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/30 ${touched.email && errors.email ? 'border-red-500/60' : 'border-charcoal-border focus:border-gold'}`}
                    />
                    {touched.email && errors.email && <p className="mt-1 font-sans text-xs text-red-400">{errors.email}</p>}
                  </div>
                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.1em] rtl:tracking-normal text-cream-muted">
                      {t('contact.message')} <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      onBlur={() => handleBlur('message')}
                      placeholder={t('contact.messagePlaceholder')}
                      className={`w-full resize-none border bg-charcoal px-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-muted/40 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/30 ${touched.message && errors.message ? 'border-red-500/60' : 'border-charcoal-border focus:border-gold'}`}
                    />
                    {touched.message && errors.message && <p className="mt-1 font-sans text-xs text-red-400">{errors.message}</p>}
                  </div>
                  <button type="submit" id="contact-submit-btn" className="btn-gold-filled w-full">
                    {t('contact.send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="section-padding bg-charcoal">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl">
              <SectionHeader
                eyebrow={t('contact.faqEyebrow')}
                heading={t('contact.faqHeading')}
              />
              <div ref={faqRef}>
                {faqs.map((faq, i) => (
                  <FaqItem
                    key={i}
                    q={faq.q}
                    a={faq.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stores ───────────────────────────────────────────────────── */}
        <section id="stores" className="section-padding bg-charcoal-card">
          <div className="container mx-auto px-6">
            <SectionHeader
              eyebrow={t('contact.storesEyebrow')}
              heading={t('contact.storesHeading')}
              subheading={t('contact.storesSubheading')}
            />
            <div ref={storesRef} className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {stores.map((store) => (
                <div key={store.name} className="border border-charcoal-border p-6 transition-colors hover:border-gold/40">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="mt-0.5 text-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <h3 className="font-display text-base font-normal text-cream">{store.name}</h3>
                  </div>
                  <div className="space-y-2 border-t border-charcoal-border pt-4">
                    <p className="font-sans text-xs text-cream-muted">{store.address}</p>
                    <p className="font-sans text-xs text-cream-muted">{store.hours}</p>
                    <p className="font-sans text-xs text-gold">{store.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
