import Link from 'next/link';
import FlowerVisual from '@/components/flower/FlowerVisual';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ─── HEADER ─── */}
      <header className="px-6 py-5 flex items-center justify-center sm:justify-start max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-rose" aria-hidden="true">
            <circle cx="10" cy="8" r="2.5" fill="currentColor" opacity="0.8" />
            <ellipse cx="10" cy="8" rx="3" ry="5" fill="currentColor" opacity="0.3" transform="rotate(30 10 8)" />
            <ellipse cx="10" cy="8" rx="3" ry="5" fill="currentColor" opacity="0.3" transform="rotate(-30 10 8)" />
            <path d="M10,12 L10,18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="font-serif text-lg text-charcoal tracking-tight">Digital Flower</span>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="px-6 pt-8 pb-20 sm:pt-16 sm:pb-28 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="animate-float mb-6">
          <FlowerVisual stage="bloom" health="healthy" flowerType="rose" size="lg" showParticles />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal leading-[1.1] max-w-lg mb-5">
          Give them a flower<br />that grows with them.
        </h1>

        <p className="text-taupe text-base sm:text-lg max-w-sm leading-relaxed mb-10">
          A little flower. A little care.<br />A beautiful surprise waiting to bloom.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose text-white font-semibold rounded-2xl shadow-lg hover:bg-rose-deep hover:shadow-xl shadow-rose/25 transition-all duration-200 active:scale-[0.97] text-base min-h-[56px] w-full sm:w-auto cursor-pointer"
          >
            <span aria-hidden="true">🌷</span>
            Create a Flower
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 py-4 text-taupe font-semibold rounded-2xl border-2 border-blush-soft/60 hover:border-blush hover:bg-cream-deep transition-all duration-200 text-base min-h-[56px] w-full sm:w-auto cursor-pointer"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* ─── HOW IT WORKS — Visual Cards ─── */}
      <section id="how-it-works" className="px-6 py-20 sm:py-28 bg-cream-deep">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal text-center mb-14">
            Three simple steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-blush-soft/30 shadow-sm animate-fade-in">
              <div className="text-4xl mb-3" aria-hidden="true">💧</div>
              <h3 className="font-serif text-xl text-charcoal mb-1">Care for it</h3>
              <p className="text-sm text-taupe leading-relaxed">
                A little each day.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-blush-soft/30 shadow-sm animate-fade-in">
              <div className="text-4xl mb-3" aria-hidden="true">🌱</div>
              <h3 className="font-serif text-xl text-charcoal mb-1">Watch it grow</h3>
              <p className="text-sm text-taupe leading-relaxed">
                Day by day.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-blush-soft/30 shadow-sm animate-fade-in">
              <div className="text-4xl mb-3" aria-hidden="true">🌸</div>
              <h3 className="font-serif text-xl text-charcoal mb-1">See it bloom</h3>
              <p className="text-sm text-taupe leading-relaxed">
                On Day 30.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMOTIONAL SECTION ─── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-taupe text-sm uppercase tracking-widest mb-4">More than a message</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-6">
            Something they can grow.
          </h2>
          <p className="text-taupe leading-relaxed max-w-md mx-auto mb-12">
            Every flower starts as a tiny seed. With a little love each day, it grows into something beautiful — just like the relationship you share.
          </p>

          {/* Growth stages */}
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            <div className="text-center space-y-2">
              <FlowerVisual stage="seed" health="healthy" flowerType="rose" size="sm" />
              <p className="text-xs text-taupe-light">Seed</p>
            </div>
            <div className="text-center space-y-2">
              <FlowerVisual stage="young_plant" health="healthy" flowerType="sunflower" size="sm" />
              <p className="text-xs text-taupe-light">Growing</p>
            </div>
            <div className="text-center space-y-2">
              <FlowerVisual stage="bud" health="healthy" flowerType="tulip" size="sm" />
              <p className="text-xs text-taupe-light">Budding</p>
            </div>
            <div className="text-center space-y-2">
              <FlowerVisual stage="bloom" health="healthy" flowerType="lavender" size="sm" />
              <p className="text-xs text-taupe-light">Bloom</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 py-20 sm:py-28 bg-warm-blush">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-8">
            Ready to grow<br />something beautiful?
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose text-white font-semibold rounded-2xl shadow-lg hover:bg-rose-deep hover:shadow-xl shadow-rose/25 transition-all duration-200 active:scale-[0.97] text-base min-h-[56px] cursor-pointer"
          >
            <span aria-hidden="true">🌷</span>
            Create a Flower
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-8 text-center">
        <p className="text-xs text-taupe-light">Made with care.</p>
      </footer>
    </main>
  );
}
