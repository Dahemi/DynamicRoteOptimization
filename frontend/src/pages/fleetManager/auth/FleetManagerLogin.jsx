import React, { useState } from "react";
import FleetManagerAuthService from "../../../api/fleetManagerApi";
import { Link, useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, AlertCircle } from "lucide-react";

const FleetManagerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await FleetManagerAuthService.fleetManagerLogin({ email, password });
      console.log("Login successful", response);
      navigate("/fleet-manager/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
              <Truck className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Fleet Manager Portal
            </h1>
            <p className="text-slate-600">
              Sign in to manage your fleet operations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50"
                  placeholder="manager@fleet.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Need access?{" "}
              <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Contact Administrator
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Not a fleet manager?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in as User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FleetManagerLogin;
