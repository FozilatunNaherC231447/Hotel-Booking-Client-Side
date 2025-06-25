import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReviewsCarousel from "../components/ReviewsCarousel";


import slide1 from "../assets/img1.jpg";
import slide2 from "../assets/img2.jpg";
import slide3 from "../assets/img3.jpeg";
import slide4 from "../assets/img4.jpg";


const slides = [
  {
    image: slide1,
    title: "Relax. Recharge. Rejuvenate.",
    description: "Experience luxury at its finest with HotelBook.",
  },
  {
    image: slide2,
    title: "Your Comfort, Our Priority",
    description: "Enjoy world-class amenities and unparalleled service.",
  },
  {
    image: slide3,
    title: "Discover New Horizons",
    description: "Explore our exclusive rooms and breathtaking views.",
  },
];

export default function Home() {
  const [showOffer, setShowOffer] = useState(true);
  const [current, setCurrent] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowOffer(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearTimeout(slideTimer);
  }, [current]);

  useEffect(() => {
    fetch("https://hotel-booking-platform-server-pi.vercel.app/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        // Only include rooms that have at least one review
        const roomsWithReviews = data.filter(
          (room) => Array.isArray(room.reviews) && room.reviews.length > 0
        );
        setRooms(roomsWithReviews);
        setLoadingRooms(false);
        setLoadingReviews(false); // Since reviews are embedded in rooms
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoadingRooms(false);
        setLoadingReviews(false);
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>HotelBook | Home</title>
      </Helmet>

      {/* Hero Slider */}
      <section
        className="relative h-[400px] flex flex-col justify-center items-center text-white text-center mx-6 md:mx-13 px-4 mt-10 mb-15"
        style={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{slides[current].title}</h1>
          <p className="text-lg md:text-xl mb-6">{slides[current].description}</p>
          <Link to="/rooms" className="bg-rose-500 px-6 py-2 rounded text-white hover:bg-rose-600 transition">
            View Rooms
          </Link>
        </div>
        <div className="absolute bottom-6 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${i === current ? "bg-rose-500" : "bg-gray-400"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Special Offer Modal */}
      {showOffer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative text-center">
            <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
              ✖
            </button>
            <img src={slide4} alt="Special Offer" className="rounded-lg mb-4 w-full object-cover" />
            <h2 className="text-xl font-semibold text-yellow-600 mb-2">🎁 Special Offer!</h2>
            <p className="text-gray-800">
              Get <strong>20% off</strong> your first booking. Limited time only!
            </p>
          </div>
        </motion.div>
      )}

      {/* Map Section */}
      <section className="p-6 mb-15">
        <h2 className="text-4xl font-bold mb-10 text-center">Our Location</h2>
        <div className="h-96 w-full max-w-4xl mx-auto">
          <MapContainer center={[40.7128, -74.006]} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded shadow">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={[40.7128, -74.006]}>
              <Popup>HotelBook's Main Branch</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="p-6">
        <h2 className="text-4xl font-bold text-center mb-10">Top Rated Rooms</h2>
        {loadingRooms ? (
          <p className="text-center text-gray-500">Loading rooms...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rooms
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((room) => (
                <div key={room._id} className="bg-white rounded shadow overflow-hidden transition hover:shadow-lg">
                  <img
                    src={room.image || "https://i.ibb.co/Yty8btL/no-image.jpg"}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-black">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.location}</p>
                    <p className="text-sm text-yellow-600 mt-1 mb-1">⭐ {room.rating?.toFixed(1)}</p>
                    <p className="text-rose-500 font-semibold mb-2">${room.price}</p>
                    <Link
                      to={`/room/${room._id}`}
                      className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

        {/* User Reviews Section - Room Based */}
      <section className="my-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10 mt-5">Reviews & Ratings</h2>
        <ReviewsCarousel />
      </section>

      {/* Amenities */}
      <section className="p-6 max-w-7xl mx-auto mt-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10 mt-5">World-Class Amenities</h2>
        <div className="grid md:grid-cols-3 gap-4 text-center bg-black p-10">
          <div>
            <img src="https://img.icons8.com/ios-filled/100/ffffff/spa.png" alt="Spa" className="mx-auto mb-2" />
            <h3 className="font-semibold text-white">Spa & Wellness</h3>
          </div>
          <div>
            <img src="https://img.icons8.com/ios-filled/100/ffffff/restaurant.png" alt="Restaurant" className="mx-auto mb-2" />
            <h3 className="font-semibold text-white">Fine Dining</h3>
          </div>
          <div>
            <img src="https://img.icons8.com/ios-filled/100/ffffff/swimming.png" alt="Pool" className="mx-auto mb-2" />
            <h3 className="font-semibold text-white">Infinity Pool</h3>
          </div>
        </div>
      </section>

      {/* Choose Your Experience */}
      <section className="py-16 px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10">Choose Your Experience</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center text-black">
          {[
            { title: "Business", icon: "💼", bg: "bg-blue-100" },
            { title: "Family", icon: "👨‍👩‍👧‍👦", bg: "bg-green-100" },
            { title: "Romantic", icon: "💖", bg: "bg-pink-100" },
            { title: "Adventure", icon: "🌄", bg: "bg-yellow-100" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all ${item.bg}`}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title} Stay</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
