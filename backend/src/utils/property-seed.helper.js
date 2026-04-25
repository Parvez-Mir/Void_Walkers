import {
  AHMEDABAD_LOCALITIES,
  AMENITY_KEYS,
  CONSTRUCTION_STATUSES,
  FURNISHING_STATUSES,
  LISTING_TYPES,
  OWNERSHIP_TYPES,
  PROJECT_PREFIXES,
  PROJECT_SUFFIXES,
  PROPERTY_IMAGE_POOL,
  PROPERTY_TYPES,
  SELLER_TYPES,
  toTitleCase
} from "./property.utils.js";

const STREET_NAMES = [
  "Iscon Avenue",
  "Shilaj Circle",
  "Corporate Road",
  "Sindhu Bhavan Road",
  "SP Ring Road",
  "Science City Road",
  "Bopal Cross Road",
  "Ambli Road",
  "Sun City Road",
  "Anandnagar Road"
];

const LANDMARKS = [
  "near school campus",
  "close to retail arcade",
  "walking distance from garden",
  "near club house",
  "adjacent to SP Ring Road",
  "behind premium township",
  "near hospital zone",
  "close to business park"
];

const NEARBY_SCHOOLS = [
  "Zydus School",
  "Anand Niketan",
  "Delhi Public School",
  "The New Tulip School",
  "SGVP International School"
];

const NEARBY_HOSPITALS = [
  "Shalby Hospital",
  "Sterling Hospital",
  "Apollo Clinic",
  "KD Hospital",
  "CIMS Hospital"
];

const NEARBY_MALLS = [
  "Alpha One Mall",
  "Iscon Mega Mall",
  "Gulmohar Park Mall",
  "Acropolis Mall",
  "Palladium Ahmedabad"
];

const NEARBY_TRANSIT = [
  "Thaltej Metro",
  "Doordarshan Kendra Metro",
  "Vastral Gam Metro",
  "Old High Court Metro",
  "APMC Bus Hub"
];

const HIGHLIGHT_POOL = [
  "gated society",
  "double height entrance lobby",
  "low density planning",
  "good natural light",
  "close to daily retail",
  "family-oriented neighborhood",
  "well maintained campus",
  "strong resale demand",
  "ideal for end use",
  "good rental pickup"
];

const hashString = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const createRandom = (seed) => {
  let current = hashString(seed) || 1;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
};

const pick = (random, list) => list[Math.floor(random() * list.length)];
const pickMany = (random, list, count) => {
  const clone = [...list];
  const selected = [];

  while (clone.length && selected.length < count) {
    selected.push(clone.splice(Math.floor(random() * clone.length), 1)[0]);
  }

  return selected;
};

const range = (random, min, max) => Math.round(min + random() * (max - min));
const chance = (random, threshold) => random() < threshold;

const deriveBhk = (propertyType, random) => {
  if (propertyType === "studio") return 1;
  if (propertyType === "plot") return 0;
  if (propertyType === "penthouse") return range(random, 3, 5);
  if (propertyType === "villa") return range(random, 3, 5);
  return range(random, 1, 4);
};

const deriveArea = (propertyType, bhk, random) => {
  if (propertyType === "plot") {
    return range(random, 900, 2800);
  }
  if (propertyType === "studio") {
    return range(random, 450, 780);
  }
  if (propertyType === "villa") {
    return range(random, 1800, 4200);
  }
  if (propertyType === "penthouse") {
    return range(random, 2200, 4500);
  }
  return range(random, 650 + bhk * 180, 1100 + bhk * 380);
};

const derivePrice = ({ listingType, locality, propertyType, bhk, areaSqft, random }) => {
  const [minBase, maxBase] = listingType === "sale" ? locality.saleRange : locality.rentRange;
  let value = range(random, minBase, maxBase);
  const typeMultipliers = {
    apartment: 1,
    villa: 1.35,
    penthouse: 1.5,
    "builder-floor": 0.95,
    studio: 0.42,
    plot: 0.9
  };

  value *= typeMultipliers[propertyType] || 1;
  if (bhk && bhk <= 2 && propertyType === "apartment") value *= 0.84;
  if (bhk && bhk >= 4 && propertyType === "apartment") value *= 1.22;

  if (listingType === "sale") {
    const sqftAdjustment = areaSqft * range(random, 3200, 9800);
    value = Math.max(value, sqftAdjustment);
  }

  return Math.round(value);
};

const makeProjectName = (random) => `${pick(random, PROJECT_PREFIXES)} ${pick(random, PROJECT_SUFFIXES)}`;

const buildGallery = (random) => {
  const gallery = pickMany(random, PROPERTY_IMAGE_POOL, 5).map((url, index) => ({
    url,
    label: index === 0 ? "Front elevation" : `Gallery view ${index + 1}`,
    isPrimary: index === 0
  }));

  return {
    coverImage: gallery[0]?.url || PROPERTY_IMAGE_POOL[0],
    gallery,
    floorPlanImages: gallery.slice(0, 2).map((entry, index) => ({
      url: entry.url,
      label: `Floor plan ${index + 1}`,
      isPrimary: index === 0
    }))
  };
};

const buildNearbyPlaces = (random, pool) =>
  pickMany(random, pool, 2).map((name) => ({
    name,
    distanceKm: Number((0.6 + random() * 5.5).toFixed(1))
  }));

const maskedPhone = (random) => `98${range(random, 10, 99)}xxxx${range(random, 100, 999)}`;

const buildTitle = ({ bhk, propertyType, listingType, locality, projectName }) => {
  const bhkLabel = bhk > 0 ? `${bhk} BHK` : "";
  const typeLabel = propertyType === "builder-floor" ? "Builder Floor" : toTitleCase(propertyType.replace("-", " "));
  const intent = listingType === "sale" ? "for sale" : "for rent";
  return `${[bhkLabel, typeLabel].filter(Boolean).join(" ")} in ${projectName}, ${locality.locality} ${intent}`;
};

export const generateMockProperty = (index, options = {}) => {
  const seed = `${options.seed || "void-walkers"}-${index}`;
  const random = createRandom(seed);
  const locality = AHMEDABAD_LOCALITIES[index % AHMEDABAD_LOCALITIES.length];
  const propertyType = pick(random, PROPERTY_TYPES);
  const listingType = propertyType === "plot" ? "sale" : chance(random, 0.68) ? "sale" : "rent";
  const bhk = deriveBhk(propertyType, random);
  const superBuiltupArea = deriveArea(propertyType, bhk, random);
  const builtupArea = Math.round(superBuiltupArea * (0.88 + random() * 0.06));
  const carpetArea = Math.round(superBuiltupArea * (0.68 + random() * 0.08));
  const expectedPrice = derivePrice({
    listingType,
    locality,
    propertyType,
    bhk,
    areaSqft: superBuiltupArea,
    random
  });
  const projectName = makeProjectName(random);
  const media = buildGallery(random);
  const constructionStatus = pick(random, CONSTRUCTION_STATUSES);
  const furnishingStatus = pick(random, FURNISHING_STATUSES);
  const sellerType = pick(random, SELLER_TYPES);
  const totalFloors = propertyType === "villa" ? range(random, 2, 4) : range(random, 7, 24);
  const floorNumber = propertyType === "villa" || propertyType === "plot" ? 0 : range(random, 1, totalFloors);
  const latJitter = Number(((random() - 0.5) * 0.02).toFixed(6));
  const lngJitter = Number(((random() - 0.5) * 0.02).toFixed(6));
  const coordinates = [
    Number((locality.coordinates[0] + lngJitter).toFixed(6)),
    Number((locality.coordinates[1] + latJitter).toFixed(6))
  ];
  const title = buildTitle({ bhk, propertyType, listingType, locality, projectName });
  const pricePerSqft =
    listingType === "sale" && superBuiltupArea ? Math.round(expectedPrice / superBuiltupArea) : undefined;
  const availableFrom = new Date(Date.now() + range(random, -20, 45) * 24 * 60 * 60 * 1000);
  const amenities = {
    lift: propertyType !== "villa" && propertyType !== "plot",
    parking: propertyType === "plot" ? 0 : range(random, 1, propertyType === "villa" ? 3 : 2),
    visitorParking: chance(random, 0.7),
    powerBackup: chance(random, 0.72),
    waterSupply: chance(random, 0.5) ? "24x7 borewell" : "corporation",
    security: chance(random, 0.82),
    gym: chance(random, 0.54),
    clubHouse: chance(random, 0.48),
    pool: chance(random, 0.35),
    garden: chance(random, 0.67),
    childrenPlayArea: chance(random, 0.7),
    gasPipeline: chance(random, 0.58),
    internetReady: chance(random, 0.76),
    petFriendly: chance(random, 0.42)
  };
  const activeAmenities = AMENITY_KEYS.filter((key) => amenities[key]);
  const highlights = pickMany(random, HIGHLIGHT_POOL, 4);
  const propertyCode = `PROP-AHD-${String(index + 1).padStart(4, "0")}`;

  return {
    title,
    propertyCode,
    listingType,
    propertyType,
    category: "residential",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    location: {
      locality: locality.locality,
      microMarket: locality.microMarket,
      subLocality: chance(random, 0.4) ? pick(random, locality.nearby) : `${locality.locality} Extension`,
      addressLine1: `${range(random, 101, 999)}, ${pick(random, STREET_NAMES)}`,
      landmark: pick(random, LANDMARKS),
      pincode: locality.pincode,
      coordinates: {
        type: "Point",
        coordinates
      }
    },
    pricing: {
      expectedPrice,
      pricePerSqft,
      securityDeposit: listingType === "rent" ? expectedPrice * range(random, 1, 3) : 0,
      maintenance: range(random, 1200, 6500),
      brokerage: listingType === "rent" ? range(random, 5000, 30000) : range(random, 25000, 125000),
      negotiable: chance(random, 0.64),
      taxesIncluded: chance(random, 0.3)
    },
    configuration: {
      bhk,
      bedrooms: bhk,
      bathrooms: bhk === 0 ? 0 : Math.max(1, Math.min(5, bhk + (chance(random, 0.45) ? 1 : 0))),
      balconies: propertyType === "plot" ? 0 : range(random, 0, 3),
      storeRooms: chance(random, 0.3) ? 1 : 0,
      servantRoom: propertyType === "villa" || propertyType === "penthouse" ? chance(random, 0.48) : false,
      studyRoom: bhk >= 3 ? chance(random, 0.44) : false,
      poojaRoom: bhk >= 2 ? chance(random, 0.55) : false
    },
    area: {
      superBuiltupArea,
      builtupArea,
      carpetArea,
      plotArea: propertyType === "plot" || propertyType === "villa" ? superBuiltupArea : undefined,
      areaUnit: "sqft"
    },
    building: {
      projectName,
      tower: propertyType === "villa" || propertyType === "plot" ? "NA" : `Tower ${String.fromCharCode(65 + (index % 5))}`,
      floorNumber,
      totalFloors,
      totalUnits: range(random, 40, 420),
      totalTowers: propertyType === "villa" ? range(random, 1, 3) : range(random, 2, 8),
      propertyAge: constructionStatus === "new-launch" ? 0 : range(random, 0, 12),
      constructionStatus
    },
    layout: {
      facing: pick(random, ["east", "west", "north", "south", "north-east"]),
      cornerProperty: chance(random, 0.28),
      roadWidth: range(random, 20, 80),
      openSides: range(random, 1, 3),
      overlooking: pickMany(random, ["garden", "clubhouse", "main road", "city skyline", "courtyard"], 2)
    },
    furnishing: {
      status: furnishingStatus,
      details: {
        wardrobes: bhk === 0 ? 0 : range(random, 1, Math.max(2, bhk + 1)),
        acs: chance(random, 0.55) ? range(random, 1, Math.max(1, bhk)) : 0,
        geysers: chance(random, 0.72) ? range(random, 1, Math.max(1, bhk)) : 0,
        beds: furnishingStatus === "fully-furnished" ? bhk : range(random, 0, bhk),
        sofas: propertyType === "plot" ? 0 : chance(random, 0.64) ? 1 : 0,
        diningTables: propertyType === "plot" ? 0 : chance(random, 0.58) ? 1 : 0,
        modularKitchen: propertyType !== "plot" ? chance(random, 0.74) : false,
        chimney: propertyType !== "plot" ? chance(random, 0.61) : false,
        tvUnit: propertyType !== "plot" ? chance(random, 0.57) : false
      }
    },
    amenities,
    availability: {
      availableFrom,
      isReadyToMove: constructionStatus === "ready-to-move" || constructionStatus === "resale",
      possessionStatus: constructionStatus === "under-construction" ? "within 12 months" : "immediate",
      occupancyStatus: listingType === "rent" ? "vacant" : chance(random, 0.45) ? "self-occupied" : "vacant"
    },
    legal: {
      ownershipType: pick(random, OWNERSHIP_TYPES),
      transactionType: listingType === "sale" ? (chance(random, 0.58) ? "resale" : "new booking") : "rental",
      approvedBy: pickMany(random, ["AUDA", "AMC", "RERA", "Nationalized Bank"], 2),
      reraId: `PR/GJ/AHM/${2020 + (index % 6)}/${String(10000 + index).padStart(5, "0")}`,
      loanAvailable: chance(random, 0.87)
    },
    seller: {
      sellerType,
      contactName: `${pick(random, ["Rahul", "Krunal", "Mitesh", "Pooja", "Neha", "Hiral", "Dhruv"])} ${pick(random, ["Shah", "Patel", "Trivedi", "Joshi", "Parikh", "Desai"])}`,
      contactPhoneMasked: maskedPhone(random),
      rating: Number((3.6 + random() * 1.4).toFixed(1))
    },
    description: `${title}. Located in ${locality.locality}, this listing offers strong connectivity to ${locality.nearby[0]} and ${locality.nearby[1]}. Suitable for ${listingType === "sale" ? "end use and investment" : "families and working professionals"} with practical access to schools, hospitals, and retail.`,
    highlights,
    tags: [
      locality.locality.toLowerCase(),
      locality.microMarket.toLowerCase(),
      listingType,
      propertyType,
      `${bhk}bhk`,
      ...activeAmenities
    ],
    media,
    nearby: {
      localities: locality.nearby,
      schools: buildNearbyPlaces(random, NEARBY_SCHOOLS),
      hospitals: buildNearbyPlaces(random, NEARBY_HOSPITALS),
      metro: buildNearbyPlaces(random, NEARBY_TRANSIT),
      malls: buildNearbyPlaces(random, NEARBY_MALLS)
    },
    scores: {
      walkScore: Number((5.4 + random() * 3.9).toFixed(1)),
      connectivityScore: Number((6.2 + random() * 3.4).toFixed(1)),
      livabilityScore: Number((6.0 + random() * 3.5).toFixed(1)),
      investmentScore: Number((6.4 + random() * 3.2).toFixed(1))
    },
    source: "mock-seed",
    isActive: true,
    isFeatured: chance(random, 0.14)
  };
};

export const generateMockProperties = ({ count = 1000, seed = "void-walkers-ahmedabad" } = {}) =>
  Array.from({ length: count }, (_, index) => generateMockProperty(index, { seed }));
