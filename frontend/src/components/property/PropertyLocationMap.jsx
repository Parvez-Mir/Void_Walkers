import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, IndianRupee } from 'lucide-react';
import { formatArea, formatBhk, formatPrice, getPropertyIdentifier } from '../../utils/propertyFormat';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

function loadGoogleMaps(apiKey) {
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.google.maps), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

const encodeSvg = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const createPriceMarker = (label, isActive) =>
  encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="132" height="48" viewBox="0 0 132 48">
      <rect x="6" y="6" width="120" height="28" rx="14" fill="${isActive ? '#b45309' : '#111827'}" />
      <path d="M66 42L58 30h16z" fill="${isActive ? '#b45309' : '#111827'}" />
      <text x="66" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#ffffff">${label}</text>
    </svg>
  `);

export function PropertyLocationMap({ property, nearby = [], radiusKm = 5 }) {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const center = property?.coordinates;

  const listings = useMemo(() => {
    const primary = {
      ...property,
      _id: property?.identifier,
      distanceKm: 0,
      isSubject: true,
      pricing: property?.rawPricing || {},
      configuration: property?.rawConfiguration || {},
      area: property?.rawArea || {},
    };

    return [primary, ...nearby].filter(
      (item) =>
        Number.isFinite(Number(item?.coordinates?.lat ?? item?.location?.coordinates?.coordinates?.[1])) &&
        Number.isFinite(Number(item?.coordinates?.lng ?? item?.location?.coordinates?.coordinates?.[0]))
    );
  }, [nearby, property]);

  useEffect(() => {
    if (!mapRef.current || !center?.lat || !center?.lng) {
      setStatus('unavailable');
      return undefined;
    }

    let markers = [];
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapRef.current) return;

        const map = new maps.Map(mapRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'cooperative',
          styles: [
            { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit.station', stylers: [{ saturation: -15 }] },
          ],
        });

        const bounds = new maps.LatLngBounds();
        const infoWindow = new maps.InfoWindow();

        markers = listings.map((item) => {
          const lat = Number(item?.coordinates?.lat ?? item?.location?.coordinates?.coordinates?.[1]);
          const lng = Number(item?.coordinates?.lng ?? item?.location?.coordinates?.coordinates?.[0]);
          const priceLabel = formatPrice(item?.pricing?.expectedPrice, item?.listingType).replace(/^Rs\s/, '');
          const marker = new maps.Marker({
            position: { lat, lng },
            map,
            title: item?.title || item?.header?.name || 'Property',
            icon: {
              url: createPriceMarker(priceLabel, Boolean(item?.isSubject)),
              scaledSize: new maps.Size(132, 48),
              anchor: new maps.Point(66, 42),
            },
          });

          marker.addListener('click', () => {
            const identifier = item?.isSubject ? property?.identifier : getPropertyIdentifier(item);
            const address = item?.header?.fullAddress || [item?.location?.locality, item?.city].filter(Boolean).join(', ');
            const html = `
              <div style="min-width:220px;padding:4px 2px 2px;font-family:Arial,sans-serif">
                <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:4px;">${item?.building?.projectName || item?.header?.name || item?.title || 'Property'}</div>
                <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">${address || 'Ahmedabad'}</div>
                <div style="font-size:13px;font-weight:700;color:#b45309;margin-bottom:6px;">${priceLabel}</div>
                ${identifier ? `<a href="/properties/${identifier}" style="font-size:12px;font-weight:600;color:#1d4ed8;text-decoration:none;">Open details</a>` : ''}
              </div>
            `;
            infoWindow.setContent(html);
            infoWindow.open({ anchor: marker, map });
          });

          bounds.extend({ lat, lng });
          return marker;
        });

        if (listings.length > 1) {
          map.fitBounds(bounds, 72);
        } else {
          map.setZoom(14);
        }

        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(apiKey ? 'error' : 'missing-key');
        }
      });

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [apiKey, center?.lat, center?.lng, listings, property?.identifier]);

  const nearbyCards = nearby.slice(0, 6);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-600">Micro-market map</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground">Nearby properties around this listing</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Google Map centered on {property?.locality || property?.city}, with the current listing and nearby asking prices within {radiusKm} km.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          <Navigation className="h-4 w-4" />
          {nearby.length} nearby listings
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[420px] bg-muted">
          <div ref={mapRef} className="h-full min-h-[420px] w-full" />

          {status === 'missing-key' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center">
              <div className="max-w-sm rounded-3xl bg-white/95 p-6 shadow-xl">
                <MapPin className="mx-auto h-8 w-8 text-amber-600" />
                <p className="mt-3 text-lg font-semibold text-slate-900">Google Maps key missing</p>
                <p className="mt-2 text-sm text-slate-600">Set `VITE_GOOGLE_MAPS_API_KEY` to render the live map with property price pins.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center">
              <div className="max-w-sm rounded-3xl bg-white/95 p-6 shadow-xl">
                <MapPin className="mx-auto h-8 w-8 text-amber-600" />
                <p className="mt-3 text-lg font-semibold text-slate-900">Map could not load</p>
                <p className="mt-2 text-sm text-slate-600">The nearby property data is still available in the side panel below.</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-l border-border bg-background/70">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-foreground">Around this property</h3>
            <p className="mt-1 text-sm text-muted-foreground">Nearby listings are sorted by distance from the selected property.</p>
          </div>

          <div className="space-y-3 px-4 pb-4">
            {nearbyCards.length ? (
              nearbyCards.map((item) => (
                <Link
                  key={item._id || item.slug || item.propertyCode}
                  to={`/properties/${getPropertyIdentifier(item)}`}
                  className="block rounded-2xl border border-border bg-card px-4 py-4 transition hover:border-amber-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.building?.projectName || item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{[item.location?.locality, item.city].filter(Boolean).join(', ')}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {item.distanceKm} km
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatPrice(item.pricing?.expectedPrice, item.listingType)}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">{formatBhk(item)}</span>
                    <span className="rounded-full bg-muted px-2.5 py-1">{formatArea(item.area?.superBuiltupArea, item.area?.areaUnit)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                No nearby properties were found for this radius yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
