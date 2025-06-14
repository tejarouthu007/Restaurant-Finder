import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Restaurant from "../models/restaurant.js";
import cuisineList from "../constants/cuisineList.js"

export const getRestaurantById = async(req,res) => {
    try {
        const {Id} = req.body;
        const restaurant = await Restaurant.findOne({"Restaurant ID": Id});

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        res.status(200).json(restaurant);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

export const getRestaurants = async(req,res) => {
    try {
        const {page=1, limit=20} = req.body;
        const pageNo = parseInt(page);
        const Limit = parseInt(limit);

        const restaurants = await Restaurant.paginate({},{page: pageNo, limit: Limit});

        // console.log(restaurants.pages);
        // console.log(restaurants.total);

        res.status(200).json({
            page: restaurants.page,
            totalPages: restaurants.totalPages,
            totalRestaurants: restaurants.totalDocs,
            restaurants: restaurants.docs,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

export const getRestaurantsByDetails = async (req, res) => {
    try {
        const { lat, long, cuisines, page = 1, limit = 12 } = req.body;
        const skip = (page - 1) * limit;

        let pipeline = [];
        // To count total matching documents
        let countPipeline = [...pipeline];

        if (lat && long) {
            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] },
                    distanceField: "distance",
                    maxDistance: 10000,
                    spherical: true
                }
            });
        }

        if (cuisines && cuisines.length > 0) {
            pipeline.push(
                {
                    $addFields: {
                        matchCount: {
                            $size: {
                                $setIntersection: [
                                    { 
                                        $split: [
                                            { $convert: { input: "$Cuisines", to: "string", onError: "", onNull: "" } },
                                            ", "
                                        ]
                                    },
                                    cuisines
                                ]
                            }
                        }
                    }
                },
                { $sort: { matchCount: -1 } }, 
                { $skip: skip },
                { $limit: limit }
            );
        }

        if (lat && long) {
            countPipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] },
                    distanceField: "distance",
                    maxDistance: 10000,
                    spherical: true
                }
            });
        }

        if (cuisines && cuisines.length > 0) {
            countPipeline.push(
                {
                    $addFields: {
                        matchCount: {
                            $size: {
                                $setIntersection: [
                                    { 
                                        $split: [
                                            { $convert: { input: "$Cuisines", to: "string", onError: "", onNull: "" } }, 
                                            ", "
                                        ]
                                    },
                                    cuisines
                                ]
                            }
                        }
                    }
                }
            );
        }


        const totalCount = await Restaurant.aggregate(countPipeline);

        const restaurants = await Restaurant.aggregate(pipeline);

        const totalPages = Math.ceil(totalCount.length / limit);

        res.status(200).json({
            totalPages,
            totalRestaurants: totalCount.length,
            restaurants
        });
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const detectCuisineFromImage = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = file.path;

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a classifier. Given the image of food, return ONE WORD ONLY — the most likely cuisine from this list: ${cuisineList.join(", ")}. Your response must be exactly one word and match one from the list. No extra text.`;

        const result = await model.generateContent({
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Image,
                                mimeType: file.mimetype,
                            },
                        },
                    ],
                },
            ],
        });

        const responseText = result.response.text().trim();
        const detectedCuisine = cuisineList.find(
            (c) => responseText.toLowerCase() === c.toLowerCase()
        );

        if (!detectedCuisine) {
            return res.status(400).json({ error: "Cuisine could not be confidently detected" });
        }

        return res.status(200).json({ cuisine: detectedCuisine });

    } catch (err) {
        console.error("Cuisine detection error:", err);
        return res.status(500).json({ error: "Failed to detect cuisine" });
    } finally {
        fs.unlink(imagePath, (err) => {
            if (err) console.warn("Could not delete uploaded image:", err);
        });
    }
};
