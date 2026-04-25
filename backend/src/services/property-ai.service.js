import { z } from "zod";
import { bloomSearchProperties, listProperties } from "./property-search.service.js";
import { normalizeToken, parseMultiValue } from "../utils/property.utils.js";

const aiSearchSchema = z.object({
  query: z.string().min(2),
  city: z.string().optional().default("Ahmedabad"),
  limit: z.number().int().min(1).max(20).optional().default(8)
});

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
  const localities = localityLexicon
    .filter((entry) => normalized.includes(entry))
    .map((entry) => entry.replace(/\b\w/g, (character) => character.toUpperCase()));
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
  const searchParams = {
    city: parsedQuery.city || parsedInput.city,
    listingType: parsedQuery.listingType,
    propertyType: parsedQuery.propertyType,
    bhk: parsedQuery.bhk,
    locality: localities,
    minPrice: parsedQuery.minPrice,
    maxPrice: parsedQuery.maxPrice,
    amenities: parsedQuery.amenities,
    sortBy: parsedQuery.sortBy,
    limit: parsedInput.limit,
    page: 1
  };

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
