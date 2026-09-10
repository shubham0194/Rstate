import { Outlet } from 'react-router-dom';
import Navbar from '../components/Headbar';
import Footer from '../components/Footbar';

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PublicLayout;
