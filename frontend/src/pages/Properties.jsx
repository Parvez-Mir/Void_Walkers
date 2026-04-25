import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Navbar } from '../components/globalghar/Navbar';
import { Footer } from '../components/globalghar/Footer';
import { PropertyCard } from '../components/globalghar/PropertyCard';
import { aiSearchProperties, bloomSearchProperties, getPropertyMeta, listProperties } from '../services/propertyApi';

const sortOptions = [
  { value: 'relevance', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'latest', label: 'Latest' },
  { value: 'investment', label: 'Investment picks' },
  { value: 'livability', label: 'Best livability' },
];

const propertyTypes = ['apartment', 'villa', 'penthouse', 'builder-floor', 'studio', 'plot'];
const listingTypes = ['sale', 'rent'];

const readFilters = (searchParams) => ({
  q: searchParams.get('q') || '',
  ai: searchParams.get('ai') === '1',
  locality: searchParams.get('locality') || '',
  propertyType: searchParams.get('propertyType') || '',
  listingType: searchParams.get('listingType') || '',
  bhk: searchParams.get('bhk') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  sortBy: searchParams.get('sortBy') || 'relevance',
  page: Number(searchParams.get('page') || 1),
});

function RecommendationStrip({ title, params, scoreKey }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    listProperties({ ...params, limit: 3 })
      .then((data) => {
        if (active) setItems(data.items || []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [JSON.stringify(params)]);

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link to={`/properties?sortBy=${params.sortBy || 'relevance'}`} className="flex items-center gap-2 text-sm font-semibold text-amber-600">
          View more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((property, index) => (
          <PropertyCard key={property._id || property.propertyCode} property={property} index={index} scoreKey={scoreKey} />
        ))}
      </div>
    </section>
  );
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const [meta, setMeta] = useState(null);
  const [result, setResult] = useState({ items: [], pagination: { page: 1, totalPages: 0, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    getPropertyMeta().then(setMeta).catch(() => setMeta(null));
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        let data;

        if (filters.ai && filters.q) {
          const cached = sessionStorage.getItem('lastAiPropertySearch');
          const cachedPayload = cached ? JSON.parse(cached) : null;
          if (cachedPayload?.query === filters.q && Date.now() - cachedPayload.createdAt < 120000) {
            data = cachedPayload.data.result;
          } else {
            const ai = await aiSearchProperties({ query: filters.q, city: 'Ahmedabad', limit: 12 });
            data = ai.result;
          }
        } else {
          data = await listProperties({
            page: filters.page,
            limit: 12,
            locality: filters.locality,
            propertyType: filters.propertyType,
            listingType: filters.listingType,
            bhk: filters.bhk,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
          });
        }

        if (!data?.items?.length && filters.q) {
          data = await bloomSearchProperties({ q: filters.q, page: filters.page, limit: 12 });
        }

        if (active) setResult(data || { items: [], pagination: { page: 1, totalPages: 0, total: 0 } });
      } catch (fetchError) {
        if (active) {
          setResult({ items: [], pagination: { page: 1, totalPages: 0, total: 0 } });
          setError(fetchError.response?.data?.message || 'Unable to load properties right now.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [filters.ai, filters.q, filters.locality, filters.propertyType, filters.listingType, filters.bhk, filters.minPrice, filters.maxPrice, filters.sortBy, filters.page]);

  const applyFilters = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries({ ...draft, page: 1 }).forEach(([key, value]) => {
      if (value && value !== 'relevance' && key !== 'ai') next.set(key, value);
    });
    if (draft.ai && draft.q) next.set('ai', '1');
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  const goToPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    navigate(`/properties?${next.toString()}`);
  };

  const localities = meta?.localities || [];
  const page = result.pagination?.page || filters.page || 1;
  const totalPages = result.pagination?.totalPages || 0;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Live property search</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Find your Ahmedabad property</h1>
          <p className="max-w-2xl text-lg text-white/60">Search with AI or tune filters directly against the backend catalog.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={applyFilters} className="rounded-2xl border border-border bg-card p-5 shadow-lg">
          <div className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
            <SlidersHorizontal className="h-5 w-5 text-amber-600" />
            Search filters
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="lg:col-span-2">
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Keyword or AI query</span>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={draft.q}
                  onChange={(event) => setDraft({ ...draft, q: event.target.value })}
                  className="w-full bg-transparent py-3 outline-none"
                  placeholder="3BHK in Bopal under 80 lakh"
                />
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, ai: !draft.ai })}
                  disabled={!draft.q}
                  aria-pressed={draft.ai}
                  title={!draft.q ? 'Type a query to enable AI search' : draft.ai ? 'AI interpretation is ON' : 'AI interpretation is OFF'}
                  className={`my-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    draft.ai
                      ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
                      : 'border-border bg-white text-muted-foreground hover:border-amber-200 hover:text-amber-700'
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${draft.ai ? 'text-amber-500' : ''}`} />
                  AI
                  <span className={`rounded px-1 py-0.5 text-[10px] font-bold leading-none ${draft.ai ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {draft.ai ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Locality</span>
              <select value={draft.locality} onChange={(event) => setDraft({ ...draft, locality: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none">
                <option value="">Any locality</option>
                {localities.map((locality) => <option key={locality} value={locality}>{locality}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Sort</span>
              <select value={draft.sortBy} onChange={(event) => setDraft({ ...draft, sortBy: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none">
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Property type</span>
              <select value={draft.propertyType} onChange={(event) => setDraft({ ...draft, propertyType: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none">
                <option value="">Any type</option>
                {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Listing</span>
              <select value={draft.listingType} onChange={(event) => setDraft({ ...draft, listingType: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none">
                <option value="">Sale or rent</option>
                {listingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">BHK</span>
              <input value={draft.bhk} onChange={(event) => setDraft({ ...draft, bhk: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none" placeholder="2" />
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-muted-foreground">Budget</span>
              <input value={draft.maxPrice} onChange={(event) => setDraft({ ...draft, maxPrice: event.target.value})} className="w-full rounded-xl border border-border bg-white px-3 py-3 outline-none" placeholder="Max price" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 font-bold text-slate-900 shadow-lg shadow-amber-500/20">
              <Filter className="h-4 w-4" />
              Apply search
            </button>
            <button type="button" onClick={resetFilters} className="rounded-xl border border-border px-5 py-3 font-semibold text-muted-foreground">
              Reset
            </button>
          </div>
        </form>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Search results</h2>
            <p className="text-muted-foreground">{loading ? 'Loading properties...' : `${result.pagination?.total || result.items?.length || 0} matching listings`}</p>
          </div>
        </div>

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[440px] animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : result.items?.length ? (
          <>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((property, index) => (
                <PropertyCard key={property._id || property.propertyCode} property={property} index={index} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                <button disabled={page <= 1} onClick={() => goToPage(page - 1)} className="rounded-xl border border-border px-4 py-2 font-semibold disabled:opacity-40">Previous</button>
                <span className="rounded-xl bg-muted px-4 py-2 font-semibold">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)} className="rounded-xl border border-border px-4 py-2 font-semibold disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <h3 className="text-xl font-bold text-foreground">No matching properties found</h3>
            <p className="mt-2 text-muted-foreground">Try a broader locality, lower budget restriction, or a simpler search phrase.</p>
          </div>
        )}
      </section>

      <RecommendationStrip title="Investment picks" params={{ sortBy: 'investment' }} scoreKey="investmentScore" />
      <RecommendationStrip title="Best livability" params={{ sortBy: 'livability' }} scoreKey="livabilityScore" />
      <Footer />
    </main>
  );
}
