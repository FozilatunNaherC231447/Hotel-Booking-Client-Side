import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Rating } from "@mui/material";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState("");

  const fetchBookings = () => {
    if (user?.email) {
      fetch(
        `https://hotel-booking-platform-server-pi.vercel.app/api/bookings?email=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => setBookings(data));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (booking) => {
    const bookingDate = moment(booking.date);
    const today = moment();
    const diff = bookingDate.diff(today, "days");
    if (diff < 1) {
      alert("You can only cancel at least 1 day before the booking date.");
      return;
    }

    try {
      const res = await fetch(
        `https://hotel-booking-platform-server-pi.vercel.app/api/bookings/${booking._id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        fetchBookings();
        setShowToast("Booking cancelled successfully!");
        setShowCancelModal(false);
      } else {
        const error = await res.text();
        alert("Failed to cancel booking: " + error);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const handleUpdateDate = () => {
    if (!newDate) return;
    fetch(
      `https://hotel-booking-platform-server-pi.vercel.app/api/bookings/${selectedBooking._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        const updatedList = bookings.map((b) =>
          b._id === selectedBooking._id ? { ...b, date: newDate } : b
        );
        setBookings(updatedList);
        setShowToast("Booking date updated!");
        setShowDateModal(false);
      });
  };

  const handleSubmitReview = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and comment before submitting.");
      return;
    }

    const reviewData = {
      roomId: selectedBooking.roomId,
      reviewer: user.displayName,
      rating,
      text: comment,
      timestamp: new Date().toISOString(),
    };

    fetch("https://hotel-booking-platform-server-pi.vercel.app/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    })
      .then(() => {
        setShowToast("Review submitted!");
        setShowReviewModal(false);
        setRating(0);
        setComment("");
        // Notify home page that reviews updated
        window.dispatchEvent(new Event("reviewsUpdated"));
      })
      .catch((err) => alert("Failed to submit review: " + err.message));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛌 My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Image</th>
                <th className="p-3">Room</th>
                <th className="p-3">Price</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">
                    <img
                      src={b.image || "https://via.placeholder.com/100"}
                      alt={b.roomName}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{b.roomName}</td>
                  <td className="p-3 text-rose-600 font-semibold">${b.price}</td>
                  <td className="p-3">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setShowCancelModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setShowReviewModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setNewDate(new Date(b.date));
                        setShowDateModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Update Date
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <p className="mb-4 text-black">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                No
              </button>
              <button
                onClick={() => handleCancel(selectedBooking)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Update Booking Date</h3>
            <DatePicker
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              minDate={new Date()}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDate}
                className="px-4 py-1 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-3">Leave a Review</h3>
            <p>
              <strong>Username:</strong> {user.displayName}
            </p>
            <div className="mt-2">
              <label>Rating (1 to 5):</label>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                max={5}
              />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full mt-3 p-2 border rounded"
              placeholder="Write your review..."
              rows={3}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-1 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {showToast}
          <button
            onClick={() => setShowToast("")}
            className="ml-3 text-white font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
