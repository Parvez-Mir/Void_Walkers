// Adapts a backend property document into the shape expected by the
// /components/property/* design components. Single source of truth for the
// detail page so components stay dumb and presentational.

import { formatPrice, getPropertyGallery, getAmenityLabels } from './propertyFormat';

const formatINR = (n) => {
  if (!Number.isFinite(Number(n))) return '—';
  return `₹${Number(n).toLocaleString('en-IN')}`;
};

const formatPriceCompact = (n) => {
  if (!Number.isFinite(Number(n))) return '—';
  const v = Number(n);
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(v % 1e7 ? 2 : 0)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(v % 1e5 ? 2 : 0)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

const formatDistance = (km) => {
  if (!Number.isFinite(Number(km))) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
};

const formatMonth = (ym) => {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[Number(m) - 1] || m} ${String(y).slice(2)}`;
};

const titleCase = (s = '') =>
  String(s)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

// Convert AQI value (US-EPA scale) to a label
const aqiLabel = (v) => {
  if (!Number.isFinite(Number(v))) return 'Unknown';
  if (v <= 50) return 'Good';
  if (v <= 100) return 'Moderate';
  if (v <= 150) return 'Unhealthy for Sensitive';
  if (v <= 200) return 'Unhealthy';
  return 'Hazardous';
};

// Map RERA status from backend → display string
const reraStatusLabel = (status) => {
  if (status === 'registered') return 'Verified';
  if (status === 'pending') return 'Pending';
  if (status === 'expired') return 'Expired';
  return 'Not Verified';
};

// Map verdict from backend → recommendation label
const verdictLabel = (verdict) => {
  switch (verdict) {
    case 'buy':
      return 'Strong Buy';
    case 'hold':
      return 'Hold';
    case 'avoid':
      return 'Avoid';
    default:
      return 'Awaiting Analysis';
  }
};

const riskLabel = (level) => {
  if (!level) return 'Unknown';
  return level[0].toUpperCase() + level.slice(1);
};

// Heuristic monthly EMI estimate at 8.5% / 20 yrs / 80% LTV
const estimateEmi = (price) => {
  if (!Number.isFinite(Number(price))) return '—';
  const principal = Number(price) * 0.8;
  const rate = 0.085 / 12;
  const months = 240;
  const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  return `~${formatPriceCompact(Math.round(emi))}/mo`;
};

export function adaptPropertyForDetail(p) {
  if (!p) return null;

  const gallery = getPropertyGallery(p);
  const amenities = getAmenityLabels(p.amenities);
  const fullAddress = [
    p.location?.addressLine1,
    p.location?.locality,
    p.location?.subLocality,
    p.city || p.location?.city,
    p.location?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  // ---- Trust score (1-100; backend already in that range for luxury seed) ----
  const ts = p.trustScore || {};
  const safety = Number(ts.safety?.score);
  const infrastructure = Number(ts.infrastructure?.score);
  const environment = Number(ts.environment?.score);
  const investment = Number(ts.investment?.score);
  const aggregate = Number(ts.aggregate);
  // Fallback: legacy `scores.*` are 0-10 → multiply by 10
  const scoresLegacy = p.scores || {};
  const fallbackInvestment = Number(scoresLegacy.investmentScore) * 10;
  const fallbackSafety = (Number(scoresLegacy.livabilityScore) || 7) * 10;
  const fallbackInfra = (Number(scoresLegacy.connectivityScore) || 7) * 10;
  const fallbackEnv = (Number(scoresLegacy.walkScore) || 7) * 10;

  const trustScores = {
    overall: Number.isFinite(aggregate) ? Math.round(aggregate) : 72,
    safety: Number.isFinite(safety) ? Math.round(safety) : Math.round(fallbackSafety || 72),
    infrastructure: Number.isFinite(infrastructure) ? Math.round(infrastructure) : Math.round(fallbackInfra || 72),
    environment: Number.isFinite(environment) ? Math.round(environment) : Math.round(fallbackEnv || 72),
    investment: Number.isFinite(investment) ? Math.round(investment) : Math.round(fallbackInvestment || 72),
  };

  // ---- Neighborhood: prefer new nearbyPlaces, fall back to existing nearby.* ----
  const places = Array.isArray(p.nearbyPlaces) ? p.nearbyPlaces : [];
  const placesByType = (type) =>
    places
      .filter((pl) => pl.type === type)
      .map((pl) => ({
        name: pl.name,
        distance: formatDistance(pl.distance),
        rating: 4.3 + (((pl.name?.length || 0) % 7) / 10), // deterministic mock rating 4.3-4.9
        type: titleCase(pl.type),
      }));

  // Fallback to legacy nearby.* if nearbyPlaces is empty
  const legacyToPlace = (arr = [], type) =>
    arr.map((entry) => ({
      name: entry?.name,
      distance: formatDistance(entry?.distanceKm),
      rating: 4.3 + (((entry?.name?.length || 0) % 7) / 10),
      type: titleCase(type),
    }));

  const schools = placesByType('school').length
    ? placesByType('school').slice(0, 4)
    : legacyToPlace(p.nearby?.schools, 'school').slice(0, 4);
  const hospitals = placesByType('hospital').length
    ? placesByType('hospital').slice(0, 4)
    : legacyToPlace(p.nearby?.hospitals, 'hospital').slice(0, 4);
  const transportPlaces = (placesByType('metro').length
    ? placesByType('metro')
    : legacyToPlace(p.nearby?.metro, 'metro')
  )
    .map((entry) => ({ ...entry, type: 'Metro' }))
    .slice(0, 4);

  const aqi = p.neighborhood?.aqi?.value ?? ts.environment?.factors?.aqi ?? 95;
  const safetyIndicator = trustScores.safety;

  const neighborhood = {
    schools,
    hospitals,
    transport: transportPlaces,
    safetyScore: safetyIndicator,
    aqi: Math.round(aqi),
    aqiLabel: aqiLabel(aqi),
  };

  // ---- Price intelligence ----
  const history = Array.isArray(p.priceIntelligence?.history) ? p.priceIntelligence.history : [];
  const priceHistory = history.length
    ? history.map((h) => ({
        month: formatMonth(h.month),
        price: Math.round(Number(h.perSqft) || 0),
      }))
    : [];

  const comparables = Array.isArray(p.priceIntelligence?.comparables)
    ? p.priceIntelligence.comparables.map((c) => {
        const diffPct = p.pricing?.pricePerSqft
          ? ((Number(c.perSqft) - Number(p.pricing.pricePerSqft)) / Number(p.pricing.pricePerSqft)) * 100
          : 0;
        const sign = diffPct >= 0 ? '+' : '';
        return {
          name: c.title,
          location: '', // optional; comparables don't carry their locality on backend
          price: `₹${Number(c.perSqft).toLocaleString('en-IN')}/sqft`,
          diff: `${sign}${diffPct.toFixed(1)}%`,
        };
      })
    : [];

  // YoY change derived from history (first vs last)
  let yoyChange = null;
  if (priceHistory.length >= 2) {
    const first = priceHistory[0].price;
    const last = priceHistory[priceHistory.length - 1].price;
    if (first > 0) yoyChange = ((last - first) / first) * 100;
  }

  // ---- Future growth ----
  const upcoming = Array.isArray(p.futureGrowth?.upcomingProjects)
    ? p.futureGrowth.upcomingProjects
    : [];
  const metroProject = upcoming.find((u) => u.type === 'metro') || upcoming[0] || null;
  const futureGrowth = {
    metro: metroProject
      ? {
          name: metroProject.name,
          distance: formatDistance(Number(metroProject.distanceM) / 1000),
          completion: metroProject.expectedCompletion
            ? new Date(metroProject.expectedCompletion).getFullYear().toString()
            : 'TBD',
        }
      : null,
    infrastructure: upcoming.map((u) => ({
      name: u.name,
      status:
        u.status === 'completed'
          ? 'Completed'
          : u.status === 'under-construction'
          ? 'In Progress'
          : u.status === 'approved'
          ? 'Approved'
          : 'Planned',
      impact: u.impact === 'high' ? 'Very High' : u.impact === 'medium' ? 'High' : 'Medium',
    })),
  };

  // ---- Documents ----
  const reraStatus = reraStatusLabel(p.documents?.rera?.status);
  const reraExpiry = p.documents?.rera?.verifiedAt
    ? `${new Date(p.documents.rera.verifiedAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
    : 'TBD';

  const docItems = Array.isArray(p.documents?.items) ? p.documents.items : [];
  const docTypeLabel = {
    'title-deed': 'Title Deed',
    'approval-plan': 'Plan Sanction',
    'occupancy-cert': 'Occupancy Certificate',
    encumbrance: 'Encumbrance Certificate',
    khata: 'Khata Certificate',
    patta: 'Patta',
    noc: 'NOC',
  };

  const documents = {
    reraStatus,
    reraExpiry,
    approvals: Array.isArray(p.legal?.approvedBy) ? p.legal.approvedBy : [],
    available: docItems.length
      ? docItems.map((it) => docTypeLabel[it.type] || it.label || titleCase(it.type || 'Document'))
      : ['Sale Deed Draft', 'Floor Plan', 'Brochure', 'Price List'],
  };

  // ---- AI insights ----
  const ai = p.aiInsights || {};
  const recommendation = verdictLabel(ai.investmentRecommendation?.verdict);
  const confidenceScore = Number.isFinite(Number(ai.investmentRecommendation?.confidence))
    ? Math.round(Number(ai.investmentRecommendation.confidence) * 100)
    : 75;
  const rentalEstimate = ai.rentalPotential?.monthlyEstimateInr;
  const rentalPotential = rentalEstimate
    ? `${formatPriceCompact(Math.round(rentalEstimate * 0.9))} – ${formatPriceCompact(
        Math.round(rentalEstimate * 1.1),
      )}/month`
    : '—';
  const expectedROI = ai.rentalPotential?.yieldPercent
    ? `${ai.rentalPotential.yieldPercent}% rental yield`
    : trustScores.investment >= 80
    ? '12–15% over 3 years'
    : '8–12% over 3 years';

  const highlights = Array.isArray(p.highlights) && p.highlights.length
    ? p.highlights.map(titleCase).slice(0, 5)
    : ['Verified developer', 'Active infrastructure catalysts', 'High rental demand', 'Clear legal chain'];

  const aiInsights = {
    recommendation,
    confidenceScore,
    riskLevel: riskLabel(ai.riskAssessment?.level),
    rentalPotential,
    expectedROI,
    highlights,
    concerns:
      Array.isArray(ai.riskAssessment?.flags) && ai.riskAssessment.flags.length
        ? ai.riskAssessment.flags
        : ['Standard luxury-segment liquidity considerations'],
    summary: ai.summary || '',
  };

  // ---- Header / details composite ----
  const sqft = p.area?.superBuiltupArea ?? p.area?.builtupArea ?? p.area?.carpetArea;
  const builderName =
    p.developer?.brandName ||
    p.developer?.legalName ||
    p.seller?.contactName ||
    p.building?.projectName ||
    'Listed builder';

  const ageLabel =
    p.building?.constructionStatus === 'ready-to-move'
      ? 'Ready to move'
      : p.building?.constructionStatus === 'under-construction'
      ? 'Under Construction'
      : p.building?.constructionStatus === 'new-launch'
      ? 'New Launch'
      : p.building?.constructionStatus === 'resale'
      ? 'Resale'
      : 'Available';

  const possessionLabel = p.availability?.possessionStatus
    ? titleCase(p.availability.possessionStatus)
    : ageLabel === 'Ready to move'
    ? 'Immediate'
    : 'TBD';

  const facingLabel = p.layout?.facing ? titleCase(p.layout.facing) : 'NA';

  const headerProperty = {
    name: p.building?.projectName || p.title,
    location: [p.location?.locality, p.city || p.location?.city].filter(Boolean).join(', '),
    fullAddress: fullAddress || p.location?.locality || 'Address on request',
    bhk:
      p.propertyType === 'plot'
        ? 'Plot'
        : Number(p.configuration?.bhk) > 0
        ? `${p.configuration.bhk} BHK`
        : 'Studio',
    price: formatPrice(p.pricing?.expectedPrice, p.listingType),
    pricePerSqft: p.pricing?.pricePerSqft ? formatINR(p.pricing.pricePerSqft) : '—',
    sqft: sqft ? Number(sqft).toLocaleString('en-IN') : '—',
    floor: p.building?.floorNumber != null && p.building?.totalFloors
      ? `${p.building.floorNumber} of ${p.building.totalFloors}`
      : 'NA',
    facing: facingLabel,
    age: ageLabel,
    possession: possessionLabel,
    verified:
      p.documents?.rera?.status === 'registered' ||
      Boolean(p.developer?.verified) ||
      Boolean(p.legal?.reraId),
    reraId: p.legal?.reraId || p.documents?.rera?.number || 'RERA ID not listed',
    builder: builderName,
    projectName: p.building?.projectName || 'NA',
    emi: estimateEmi(p.pricing?.expectedPrice),
  };

  return {
    id: p.slug || p.propertyCode || p._id,
    title: p.title,
    listingType: p.listingType,
    propertyType: p.propertyType,
    identifier: p.slug || p.propertyCode || p._id,
    coordinates: {
      lng: Array.isArray(p.location?.coordinates?.coordinates) ? p.location.coordinates.coordinates[0] : null,
      lat: Array.isArray(p.location?.coordinates?.coordinates) ? p.location.coordinates.coordinates[1] : null,
    },
    locality: p.location?.locality || '',
    city: p.city || p.location?.city || 'Ahmedabad',
    images: gallery,
    header: headerProperty,
    trust: trustScores,
    neighborhood,
    priceIntelligence: {
      priceHistory,
      comparables,
      currentPrice: headerProperty.pricePerSqft,
      yoyChange,
    },
    futureGrowth,
    documents,
    documentsReraId: headerProperty.reraId,
    aiInsights,
    sidebar: {
      builder: builderName,
      amenities,
      projectName: headerProperty.projectName,
      possession: headerProperty.possession,
      age: headerProperty.age,
    },
  };
}
