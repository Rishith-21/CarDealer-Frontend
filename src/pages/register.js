import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="page-wrap">
      <div className="mx-auto mt-6 max-w-md ui-card-strong p-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">Create Account</p>
        <h2 className="ui-title mt-1 mb-1">Register</h2>
        <p className="ui-subtitle mb-5">Create your user account to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="field"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="field"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="field"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="btn-primary w-full" type="submit">
            Register
          </button>
        </form>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <p className="mt-4 text-sm text-slate-600">
          Already registered? <Link className="font-medium text-slate-900 underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
