import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context"; 
import { Link2, LayoutDashboard, Link as LinkIcon, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth([]); 
    navigate("/login");
  };

  if (!auth || !auth.token) {
    return (
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-6 h-6 text-blue-600" />
            <Link to="/">
              <span className="text-lg font-semibold text-slate-900">
                Koda Shortlink
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            <Link to="/">
              <span className="text-base font-semibold text-slate-900">
                Koda Shortlink
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => { navigate("/dashboard")}}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => { navigate("/links")}}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors`}
            >
              <LinkIcon className="w-4 h-4" />
              Links
            </button>

            <button
              onClick={() => { navigate("/setting")}}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
