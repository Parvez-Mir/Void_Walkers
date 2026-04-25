import mongoose, { Schema } from "mongoose";
import { buildPropertySlug, buildSearchArtifacts } from "../utils/property.utils.js";

const coordinatesSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  { _id: false }
);

const mediaAssetSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false }
  },
  { _id: false }
);

const nearbyPlaceSchema = new Schema(
  {
    name: { type: String, trim: true },
    distanceKm: { type: Number, min: 0 }
  },
  { _id: false }
);

const furnishingDetailsSchema = new Schema(
  {
    wardrobes: { type: Number, default: 0 },
    acs: { type: Number, default: 0 },
    geysers: { type: Number, default: 0 },
    beds: { type: Number, default: 0 },
    sofas: { type: Number, default: 0 },
    diningTables: { type: Number, default: 0 },
    modularKitchen: { type: Boolean, default: false },
    chimney: { type: Boolean, default: false },
    tvUnit: { type: Boolean, default: false }
  },
  { _id: false }
);

const propertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, unique: true, trim: true },
    propertyCode: { type: String, required: true, unique: true, trim: true, index: true },
    listingType: { type: String, enum: ["sale", "rent"], required: true, index: true },
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "penthouse", "builder-floor", "studio", "plot"],
      required: true,
      index: true
    },
    category: { type: String, enum: ["residential", "commercial"], default: "residential", index: true },
    city: { type: String, default: "Ahmedabad", index: true, trim: true },
    state: { type: String, default: "Gujarat", trim: true },
    country: { type: String, default: "India", trim: true },
    location: {
      locality: { type: String, required: true, trim: true, index: true },
      microMarket: { type: String, trim: true, index: true },
      subLocality: { type: String, trim: true },
      addressLine1: { type: String, trim: true },
      landmark: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: { type: coordinatesSchema, required: true }
    },
    pricing: {
      expectedPrice: { type: Number, required: true, index: true },
      pricePerSqft: { type: Number, index: true },
      securityDeposit: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      brokerage: { type: Number, default: 0 },
      negotiable: { type: Boolean, default: true },
      taxesIncluded: { type: Boolean, default: false }
    },
    configuration: {
      bhk: { type: Number, min: 0, index: true },
      bedrooms: { type: Number, min: 0 },
      bathrooms: { type: Number, min: 0 },
      balconies: { type: Number, min: 0, default: 0 },
      storeRooms: { type: Number, min: 0, default: 0 },
      servantRoom: { type: Boolean, default: false },
      studyRoom: { type: Boolean, default: false },
      poojaRoom: { type: Boolean, default: false }
    },
    area: {
      superBuiltupArea: { type: Number, required: true, index: true },
      builtupArea: { type: Number },
      carpetArea: { type: Number },
      plotArea: { type: Number },
      areaUnit: { type: String, default: "sqft" }
    },
    building: {
      projectName: { type: String, trim: true, index: true },
      tower: { type: String, trim: true },
      floorNumber: { type: Number, min: 0 },
      totalFloors: { type: Number, min: 0 },
      totalUnits: { type: Number, min: 0 },
      totalTowers: { type: Number, min: 0 },
      propertyAge: { type: Number, min: 0 },
      constructionStatus: {
        type: String,
        enum: ["ready-to-move", "under-construction", "new-launch", "resale"],
        index: true
      }
    },
    layout: {
      facing: { type: String, trim: true },
      cornerProperty: { type: Boolean, default: false },
      roadWidth: { type: Number, min: 0 },
      openSides: { type: Number, min: 1, default: 1 },
      overlooking: [{ type: String, trim: true }]
    },
    furnishing: {
      status: { type: String, enum: ["unfurnished", "semi-furnished", "fully-furnished"], index: true },
      details: { type: furnishingDetailsSchema, default: () => ({}) }
    },
    amenities: {
      lift: { type: Boolean, default: false },
      parking: { type: Number, default: 0 },
      visitorParking: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      waterSupply: { type: String, default: "corporation" },
      security: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      clubHouse: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      childrenPlayArea: { type: Boolean, default: false },
      gasPipeline: { type: Boolean, default: false },
      internetReady: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false }
    },
    availability: {
      availableFrom: { type: Date },
      isReadyToMove: { type: Boolean, default: false, index: true },
      possessionStatus: { type: String, trim: true },
      occupancyStatus: { type: String, trim: true }
    },
    legal: {
      ownershipType: { type: String, enum: ["freehold", "leasehold", "co-operative-society"] },
      transactionType: { type: String, trim: true },
      approvedBy: [{ type: String, trim: true }],
      reraId: { type: String, trim: true },
      loanAvailable: { type: Boolean, default: true }
    },
    seller: {
      sellerType: { type: String, enum: ["owner", "agent", "builder"], index: true },
      contactName: { type: String, trim: true },
      contactPhoneMasked: { type: String, trim: true },
      rating: { type: Number, min: 0, max: 5 }
    },
    description: { type: String, trim: true },
    highlights: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true, index: true }],
    media: {
      coverImage: { type: String, trim: true },
      gallery: { type: [mediaAssetSchema], default: [] },
      floorPlanImages: { type: [mediaAssetSchema], default: [] },
      videoTourUrl: { type: String, trim: true }
    },
    nearby: {
      localities: [{ type: String, trim: true }],
      schools: { type: [nearbyPlaceSchema], default: [] },
      hospitals: { type: [nearbyPlaceSchema], default: [] },
      metro: { type: [nearbyPlaceSchema], default: [] },
      malls: { type: [nearbyPlaceSchema], default: [] }
    },
    scores: {
      walkScore: { type: Number, min: 0, max: 10 },
      connectivityScore: { type: Number, min: 0, max: 10 },
      livabilityScore: { type: Number, min: 0, max: 10 },
      investmentScore: { type: Number, min: 0, max: 10 }
    },
    searchText: { type: String, trim: true },
    tokens: [{ type: String, trim: true, index: true }],
    normalizedLocalities: [{ type: String, trim: true, index: true }],
    source: { type: String, default: "mock-seed", trim: true },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true }
  },
  {
    timestamps: true
  }
);

propertySchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = buildPropertySlug({ title: this.title, propertyCode: this.propertyCode });
  }

  if (!this.media?.coverImage && this.media?.gallery?.length) {
    this.media.coverImage = this.media.gallery[0].url;
  }

  const artifacts = buildSearchArtifacts({
    title: this.title,
    slug: this.slug,
    description: this.description,
    projectName: this.building?.projectName,
    location: this.location,
    configuration: this.configuration,
    propertyType: this.propertyType,
    listingType: this.listingType,
    highlights: this.highlights,
    tags: this.tags,
    nearby: this.nearby
  });

  this.searchText = artifacts.searchText;
  this.tokens = artifacts.tokens;
  this.normalizedLocalities = artifacts.normalizedLocalities;
  next();
});

propertySchema.index({ "location.coordinates": "2dsphere" });
propertySchema.index({
  title: "text",
  description: "text",
  "location.locality": "text",
  "location.microMarket": "text",
  "building.projectName": "text",
  tags: "text",
  searchText: "text"
});

export const Property = mongoose.model("Property", propertySchema);
