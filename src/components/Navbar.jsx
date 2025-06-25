import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-black text-white shadow-md relative z-50 lg:px-20 py-3">
      {/* Top Nav */}
      <div className="px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-widest text-rose-400 hover:text-rose-500 transition-all duration-300"
        >
          StayEase🛎️
        </Link>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white z-50" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-rose-400 text-2xl transition duration-200">
            Home
          </Link>
          <Link to="/rooms" className="hover:text-rose-400 text-2xl transition duration-200">
            Rooms
          </Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-rose-400 text-2xl transition duration-200">
              My Bookings
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-300 text-sm">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-rose-400 hover:bg-rose-700 px-4 py-1 rounded text-2xl transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-rose-400 hover:bg-rose-700 px-4 py-1 rounded text-2xl transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Side Drawer Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-64 bg-black border-l border-gray-700 shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 pt-12 pb-6 flex flex-col gap-4">
           <Link
            to="/"
            className="hover:text-rose-400 text-lg transition duration-200"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/rooms"
            className="hover:text-rose-400 text-lg transition duration-200"
            onClick={toggleMenu}
          >
            Rooms
          </Link>
          {user && (
            <Link
              to="/my-bookings"
              className="hover:text-rose-400 text-lg transition duration-200"
              onClick={toggleMenu}
            >
              My Bookings
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-300 text-sm">{user.displayName}</span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-rose-400 hover:bg-rose-700 px-4 py-1 rounded text-sm transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-rose-400 hover:bg-rose-700 px-4 py-1 rounded text-sm transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
