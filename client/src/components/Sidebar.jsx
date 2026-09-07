import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r border-black bg-white p-6 text-black">
      <h2 className="text-xl font-bold">Rstate Admin</h2>
      <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
        <NavLink
          to="/admin/dashboard"
          className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/AddRoom"
          className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
          Add Room
        </NavLink>
        <NavLink
          to="/admin/rooms"
          className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
          Rooms
        </NavLink>
        <NavLink
          to="/admin/Map"
          className="rounded-lg px-3 py-2 hover:bg-black hover:text-white">
          Test Map
        </NavLink>

      </nav>
    </aside>
  )
}

export default Sidebar;