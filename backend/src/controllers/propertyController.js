const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateSimulation } = require("../services/simulation");

exports.getProperty = asyncHandler(async (req, res) => {
  console.log("Received request for property with params:", req.params, "and query:", req.query);
  const { id } = req.params;
  const persona = req.query.persona || "family";

  const property = await Property.findOne({ propertyCode: id });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const simulation = generateSimulation(property, persona);

  res.json({
    success: true,
    property,
    //places: property.nearbyPlaces,
    simulation
  });
});