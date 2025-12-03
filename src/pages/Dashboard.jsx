import { useState, useEffect, useContext } from "react";
import { Eye, Link2, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AuthContext } from "../context/context";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate()



  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      if (!auth?.token?.access_token) return;
      setLoading(true);
            
      const response = await fetch("http://localhost:8008/api/v1/links/dashboard/stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token.access_token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const result = await response.json();
      setStats(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatGrowth = (value) => {
    return value >= 0 ? `+${value}%` : `${value}%`;
  };

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium mb-2">Error loading dashboard</p>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = stats?.last_7_days?.map(item => ({
    date: formatDate(item.date),
    visits: item.visits
  })) || [];

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
     <Navbar/>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Welcome back! Here's your link performance overview.
            </p>
          </div>
          <button onClick={()=> navigate("/")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <span className="text-lg leading-none">+</span>
            Create Short Link
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Links</p>
            <p className="text-3xl font-semibold text-slate-900 mb-1">
              {stats?.total_links || 0}
            </p>
            <p className="text-xs text-green-600">
              +{stats?.links_this_week || 0} this week
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Visits</p>
            <p className="text-3xl font-semibold text-slate-900 mb-1">
              {stats?.total_visits?.toLocaleString() || 0}
            </p>
            <p className={`text-xs ${stats?.visits_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatGrowth(stats?.visits_growth || 0)} from last week
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Avg. Click Rate</p>
            <p className="text-3xl font-semibold text-slate-900 mb-1">
              {stats?.avg_click_rate?.toFixed(1) || 0}
            </p>
            <p className={`text-xs ${stats?.click_rate_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatGrowth(stats?.click_rate_change || 0)} increase
            </p>
          </div>
        </div>

        {/* Visitor Analytics Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Visitor Analytics (Last 7 Days)
            </h2>
            <button 
              onClick={fetchDashboardStats}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}