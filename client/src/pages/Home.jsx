import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../index.css";

const fallbackProperties = [
  { _id: "featured-1", name: "The Willow Residence", price: 1850, bhkType: "2BHK", location: { locality: "Green Park", city: "New Delhi" } },
  { _id: "featured-2", name: "Sunlit Corner Loft", price: 2400, bhkType: "3BHK", location: { locality: "Indiranagar", city: "Bengaluru" } },
  { _id: "featured-3", name: "The Courtyard House", price: 1450, bhkType: "1BHK", location: { locality: "Bandra West", city: "Mumbai" } },
];

const getLocation = (location) => {
  if (typeof location === "string") return location;
  return [location?.locality, location?.city, location?.state].filter(Boolean).join(", ") || "India";
};

function Home() {
  const [properties, setProperties] = useState(fallbackProperties);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await API.get("/rooms", { params: { sort: "newest" } });
        if (response.data.data?.length) setProperties(response.data.data.slice(0, 3));
      } catch {
        // Keep the curated fallback visible while the API is unavailable.
      }
    };
    loadProperties();
  }, []);

  return (
    <main className="home-page">
      <header className="home-header">
        <p>Rstate</p>
        <span>Property brokerage</span>
      </header>

      <section className="home-intro">
        <h1>Find a place to call home.</h1>
        <p>Rstate helps people find homes and rooms with clear information and straightforward advice.</p>
        <Link to="/rooms">View available properties</Link>
      </section>

      <section className="home-section">
        <h2>About Rstate</h2>
        <p>We are an independent property broker. We work with renters, buyers, and property owners to make the process of finding a place simple.</p>
        <p><Link to="/about">Read more about us</Link></p>
      </section>

      <section className="home-section">
        <h2>Why choose us</h2>
        <ul className="reason-list">
          <li>Local knowledge of properties and neighbourhoods.</li>
          <li>Clear details about price, location, and availability.</li>
          <li>Personal help from the first enquiry to the final agreement.</li>
        </ul>
      </section>

      <section className="home-section">
        <div className="section-title-row"><h2>Top properties</h2><Link to="/rooms">View all</Link></div>
        <div className="property-list">
          {properties.map((property) => (
            <Link to={`/room/${property._id}`} className="property-row" key={property._id}>
              <span><strong>{property.name}</strong><small>{getLocation(property.location)}</small></span>
              <span><strong>${Number(property.price || 0).toLocaleString()}</strong><small>{property.bhkType || "Residence"}</small></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;