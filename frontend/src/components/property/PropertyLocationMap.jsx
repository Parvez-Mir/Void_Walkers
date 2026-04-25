import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, IndianRupee } from 'lucide-react';
import { formatArea, formatBhk, formatPrice, getPropertyIdentifier } from '../../utils/propertyFormat';

const LEAFLET_SCRIPT_ID = 'leaflet-script';
const LEAFLET_STYLE_ID = 'leaflet-style';
const LEAFLET_SCRIPT_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_STYLE_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function loadLeaflet() {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  const existingScript = document.getElementById(LEAFLET_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.L), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Leaflet')), { once: true });
    });
  }

  if (!document.getElementById(LEAFLET_STYLE_ID)) {
    const style = document.createElement('link');
    style.id = LEAFLET_STYLE_ID;
    style.rel = 'stylesheet';
    style.href = LEAFLET_STYLE_SRC;
    document.head.appendChild(style);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = LEAFLET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.head.appendChild(script);
  });
}

const createPriceMarkerHtml = (label, isActive) =>
  `
    <div style="position:relative;display:inline-flex;align-items:center;justify-content:center;padding:0 14px;height:34px;border-radius:999px;background:${isActive ? '#b45309' : '#111827'};color:#ffffff;font:700 13px Arial,sans-serif;white-space:nowrap;box-shadow:0 10px 24px rgba(15,23,42,0.18);">
      ${label}
      <span style="position:absolute;left:50%;bottom:-8px;width:14px;height:14px;background:${isActive ? '#b45309' : '#111827'};transform:translateX(-50%) rotate(45deg);border-radius:2px;"></span>
    </div>
  `;

const createStaticMapLink = (lat, lng) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;

const createDirectionsLink = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export function PropertyLocationMap({ property, nearby = [], radiusKm = 5 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [status, setStatus] = useState('loading');
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

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: 13,
          scrollWheelZoom: false,
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const bounds = L.latLngBounds([]);

        markers = listings.map((item) => {
          const lat = Number(item?.coordinates?.lat ?? item?.location?.coordinates?.coordinates?.[1]);
          const lng = Number(item?.coordinates?.lng ?? item?.location?.coordinates?.coordinates?.[0]);
          const priceLabel = formatPrice(item?.pricing?.expectedPrice, item?.listingType).replace(/^Rs\s/, '');
          const marker = L.marker([lat, lng], {
            title: item?.title || item?.header?.name || 'Property',
            icon: L.divIcon({
              html: createPriceMarkerHtml(priceLabel, Boolean(item?.isSubject)),
              className: 'property-price-marker',
              iconSize: [132, 48],
              iconAnchor: [66, 42],
              popupAnchor: [0, -34],
            }),
          }).addTo(map);

          const identifier = item?.isSubject ? property?.identifier : getPropertyIdentifier(item);
          const address = item?.header?.fullAddress || [item?.location?.locality, item?.city].filter(Boolean).join(', ');
          const popupHtml = `
            <div style="min-width:220px;padding:4px 2px 2px;font-family:Arial,sans-serif">
              <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:4px;">${item?.building?.projectName || item?.header?.name || item?.title || 'Property'}</div>
              <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">${address || 'Ahmedabad'}</div>
              <div style="font-size:13px;font-weight:700;color:#b45309;margin-bottom:6px;">${priceLabel}</div>
              ${identifier ? `<a href="/properties/${identifier}" style="font-size:12px;font-weight:600;color:#1d4ed8;text-decoration:none;">Open details</a>` : ''}
            </div>
          `;
          marker.bindPopup(popupHtml, {
            closeButton: false,
            offset: [0, -24],
          });

          bounds.extend([lat, lng]);
          return marker;
        });

        if (listings.length > 1) {
          map.fitBounds(bounds, { padding: [48, 48] });
        } else {
          map.setView([center.lat, center.lng], 14);
        }

        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center?.lat, center?.lng, listings, property?.identifier]);

  const nearbyCards = nearby.slice(0, 6);

  return (
    <section className="property-location-map overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-600">Micro-market map</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground">Nearby properties around this listing</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Leaflet map centered on {property?.locality || property?.city}, with the current listing and nearby asking prices within {radiusKm} km.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          <Navigation className="h-4 w-4" />
          {nearby.length} nearby listings
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative z-0 min-h-[420px] overflow-hidden bg-muted">
          <div ref={mapRef} className="h-full min-h-[420px] w-full" />

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
            {center?.lat && center?.lng && (
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={createStaticMapLink(center.lat, center.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-amber-50 hover:text-amber-700"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open in OSM
                </a>
                <a
                  href={createDirectionsLink(center.lat, center.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-amber-50 hover:text-amber-700"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Directions
                </a>
              </div>
            )}
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
