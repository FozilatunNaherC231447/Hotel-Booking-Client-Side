import { useEffect, useState } from "react";
import { Rating } from "@mui/material";

function getInitials(name) {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReviews = () => {
    fetch("https://hotel-booking-platform-server-pi.vercel.app/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setReviews(sorted);
      });
  };

  useEffect(() => {
    fetchReviews();

    const handleReviewsUpdated = () => {
      fetchReviews();
    };

    window.addEventListener("reviewsUpdated", handleReviewsUpdated);

    return () => {
      window.removeEventListener("reviewsUpdated", handleReviewsUpdated);
    };
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); // 6 seconds for better reading
    return () => clearInterval(timer);
  }, [reviews]);

  if (reviews.length === 0)
    return (
      <p className="text-center text-gray-500 italic mt-10">No reviews yet.</p>
    );

  const { reviewer, rating, text, timestamp } = reviews[currentIndex];
  const initials = getInitials(reviewer);

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-2xl shadow-lg border border-gray-500">
      <h3 className="text-2xl font-extrabold mb-8 text-center text-gray-400">
        What Our Users Say
      </h3>

      <div className="flex items-center mb-4 space-x-4 pl-20">
        <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl select-none shadow-md">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-500 ">{reviewer}</p>
          <p className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="text-center mb-4">
        <Rating value={rating} readOnly max={5} precision={0.5} />
      </div>

      <blockquote className="text-gray-300 italic text-center text-lg leading-relaxed mb-6">
        &ldquo;{text}&rdquo;
      </blockquote>

      <div className="flex justify-center space-x-8">
        <button
          onClick={() =>
            setCurrentIndex(
              (currentIndex - 1 + reviews.length) % reviews.length
            )
          }
          aria-label="Previous Review"
          className="text-indigo-600 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
        >
          ‹
        </button>

        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % reviews.length)}
          aria-label="Next Review"
          className="text-indigo-600 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
        >
          ›
        </button>
      </div>
    </div>
  );
}
