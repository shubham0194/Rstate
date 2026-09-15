import { Routes, Route } from 'react-router-dom';

// for public imports
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Room from './pages/Room';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import PageNotFound from './pages/PageNotFound';

// for admin imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AddRoom from './pages/Admin/AddRoom';
import AdminRooms from './pages/Admin/Rooms';
import Map from './pages/Admin/Map';
import EditRoom from './pages/Admin/EditRoom';

// route protection
import ProtectedRoute from './components/protectedroute';
import AdminRoute from './components/Adminroutes';


function AppRoutes() {
    return (
        <Routes>


            {/* ================= PUBLIC ================= */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/room/:id" element={<Room />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />


            {/* ================= NORMAL USER ================= */}

              <Route element={<ProtectedRoute />}>
                  <Route element={<PublicLayout />}>
                      <Route path="/favorites" element={<Favorites />} />
                  </Route>
              </Route>
            </Route>


            {/* ================= ADMIN ================= */}

            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/AddRoom" element={<AddRoom />} />
                    <Route path="/admin/rooms" element={<AdminRooms />} />
                    <Route path="/admin/Map" element={<Map />} />
                    <Route path="/admin/edit/:id" element={<EditRoom />} />
                </Route>
            </Route>


            {/* ================= 404 ================= */}

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    );
}

export default AppRoutes;