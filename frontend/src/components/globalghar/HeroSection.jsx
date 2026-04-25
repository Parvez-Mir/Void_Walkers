import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home, Search, Sparkles, Users, X } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { aiSearchProperties } from '../../services/propertyApi';

const categories = [
  { label: 'Buyer Intent', options: ['Investment', 'Self-use', 'Rental income'] },
  { label: 'Lifestyle', options: ['Gated community', 'Near parks', 'Quiet neighborhood'] },
  { label: "Who It's For", options: ['Families', 'Couples', 'Singles', 'Seniors'] },
  { label: 'Property Type', options: ['Apartment', 'Villa', 'Penthouse', 'Plot'] },
  { label: 'Connectivity', options: ['Near metro', 'Highway access', 'Airport proximity'] },
];

const defaultChips = ['Investment', 'Gated community', 'RERA verified', 'Near metro'];

export function HeroSection() {
  const [selectedChips, setSelectedChips] = useState(defaultChips);
  const [activeCategory, setActiveCategory] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleChip = (chip) => {
    setSelectedChips((prev) => (prev.includes(chip) ? prev.filter((entry) => entry !== chip) : [...prev, chip]));
  };

  const submitSearch = async (event) => {
    event.preventDefault();
    const finalQuery = [query.trim(), ...selectedChips].filter(Boolean).join(' ');
    if (!finalQuery) return;

    setLoading(true);
    try {
      const data = await aiSearchProperties({ query: finalQuery, city: 'Ahmedabad', limit: 12 });
      sessionStorage.setItem('lastAiPropertySearch', JSON.stringify({ query: finalQuery, data, createdAt: Date.now() }));
    } catch {
      sessionStorage.removeItem('lastAiPropertySearch');
    } finally {
      setLoading(false);
      navigate(`/properties?q=${encodeURIComponent(finalQuery)}&ai=1`);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-[100px]" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-in-up">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold tracking-wide text-amber-400">AI-Powered Real Estate Platform</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Smart Real Estate Decisions <span className="text-gold-gradient">From Anywhere</span> in the World.
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
              AI-powered neighborhood intelligence and remote property discovery for NRIs and remote buyers.
              <span className="text-amber-400"> No middlemen. Full transparency.</span>
            </p>

            <form onSubmit={submitSearch} className="mb-8">
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl transition focus-within:border-amber-400/50 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-white/40" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="Try: 3BHK in Prahlad Nagar under 80 lakhs near schools"
                    className="w-full flex-1 bg-transparent py-4 text-base text-white placeholder:text-white/40 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? 'Searching...' : 'Search with AI'}
                </button>
              </div>
            </form>

            <div className="mb-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <div key={category.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveCategory(activeCategory === category.label ? null : category.label)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === category.label ? 'bg-amber-400 text-slate-900' : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    {category.label}
                  </button>
                  {activeCategory === category.label && (
                    <div className="animate-scale-in absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-xl border border-white/10 bg-slate-800/95 p-3 shadow-2xl backdrop-blur-xl">
                      {category.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleChip(option)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${selectedChips.includes(option) ? 'bg-amber-400/20 text-amber-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                        >
                          {option}
                          {selectedChips.includes(option) ? <Check className="h-4 w-4" /> : <span>+</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {selectedChips.map((chip) => (
                <button key={chip} type="button" onClick={() => toggleChip(chip)} className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-400/20 to-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
                  {chip}
                  <X className="h-3.5 w-3.5 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-[500px] animate-fade-in-right lg:h-[600px]">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-400/20 via-transparent to-teal-400/20 blur-2xl" />
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <HeroCarousel />
            </div>
            <div className="absolute -left-8 top-20 hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1,000+</p>
                  <p className="text-sm text-white/60">Properties Listed</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-32 hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                  <Users className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3,800+</p>
                  <p className="text-sm text-white/60">Remote Buyers Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
