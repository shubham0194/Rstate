import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../utils/Auth";
import "../index.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUser());
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-black">
          Rstate
        </Link>
        <Link to="/" className="text-gray-700 hover:text-black">
          Home
        </Link>
        <Link to="/rooms" className="text-gray-700 hover:text-black">
          Rooms
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-black">
          About
        </Link>
        {user && user.role === "user" && (
          <Link to="/favorites" className="text-gray-700 hover:text-black">
            Favorites
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && user.role === "admin" && (
          <Link
            to="/admin"
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Admin Panel
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Welcome, <strong className="text-black">{user.name || "User"}</strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-red-600 px-3 py-1.5 text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded border border-black px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;