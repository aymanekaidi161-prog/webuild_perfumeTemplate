import { useRef } from 'react'
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

// ─── Icons ───────────────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M11 20A7 7 0 0 1 14 6h7v7a7 7 0 0 1-7 7h-3Z"/><path d="M14 6v6a3 3 0 0 1-3 3h-4"/></svg>
)

const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M7 15.3 2.3 11 7 6.7"/><path d="m17 8.7 4.7 4.3-4.7 4.3"/><path d="M2.3 11h14.4c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3H11"/></svg>
)

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
)

// ─── About Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { t } = useTranslation()
  const ingredientsRef = useRef<HTMLDivElement>(null)
  const sustainabilityRef = useRef<HTMLDivElement>(null)

  useScrollReveal(ingredientsRef as React.RefObject<HTMLElement | null>, { stagger: 0.12, y: 28 })
  useScrollReveal(sustainabilityRef as React.RefObject<HTMLElement | null>, { stagger: 0.12, y: 24 })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="about-hero"
          className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden pt-20 text-center"
          style={{ background: 'linear-gradient(180deg,#1A1A1A 0%,#222020 40%,#1A1A1A 100%)' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,169,110,0.06) 0%,transparent 100%)' }}
          />
          <div className="relative z-10 mx-auto max-w-2xl px-6 py-20">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gold opacity-40" />
              <span className="font-sans text-[10px] uppercase tracking-[0.35em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-70">{t('about.eyebrow')}</span>
              <span className="h-px w-16 bg-gold opacity-40" />
            </div>
            <h1 className="font-display mb-6 text-4xl font-normal leading-tight text-cream md:text-5xl lg:text-6xl">
              {t('about.heroHeading')}
            </h1>
            <p className="mx-auto max-w-lg font-sans text-base font-light leading-relaxed text-cream-muted">
              {t('about.heroSubheading')}
            </p>
          </div>
        </section>

        {/* ── Our Story ────────────────────────────────────────────────── */}
        <section id="story" className="section-padding bg-charcoal-card">
          <div className="container mx-auto px-6">
            <SectionHeader
              eyebrow={t('about.storyEyebrow')}
              heading={t('about.storyHeading')}
            />
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/images/products/oud-noir-1.png"
                  alt="Maison Aurel atelier"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                <div className="absolute bottom-6 start-6 border-s-2 border-gold ps-4">
                  <p className="font-display text-sm italic text-cream">Maison Aurel</p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] rtl:tracking-normal text-gold opacity-70">Paris — Est. 2018</p>
                </div>
              </div>
              {/* Text */}
              <div className="space-y-6">
                <p className="font-sans text-sm leading-relaxed text-cream-muted">
                  {t('about.storyBody1')}
                </p>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold opacity-40" />
                  <span className="h-1 w-1 rotate-45 bg-gold opacity-40" />
                  <span className="h-px w-8 bg-gold opacity-40" />
                </div>
                <p className="font-sans text-sm leading-relaxed text-cream-muted">
                  {t('about.storyBody2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ingredients ──────────────────────────────────────────────── */}
        <section id="ingredients" className="section-padding bg-charcoal">
          <div className="container mx-auto px-6">
            <SectionHeader
              eyebrow={t('about.ingredientsEyebrow')}
              heading={t('about.ingredientsHeading')}
              subheading={t('about.ingredientsSubheading')}
            />
            <div ref={ingredientsRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Oud */}
              <article className="group flex flex-col overflow-hidden border border-charcoal-border bg-charcoal-card p-0 transition-colors hover:border-gold/40">
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src="/images/products/oud-noir-1.png"
                    alt={t('about.ing1Name')}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex w-full flex-1 flex-col p-6">
                  <span className="mb-1 block font-sans text-[9px] uppercase tracking-[0.2em] rtl:tracking-normal text-gold opacity-60">{t('about.ing1Origin')}</span>
                  <h3 className="font-display mb-3 text-xl font-normal text-cream">{t('about.ing1Name')}</h3>
                  <p className="font-sans text-xs leading-relaxed text-cream-muted">{t('about.ing1Desc')}</p>
                </div>
              </article>
              {/* Rose */}
              <article className="group flex flex-col overflow-hidden border border-charcoal-border bg-charcoal-card p-0 transition-colors hover:border-gold/40">
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src="/images/products/rose-de-minuit-1.png"
                    alt={t('about.ing2Name')}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex w-full flex-1 flex-col p-6">
                  <span className="mb-1 block font-sans text-[9px] uppercase tracking-[0.2em] rtl:tracking-normal text-gold opacity-60">{t('about.ing2Origin')}</span>
                  <h3 className="font-display mb-3 text-xl font-normal text-cream">{t('about.ing2Name')}</h3>
                  <p className="font-sans text-xs leading-relaxed text-cream-muted">{t('about.ing2Desc')}</p>
                </div>
              </article>
              {/* Amber */}
              <article className="group flex flex-col overflow-hidden border border-charcoal-border bg-charcoal-card p-0 transition-colors hover:border-gold/40">
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src="/images/products/ambre-dore-1.png"
                    alt={t('about.ing3Name')}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex w-full flex-1 flex-col p-6">
                  <span className="mb-1 block font-sans text-[9px] uppercase tracking-[0.2em] rtl:tracking-normal text-gold opacity-60">{t('about.ing3Origin')}</span>
                  <h3 className="font-display mb-3 text-xl font-normal text-cream">{t('about.ing3Name')}</h3>
                  <p className="font-sans text-xs leading-relaxed text-cream-muted">{t('about.ing3Desc')}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Sustainability ────────────────────────────────────────────── */}
        <section id="sustainability" className="section-padding bg-charcoal-card">
          <div className="container mx-auto px-6">
            <SectionHeader
              eyebrow={t('about.sustainabilityEyebrow')}
              heading={t('about.sustainabilityHeading')}
              subheading={t('about.sustainabilitySubheading')}
            />
            <div ref={sustainabilityRef} className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: <LeafIcon />, titleKey: 'about.sus1Title', descKey: 'about.sus1Desc' },
                { icon: <RecycleIcon />, titleKey: 'about.sus2Title', descKey: 'about.sus2Desc' },
                { icon: <GlobeIcon />, titleKey: 'about.sus3Title', descKey: 'about.sus3Desc' },
              ].map(({ icon, titleKey, descKey }) => (
                <div key={titleKey} className="border border-charcoal-border p-8 text-center">
                  <div className="mb-4 flex justify-center">{icon}</div>
                  <div className="mb-3 flex justify-center">
                    <span className="h-px w-8 bg-gold opacity-30" />
                  </div>
                  <h3 className="font-display mb-3 text-base font-normal text-cream">{t(titleKey)}</h3>
                  <p className="font-sans text-xs leading-relaxed text-cream-muted">{t(descKey)}</p>
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
