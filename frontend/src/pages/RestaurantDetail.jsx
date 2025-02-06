import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantDetail = () => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const restaurantId = parseInt(id);

    const defaultImage =
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D00";
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const response = await axios.post(`${backendurl}/api/restaurant`, { Id: restaurantId });
                setRestaurant(response.data);
            } catch (error) {
                setError("404 not found.");
            } finally {
                setLoading(false);
            }
        };

        getRestaurant();
    }, [id, backendurl]);

    if (loading) return <div className="text-center p-2 text-base">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-2 text-base">{error}</div>;

    return (
        restaurant && (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                {/* Centered Restaurant Detail Card */}
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        {/* Restaurant Image */}
                        <img
                            src={restaurant["featured_image"] || defaultImage}
                            alt={restaurant["Restaurant Name"]}
                            className="w-full h-60 object-cover rounded-md mb-6"
                        />

                        {/* Restaurant Name and Menu Link */}
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-bold text-retroOrange">{restaurant["Restaurant Name"]}</h1>
                            {restaurant["menu_url"] && (
                                <a
                                    href={restaurant["menu_url"]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg text-blue-500 hover:underline"
                                >
                                    Menu
                                </a>
                            )}
                        </div>

                        {/* Cuisines */}
                        <p className="text-lg text-gray-700 mb-4">{restaurant["Cuisines"]}</p>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4 text-lg">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            <p className="text-gray-700">
                                {restaurant["Aggregate rating"]} ({restaurant["Rating text"]})
                            </p>
                        </div>

                        {/* Address */}
                        <div className="bg-gray-100 p-4 rounded-md mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                            <p className="text-lg text-gray-600">{restaurant["Address"]}</p>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-100 p-4 rounded-md mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                            <p className="text-lg text-gray-600">
                                {restaurant["City"]}, {restaurant["Country Code"]}
                            </p>
                        </div>

                        {/* Always Visible Additional Info */}
                        <div className="bg-gray-100 p-4 rounded-md mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Additional Info</h3>
                            <p className="text-lg text-gray-600">
                                Average Cost for Two: {restaurant["Average Cost for two"]} {restaurant["Currency"]}
                            </p>
                            <p className="text-lg text-gray-600">
                                Table Booking: {restaurant["Has Table booking"] ? "Yes" : "No"}
                            </p>
                            <p className="text-lg text-gray-600">
                                Online Delivery: {restaurant["Has Online delivery"] ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default RestaurantDetail;
