import express from "express";
import { getRestaurantById, getRestaurants, getRestaurantsByDetails } from "../controllers/restaurantController.js";

const router = express.Router();

router.post('/all-restaurants',getRestaurants);
router.post('/restaurant',getRestaurantById);
router.post('/restaurants-by-location',getRestaurantsByDetails);

export default router;