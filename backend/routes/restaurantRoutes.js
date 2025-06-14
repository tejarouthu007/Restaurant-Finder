import express from "express";
import multer from "multer";
import {
    getRestaurantById,
    getRestaurants,
    getRestaurantsByDetails,
    detectCuisineFromImage,
} from "../controllers/restaurantController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.post('/all-restaurants', getRestaurants);
router.post('/restaurant', getRestaurantById);
router.post('/restaurants-by-location', getRestaurantsByDetails);
router.post('/detect-cuisine', upload.single("image"), detectCuisineFromImage); 

export default router;
