import { useState } from "react";
import axios from "axios";
import RestaurantList from "../components/RestaurantList";


const capitalizeCuisine = (cuisine) => {
    return cuisine
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const SearchRestaurants = () => {
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [cuisines, setCuisines] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formattedCuisines = cuisines
                .split(",")
                .map((cuisine) => capitalizeCuisine(cuisine.trim()));

            const res = await axios.post(`${backendUrl}/api/restaurants-by-location`, {
                lat: parseFloat(lat),
                long: parseFloat(long),
                cuisines: formattedCuisines, 
            });

            setRestaurants(res.data.restaurants);
        } catch (error) {
            setError("Failed to fetch restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Search Restaurants</h1>
            <form onSubmit={handleSearch} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700">Latitude</label>
                    <input
                        type="number"
                        placeholder="Latitude"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Longitude</label>
                    <input
                        type="number"
                        placeholder="Longitude"
                        value={long}
                        onChange={(e) => setLong(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Cuisines (comma-separated)</label>
                    <input
                        type="text"
                        placeholder="Cuisines"
                        value={cuisines}
                        onChange={(e) => setCuisines(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <div className="text-center text-xl text-red-500 mt-4">{error}</div>}

            {restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {restaurants.length === 0 && !loading && <p className="text-center text-gray-600 mt-4">No restaurants found.</p>}
        </div>
    );
};

export default SearchRestaurants;
