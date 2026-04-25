import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bed, Building2, Calendar, CheckCircle, IndianRupee, MapPin, Maximize, Phone, Shield, Star } from 'lucide-react';
import { Navbar } from '../components/propsight/Navbar';
import { Footer } from '../components/propsight/Footer';
import { PropertyCard } from '../components/propsight/PropertyCard';
import { getProperty, listProperties } from '../services/propertyApi';
import { formatArea, formatBhk, formatPrice, getAmenityLabels, getLocationLabel, getPropertyGallery, getScore } from '../utils/propertyFormat';

function ScorePill({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 text-sm font-semibold text-muted-foreground">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-amber-600">{value}</span>
        <span className="pb-1 text-sm text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export default function PropertyDetails() {
  const { identifier } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProperty(identifier)
      .then(async (data) => {
        if (!active) return;
        setProperty(data);

        if (data?.location?.locality) {
          const related = await listProperties({ locality: data.location.locality, limit: 4 });
          if (active) {
            setSimilar((related.items || []).filter((item) => item._id !== data._id).slice(0, 3));
          }
        }
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.response?.data?.message || 'Property not found.');
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
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="h-[520px] animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Property unavailable</h1>
          <p className="mt-3 text-muted-foreground">{error || 'This property could not be loaded.'}</p>
          <Link to="/properties" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 font-bold text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const gallery = getPropertyGallery(property);
  const amenities = getAmenityLabels(property.amenities);
  const nearbyGroups = [
    ['Schools', property.nearby?.schools],
    ['Hospitals', property.nearby?.hospitals],
    ['Metro', property.nearby?.metro],
    ['Malls', property.nearby?.malls],
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link to="/properties" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-amber-400">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-400">{property.listingType}</span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/70">{property.propertyType}</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">{property.title}</h1>
              <p className="flex items-center gap-2 text-lg text-white/70">
                <MapPin className="h-5 w-5 text-amber-400" />
                {getLocationLabel(property)}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">Expected price</div>
              <div className="mb-4 text-4xl font-bold text-amber-400">{formatPrice(property.pricing?.expectedPrice, property.listingType)}</div>
              <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
                <span className="rounded-xl bg-white/10 p-3">{formatBhk(property)}</span>
                <span className="rounded-xl bg-white/10 p-3">{formatArea(property.area?.superBuiltupArea, property.area?.areaUnit)}</span>
                <span className="rounded-xl bg-white/10 p-3">Score {getScore(property)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="overflow-hidden rounded-3xl bg-muted">
            <img src={gallery[0]} alt={property.title} className="h-[460px] w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {gallery.slice(1, 3).map((image) => (
              <img key={image} src={image} alt={property.title} className="h-[222px] w-full rounded-3xl object-cover" />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Overview</h2>
              <p className="leading-relaxed text-muted-foreground">{property.description || 'Detailed property information is available from the structured listing data.'}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [Bed, 'Configuration', formatBhk(property)],
                  [Maximize, 'Area', formatArea(property.area?.superBuiltupArea, property.area?.areaUnit)],
                  [Building2, 'Project', property.building?.projectName || 'NA'],
                  [Calendar, 'Status', property.building?.constructionStatus || property.availability?.possessionStatus || 'NA'],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="rounded-2xl bg-muted/50 p-4">
                    <Icon className="mb-3 h-5 w-5 text-amber-600" />
                    <div className="text-sm text-muted-foreground">{label}</div>
                    <div className="font-bold text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Amenities</h2>
              {amenities.length ? (
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      <CheckCircle className="h-4 w-4" />
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No amenities listed for this property.</p>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Nearby places</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {nearbyGroups.map(([label, places]) => (
                  <div key={label} className="rounded-2xl bg-muted/50 p-4">
                    <h3 className="mb-3 font-bold text-foreground">{label}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {(places || []).slice(0, 3).map((place) => (
                        <div key={`${label}-${place.name}`} className="flex justify-between gap-3">
                          <span>{place.name}</span>
                          <span>{place.distanceKm} km</span>
                        </div>
                      ))}
                      {!places?.length && <span>Not listed</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-foreground">Seller details</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-bold text-foreground">{property.seller?.contactName || 'Listed seller'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-bold text-foreground">{property.seller?.sellerType || 'NA'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-bold text-foreground">{property.seller?.contactPhoneMasked || 'Masked'}</span>
                </div>
              </div>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 font-bold text-slate-900">
                <Phone className="h-4 w-4" />
                Request callback
              </button>
            </div>

            <div className="grid gap-4">
              <ScorePill label="Investment score" value={getScore(property, 'investmentScore')} />
              <ScorePill label="Livability score" value={getScore(property, 'livabilityScore')} />
              <ScorePill label="Connectivity score" value={getScore(property, 'connectivityScore')} />
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-foreground">Legal and price</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /> {property.legal?.reraId || 'RERA details not listed'}</p>
                <p className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-amber-600" /> {property.pricing?.negotiable ? 'Negotiable' : 'Fixed price'}</p>
                <p className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-600" /> Seller rating {property.seller?.rating || 'NA'}</p>
              </div>
            </div>
          </aside>
        </div>

        {property.highlights?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Highlights</h2>
            <div className="flex flex-wrap gap-3">
              {property.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{highlight}</span>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Similar nearby properties</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {similar.map((item, index) => (
                <PropertyCard key={item._id || item.propertyCode} property={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </section>

      <Footer />
    </main>
  );
}
