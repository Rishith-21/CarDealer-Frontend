import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    fuelType: "",
    transmission: "",
    sortBy: "latest",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      if (filters.transmission) params.transmission = filters.transmission;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await API.get("/cars", { params });
      setCars(Array.isArray(res.data) ? res.data : res.data.cars || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load cars");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const currency = useMemo(
    () => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }),
    []
  );

  return (
    <div className="page-wrap">
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowLoginModal(false)}
            aria-label="Close login modal"
          />
          <div className="modal-pop ui-card-strong relative w-full max-w-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900">View details</h3>
            <p className="mt-2 text-sm text-gray-600">
              Please login to access complete car details.
            </p>
            <div className="mt-5 flex gap-2">
              <button className="btn-secondary" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate("/login", { replace: true, state: { from: location.pathname } })}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-widest text-slate-300">Single Seller Inventory</p>
        <h1 className="mt-2 text-2xl font-semibold">Find your next car with confidence</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-200">
          Browse available cars and connect directly with the seller for full details.
        </p>
      </div>

      {!loggedIn && (
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-800">
            Dashboard is visible. Please login to continue to protected actions.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/login", { replace: true, state: { from: location.pathname } })}
          >
            Login
          </button>
        </div>
      )}

      <div className="ui-card mb-4 flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Do you want to sell you car?</p>
          <p className="text-sm text-gray-700">Get the best price for you car</p>
          <p className="text-sm text-gray-700">Contact us for more information</p>
        </div>
        {loggedIn ? (
          <Link to="/sell-your-car" className="btn-primary">
            Sell Your Car
          </Link>
        ) : (
          <button
            className="btn-primary"
            onClick={() => navigate("/login", { replace: true, state: { from: location.pathname } })}
          >
            Login to Sell Car
          </button>
        )}
      </div>

      <div className="ui-card mb-6 grid grid-cols-1 gap-3 p-3 md:grid-cols-[minmax(0,1fr)_170px_190px_170px]">
        <input
          className="field min-w-0"
          placeholder="Search by brand, model, title..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          className="field"
          value={filters.fuelType}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
        >
          <option value="">All Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          className="field"
          value={filters.transmission}
          onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
        >
          <option value="">All Transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        <select
          className="field"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="latest">Latest</option>
          <option value="priceAsc">Price Low to High</option>
          <option value="priceDesc">Price High to Low</option>
          <option value="yearDesc">Newest Year</option>
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Loading cars...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cars.map((car) => (
          <div key={car._id} className="ui-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">
            <div className="h-44 bg-gray-200">
              {car.imageUrl ? (
                <img src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">{car.featured ? "Featured" : "Available"}</p>
              <h3 className="text-lg font-semibold">{car.title}</h3>
              <p className="text-sm text-gray-600">
                {car.brand} {car.model} | {car.year}
              </p>
              <p className="text-sm text-gray-600">
                {car.fuelType} | {car.transmission} | {car.mileage?.toLocaleString()} km
              </p>
              <p className="text-lg font-bold mt-2">Rs {currency.format(car.price)}</p>
              {loggedIn ? (
                <Link to={`/cars/${car._id}`} className="btn-primary mt-3">
                  View Details
                </Link>
              ) : (
                <button
                  className="btn-primary mt-3"
                  onClick={() => setShowLoginModal(true)}
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && !cars.length && <p className="mt-5 text-gray-600">No cars match your filters.</p>}
    </div>
  );
};

export default Home;
