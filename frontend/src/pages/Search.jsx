import { useState, useEffect } from "react";
import axios from "axios";
import RestaurantList from "../components/RestaurantList";

const capitalizeCuisine = (cuisine) => {
    return cuisine
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const SearchRestaurants = () => {
    const [cuisines, setCuisines] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [searched, setSearched] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Detect user location when the component mounts
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                () => {
                    console.warn("Geolocation permission denied. Searching by cuisine only.");
                    setUserLocation(null); 
                }
            );
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formattedCuisines = cuisines
                .split(",")
                .map((cuisine) => capitalizeCuisine(cuisine.trim()));

            const requestData = userLocation
                ? { lat: userLocation.lat, long: userLocation.long, cuisines: formattedCuisines, page, limit: 12 }
                : { lat: null, long: null, cuisines: formattedCuisines, page, limit: 12 };

            const res = await axios.post(`${backendUrl}/api/restaurants-by-location`, requestData);
            setRestaurants(res.data.restaurants);
            setTotalPages(res.data.totalPages); // Update total pages
            setSearched(true);
        } catch (error) {
            console.log(error.message);
            setError("Failed to fetch restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = async (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Prevent out-of-bounds pagination

        setLoading(true); 
        setPage(newPage); 

        try {
            const formattedCuisines = cuisines
                .split(",")
                .map((cuisine) => capitalizeCuisine(cuisine.trim()));

            const requestData = userLocation
                ? { lat: userLocation.lat, long: userLocation.long, cuisines: formattedCuisines, page: newPage, limit: 12 }
                : { lat: null, long: null, cuisines: formattedCuisines, page: newPage, limit: 12 };

            const res = await axios.post(`${backendUrl}/api/restaurants-by-location`, requestData);
            setRestaurants(res.data.restaurants); 
        } catch (error) {
            console.log(error.message);
            setError("Failed to fetch restaurants. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Search Restaurants</h1>

            {error && <div className="text-center text-red-500">{error}</div>}

            <form onSubmit={handleSearch} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700">Cuisines (comma-separated)</label>
                    <input
                        type="text"
                        placeholder="Cuisines"
                        required={!userLocation}
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

            {restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {restaurants.length === 0 && !loading && <p className="text-center text-gray-600 mt-4">No restaurants found.</p>}
            
            {/* Pagination Controls */}
            {searched && <div className="flex justify-center mt-6 space-x-4">
                <button 
                    disabled={page === 1 || loading} 
                    onClick={() => handlePagination(page - 1)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-lg text-gray-700">Page {page} of {totalPages}</span>
                <button 
                    disabled={page === totalPages || loading} 
                    onClick={() => handlePagination(page + 1)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 disabled:opacity-50"
                >
                    Next
                </button>
            </div>}
        </div>
    );
};

export default SearchRestaurants;
