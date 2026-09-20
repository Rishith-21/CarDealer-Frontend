import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const initialForm = {
  title: "",
  brand: "",
  model: "",
  year: 2022,
  price: "",
  fuelType: "Petrol",
  transmission: "Manual",
  mileage: 0,
  ownerNumber: 1,
  insuranceValidTill: "",
  condition: "Good",
  featuresInput: "",
  color: "",
  bodyType: "Sedan",
  location: "",
  description: "",
  imageUrl: "",
  featured: false,
};

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, carsRes, inquiriesRes, sellRequestsRes] = await Promise.all([
        API.get("/cars/admin/stats"),
        API.get("/cars/admin/mine"),
        API.get("/inquiries/admin"),
        API.get("/sell-requests/admin"),
      ]);
      setStats(statsRes.data);
      setCars(carsRes.data);
      setInquiries(inquiriesRes.data);
      setSellRequests(sellRequestsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
        ownerNumber: Number(form.ownerNumber),
        insuranceValidTill: form.insuranceValidTill || null,
        features: form.featuresInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      delete payload.featuresInput;

      if (imageFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        formData.append("image", imageFile);

        if (editingId) {
          await API.put(`/cars/${editingId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await API.post("/cars", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else if (editingId) {
        await API.put(`/cars/${editingId}`, payload);
      } else {
        await API.post("/cars", payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save car");
    }
  };

  const onEditCar = (car) => {
    setEditingId(car._id);
    setImageFile(null);
    setForm({
      title: car.title || "",
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || 2022,
      price: car.price || "",
      fuelType: car.fuelType || "Petrol",
      transmission: car.transmission || "Manual",
      mileage: car.mileage || 0,
      ownerNumber: car.ownerNumber || 1,
      insuranceValidTill: car.insuranceValidTill
        ? new Date(car.insuranceValidTill).toISOString().split("T")[0]
        : "",
      condition: car.condition || "Good",
      featuresInput: Array.isArray(car.features) ? car.features.join(", ") : "",
      color: car.color || "",
      bodyType: car.bodyType || "Sedan",
      location: car.location || "",
      description: car.description || "",
      imageUrl: car.imageUrl || "",
      featured: !!car.featured,
    });
  };

  const deleteCar = async (id) => {
    try {
      await API.delete(`/cars/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete car");
    }
  };

  const setCarStatus = async (id, status) => {
    try {
      await API.patch(`/cars/${id}/status`, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update car status");
    }
  };

  const setInquiryStatus = async (id, status) => {
    try {
      await API.patch(`/inquiries/admin/${id}/status`, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update inquiry");
    }
  };

  const setSellRequestStatus = async (id, status) => {
    try {
      await API.patch(`/sell-requests/admin/${id}/status`, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update sell request");
    }
  };

  const currency = useMemo(
    () => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }),
    []
  );

  return (
    <div className="page-wrap space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-widest text-slate-300">Single Seller Control Room</p>
        <h1 className="mt-2 text-2xl font-semibold">Owner Admin Portal</h1>
        <p className="mt-1 text-sm text-slate-200">Manage inventory, inquiries, and sell requests.</p>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{error}</p>}
      {loading && <p className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">Loading...</p>}

      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="ui-card p-4">Total: {stats.totalCars}</div>
          <div className="ui-card p-4">Available: {stats.availableCars}</div>
          <div className="ui-card p-4">Sold: {stats.soldCars}</div>
          <div className="ui-card p-4">Featured: {stats.featuredCars}</div>
          <div className="ui-card p-4">
            Value: Rs {currency.format(stats.inventoryValue)}
          </div>
        </section>
      )}

      <section className="ui-card-strong p-4">
        <h2 className="text-xl mb-3 font-semibold text-slate-900">{editingId ? "Edit Car" : "Add Car"}</h2>
        <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-3">
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Title
            <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Brand
            <input className="field" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Model
            <input className="field" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Year
            <input className="field" type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Price
            <input className="field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Mileage
            <input className="field" type="number" placeholder="Mileage" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Owner Number
            <input className="field" type="number" min="1" max="5" placeholder="Owner Number (1-5)" value={form.ownerNumber} onChange={(e) => setForm({ ...form, ownerNumber: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Insurance Valid Till
            <input className="field" type="date" placeholder="Insurance Valid Till" value={form.insuranceValidTill} onChange={(e) => setForm({ ...form, insuranceValidTill: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Color
            <input className="field" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Location
            <input className="field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Upload Image
            <input
              className="field"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Fuel Type
            <select className="field" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Transmission
            <select className="field" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            <option>Manual</option>
            <option>Automatic</option>
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Body Type
            <select className="field" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Coupe</option>
            <option>Convertible</option>
            <option>Pickup</option>
            <option>Van</option>
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Condition
            <select className="field" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-2">
            Features
            <input className="field" placeholder="Features (comma separated)" value={form.featuresInput} onChange={(e) => setForm({ ...form, featuresInput: e.target.value })} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-3">
            Description
            <textarea className="field" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="md:col-span-3 flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured listing
          </label>
          <div className="md:col-span-3 flex gap-2">
            <button className="btn-primary" type="submit">
              {editingId ? "Update Car" : "Add Car"}
            </button>
            {editingId && (
              <button className="btn-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="ui-card-strong p-4">
        <h2 className="text-xl mb-3 font-semibold text-slate-900">Inventory Management</h2>
        <div className="space-y-3">
          {cars.map((car) => (
            <div key={car._id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-medium">{car.title}</p>
                <p className="text-sm text-gray-600">
                  {car.brand} {car.model} | {car.year} | Rs {currency.format(car.price)} | {car.status}
                </p>
                <p className="text-sm text-gray-600">
                  Owner #{car.ownerNumber || 1} | {car.condition || "Good"} | Insurance: {car.insuranceValidTill ? new Date(car.insuranceValidTill).toLocaleDateString("en-IN") : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => onEditCar(car)}>
                  Edit
                </button>
                <button className="btn-secondary" onClick={() => setCarStatus(car._id, car.status === "available" ? "sold" : "available")}>
                  Mark {car.status === "available" ? "Sold" : "Available"}
                </button>
                <button className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50" onClick={() => deleteCar(car._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!cars.length && <p className="text-gray-600">No cars in inventory yet.</p>}
        </div>
      </section>

      <section className="ui-card-strong p-4">
        <h2 className="text-xl mb-3 font-semibold text-slate-900">Buyer Inquiries</h2>
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="font-medium">
                {inquiry.name} | {inquiry.email} | {inquiry.phone}
              </p>
              <p className="text-sm text-gray-600">
                Car: {inquiry.car?.title || "N/A"} ({inquiry.car?.year || "N/A"})
              </p>
              <p className="text-sm mt-1">{inquiry.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs uppercase">Status: {inquiry.status}</span>
                <button className="btn-secondary" onClick={() => setInquiryStatus(inquiry._id, "contacted")}>
                  Mark Contacted
                </button>
                <button className="btn-secondary" onClick={() => setInquiryStatus(inquiry._id, "closed")}>
                  Mark Closed
                </button>
              </div>
            </div>
          ))}
          {!inquiries.length && <p className="text-gray-600">No inquiries yet.</p>}
        </div>
      </section>

      <section className="ui-card-strong p-4">
        <h2 className="text-xl mb-3 font-semibold text-slate-900">User Sell Requests</h2>
        <div className="space-y-3">
          {sellRequests.map((request) => (
            <div key={request._id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="font-medium">
                {request.name} | {request.email} | {request.phone}
              </p>
              <p className="text-sm text-gray-600">
                Car: {request.carBrand} {request.carModel} | {request.year} | {request.mileage?.toLocaleString()} km
              </p>
              {request.expectedPrice > 0 && (
                <p className="text-sm text-gray-600">Expected Price: Rs {currency.format(request.expectedPrice)}</p>
              )}
              {request.message && <p className="text-sm mt-1">{request.message}</p>}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs uppercase">Status: {request.status}</span>
                <button className="btn-secondary" onClick={() => setSellRequestStatus(request._id, "contacted")}>
                  Mark Contacted
                </button>
                <button className="btn-secondary" onClick={() => setSellRequestStatus(request._id, "closed")}>
                  Mark Closed
                </button>
              </div>
            </div>
          ))}
          {!sellRequests.length && <p className="text-gray-600">No sell requests yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
