const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const PROPERTY_IMAGE_POOL = [
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
  "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
  "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
  "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
  "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
  "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
  "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg",
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
  "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg",
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
];

export const AHMEDABAD_LOCALITIES = [
  {
    locality: "Bopal",
    microMarket: "West Ahmedabad",
    pincode: "380058",
    coordinates: [72.4658, 23.0324],
    nearby: ["South Bopal", "Ambli", "Shela", "Ghuma"],
    saleRange: [5200000, 9800000],
    rentRange: [18000, 38000]
  },
  {
    locality: "South Bopal",
    microMarket: "West Ahmedabad",
    pincode: "380058",
    coordinates: [72.4631, 23.0228],
    nearby: ["Bopal", "Shela", "Ghuma", "Ambli Bopal Road"],
    saleRange: [4800000, 9200000],
    rentRange: [17000, 36000]
  },
  {
    locality: "Ambli",
    microMarket: "West Ahmedabad",
    pincode: "380058",
    coordinates: [72.5006, 23.0301],
    nearby: ["Bopal", "Bodakdev", "Thaltej", "Ambli Bopal Road"],
    saleRange: [8500000, 22000000],
    rentRange: [28000, 85000]
  },
  {
    locality: "Ambli Bopal Road",
    microMarket: "West Ahmedabad",
    pincode: "380054",
    coordinates: [72.4884, 23.0268],
    nearby: ["Bopal", "Ambli", "South Bopal", "Shela"],
    saleRange: [7000000, 16000000],
    rentRange: [24000, 60000]
  },
  {
    locality: "Shela",
    microMarket: "South West Ahmedabad",
    pincode: "380058",
    coordinates: [72.4503, 23.0181],
    nearby: ["South Bopal", "Bopal", "Ghuma", "Sanand Road"],
    saleRange: [4500000, 11000000],
    rentRange: [15000, 42000]
  },
  {
    locality: "Ghuma",
    microMarket: "South West Ahmedabad",
    pincode: "380058",
    coordinates: [72.4442, 23.0096],
    nearby: ["Shela", "Bopal", "South Bopal", "Sanand Road"],
    saleRange: [4200000, 9000000],
    rentRange: [14000, 32000]
  },
  {
    locality: "Thaltej",
    microMarket: "North West Ahmedabad",
    pincode: "380059",
    coordinates: [72.4994, 23.0498],
    nearby: ["Bodakdev", "Science City", "SG Highway", "Gota"],
    saleRange: [7800000, 21000000],
    rentRange: [26000, 70000]
  },
  {
    locality: "Bodakdev",
    microMarket: "North West Ahmedabad",
    pincode: "380054",
    coordinates: [72.5072, 23.0375],
    nearby: ["Satellite", "Prahlad Nagar", "Vastrapur", "Thaltej"],
    saleRange: [9000000, 25000000],
    rentRange: [30000, 90000]
  },
  {
    locality: "Satellite",
    microMarket: "West Ahmedabad",
    pincode: "380015",
    coordinates: [72.5238, 23.0137],
    nearby: ["Bodakdev", "Jodhpur", "Vastrapur", "Prahlad Nagar"],
    saleRange: [7000000, 16500000],
    rentRange: [23000, 65000]
  },
  {
    locality: "Prahlad Nagar",
    microMarket: "West Ahmedabad",
    pincode: "380015",
    coordinates: [72.5101, 23.0124],
    nearby: ["Satellite", "Makarba", "SG Highway", "Bodakdev"],
    saleRange: [8500000, 19000000],
    rentRange: [26000, 72000]
  },
  {
    locality: "Makarba",
    microMarket: "West Ahmedabad",
    pincode: "380051",
    coordinates: [72.4981, 22.9917],
    nearby: ["Prahlad Nagar", "SG Highway", "Vejalpur", "Juhapura"],
    saleRange: [5500000, 12000000],
    rentRange: [18000, 45000]
  },
  {
    locality: "SG Highway",
    microMarket: "Growth Corridor",
    pincode: "380054",
    coordinates: [72.5016, 23.0472],
    nearby: ["Bodakdev", "Thaltej", "Makarba", "Science City"],
    saleRange: [8000000, 22000000],
    rentRange: [25000, 85000]
  },
  {
    locality: "Vastrapur",
    microMarket: "West Ahmedabad",
    pincode: "380015",
    coordinates: [72.5252, 23.0396],
    nearby: ["Bodakdev", "Satellite", "Memnagar", "IIM Road"],
    saleRange: [8000000, 17000000],
    rentRange: [24000, 68000]
  },
  {
    locality: "Jodhpur",
    microMarket: "West Ahmedabad",
    pincode: "380015",
    coordinates: [72.5147, 23.0195],
    nearby: ["Satellite", "Vastrapur", "Shyamal", "Prahlad Nagar"],
    saleRange: [6800000, 14500000],
    rentRange: [21000, 52000]
  },
  {
    locality: "Science City",
    microMarket: "North West Ahmedabad",
    pincode: "380060",
    coordinates: [72.4747, 23.0704],
    nearby: ["Thaltej", "SG Highway", "Gota", "Sola"],
    saleRange: [6500000, 15000000],
    rentRange: [22000, 52000]
  },
  {
    locality: "Gota",
    microMarket: "North Ahmedabad",
    pincode: "382481",
    coordinates: [72.5382, 23.1013],
    nearby: ["Science City", "Sola", "Chandlodia", "Jagatpur"],
    saleRange: [4200000, 9200000],
    rentRange: [15000, 32000]
  },
  {
    locality: "Chandkheda",
    microMarket: "North Ahmedabad",
    pincode: "382424",
    coordinates: [72.6461, 23.1107],
    nearby: ["Motera", "Sabarmati", "New CG Road", "Tragad"],
    saleRange: [4300000, 9800000],
    rentRange: [15000, 30000]
  },
  {
    locality: "Motera",
    microMarket: "North Ahmedabad",
    pincode: "380005",
    coordinates: [72.6041, 23.0915],
    nearby: ["Chandkheda", "Sabarmati", "Tapovan Circle", "Airport Road"],
    saleRange: [5000000, 14000000],
    rentRange: [18000, 42000]
  },
  {
    locality: "Nikol",
    microMarket: "East Ahmedabad",
    pincode: "382350",
    coordinates: [72.6848, 23.0538],
    nearby: ["Naroda", "Bapunagar", "Sardar Chowk", "Odhav"],
    saleRange: [3500000, 7800000],
    rentRange: [12000, 24000]
  },
  {
    locality: "Naroda",
    microMarket: "East Ahmedabad",
    pincode: "382330",
    coordinates: [72.6579, 23.0707],
    nearby: ["Nikol", "Hanspura", "Kubernagar", "Airport Road"],
    saleRange: [3200000, 7600000],
    rentRange: [11000, 22000]
  },
  {
    locality: "Maninagar",
    microMarket: "Central Ahmedabad",
    pincode: "380008",
    coordinates: [72.5937, 22.9967],
    nearby: ["Kankaria", "Isanpur", "Paldi", "Gitamandir"],
    saleRange: [4500000, 10000000],
    rentRange: [14000, 28000]
  }
];

export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "penthouse",
  "builder-floor",
  "studio",
  "plot"
];

export const LISTING_TYPES = ["sale", "rent"];

export const FURNISHING_STATUSES = ["unfurnished", "semi-furnished", "fully-furnished"];
export const CONSTRUCTION_STATUSES = ["ready-to-move", "under-construction", "new-launch", "resale"];
export const OWNERSHIP_TYPES = ["freehold", "leasehold", "co-operative-society"];
export const SELLER_TYPES = ["owner", "agent", "builder"];

export const PROJECT_PREFIXES = [
  "Safal",
  "Aaryan",
  "Shiv",
  "Sun",
  "Skyline",
  "Shantam",
  "Green",
  "Orchid",
  "Dev",
  "Serene",
  "Elite",
  "Magnus"
];

export const PROJECT_SUFFIXES = [
  "Heights",
  "Harmony",
  "County",
  "Imperial",
  "Residency",
  "Avenue",
  "Sky",
  "Enclave",
  "Courtyard",
  "Vista",
  "Greens",
  "Orchid"
];

export const AMENITY_KEYS = [
  "lift",
  "visitorParking",
  "powerBackup",
  "security",
  "gym",
  "clubHouse",
  "pool",
  "garden",
  "childrenPlayArea",
  "gasPipeline",
  "internetReady",
  "petFriendly"
];

export const normalizeToken = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const buildSearchArtifacts = (property) => {
  const candidates = [
    property.title,
    property.slug,
    property.description,
    property.projectName,
    property.location?.locality,
    property.location?.microMarket,
    property.location?.subLocality,
    property.location?.landmark,
    property.configuration?.bhk ? `${property.configuration.bhk} bhk` : "",
    property.propertyType,
    property.listingType,
    ...(property.highlights || []),
    ...(property.tags || []),
    ...(property.nearby?.localities || [])
  ];

  const normalized = normalizeToken(candidates.filter(Boolean).join(" "));
  const tokens = [...new Set(normalized.split(" ").filter(Boolean))];
  const normalizedLocalities = [...new Set(
    [
      property.location?.locality,
      property.location?.microMarket,
      property.location?.subLocality,
      ...(property.nearby?.localities || [])
    ]
      .filter(Boolean)
      .map((entry) => normalizeToken(entry))
  )];

  return {
    searchText: normalized,
    tokens,
    normalizedLocalities
  };
};

export const buildPropertySlug = ({ title, propertyCode }) => {
  const base = slugify(title || propertyCode || "property");
  const uniqueId = propertyCode ? `-${propertyCode.toLowerCase()}` : `-${Date.now()}`;
  return `${base}${uniqueId}`;
};

export const parseMultiValue = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => parseMultiValue(entry));
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const toTitleCase = (value = "") =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
