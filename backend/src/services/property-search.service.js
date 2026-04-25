import mongoose from "mongoose";
import { Property } from "../models/property.model.js";
import { normalizeToken, parseMultiValue } from "../utils/property.utils.js";

const toPositiveNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildSort = (sortBy = "relevance") => {
  switch (sortBy) {
    case "price-asc":
      return { "pricing.expectedPrice": 1, createdAt: -1 };
    case "price-desc":
      return { "pricing.expectedPrice": -1, createdAt: -1 };
    case "latest":
      return { createdAt: -1 };
    case "investment":
      return { "scores.investmentScore": -1, createdAt: -1 };
    case "livability":
      return { "scores.livabilityScore": -1, createdAt: -1 };
    default:
      return { isFeatured: -1, "scores.connectivityScore": -1, createdAt: -1 };
  }
};

export const buildPropertyFilters = (params = {}) => {
  const filter = { isActive: true };
  const localities = parseMultiValue(params.locality || params.localities);
  const propertyTypes = parseMultiValue(params.propertyType || params.propertyTypes);
  const listingTypes = parseMultiValue(params.listingType || params.listingTypes);
  const amenities = parseMultiValue(params.amenities);

  if (params.city) {
    filter.city = new RegExp(`^${String(params.city).trim()}$`, "i");
  }

  if (localities.length) {
    filter.$or = [
      { "location.locality": { $in: localities.map((entry) => new RegExp(`^${entry}$`, "i")) } },
      { "location.microMarket": { $in: localities.map((entry) => new RegExp(`^${entry}$`, "i")) } },
      { normalizedLocalities: { $in: localities.map((entry) => normalizeToken(entry)) } }
    ];
  }

  if (propertyTypes.length) {
    filter.propertyType = { $in: propertyTypes };
  }

  if (listingTypes.length) {
    filter.listingType = { $in: listingTypes };
  }

  const bhk = toPositiveNumber(params.bhk);
  if (bhk !== undefined) {
    filter["configuration.bhk"] = bhk;
  }

  const minPrice = toPositiveNumber(params.minPrice);
  const maxPrice = toPositiveNumber(params.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter["pricing.expectedPrice"] = {};
    if (minPrice !== undefined) filter["pricing.expectedPrice"].$gte = minPrice;
    if (maxPrice !== undefined) filter["pricing.expectedPrice"].$lte = maxPrice;
  }

  const minArea = toPositiveNumber(params.minArea);
  const maxArea = toPositiveNumber(params.maxArea);
  if (minArea !== undefined || maxArea !== undefined) {
    filter["area.superBuiltupArea"] = {};
    if (minArea !== undefined) filter["area.superBuiltupArea"].$gte = minArea;
    if (maxArea !== undefined) filter["area.superBuiltupArea"].$lte = maxArea;
  }

  if (params.furnishingStatus) {
    filter["furnishing.status"] = params.furnishingStatus;
  }

  if (params.constructionStatus) {
    filter["building.constructionStatus"] = params.constructionStatus;
  }

  if (params.isFeatured !== undefined) {
    filter.isFeatured = String(params.isFeatured) === "true";
  }

  amenities.forEach((amenity) => {
    filter[`amenities.${amenity}`] = true;
  });

  const lat = toPositiveNumber(params.lat);
  const lng = toPositiveNumber(params.lng);
  const radiusKm = toPositiveNumber(params.radiusKm || params.radius);
  if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
    filter["location.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: radiusKm * 1000
      }
    };
  }

  return filter;
};

export const listProperties = async (params = {}) => {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
  const filter = buildPropertyFilters(params);
  const sort = buildSort(params.sortBy);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Property.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Property.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const bloomSearchProperties = async ({ q = "", page = 1, limit = 10 } = {}) => {
  const normalized = normalizeToken(q);
  const tokens = normalized.split(" ").filter(Boolean);
  const skip = (page - 1) * limit;

  const filter = {
    isActive: true
  };

  if (tokens.length) {
    filter.$and = tokens.map((token) => ({
      $or: [
        { tokens: token },
        { normalizedLocalities: token },
        { searchText: { $regex: token, $options: "i" } }
      ]
    }));
  }

  const [items, total] = await Promise.all([
    Property.find(filter)
      .sort({ isFeatured: -1, "scores.connectivityScore": -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(filter)
  ]);

  return {
    items,
    queryTokens: tokens,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getPropertyByIdentifier = async (identifier) => {
  const orConditions = [{ slug: identifier }, { propertyCode: identifier }];
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    orConditions.unshift({ _id: identifier });
  }

  const property = await Property.findOne({
    $or: orConditions
  }).lean();

  return property;
};

export const getPropertyFilterMeta = async () => {
  const [summary, localities, projectNames] = await Promise.all([
    Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$pricing.expectedPrice" },
          maxPrice: { $max: "$pricing.expectedPrice" },
          minArea: { $min: "$area.superBuiltupArea" },
          maxArea: { $max: "$area.superBuiltupArea" },
          listingTypes: { $addToSet: "$listingType" },
          propertyTypes: { $addToSet: "$propertyType" },
          furnishingStatuses: { $addToSet: "$furnishing.status" },
          bhkOptions: { $addToSet: "$configuration.bhk" }
        }
      }
    ]),
    Property.distinct("location.locality", { isActive: true }),
    Property.distinct("building.projectName", { isActive: true })
  ]);

  return {
    ...(summary[0] || {}),
    localities: localities.sort(),
    projectNames: projectNames.filter(Boolean).sort().slice(0, 100)
  };
};
