import Restaurant from "../models/restaurant.js";

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

export const getRestaurantsByLocation = async (req, res) => {
    try {
        const { lat, long, cuisines } = req.body;

        const matchStage = cuisines && cuisines.length > 0 ? {
            $addFields: {
                "matchCount": {
                    $size: {
                        $setIntersection: [{$split: ["$Cuisines", ", "]}, cuisines]
                    }
                }
            }
        } : {};

        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lat, long] },
                    distanceField: "distance",
                    maxDistance: 10000,
                    spherical: true
                }
            },
            matchStage, 
            // { $match: { matchCount: { $gt: 0 } } },
            { $sort: { matchCount: -1 } }
        ]);

        
        const totalRestaurants = restaurants.length;

        res.status(200).json({
            totalRestaurants,
            restaurants
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
