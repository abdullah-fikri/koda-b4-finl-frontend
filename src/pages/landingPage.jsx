import React, { useState } from "react";
import { Zap, TrendingUp, Shield, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/context";




export default function ShortlinkLanding() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = "http://localhost:8008"
  const { auth } = useContext(AuthContext);


  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch (e) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setShowResult(false);

    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (auth?.token) {
        headers["Authorization"] = `Bearer ${auth.token.access_token}`;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/v1/links/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setShortenedUrl(data.short_url);
      setShortcode(data.shortcode);
      setShowResult(true);
      
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Shorten Your Links,
            <br />
            <span className="text-blue-600">Amplify Your Reach</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create short, memorable links in seconds. Track clicks, manage
            campaigns, and optimize your digital presence.
          </p>
        </div>

        {/* input */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your long URL here..."
              className="flex-1 px-6 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
              disabled={loading}
            />
            <button
              onClick={handleShorten}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors whitespace-nowrap disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {/* error message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* result */}
          {showResult && (
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-600 mb-3 text-center">
                Your shortened URL:
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={shortenedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                />
                <button
                  onClick={handleCopy}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="mt-4 text-sm text-slate-500 text-center">
                <p className="mb-1">Shortcode: <span className="font-mono font-semibold text-slate-700">{shortcode}</span></p>
                <p>Sign in to track analytics and manage your links</p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {/* Lightning Fast */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Lightning Fast
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Generate short links instantly and share them across all your
              platforms in seconds.
            </p>
          </div>

          {/* advanced analytics */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Advanced Analytics
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Track every click with detailed analytics and insights to optimize
              your campaigns.
            </p>
          </div>

          {/* secure & reliable */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Secure & Reliable
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Your links are protected with enterprise-grade security and 99.9%
              uptime.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}