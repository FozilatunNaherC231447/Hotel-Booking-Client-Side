import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../providers/AuthProvider";

export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBookedGlobally, setIsBookedGlobally] = useState(false);
  const [embeddedReviews, setEmbeddedReviews] = useState([]);
  const [newReviews, setNewReviews] = useState([]);

  const fallbackImage = "https://i.ibb.co/Yty8btL/no-image.jpg";

  useEffect(() => {
    async function fetchRoomAndReviews() {
      try {
        // 1. Fetch room info (including embedded reviews)
        const roomRes = await fetch(
          `https://hotel-booking-platform-server-pi.vercel.app/api/rooms/${id}`
        );
        const roomData = await roomRes.json();
        setRoom(roomData);
        setIsBookedGlobally(roomData?.isBooked ?? false);
        setEmbeddedReviews(Array.isArray(roomData.reviews) ? roomData.reviews : []);

        // 2. Fetch separately stored reviews
        const revRes = await fetch(
          `https://hotel-booking-platform-server-pi.vercel.app/api/reviews?roomId=${id}`
        );
        const revData = await revRes.json();
        setNewReviews(Array.isArray(revData) ? revData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomAndReviews();
  }, [id]);

  const handleBookNowClick = () => {
    if (!user) return navigate("/login");
    setShowModal(true);
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a booking date.");
      return;
    }

    const bookingData = {
      roomId: room._id,
      roomName: room.name,
      image: room.image,
      price: room.price,
      email: user.email,
      date: selectedDate,
    };

    try {
      await fetch("https://hotel-booking-platform-server-pi.vercel.app/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      alert("Room booked successfully!");
      setIsBookedGlobally(true);
      setShowModal(false);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Try again.");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!room) return <div className="text-center text-red-500 p-10">Room not found.</div>;

  // Combine and sort reviews by timestamp descending (newest first)
  const allReviews = [...embeddedReviews, ...newReviews].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="p-6 lg:py-20 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">{room.name}</h2>
      <img
        src={room.image || fallbackImage}
        alt={room.name}
        className="w-full h-64 object-cover rounded"
      />
      <p className="text-sm text-gray-500">📍 {room.location}</p>
      <p className="font-semibold text-rose-600 text-lg">${room.price}</p>

      {/* Overall Rating & Total Reviews */}
      <p className="text-yellow-600">⭐ {room.rating} / 5</p>
      <p className="text-gray-400">
        <strong>{allReviews.length}</strong> review{allReviews.length !== 1 && "s"}
      </p>

      <p className="text-gray-400">{room.description || "No description available."}</p>

      <div>
        <h3 className="text-lg font-semibold">Reviews</h3>
        {allReviews.length === 0 ? (
          <p className="text-gray-400 italic mt-1">No reviews yet.</p>
        ) : (
          <ul className="list-disc ml-6 mt-2 space-y-3">
            {allReviews.map(({ _id, text, rating, reviewer, timestamp }) => (
              <li key={_id} className="border-b border-gray-700 pb-2">
                <p className="font-semibold">
                  {reviewer}{" "}
                  <span className="text-yellow-400">
                    ⭐ {rating}
                  </span>
                </p>
                <p>{text}</p>
                <p className="text-xs text-gray-400">
                  {new Date(timestamp).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        disabled={isBookedGlobally}
        onClick={handleBookNowClick}
        className={
          "px-6 py-2 font-semibold text-white rounded " +
          (isBookedGlobally ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700")
        }
      >
        {isBookedGlobally ? "Room Already Booked" : "Book Now"}
      </button>

      {showModal && !isBookedGlobally && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h3 className="text-2xl font-bold mb-4">Booking Summary</h3>
            <p><strong>Room:</strong> {room.name}</p>
            <p><strong>Location:</strong> {room.location}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <p className="mt-2">{room.description || "No description available."}</p>

            <div className="mt-4">
              <label className="block font-medium mb-1">Select Booking Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                className="w-full p-2 border rounded"
                placeholderText="Click to select a date"
                dateFormat="MMMM d, yyyy"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!selectedDate}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
