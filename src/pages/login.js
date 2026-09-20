import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      loginUser(res.data.token, res.data.user);
      const fromPath = location.state?.from;
      if (["dealer", "seller", "admin"].includes(res.data.user.role)) {
        navigate(fromPath && fromPath !== "/login" ? fromPath : "/admin", { replace: true });
      } else {
        navigate(fromPath && fromPath !== "/login" ? fromPath : "/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-wrap">
      <div className="mx-auto mt-6 max-w-md ui-card-strong p-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">Welcome Back</p>
        <h2 className="ui-title mt-1 mb-1">Login</h2>
        <p className="ui-subtitle mb-5">Access your dashboard and continue.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <p className="mt-4 text-sm text-slate-600">
          Need an account? <Link className="font-medium text-slate-900 underline" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
