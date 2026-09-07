import { Routes, Route } from 'react-router-dom';

// for public imports
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Room from './pages/Room';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import About from './pages/About';
import PageNotFound from './pages/PageNotFound';

// for admin imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AddRoom from './pages/Admin/AddRoom';
import AdminRooms from './pages/Admin/Rooms';
import Map from './pages/Admin/Map';
import EditRoom from './pages/Admin/EditRoom';

function AppRoutes() {
    return (
      <Routes>

        <Route element ={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room" element={<Room />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/AddRoom" element={<AddRoom />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/Map" element={<Map />} />
            <Route path="/admin/edit" element={<EditRoom />} />
        </Route>



        <Route path="*" element={<PageNotFound />} />

      </Routes>

    )
}

export default AppRoutes;