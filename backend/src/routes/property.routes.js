import { Router } from "express";
import {
  aiPropertySearch,
  bloomSearch,
  getProperties,
  getPropertyDetails,
  getPropertyNearby,
  propertyMeta,
  richSearch
} from "../controllers/property.controller.js";

const router = Router();

router.route("/").get(getProperties);
router.route("/meta/filters").get(propertyMeta);
router.route("/search/bloom").get(bloomSearch);
router.route("/search/rich").get(richSearch);
router.route("/search/ai").post(aiPropertySearch);
router.route("/:identifier/nearby").get(getPropertyNearby);
router.route("/:identifier").get(getPropertyDetails);

export default router;
