import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CarDetails = () => {
  const sellerPhoneNumber = "9382716405";
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    setSubmitted("");
    setInquiryMessage("");
    try {
      await API.post("/inquiries", {
        ...inquiryForm,
        carId: id,
      });
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      setSubmitted("Inquiry sent successfully. Seller will contact you soon.");
    } catch (err) {
      setInquiryMessage(err.response?.data?.message || "Failed to send inquiry");
    }
  };

  const currency = useMemo(
    () => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }),
    []
  );

  if (loading) {
    return <p className="page-wrap">Loading...</p>;
  }

  if (error) {
    return <p className="page-wrap text-red-600">{error}</p>;
  }

  if (!car) {
    return null;
  }

  return (
    <div className="page-wrap grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 ui-card-strong p-5">
        <div className="h-80 rounded-xl bg-gray-200 mb-4 overflow-hidden">
          {car.imageUrl ? (
            <img src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
          )}
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-500">Car Overview</p>
        <h1 className="ui-title mt-1">{car.title}</h1>
        <p className="ui-subtitle mt-1">
          {car.brand} {car.model} | {car.year} | {car.bodyType}
        </p>
        <p className="mt-3 text-2xl font-bold text-slate-900">Rs {currency.format(car.price)}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
          <p className="rounded-lg bg-slate-50 px-3 py-2">Brand: {car.brand}</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2">Model: {car.model}</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2">Year: {car.year}</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2">Fuel: {car.fuelType}</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2">Transmission: {car.transmission}</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2">Mileage: {car.mileage?.toLocaleString()} km</p>
        </div>
        <p className="mt-4 text-slate-800 leading-relaxed">{car.description || "No description provided."}</p>
      </section>

      <section className="ui-card-strong p-5 h-fit">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Contact Seller</h2>
        <p className="text-sm text-slate-600 mb-1">Seller Phone: {sellerPhoneNumber}</p>
        <p className="text-xs text-slate-500 mb-3">Core details are shared by seller after inquiry.</p>
        <form onSubmit={submitInquiry} className="space-y-2">
          <input
            className="field"
            placeholder="Your name"
            value={inquiryForm.name}
            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
            required
          />
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={inquiryForm.email}
            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
            required
          />
          <input
            className="field"
            placeholder="Phone Number"
            value={inquiryForm.phone}
            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
            required
          />
          <textarea
            className="field"
            rows="4"
            placeholder="Message"
            value={inquiryForm.message}
            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
            required
          />
          <button className="btn-primary w-full" type="submit">
            Send Inquiry
          </button>
        </form>
        {submitted && <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{submitted}</p>}
        {inquiryMessage && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{inquiryMessage}</p>}
      </section>
    </div>
  );
};

export default CarDetails;
