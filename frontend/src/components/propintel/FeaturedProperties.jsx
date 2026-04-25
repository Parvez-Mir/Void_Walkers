import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { getFeaturedProperties } from '../../services/propertyApi';
import { PropertyCard } from './PropertyCard';

export function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFeaturedProperties(3)
      .then((data) => {
        if (active) setProperties(data.items || []);
      })
      .catch(() => {
        if (active) setProperties([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="properties" className="relative overflow-hidden bg-background py-24">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-400/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-400/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">Handpicked for You</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Featured <span className="text-gold-gradient">Properties</span>
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">Explore top-rated listings from the live property catalog.</p>
          </div>
          <Link to="/properties" className="group flex items-center gap-2 self-start font-semibold text-amber-600 transition hover:text-amber-700 md:self-auto">
            View all properties
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-[440px] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : properties.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard key={property._id || property.propertyCode} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold text-foreground">No properties found yet.</p>
            <p className="mt-2 text-muted-foreground">Seed the backend database to populate live recommendations.</p>
          </div>
        )}
      </div>
    </section>
  );
}
