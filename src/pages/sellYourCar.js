import { useState } from "react";
import API from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  carBrand: "",
  carModel: "",
  year: "",
  mileage: "",
  expectedPrice: "",
  message: "",
};

const SellYourCar = () => {
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await API.post("/sell-requests", {
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage || 0),
        expectedPrice: Number(form.expectedPrice || 0),
      });
      setForm(initialForm);
      setSuccess("Your sell request has been submitted. Owner will contact you shortly.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit sell request");
    }
  };

  return (
    <div className="page-wrap">
      <div className="mx-auto max-w-3xl ui-card-strong p-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">Seller Contact</p>
        <h1 className="ui-title mt-1 mb-1">Sell Your Car</h1>
        <p className="ui-subtitle mb-5">
          Share your car details and the owner team will connect with you.
        </p>
        <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
          <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="field" placeholder="Car brand" value={form.carBrand} onChange={(e) => setForm({ ...form, carBrand: e.target.value })} required />
          <input className="field" placeholder="Car model" value={form.carModel} onChange={(e) => setForm({ ...form, carModel: e.target.value })} required />
          <input className="field" type="number" placeholder="Model Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          <input className="field" type="number" placeholder="Mileage (km)" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
          <input className="field" type="number" placeholder="Expected price" value={form.expectedPrice} onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })} />
          <textarea className="field sm:col-span-2" rows="4" placeholder="Extra details (condition, service history, etc.)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary sm:col-span-2" type="submit">
            Submit Request
          </button>
        </form>
        {success && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    </div>
  );
};

export default SellYourCar;
