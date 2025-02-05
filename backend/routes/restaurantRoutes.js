import express from "express";
import { getRestaurantById, getRestaurants, getRestaurantsByLocation } from "../controllers/restaurantController.js";

const router = express.Router();

router.post('/all-restaurants',getRestaurants);
router.post('/restaurant',getRestaurantById);
router.post('/restaurants-by-location',getRestaurantsByLocation);

export default router;