import { Link } from "react-router-dom";
import error from "../assets/error.png";
export default function NotFound() {
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <img
        src={error} 
        alt="404 - Not Found"
        className="w-80 h-auto mb-8"
      />
      <h1 className="text-4xl font-bold text-rose-500 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-6 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition duration-300 font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
