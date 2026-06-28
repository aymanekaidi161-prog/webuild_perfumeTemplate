import { useTranslation } from 'react-i18next'

type FilterValue = 'all' | 'men' | 'women' | 'unisex'

interface FilterBarProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  const { t } = useTranslation()

  const filters: { label: string; value: FilterValue }[] = [
    { label: t('filter.all'), value: 'all' },
    { label: t('filter.men'), value: 'men' },
    { label: t('filter.women'), value: 'women' },
    { label: t('filter.unisex'), value: 'unisex' },
  ]

  return (
    <div
      className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label={t('filter.label')}
    >
      {filters.map((f) => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            id={`filter-btn-${f.value}`}
            onClick={() => onChange(f.value)}
            className={`relative shrink-0 min-w-[72px] px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] transition-all duration-300 rtl:tracking-normal rtl:text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 ${
              isActive
                ? 'border border-gold text-gold'
                : 'border border-charcoal-border text-cream-muted hover:border-gold/50 hover:text-cream'
            }`}
          >
            {f.label}
            {/* Active indicator — thin gold underline */}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4 bg-gold"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
