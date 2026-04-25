import { z } from "zod";
import {
  bloomSearchProperties,
  getPropertyByIdentifier,
  getPropertyFilterMeta,
  listProperties
} from "../services/property-search.service.js";
import { runAiPropertySearch } from "../services/property-ai.service.js";

const searchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  city: z.string().optional(),
  locality: z.union([z.string(), z.array(z.string())]).optional(),
  localities: z.union([z.string(), z.array(z.string())]).optional(),
  propertyType: z.union([z.string(), z.array(z.string())]).optional(),
  propertyTypes: z.union([z.string(), z.array(z.string())]).optional(),
  listingType: z.union([z.string(), z.array(z.string())]).optional(),
  listingTypes: z.union([z.string(), z.array(z.string())]).optional(),
  bhk: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  furnishingStatus: z.string().optional(),
  constructionStatus: z.string().optional(),
  amenities: z.union([z.string(), z.array(z.string())]).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  isFeatured: z.union([z.string(), z.boolean()]).optional()
});

export const getProperties = async (req, res, next) => {
  try {
    const params = searchQuerySchema.parse(req.query);
    const data = await listProperties(params);
    return res.status(200).json({
      success: true,
      data,
      message: "Properties fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyDetails = async (req, res, next) => {
  try {
    const property = await getPropertyByIdentifier(req.params.identifier);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
      message: "Property fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const bloomSearch = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const data = await bloomSearchProperties({
      q: req.query.q || "",
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Bloom search completed"
    });
  } catch (error) {
    next(error);
  }
};

export const richSearch = async (req, res, next) => {
  return getProperties(req, res, next);
};

export const propertyMeta = async (req, res, next) => {
  try {
    const data = await getPropertyFilterMeta();
    return res.status(200).json({
      success: true,
      data,
      message: "Property filter metadata fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const aiPropertySearch = async (req, res, next) => {
  try {
    const data = await runAiPropertySearch(req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "AI property search completed"
    });
  } catch (error) {
    next(error);
  }
};
