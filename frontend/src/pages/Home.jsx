import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RestaurantList from "../components/RestaurantList";

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.post(`${backendUrl}/api/all-restaurants`, { page, limit: 20 });
                setRestaurants(res.data.restaurants);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                setError("Failed to load restaurants. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [page, backendUrl]);

    return (
        <div className="container mx-auto p-6">
            {/* Navbar */}
            <nav className="bg-white py-4 sticky top-0 z-50">
                <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
                    {/* Title */}
                    <h1 className="text-black text-5xl font-bold">Restaurant Finder</h1>

                    {/* Search Button */}
                    <Link
                        to="/search"
                        className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 text-lg font-semibold"
                    >
                        Search
                    </Link>
                </div>
            </nav>

            {/* Aesthetic Line Divider */}
            <hr className="my-6 border-t-2 border-gray-200" />

            {/* Restaurant Listings */}
            <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Restaurant Listings</h1>

            {/* Loading/Error States */}
            {loading && <div className="text-center text-xl text-gray-600">Loading...</div>}
            {error && <div className="text-center text-xl text-red-500">{error}</div>}

            {/* Restaurant List */}
            {!loading && !error && <RestaurantList restaurants={restaurants} />}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-4">
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-lg text-gray-700">Page {page} of {totalPages}</span>
                <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
