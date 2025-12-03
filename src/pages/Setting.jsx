import { Lock, Save, Upload, User } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/context";

const API_URL = "http://localhost:8008";

export default function Setting() {
  const { auth } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const token = auth?.token?.access_token;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log("Profile error:", response.status);
          return;
        }

        const json = await response.json();
        const user = json.data;

        setFullName(user.username || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/v1/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: fullName,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Updated successfully");
      } else {
        alert(result.message || "Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-[#F9FAFB] h-screen w-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8 ">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Settings
          </h1>
          <p className="text-sm text-slate-600">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* profile */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Profile Information
            </h2>
          </div>

          {/* pp */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-700 mb-2">
              Profile Picture
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Upload className="w-4 h-4" />
                Upload New Photo
              </button>
            </div>
          </div>

          {/* fullname */}
          <form>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* email */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button onClick={onSubmit} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </form>
        </div>

        {/* change password */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Change Password
            </h2>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Lock className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
