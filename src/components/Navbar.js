import { Link, useNavigate } from "react-router-dom";
import { getUser, isDealer, isLoggedIn, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link className="text-xl font-bold tracking-tight text-slate-900" to="/">
          AutoAxis
        </Link>
        {/* {loggedIn && (
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-900" to="/sell-your-car">
            Sell Your Car
          </Link>
        )} */}
        {isDealer() && (
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-900" to="/admin">
            Admin Portal
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {loggedIn && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{user?.name}</span>}
        {!loggedIn && (
          <>
            <Link className="text-sm font-medium text-slate-700 hover:text-slate-900" to="/login">
              Login
            </Link>
            <Link className="text-sm font-medium text-slate-700 hover:text-slate-900" to="/register">
              Register
            </Link>
          </>
        )}
        {loggedIn && (
          <button
            className="btn-secondary"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
