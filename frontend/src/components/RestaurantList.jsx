import { useNavigate } from "react-router-dom";

const RestaurantList = ({ restaurants }) => {
    if (!restaurants.length) return <p className="text-center text-gray-600">No restaurants found.</p>;
    const navigate = useNavigate();

    const defautltImage ="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D00";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {restaurants.map((restaurant) => (
                <div 
                    key={restaurant._id} 
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/restaurants/${restaurant["Restaurant ID"]}`)}
                >
                    <div className="p-4">
                        {/* Restaurant Image */}
                        
                        <img
                            src={restaurant["featured_image"] || defautltImage}
                            alt={restaurant["Restaurant Name"]}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        

                        {/* Restaurant Name */}
                        <h2 className="text-xl font-bold text-gray-800">{restaurant["Restaurant Name"]}</h2>
                        <p className="text-gray-600">{restaurant["Cuisines"]}</p>
                        <p className="text-gray-700 font-semibold mt-2">⭐ {restaurant["Aggregate rating"]}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RestaurantList;
