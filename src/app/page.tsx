import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFF8F0] to-[#FFE4E6]">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Hero flower icon */}
        <div className="text-6xl animate-float" aria-hidden="true">🌸</div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
          Give someone a flower
          <br />
          that grows with them.
        </h1>

        <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
          Create a digital flower, write a personal message, and send a private link.
          They care for it a little each day. After 30 days, it blooms.
        </p>

        <Link
          href="/create"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#E8637A] hover:bg-[#C94862] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-lg min-h-[56px]"
        >
          Create a Flower
        </Link>

        <div className="grid grid-cols-3 gap-6 pt-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl" aria-hidden="true">💧</div>
            <p className="text-sm text-gray-500">Daily care</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl" aria-hidden="true">🌱</div>
            <p className="text-sm text-gray-500">Watch it grow</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl" aria-hidden="true">🌸</div>
            <p className="text-sm text-gray-500">30-day bloom</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-4">
          Private link • No account needed
        </p>
      </div>
    </main>
  );
}
