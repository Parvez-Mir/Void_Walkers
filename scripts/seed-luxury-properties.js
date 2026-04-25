/**
 * Seeds 200 high-end luxury property listings in/around Ahmedabad.
 *
 * - Idempotent: upserts by `propertyCode` (PROP-AHD-LUX-0001…0200), so
 *   re-running won't duplicate. Existing PROP-AHD-* docs (the 1000-doc
 *   seed) are NOT touched.
 * - Schema-compatible with backend/src/models/property.model.js:
 *   uses listingType "sale", propertyType from existing enum, sellerType
 *   "builder" (no "developer" enum value, so we use the closest match),
 *   and populates all additive feature blocks (trustScore, aiInsights,
 *   futureGrowth, priceIntelligence, developer, documents, nearbyPlaces)
 *   with luxury-appropriate values.
 * - Uses native MongoDB driver (Mongoose pre-validate hook is bypassed),
 *   so this script computes slug/searchText/tokens/normalizedLocalities
 *   inline.
 *
 * Flags:
 *   --count=200    (default 200)
 *   --apply        (without this, runs as dry-run printing one sample)
 *
 * Run from any directory with `mongodb` installed:
 *   NODE_PATH=/tmp/voidwalkers-mongo-test/node_modules \
 *     node /path/to/Void_Walkers/scripts/seed-luxury-properties.js --apply
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// --- env loader ---
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const APPLY = process.argv.includes('--apply');
const countArg = process.argv.find((a) => a.startsWith('--count='));
const COUNT = countArg ? Number(countArg.split('=')[1]) : 200;

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'void_walkers';
if (!URI) {
  console.error('MONGODB_URI not set (expected in ../.env.local)');
  process.exit(1);
}

// === Reference data (premium Ahmedabad) ===

const LUXURY_LOCALITIES = [
  { locality: 'Ambli',          microMarket: 'West Ahmedabad',       pincode: '380058', coordinates: [72.5006, 23.0301], nearby: ['Bopal', 'Bodakdev', 'Thaltej', 'Ambli Bopal Road'], saleRange: [25_000_000, 95_000_000] },
  { locality: 'Bodakdev',       microMarket: 'North West Ahmedabad', pincode: '380054', coordinates: [72.5072, 23.0375], nearby: ['Satellite', 'Prahlad Nagar', 'Vastrapur', 'Thaltej'], saleRange: [22_000_000, 90_000_000] },
  { locality: 'Thaltej',        microMarket: 'North West Ahmedabad', pincode: '380059', coordinates: [72.4994, 23.0498], nearby: ['Bodakdev', 'Science City', 'SG Highway', 'Gota'], saleRange: [20_000_000, 85_000_000] },
  { locality: 'Prahlad Nagar',  microMarket: 'West Ahmedabad',       pincode: '380015', coordinates: [72.5101, 23.0124], nearby: ['Satellite', 'Makarba', 'SG Highway', 'Bodakdev'], saleRange: [22_000_000, 80_000_000] },
  { locality: 'SG Highway',     microMarket: 'Growth Corridor',      pincode: '380054', coordinates: [72.5016, 23.0472], nearby: ['Bodakdev', 'Thaltej', 'Makarba', 'Science City'], saleRange: [25_000_000, 110_000_000] },
  { locality: 'Vastrapur',      microMarket: 'West Ahmedabad',       pincode: '380015', coordinates: [72.5252, 23.0396], nearby: ['Bodakdev', 'Satellite', 'Memnagar', 'IIM Road'], saleRange: [18_000_000, 70_000_000] },
  { locality: 'Satellite',      microMarket: 'West Ahmedabad',       pincode: '380015', coordinates: [72.5238, 23.0137], nearby: ['Bodakdev', 'Jodhpur', 'Vastrapur', 'Prahlad Nagar'], saleRange: [18_000_000, 65_000_000] },
  { locality: 'Jodhpur',        microMarket: 'West Ahmedabad',       pincode: '380015', coordinates: [72.5147, 23.0195], nearby: ['Satellite', 'Vastrapur', 'Shyamal', 'Prahlad Nagar'], saleRange: [16_000_000, 55_000_000] },
  { locality: 'Shilaj',         microMarket: 'West Ahmedabad',       pincode: '380059', coordinates: [72.4881, 23.0561], nearby: ['Thaltej', 'Bodakdev', 'Shilaj Circle', 'Sindhu Bhavan Road'], saleRange: [22_000_000, 95_000_000] },
  { locality: 'Sindhu Bhavan',  microMarket: 'West Ahmedabad',       pincode: '380054', coordinates: [72.5036, 23.0406], nearby: ['Bodakdev', 'Thaltej', 'Shilaj', 'SG Highway'], saleRange: [28_000_000, 120_000_000] }
];

const LUXURY_DEVELOPERS = [
  { brandName: 'Adani Realty',        legalName: 'Adani Realty India Ltd',         projectsDelivered: 38,  onTimeRate: 0.94, avgRating: 4.6, established: 2010 },
  { brandName: 'Goyal & Co',          legalName: 'Goyal & Co Construction Pvt Ltd', projectsDelivered: 65,  onTimeRate: 0.91, avgRating: 4.5, established: 1971 },
  { brandName: 'Sun Builders',        legalName: 'Sun Builders Group',              projectsDelivered: 78,  onTimeRate: 0.93, avgRating: 4.6, established: 1981 },
  { brandName: 'Shivalik Projects',   legalName: 'Shivalik Real Estate Pvt Ltd',    projectsDelivered: 42,  onTimeRate: 0.89, avgRating: 4.4, established: 1998 },
  { brandName: 'Savvy Group',         legalName: 'Savvy Infrastructure Pvt Ltd',    projectsDelivered: 26,  onTimeRate: 0.95, avgRating: 4.7, established: 2003 },
  { brandName: 'Vraj Group',          legalName: 'Vraj Builders & Developers',      projectsDelivered: 31,  onTimeRate: 0.90, avgRating: 4.5, established: 1995 },
  { brandName: 'Arvind SmartSpaces',  legalName: 'Arvind SmartSpaces Ltd',          projectsDelivered: 22,  onTimeRate: 0.96, avgRating: 4.7, established: 2008 },
  { brandName: 'Nila Spaces',         legalName: 'Nila Spaces Ltd',                 projectsDelivered: 18,  onTimeRate: 0.88, avgRating: 4.3, established: 2000 }
];

const LUXURY_PROJECT_PREFIXES = ['Adani', 'Goyal', 'Sun', 'Shivalik', 'Savvy', 'Vraj', 'Arvind', 'Nila', 'Royal', 'Imperial', 'Prestige', 'Iconic', 'Atlantis', 'Crescent', 'Aurum'];
const LUXURY_PROJECT_SUFFIXES = ['Shantigram', 'Vista', 'Highline', 'Riviera', 'Casa', 'Pinnacle', 'Skyline', 'Greens', 'Elite', 'Heritage', 'Imperial', 'Sanctuary', 'Boulevard', 'Estate', 'One'];

const LUXURY_IMAGES = [
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
  'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
  'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg',
  'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
  'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
  'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
  'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
  'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
  'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg'
];

const LUX_HIGHLIGHTS = [
  'private elevator', 'sky deck', 'concierge service', 'imported italian marble',
  'floor-to-ceiling glass', 'panoramic city view', 'smart home automation',
  'private terrace garden', 'home theatre room', 'walk-in wardrobes',
  'top-tier security', 'low density planning', 'gated community', 'club-grade amenities'
];

const LUX_INFRA_PROJECTS = [
  { name: 'Ahmedabad Metro Phase 2 (West Corridor)', type: 'metro', status: 'under-construction', expectedCompletion: '2027-12-31' },
  { name: 'SG Highway Elevated Corridor',            type: 'road',  status: 'approved',            expectedCompletion: '2028-06-30' },
  { name: 'GIFT City Connector',                     type: 'road',  status: 'under-construction', expectedCompletion: '2027-03-31' },
  { name: 'Sardar Patel International Terminal 3',   type: 'airport', status: 'planned',          expectedCompletion: '2029-12-31' },
  { name: 'Shilaj-Sindhu Bhavan Underpass',          type: 'road',  status: 'approved',            expectedCompletion: '2027-09-30' }
];

const LUX_NEAR_SCHOOLS    = ['Riverside School', 'Anand Niketan Satellite', 'Delhi Public School Bopal', 'Eklavya School', 'Calorx Olive International', 'The Riverside International'];
const LUX_NEAR_HOSPITALS  = ['Apollo Hospitals', 'Shalby Hospital', 'CIMS Hospital', 'Sterling Hospital', 'KD Hospital', 'Marengo CIMS'];
const LUX_NEAR_METRO      = ['Thaltej Metro', 'Doordarshan Kendra Metro', 'Gurukul Road Metro', 'Sabarmati River Metro', 'Old High Court Metro'];
const LUX_NEAR_MALLS      = ['Palladium Ahmedabad', 'Iscon Mega Mall', 'Acropolis Mall', 'Alpha One Mall', 'AlphaOne Vastrapur'];
const LUX_NEAR_PARKS      = ['Sardar Patel National Park', 'Vastrapur Lake', 'Riverfront Park', 'Indroda Nature Park'];
const LUX_NEAR_GYMS       = ['Gold\'s Gym Bodakdev', 'Talwalkars HiFi Gym', 'Snap Fitness SG Road'];
const LUX_NEAR_RESTAURANTS = ['Agashiye', 'Tomato\'s', 'Palki', 'Marwadi Bhojanalay', 'Cafe Upper Crust'];

// === seeded RNG + helpers ===
const hashString = (v) => { let h = 0; for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) >>> 0; return h; };
const createRandom = (seed) => { let c = hashString(seed) || 1; return () => { c = (c * 1664525 + 1013904223) % 4294967296; return c / 4294967296; }; };
const pick = (rng, list) => list[Math.floor(rng() * list.length)];
const pickMany = (rng, list, n) => { const c = [...list], out = []; while (c.length && out.length < n) out.push(c.splice(Math.floor(rng() * c.length), 1)[0]); return out; };
const range = (rng, min, max) => Math.round(min + rng() * (max - min));
const chance = (rng, t) => rng() < t;
const round1 = (n) => Number(n.toFixed(1));

const slugify = (s = '') => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const normalizeToken = (s = '') => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const buildSearchArtifacts = (p) => {
  const candidates = [
    p.title, p.slug, p.description, p.building?.projectName,
    p.location?.locality, p.location?.microMarket, p.location?.subLocality, p.location?.landmark,
    p.configuration?.bhk ? `${p.configuration.bhk} bhk` : '',
    p.propertyType, p.listingType,
    ...(p.highlights || []), ...(p.tags || []),
    ...(p.nearby?.localities || [])
  ];
  const normalized = normalizeToken(candidates.filter(Boolean).join(' '));
  const tokens = [...new Set(normalized.split(' ').filter(Boolean))];
  const normalizedLocalities = [...new Set([
    p.location?.locality, p.location?.microMarket, p.location?.subLocality,
    ...(p.nearby?.localities || [])
  ].filter(Boolean).map(normalizeToken))];
  return { searchText: normalized, tokens, normalizedLocalities };
};

// === luxury property generator ===
function generateLuxuryProperty(index) {
  const rng = createRandom(`void-walkers-luxury-${index}`);
  const locality = LUXURY_LOCALITIES[index % LUXURY_LOCALITIES.length];
  const dev = LUXURY_DEVELOPERS[index % LUXURY_DEVELOPERS.length];

  // luxury skews to villa/penthouse/premium-apartment
  const propertyType = pick(rng, ['villa', 'villa', 'penthouse', 'penthouse', 'apartment', 'apartment', 'builder-floor']);
  const bhk = propertyType === 'villa'    ? range(rng, 4, 6)
            : propertyType === 'penthouse' ? range(rng, 3, 5)
            : propertyType === 'apartment' ? range(rng, 3, 4)
            : range(rng, 3, 5); // builder-floor

  const superBuiltupArea =
    propertyType === 'villa'      ? range(rng, 3500, 7500) :
    propertyType === 'penthouse'  ? range(rng, 3000, 6500) :
    propertyType === 'apartment'  ? range(rng, 1900, 3400) :
                                    range(rng, 2400, 5200);
  const builtupArea = Math.round(superBuiltupArea * (0.88 + rng() * 0.06));
  const carpetArea  = Math.round(superBuiltupArea * (0.70 + rng() * 0.06));

  const [minSale, maxSale] = locality.saleRange;
  let expectedPrice = range(rng, minSale, maxSale);
  const typeMult = { villa: 1.4, penthouse: 1.55, apartment: 1.0, 'builder-floor': 1.15 };
  expectedPrice = Math.round(expectedPrice * (typeMult[propertyType] || 1));
  // floor by ₹/sqft (luxury): ₹15k–₹35k per sqft
  const minBySqft = superBuiltupArea * range(rng, 15_000, 35_000);
  expectedPrice = Math.max(expectedPrice, minBySqft);
  const pricePerSqft = Math.round(expectedPrice / superBuiltupArea);

  const projectName = `${pick(rng, LUXURY_PROJECT_PREFIXES)} ${pick(rng, LUXURY_PROJECT_SUFFIXES)}`;
  const propertyCode = `PROP-AHD-LUX-${String(index + 1).padStart(4, '0')}`;
  const _id = `lux-ahd-${String(index + 1).padStart(4, '0')}-${propertyCode.toLowerCase()}`;

  const galleryUrls = pickMany(rng, LUXURY_IMAGES, 6);
  const gallery = galleryUrls.map((url, i) => ({
    url,
    label: i === 0 ? 'Front elevation' : `Gallery view ${i + 1}`,
    isPrimary: i === 0
  }));

  const lat = locality.coordinates[1] + (rng() - 0.5) * 0.02;
  const lng = locality.coordinates[0] + (rng() - 0.5) * 0.02;
  const coordinates = [Number(lng.toFixed(6)), Number(lat.toFixed(6))];

  const totalFloors = propertyType === 'villa'        ? range(rng, 2, 4)
                    : propertyType === 'builder-floor' ? range(rng, 4, 7)
                    : range(rng, 18, 38); // luxury high-rise
  const floorNumber = propertyType === 'villa' ? 0 : range(rng, Math.floor(totalFloors / 2), totalFloors);

  const constructionStatus = pick(rng, ['ready-to-move', 'ready-to-move', 'under-construction', 'new-launch']);
  const intent = 'for sale';
  const bhkLabel = `${bhk} BHK`;
  const typeLabel = propertyType === 'builder-floor' ? 'Builder Floor'
                  : propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
  const title = `${bhkLabel} ${typeLabel} in ${projectName}, ${locality.locality} ${intent}`;

  const slug = `${slugify(title)}-${propertyCode.toLowerCase()}`;

  const highlights = pickMany(rng, LUX_HIGHLIGHTS, 5);

  // Luxury amenities — mostly TRUE
  const amenities = {
    lift: propertyType !== 'villa',
    parking: propertyType === 'villa' ? range(rng, 3, 5) : range(rng, 2, 3),
    visitorParking: true,
    powerBackup: true,
    waterSupply: '24x7 borewell',
    security: true,
    gym: chance(rng, 0.92),
    clubHouse: chance(rng, 0.95),
    pool: chance(rng, 0.9),
    garden: true,
    childrenPlayArea: true,
    gasPipeline: chance(rng, 0.85),
    internetReady: true,
    petFriendly: chance(rng, 0.7)
  };
  const activeAmenities = Object.keys(amenities).filter((k) => k !== 'parking' && k !== 'waterSupply' && amenities[k] === true);

  // === additive blocks (populated for luxury) ===

  // Trust score: luxury → high but varied
  const trust = {
    safety: range(rng, 82, 96),
    infrastructure: range(rng, 78, 94),
    environment: range(rng, 72, 90),
    investment: range(rng, 80, 95)
  };
  const trustAggregate = Math.round((trust.safety + trust.infrastructure + trust.environment + trust.investment) / 4);

  // Future growth: 1-2 nearby infra projects
  const upcomingProjects = pickMany(rng, LUX_INFRA_PROJECTS, range(rng, 1, 2)).map((p) => ({
    name: p.name,
    type: p.type,
    status: p.status,
    expectedCompletion: new Date(p.expectedCompletion),
    distanceM: range(rng, 600, 4500),
    impact: chance(rng, 0.5) ? 'high' : 'medium'
  }));
  const futureGrowthScore = Math.min(95, 65 + upcomingProjects.length * 8 + (upcomingProjects.some((p) => p.impact === 'high') ? 10 : 0));

  // Price intelligence: 12-month history showing 8-15% appreciation
  const apprPct = 0.08 + rng() * 0.07;
  const startSqft = Math.round(pricePerSqft / (1 + apprPct));
  const history = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000);
    const ym = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    const factor = 1 + (apprPct * (i / 11));
    return { month: ym, perSqft: Math.round(startSqft * factor) };
  });
  const areaAvgPerSqft = Math.round(pricePerSqft * (0.92 + rng() * 0.08));

  // AI insights (mock pre-generated)
  const verdict = trustAggregate >= 88 ? 'buy' : trustAggregate >= 80 ? 'hold' : 'avoid';
  const verdictReasoning = {
    buy: `Strong fundamentals across the board (Trust ${trustAggregate}/100). Premium location with active infra catalysts and a verified developer with ${dev.projectsDelivered}+ deliveries. Suitable for NRI long-hold capital appreciation.`,
    hold: `Solid asset (Trust ${trustAggregate}/100) but premium pricing implies limited near-term upside. Worth watching for entry on possession or a softer market.`,
    avoid: `Numbers don't justify the asking price at this stage of the cycle. Better-yielding alternatives exist within 2km.`
  };
  const monthlyRent = Math.round((expectedPrice * 0.026) / 12); // ~2.6% gross yield
  const aiInsights = {
    summary: `${title}. ${dev.brandName}-developed ${propertyType} in ${locality.locality} (${locality.microMarket}). Verified RERA + on-time delivery track record. Trust score ${trustAggregate}/100.`,
    investmentRecommendation: {
      verdict,
      confidence: round1(0.7 + rng() * 0.25),
      reasoning: verdictReasoning[verdict]
    },
    riskAssessment: {
      level: trustAggregate >= 88 ? 'low' : 'medium',
      flags: constructionStatus === 'under-construction'
        ? ['Possession 12-18 months out — track construction milestones', 'Verify approval status quarterly']
        : ['Premium-segment liquidity — exit may take 6-9 months in soft market'],
      reasoning: 'Standard luxury-segment risks; verified developer KYC reduces counterparty exposure.'
    },
    rentalPotential: {
      monthlyEstimateInr: monthlyRent,
      yieldPercent: round1((monthlyRent * 12 * 100) / expectedPrice),
      tenantDemand: 'high',
      typicalTenantProfile: 'Senior IT professionals, expats from GIFT City, NRI returnee families'
    },
    generatedAt: new Date(),
    model: 'claude-sonnet-4-6'
  };

  // Developer snapshot
  const developer = {
    legalName: dev.legalName,
    brandName: dev.brandName,
    verified: true,
    badgeIssuedAt: new Date(Date.now() - range(rng, 30, 365) * 24 * 60 * 60 * 1000),
    trackRecord: {
      projectsDelivered: dev.projectsDelivered,
      onTimeRate: dev.onTimeRate,
      avgRating: dev.avgRating
    }
  };

  // Documents
  const reraId = `PR/GJ/AHM/${2022 + (index % 4)}/${String(20000 + index).padStart(5, '0')}`;
  const documents = {
    rera: {
      number: reraId,
      state: 'Gujarat',
      status: 'registered',
      verifiedAt: new Date(Date.now() - range(rng, 60, 720) * 24 * 60 * 60 * 1000),
      portalUrl: `https://gujrera.gujarat.gov.in/projectViewDetails?prjId=${encodeURIComponent(reraId)}`
    },
    items: [
      { type: 'title-deed',     label: 'Title Deed',          status: 'verified', url: `https://docs.voidwalkers.in/${propertyCode}/title.pdf` },
      { type: 'approval-plan',  label: 'Plan Sanction',       status: 'verified', url: `https://docs.voidwalkers.in/${propertyCode}/plan.pdf` },
      { type: 'encumbrance',    label: 'Encumbrance Certificate', status: 'verified', url: `https://docs.voidwalkers.in/${propertyCode}/ec.pdf` },
      { type: 'khata',          label: 'Khata Certificate',   status: 'verified', url: `https://docs.voidwalkers.in/${propertyCode}/khata.pdf` },
      ...(constructionStatus === 'ready-to-move' ? [{ type: 'occupancy-cert', label: 'Occupancy Certificate', status: 'verified', url: `https://docs.voidwalkers.in/${propertyCode}/oc.pdf` }] : [])
    ]
  };

  // nearbyPlaces — populated with new-format places
  const buildPlaces = (type, pool, n) =>
    pickMany(rng, pool, n).map((name) => {
      const distance = round1(0.4 + rng() * 4.6);
      return { type, name, distance, travelTime: { car: Math.max(1, Math.round(distance * 2.5)) } };
    });
  const nearbyPlaces = [
    ...buildPlaces('school',     LUX_NEAR_SCHOOLS, 2),
    ...buildPlaces('hospital',   LUX_NEAR_HOSPITALS, 2),
    ...buildPlaces('metro',      LUX_NEAR_METRO, 2),
    ...buildPlaces('mall',       LUX_NEAR_MALLS, 2),
    ...buildPlaces('park',       LUX_NEAR_PARKS, 1),
    ...buildPlaces('gym',        LUX_NEAR_GYMS, 1),
    ...buildPlaces('restaurant', LUX_NEAR_RESTAURANTS, 1)
  ];

  // existing-style nearby block (so the existing "nearby" UI also has data)
  const nearby = {
    localities: locality.nearby,
    schools:   nearbyPlaces.filter((p) => p.type === 'school').map((p) => ({ name: p.name, distanceKm: p.distance })),
    hospitals: nearbyPlaces.filter((p) => p.type === 'hospital').map((p) => ({ name: p.name, distanceKm: p.distance })),
    metro:     nearbyPlaces.filter((p) => p.type === 'metro').map((p) => ({ name: p.name, distanceKm: p.distance })),
    malls:     nearbyPlaces.filter((p) => p.type === 'mall').map((p) => ({ name: p.name, distanceKm: p.distance }))
  };

  const property = {
    _id,
    title,
    slug,
    propertyCode,
    listingType: 'sale',
    propertyType,
    category: 'residential',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    location: {
      locality: locality.locality,
      microMarket: locality.microMarket,
      subLocality: chance(rng, 0.5) ? pick(rng, locality.nearby) : `${locality.locality} Boulevard`,
      addressLine1: `${range(rng, 1, 99)}, ${pick(rng, ['Sindhu Bhavan Road', 'Corporate Road', 'Iscon Avenue', 'Riverfront Drive', 'Boulevard Road'])}`,
      landmark: pick(rng, ['near Iscon Cross Road', 'overlooking Sabarmati', 'next to GIFT corridor', 'walking distance from premium club']),
      pincode: locality.pincode,
      coordinates: { type: 'Point', coordinates }
    },
    pricing: {
      expectedPrice,
      pricePerSqft,
      securityDeposit: 0,
      maintenance: range(rng, 8000, 25000),
      brokerage: 0, // luxury — no brokers per platform rule
      negotiable: chance(rng, 0.4),
      taxesIncluded: false
    },
    configuration: {
      bhk,
      bedrooms: bhk,
      bathrooms: bhk + (chance(rng, 0.6) ? 1 : 0),
      balconies: range(rng, 2, 4),
      storeRooms: 1,
      servantRoom: chance(rng, 0.7),
      studyRoom: chance(rng, 0.65),
      poojaRoom: chance(rng, 0.6)
    },
    area: {
      superBuiltupArea,
      builtupArea,
      carpetArea,
      plotArea: propertyType === 'villa' ? superBuiltupArea : undefined,
      areaUnit: 'sqft'
    },
    building: {
      projectName,
      tower: propertyType === 'villa' ? 'NA' : `Tower ${pick(rng, ['A', 'B', 'C', 'Skyline', 'Crest'])}`,
      floorNumber,
      totalFloors,
      totalUnits: range(rng, 60, 220),
      totalTowers: propertyType === 'villa' ? range(rng, 1, 2) : range(rng, 2, 5),
      propertyAge: constructionStatus === 'new-launch' ? 0 : range(rng, 0, 4),
      constructionStatus
    },
    layout: {
      facing: pick(rng, ['east', 'north-east', 'north', 'west']),
      cornerProperty: chance(rng, 0.45),
      roadWidth: range(rng, 40, 100),
      openSides: range(rng, 2, 4),
      overlooking: pickMany(rng, ['city skyline', 'garden', 'clubhouse', 'pool', 'main road'], 2)
    },
    furnishing: {
      status: pick(rng, ['semi-furnished', 'fully-furnished', 'fully-furnished']),
      details: {
        wardrobes: range(rng, bhk, bhk + 2),
        acs: range(rng, bhk, bhk + 1),
        geysers: range(rng, bhk, bhk + 1),
        beds: chance(rng, 0.6) ? bhk : 0,
        sofas: range(rng, 1, 3),
        diningTables: 1,
        modularKitchen: true,
        chimney: true,
        tvUnit: chance(rng, 0.85)
      }
    },
    amenities,
    availability: {
      availableFrom: new Date(Date.now() + range(rng, -30, 90) * 24 * 60 * 60 * 1000),
      isReadyToMove: constructionStatus === 'ready-to-move',
      possessionStatus: constructionStatus === 'under-construction' ? 'within 18 months' : 'immediate',
      occupancyStatus: 'vacant'
    },
    legal: {
      ownershipType: 'freehold',
      transactionType: chance(rng, 0.55) ? 'new booking' : 'resale',
      approvedBy: ['AUDA', 'AMC', 'RERA', 'Nationalized Bank'],
      reraId,
      loanAvailable: true
    },
    seller: {
      sellerType: 'builder', // platform rule: developer-direct only; "builder" is closest enum match
      contactName: dev.brandName,
      contactPhoneMasked: `98${range(rng, 10, 99)}xxxx${range(rng, 100, 999)}`,
      rating: round1(4.4 + rng() * 0.6)
    },
    description: `${title}. Developed by ${dev.brandName} (est. ${dev.established}), this ${propertyType} sits in the heart of ${locality.locality}, ${locality.microMarket}. ${dev.projectsDelivered}+ projects delivered with ${Math.round(dev.onTimeRate * 100)}% on-time rate. Trust score ${trustAggregate}/100. Suitable for high-net-worth NRI buyers seeking long-hold capital appreciation with verified legal chain.`,
    highlights,
    tags: [
      locality.locality.toLowerCase(),
      locality.microMarket.toLowerCase(),
      'luxury',
      'sale',
      propertyType,
      `${bhk}bhk`,
      ...activeAmenities.slice(0, 6)
    ],
    media: {
      coverImage: gallery[0].url,
      gallery,
      floorPlanImages: gallery.slice(0, 2).map((g, i) => ({ url: g.url, label: `Floor plan ${i + 1}`, isPrimary: i === 0 }))
    },
    nearby,
    scores: {
      // legacy scores block — kept compatible with existing model
      walkScore: round1(7.5 + rng() * 2.2),
      connectivityScore: round1(7.8 + rng() * 1.9),
      livabilityScore: round1(8.0 + rng() * 1.8),
      investmentScore: round1(8.2 + rng() * 1.6)
    },
    source: 'luxury-seed',
    isActive: true,
    isFeatured: chance(rng, 0.4), // 40% featured in luxury bucket

    // === additive feature blocks (populated) ===
    trustScore: {
      aggregate: trustAggregate,
      safety:         { score: trust.safety,         factors: { policeStations: range(rng, 3, 6), crimeIndex: 'very-low', lighting: 'excellent' } },
      infrastructure: { score: trust.infrastructure, factors: { powerReliability: 0.97, waterReliability: 0.95, internetSpeedMbps: 300, roadCondition: 'excellent' } },
      environment:    { score: trust.environment,   factors: { aqi: range(rng, 60, 110), noiseDb: range(rng, 45, 60), greenCoverPct: range(rng, 18, 32), floodRisk: 'low' } },
      investment:     { score: trust.investment,    factors: { priceVsArea: 'fair', appreciation5y: round1(0.35 + rng() * 0.25), rentalYield: round1(0.024 + rng() * 0.012) } },
      computedAt: new Date()
    },
    aiInsights,
    futureGrowth: {
      summaryScore: futureGrowthScore,
      upcomingProjects
    },
    priceIntelligence: {
      history,
      comparables: [], // populated post-seed via a separate cross-property pass if needed
      areaAvgPerSqft
    },
    developer,
    documents,
    nearbyPlaces
  };

  // search artifacts
  const artifacts = buildSearchArtifacts(property);
  property.searchText = artifacts.searchText;
  property.tokens = artifacts.tokens;
  property.normalizedLocalities = artifacts.normalizedLocalities;

  property.createdAt = new Date();
  property.updatedAt = new Date();
  property.__v = 0;

  return property;
}

// === main ===
(async () => {
  console.log('=== seed-luxury-properties ===');
  console.log(`Count:  ${COUNT}`);
  console.log(`Apply:  ${APPLY}`);
  console.log('');

  const props = Array.from({ length: COUNT }, (_, i) => generateLuxuryProperty(i));

  if (!APPLY) {
    console.log(`[DRY RUN] Generated ${props.length} luxury property objects (not written).`);
    console.log('Sample first record:');
    console.log(JSON.stringify(props[0], null, 2));
    return;
  }

  const client = new MongoClient(URI);
  await client.connect();
  const coll = client.db(DB_NAME).collection('properties');
  const beforeCount = await coll.countDocuments();
  const beforeLux = await coll.countDocuments({ source: 'luxury-seed' });

  const ops = props.map((p) => ({
    updateOne: {
      filter: { propertyCode: p.propertyCode },
      update: { $set: p },
      upsert: true
    }
  }));
  const result = await coll.bulkWrite(ops, { ordered: false });

  const afterCount = await coll.countDocuments();
  const afterLux = await coll.countDocuments({ source: 'luxury-seed' });

  console.log(`Upserts:    ${result.upsertedCount}`);
  console.log(`Updates:    ${result.modifiedCount}`);
  console.log(`Total docs: ${beforeCount} → ${afterCount}`);
  console.log(`Luxury:     ${beforeLux} → ${afterLux}`);

  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
