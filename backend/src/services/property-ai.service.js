import { z } from "zod";
import { bloomSearchProperties, listProperties } from "./property-search.service.js";
import { normalizeToken, parseMultiValue, AHMEDABAD_LOCALITIES } from "../utils/property.utils.js";

const aiSearchSchema = z.object({
  query: z.string().min(2),
  city: z.string().optional().default("Ahmedabad"),
  limit: z.number().int().min(1).max(20).optional().default(8)
});

const NEAR_RADIUS_KM = 5;

const localityLexicon = [
  "bopal",
  "south bopal",
  "ambli",
  "ambli bopal road",
  "shela",
  "ghuma",
  "thaltej",
  "bodakdev",
  "satellite",
  "prahlad nagar",
  "makarba",
  "sg highway",
  "vastrapur",
  "jodhpur",
  "science city",
  "gota",
  "chandkheda",
  "motera",
  "nikol",
  "naroda",
  "maninagar"
];

// Coordinates keyed by normalized locality name → [lng, lat]
const localityCoords = AHMEDABAD_LOCALITIES.reduce((map, entry) => {
  map[normalizeToken(entry.locality)] = entry.coordinates;
  return map;
}, {});

// Levenshtein distance — small inline impl, no extra deps
const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
};

const singleWordLexicon = localityLexicon.filter((entry) => !entry.includes(" "));

// Extracts localities with typo tolerance: exact substring first, then per-token fuzzy fallback
const extractLocalities = (normalized) => {
  const exact = localityLexicon.filter((entry) => normalized.includes(entry));
  if (exact.length) return exact;

  const tokens = normalized.split(/\s+/).filter((t) => t.length >= 4);
  const fuzzy = new Set();
  for (const token of tokens) {
    let best = null;
    let bestDist = 3; // accept distance 0, 1, or 2
    for (const entry of singleWordLexicon) {
      if (Math.abs(token.length - entry.length) > 2) continue;
      const dist = levenshtein(token, entry);
      if (dist < bestDist) {
        best = entry;
        bestDist = dist;
      }
    }
    if (best) fuzzy.add(best);
  }
  return Array.from(fuzzy);
};

const amenityLexicon = {
  gym: ["gym", "fitness"],
  pool: ["pool", "swimming"],
  petFriendly: ["pet", "pet friendly"],
  powerBackup: ["power backup", "backup"],
  clubHouse: ["club", "clubhouse"],
  garden: ["garden"],
  childrenPlayArea: ["kids play", "play area"]
};

const parseBudget = (query) => {
  const normalized = normalizeToken(query);
  const lakhMatch = normalized.match(/under\s+(\d+)\s*lakh/);
  if (lakhMatch) {
    return { maxPrice: Number(lakhMatch[1]) * 100000 };
  }

  const croreMatch = normalized.match(/under\s+(\d+(?:\.\d+)?)\s*crore/);
  if (croreMatch) {
    return { maxPrice: Math.round(Number(croreMatch[1]) * 10000000) };
  }

  const rentMatch = normalized.match(/under\s+(\d+)\s*k/);
  if (rentMatch) {
    return { maxPrice: Number(rentMatch[1]) * 1000 };
  }

  return {};
};

const heuristicParse = (query, city = "Ahmedabad") => {
  const normalized = normalizeToken(query);
  const bhkMatch = normalized.match(/(\d)\s*bhk/);
  const listingType = normalized.includes("rent") || normalized.includes("rental") ? "rent" : "sale";
  const localities = extractLocalities(normalized).map((entry) =>
    entry.replace(/\b\w/g, (character) => character.toUpperCase()),
  );
  const amenities = Object.entries(amenityLexicon)
    .filter(([, terms]) => terms.some((term) => normalized.includes(term)))
    .map(([key]) => key);
  const propertyType = normalized.includes("villa")
    ? "villa"
    : normalized.includes("plot")
      ? "plot"
      : normalized.includes("penthouse")
        ? "penthouse"
        : normalized.includes("studio")
          ? "studio"
          : normalized.includes("builder floor")
            ? "builder-floor"
            : "apartment";

  return {
    intent: "property_search",
    city,
    listingType,
    propertyType,
    bhk: bhkMatch ? Number(bhkMatch[1]) : undefined,
    localities,
    nearLocalities: normalized.includes("near"),
    amenities,
    ...parseBudget(normalized),
    sortBy: normalized.includes("cheap") || normalized.includes("budget") ? "price-asc" : "relevance"
  };
};

const parseWithOpenAI = async (query, city) => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Extract real-estate search filters into JSON. Only return JSON with keys intent, city, listingType, propertyType, bhk, localities, nearLocalities, amenities, minPrice, maxPrice, sortBy."
        },
        {
          role: "user",
          content: `City: ${city}\nQuery: ${query}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI parsing failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  return JSON.parse(content);
};

export const runAiPropertySearch = async (input) => {
  const parsedInput = aiSearchSchema.parse({
    ...input,
    limit: input.limit ? Number(input.limit) : undefined
  });

  let parsedQuery;
  let parser = "heuristic";

  try {
    parsedQuery = await parseWithOpenAI(parsedInput.query, parsedInput.city);
    if (parsedQuery) {
      parser = "openai";
    }
  } catch (error) {
    parsedQuery = null;
  }

  if (!parsedQuery) {
    parsedQuery = heuristicParse(parsedInput.query, parsedInput.city);
  }

  const localities = parseMultiValue(parsedQuery.localities);
  const wantsNearby = Boolean(parsedQuery.nearLocalities);
  const searchParams = {
    city: parsedQuery.city || parsedInput.city,
    listingType: parsedQuery.listingType,
    propertyType: parsedQuery.propertyType,
    bhk: parsedQuery.bhk,
    minPrice: parsedQuery.minPrice,
    maxPrice: parsedQuery.maxPrice,
    amenities: parsedQuery.amenities,
    sortBy: parsedQuery.sortBy,
    limit: parsedInput.limit,
    page: 1
  };

  // When the parser flagged "near <locality>", switch to a geo-radius query
  // around the matched locality's coordinates. Falls back to text-locality
  // matching if we don't have coords for the place.
  if (wantsNearby && localities.length) {
    const primaryNorm = normalizeToken(localities[0]);
    const coords = localityCoords[primaryNorm];
    if (coords) {
      searchParams.lng = coords[0];
      searchParams.lat = coords[1];
      searchParams.radiusKm = NEAR_RADIUS_KM;
      parsedQuery.appliedRadiusKm = NEAR_RADIUS_KM;
      parsedQuery.appliedNearLocality = localities[0];
    } else {
      searchParams.locality = localities;
    }
  } else if (localities.length) {
    searchParams.locality = localities;
  }

  let result = await listProperties(searchParams);

  if (!result.items.length) {
    result = await bloomSearchProperties({
      q: parsedInput.query,
      page: 1,
      limit: parsedInput.limit
    });
  }

  return {
    parser,
    parsedQuery,
    result
  };
};
