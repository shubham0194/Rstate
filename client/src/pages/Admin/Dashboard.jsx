import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/rooms/stats");
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const total = stats.total || 0;
  const availablePct = total > 0 ? Math.round((stats.available / total) * 100) : 0;
  const rentedPct = total > 0 ? Math.round((stats.rented / total) * 100) : 0;

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900 sm:px-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Admin Overview
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Live overview of rooms and listing statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Refreshing..." : "↻ Refresh Stats"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 font-medium underline hover:text-red-900 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Rooms
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              All
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            {loading ? "..." : stats.total}
          </p>
          <p className="mt-1 text-xs text-gray-500">Total properties recorded</p>
        </div>

        {/* Available */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Available
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              Active
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-emerald-800">
            {loading ? "..." : stats.available}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {loading ? "" : `${availablePct}% of total`}
          </p>
        </div>

        {/* Rented */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Rented
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Occupied
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-amber-800">
            {loading ? "..." : stats.rented}
          </p>
          <p className="mt-1 text-xs text-amber-600">
            {loading ? "" : `${rentedPct}% of total`}
          </p>
        </div>
      </div>

      {/* Visual Status Ratio Bar */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-semibold text-gray-900">
          Listing Status Breakdown
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Proportion of available and rented properties.
        </p>

        {total > 0 ? (
          <div className="mt-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                style={{ width: `${availablePct}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`Available: ${availablePct}%`}
              />
              <div
                style={{ width: `${rentedPct}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`Rented: ${rentedPct}%`}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Available ({stats.available} - {availablePct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>Rented ({stats.rented} - {rentedPct}%)</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-gray-400">
            {loading ? "Loading breakdown..." : "No rooms available to display breakdown."}
          </p>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/admin/rooms"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-black"
          >
            <div>
              <p className="font-semibold text-gray-900">Manage Rooms</p>
              <p className="mt-1 text-xs text-gray-500">Edit, search, or delete listings</p>
            </div>
            <span className="text-lg text-gray-400">→</span>
          </Link>

          <Link
            to="/admin/AddRoom"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-black"
          >
            <div>
              <p className="font-semibold text-gray-900">Add New Room</p>
              <p className="mt-1 text-xs text-gray-500">Publish a new property listing</p>
            </div>
            <span className="text-lg text-gray-400">→</span>
          </Link>

          <Link
            to="/admin/Map"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-black"
          >
            <div>
              <p className="font-semibold text-gray-900">Map Overview</p>
              <p className="mt-1 text-xs text-gray-500">View geolocation of rooms</p>
            </div>
            <span className="text-lg text-gray-400">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
