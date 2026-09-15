import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../utils/Auth'

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-black bg-white p-6 text-black">
      <div>
        <h2 className="text-xl font-bold">Rstate Admin</h2>
        <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
          <NavLink
            to="/admin/dashboard"
            className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/rooms"
            className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
            Rooms
          </NavLink>
          <NavLink
            to="/admin/AddRoom"
            className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
            Add Room
          </NavLink>
          <NavLink
            to="/admin/Map"
            className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
            Test Map
          </NavLink>
        </nav>
      </div>

      <div className="pt-6 border-t border-gray-200 grid gap-2">
        <NavLink
          to="/"
          className="rounded-lg px-3 py-2 border border-black text-center hover:bg-gray-100">
          View Main Site
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 bg-red-600 text-white text-center hover:bg-red-700">
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar;