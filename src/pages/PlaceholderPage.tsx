export default function PlaceholderPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal px-6 text-center">
      {/* Decorative top line */}
      <div className="mb-10 flex items-center gap-4">
        <span className="h-px w-16 bg-gold opacity-50" />
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
          Maison Aurel
        </span>
        <span className="h-px w-16 bg-gold opacity-50" />
      </div>

      {/* Serif heading */}
      <h1 className="font-display mb-6 max-w-2xl text-5xl font-normal leading-tight text-cream md:text-6xl lg:text-7xl">
        The Art of{' '}
        <em className="italic text-gold">Scent</em>
      </h1>

      {/* Sans-serif body paragraph */}
      <p className="mb-12 max-w-md font-sans text-base font-light leading-relaxed text-cream-muted md:text-lg">
        A curated collection of handcrafted fragrances, each telling a story of rare ingredients
        and quiet luxury. Discover the house behind the bottle.
      </p>

      {/* Gold accent buttons */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <button id="explore-collection-btn" className="btn-gold-filled">
          Explore Collection
        </button>
        <button id="our-story-btn" className="btn-gold">
          Our Story
        </button>
      </div>

      {/* Decorative bottom ornament */}
      <div className="mt-20 flex flex-col items-center gap-3 opacity-30">
        <div className="h-12 w-px bg-gold" />
        <div className="h-1.5 w-1.5 rotate-45 bg-gold" />
      </div>
    </main>
  )
}
