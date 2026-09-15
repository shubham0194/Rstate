import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen items-start">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;