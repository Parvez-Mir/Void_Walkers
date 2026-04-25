const fallbackImages = [
  '/images/ahmedabad-property-1.jpg',
  '/images/ahmedabad-property-2.jpg',
  '/images/ahmedabad-property-3.jpg',
  '/images/ahmedabad-property-4.jpg',
  '/images/ahmedabad-property-5.jpg',
];

export const getPropertyIdentifier = (property) =>
  property?.slug || property?.propertyCode || property?._id;

export const getPropertyImage = (property, index = 0) =>
  property?.media?.coverImage ||
  property?.media?.gallery?.find((asset) => asset?.isPrimary)?.url ||
  property?.media?.gallery?.[0]?.url ||
  fallbackImages[index % fallbackImages.length];

export const getPropertyGallery = (property) => {
  const urls = [
    property?.media?.coverImage,
    ...(property?.media?.gallery || []).map((asset) => asset?.url),
  ].filter(Boolean);

  return [...new Set(urls)].length ? [...new Set(urls)] : fallbackImages;
};

export const formatPrice = (value, listingType) => {
  if (!Number.isFinite(Number(value))) {
    return 'Price on request';
  }

  const amount = Number(value);
  if (listingType === 'rent') {
    return `Rs ${amount.toLocaleString('en-IN')}/mo`;
  }

  if (amount >= 10000000) {
    return `Rs ${(amount / 10000000).toFixed(amount % 10000000 ? 1 : 0)} Cr`;
  }

  if (amount >= 100000) {
    return `Rs ${(amount / 100000).toFixed(amount % 100000 ? 1 : 0)} L`;
  }

  return `Rs ${amount.toLocaleString('en-IN')}`;
};

export const formatArea = (value, unit = 'sqft') => {
  if (!Number.isFinite(Number(value))) {
    return 'Area NA';
  }

  return `${Number(value).toLocaleString('en-IN')} ${unit}`;
};

export const formatBhk = (property) => {
  const bhk = property?.configuration?.bhk;
  if (property?.propertyType === 'plot') return 'Plot';
  if (!Number.isFinite(Number(bhk)) || Number(bhk) === 0) return 'Studio';
  return `${bhk} BHK`;
};

export const getScore = (property, preferred = 'investmentScore') => {
  const raw = property?.scores?.[preferred] ?? property?.scores?.livabilityScore ?? property?.scores?.connectivityScore;
  const score = Number(raw);
  if (!Number.isFinite(score)) return 72;
  return Math.max(0, Math.min(100, Math.round(score * 10)));
};

export const getScoreLevel = (score) => {
  if (score >= 86) return 'excellent';
  if (score >= 72) return 'good';
  if (score >= 58) return 'average';
  return 'developing';
};

export const getLocationLabel = (property) =>
  [property?.location?.locality, property?.city].filter(Boolean).join(', ') || 'Ahmedabad';

export const getAmenityLabels = (amenities = {}) =>
  Object.entries({
    lift: 'Lift',
    parking: 'Parking',
    visitorParking: 'Visitor parking',
    powerBackup: 'Power backup',
    security: 'Security',
    gym: 'Gym',
    clubHouse: 'Club house',
    pool: 'Pool',
    garden: 'Garden',
    childrenPlayArea: 'Play area',
    gasPipeline: 'Gas pipeline',
    internetReady: 'Internet ready',
    petFriendly: 'Pet friendly',
  }).filter(([key]) => Boolean(amenities[key])).map(([, label]) => label);
