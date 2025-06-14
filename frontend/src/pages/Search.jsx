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
  const [detectingCuisine, setDetectingCuisine] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [showForm, setShowForm] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        () => {
          console.warn("Geolocation permission denied.");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (searched) handleSearch();
  }, [page]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setDetectingCuisine(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${backendUrl}/api/detect-cuisine`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const detected = res.data.cuisine;
      if (detected) {
        setCuisines(capitalizeCuisine(detected));
      } else {
        setError("Could not detect cuisine.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to detect cuisine.");
    } finally {
      setDetectingCuisine(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedCuisines = cuisines
        ? cuisines.split(",").map((c) => capitalizeCuisine(c.trim()))
        : [];

      const payload = {};
      if (lat && long) {
        payload.lat = parseFloat(lat);
        payload.long = parseFloat(long);
      }
      if (formattedCuisines.length > 0) {
        payload.cuisines = formattedCuisines;
      }

      if (!payload.lat && !payload.long && formattedCuisines.length === 0) {
        setError("Please enter at least a cuisine or location.");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${backendUrl}/api/restaurants-by-location`, payload);

      setRestaurants(res.data.restaurants);
      setSearched(true);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setShowForm(true);
    setRestaurants([]);
    setSearched(false);
    setError(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Find Restaurants
      </h1>

      {/* Search Form */}
      {showForm && (
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 space-y-6 max-w-4xl mx-auto"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Upload Food Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {detectingCuisine && (
              <p className="text-blue-600 text-sm mt-2 animate-pulse">Detecting cuisine from image...</p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Optional"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              value={long}
              onChange={(e) => setLong(e.target.value)}
              placeholder="Optional"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Cuisines */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Cuisine(s) <span className="text-sm text-gray-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={cuisines}
              onChange={(e) => setCuisines(e.target.value)}
              placeholder="Optional"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Searching..." : "Search Restaurants"}
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && <p className="text-center text-red-600 mt-4 text-lg font-medium">{error}</p>}

      {/* Results */}
      {!showForm && (
        <>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSearchAgain}
              className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
            >
              Search Again
            </button>
          </div>

          {restaurants.length > 0 ? (
            <div className="mt-10">
              <RestaurantList restaurants={restaurants} />
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-6">
              No restaurants found for the given criteria.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchRestaurants;
