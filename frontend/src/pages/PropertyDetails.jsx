import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/globalghar/Navbar';
import { Footer } from '../components/globalghar/Footer';
import { getProperty } from '../services/propertyApi';
import { adaptPropertyForDetail } from '../utils/propertyDetailAdapter';

import { PropertyHeader } from '../components/property/PropertyHeader';
import { TrustScoreCard } from '../components/property/TrustScoreCard';
import { NeighborhoodInsights } from '../components/property/NeighborhoodInsights';
import { PriceIntelligence } from '../components/property/PriceIntelligence';
import { FutureGrowthSignals } from '../components/property/FutureGrowthSignals';
import { DocumentPreview } from '../components/property/DocumentPreview';
import { AIInsightsSummary } from '../components/property/AIInsightsSummary';
import { PropertyAmenities } from '../components/property/PropertyAmenities';
import { ContactAgent } from '../components/property/ContactAgent';

export default function PropertyDetails() {
  const { identifier } = useParams();
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProperty(identifier)
      .then((data) => {
        if (active) setRaw(data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Property not found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [identifier]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <div className="h-[500px] animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    );
  }

  if (error || !raw) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 pt-32 pb-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Property unavailable</h1>
          <p className="mt-3 text-muted-foreground">{error || 'This property could not be loaded.'}</p>
          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 font-bold text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const property = adaptPropertyForDetail(raw);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/properties"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-amber-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          {/* Image gallery — preserved layout from earlier commit */}
          <div className="mb-10 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="overflow-hidden rounded-3xl bg-muted">
              <img
                src={property.images[0]}
                alt={property.header.name}
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {property.images.slice(1, 3).map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={property.header.name}
                  className="h-[222px] w-full rounded-3xl object-cover"
                />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PropertyHeader property={property.header} />
              <TrustScoreCard scores={property.trust} />
              <NeighborhoodInsights neighborhood={property.neighborhood} />
              <PriceIntelligence
                priceHistory={property.priceIntelligence.priceHistory}
                comparables={property.priceIntelligence.comparables}
                currentPrice={property.priceIntelligence.currentPrice}
                yoyChange={property.priceIntelligence.yoyChange}
              />
              <FutureGrowthSignals futureGrowth={property.futureGrowth} />
              <DocumentPreview documents={property.documents} reraId={property.documentsReraId} />
              <AIInsightsSummary insights={property.aiInsights} />
            </div>

            <aside className="space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                <ContactAgent builder={property.sidebar.builder} />
                <PropertyAmenities
                  amenities={property.sidebar.amenities}
                  builder={property.sidebar.builder}
                  projectName={property.sidebar.projectName}
                  possession={property.sidebar.possession}
                  age={property.sidebar.age}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
