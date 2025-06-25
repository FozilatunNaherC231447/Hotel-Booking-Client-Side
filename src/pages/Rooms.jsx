import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

export default function Rooms() {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [reviewsByRoom, setReviewsByRoom] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Price filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  // Fetch rooms and reviews, accepts optional price filters
  useEffect(() => {
    async function fetchRoomsAndReviews() {
      setLoading(true);
      setError(null);
      try {
        // Build query string for price filtering
        const params = new URLSearchParams();
        if (minPrice !== "") params.append("minPrice", minPrice);
        if (maxPrice !== "") params.append("maxPrice", maxPrice);

        const url = `https://hotel-booking-platform-server-pi.vercel.app/api/rooms?${params.toString()}`;
        const roomsRes = await fetch(url);
        if (!roomsRes.ok) throw new Error("Failed to fetch rooms");
        const roomsData = await roomsRes.json();

        // Fetch reviews for each room in parallel
        const reviewsFetches = roomsData.map(async (room) => {
          try {
            const revRes = await fetch(
              `https://hotel-booking-platform-server-pi.vercel.app/api/reviews?roomId=${room._id}`
            );
            if (!revRes.ok) throw new Error("Failed to fetch reviews for room " + room._id);
            const revData = await revRes.json();
            return { roomId: room._id, reviews: Array.isArray(revData) ? revData : [] };
          } catch {
            return { roomId: room._id, reviews: [] };
          }
        });

        const reviewsResults = await Promise.all(reviewsFetches);
        const reviewsMap = {};
        reviewsResults.forEach(({ roomId, reviews }) => {
          reviewsMap[roomId] = reviews;
        });

        setRooms(roomsData);
        setReviewsByRoom(reviewsMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomsAndReviews();
  }, [minPrice, maxPrice]); // refetch when price filters change

  const handleCardClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  // Handlers for filter inputs
  const handleMinPriceChange = (e) => {
    const val = e.target.value;
    // Only allow numeric or empty
    if (val === "" || /^\d*\.?\d*$/.test(val)) setMinPrice(val);
  };
  const handleMaxPriceChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) setMaxPrice(val);
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🛌 Available Rooms</h2>

      {/* Price filter */}
      <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <div>
          <label htmlFor="minPrice" className="mr-2 font-semibold text-gray-300">
            Min Price:
          </label>
          <input
            id="minPrice"
            type="text"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
            className="border rounded px-3 py-1 w-24"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="mr-2 font-semibold text-gray-300">
            Max Price:
          </label>
          <input
            id="maxPrice"
            type="text"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="1000"
            className="border rounded px-3 py-1 w-24"
          />
        </div>
      </div>

      {loading && <p className="p-5 text-center">Loading rooms...</p>}
      {error && <p className="p-5 text-center text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {rooms.length === 0 ? (
            <p className="text-center text-gray-500">No rooms available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const embeddedReviews = Array.isArray(room.reviews) ? room.reviews : [];
                const newReviews = reviewsByRoom[room._id] || [];
                const allReviews = [...embeddedReviews, ...newReviews];
                const totalReviews = allReviews.length;
                const averageRating =
                  totalReviews > 0
                    ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
                    : "N/A";

                return (
                  <div
                    key={room._id}
                    onClick={() => handleCardClick(room._id)}
                    className="cursor-pointer border border-gray-200 rounded-lg shadow hover:shadow-md transition duration-200"
                  >
                    <img
                      src={room.image || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={room.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-1">
                      <h3 className="text-xl font-semibold">{room.name}</h3>
                      <p className="text-gray-500 text-sm">{room.location}</p>
                      <p className="text-sm text-gray-500 italic line-clamp-2">
                        {room.description || "No description available."}
                      </p>
                      <p className="text-rose-600 font-bold">${room.price}</p>

                      <p className="text-yellow-600">
                        ⭐ {averageRating} {averageRating !== "N/A" && "/ 5"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <strong>{totalReviews}</strong> review{totalReviews !== 1 && "s"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
