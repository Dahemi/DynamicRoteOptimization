import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FleetManagerAuthService from "../../../api/fleetManagerApi";
import { toast } from "react-toastify";
import { Truck, LayoutDashboard, Map, Users, Calendar, User, LogOut, Menu, X } from "lucide-react";

const FleetManagerDrawer = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [managerInfo, setManagerInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const managerData = localStorage.getItem('fleetManagerInfo');
    if (managerData) {
      setManagerInfo(JSON.parse(managerData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await FleetManagerAuthService.logoutCurrentFleetManager();
      FleetManagerAuthService.logout();
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/fleet-manager/login");
      }, 1500);
    } catch (error) {
      FleetManagerAuthService.logout();
      navigate("/fleet-manager/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/fleet-manager/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Overview',
    },
    {
      path: '/fleet-manager/service-areas',
      icon: <Map className="w-5 h-5" />,
      label: 'Routes',
    },
    {
      path: '/fleet-manager/collectors',
      icon: <Users className="w-5 h-5" />,
      label: 'Drivers',
    },
    {
      path: '/fleet-manager/schedules',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Schedules',
    },
    {
      path: '/fleet-manager/profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-700">
          <Link to="/fleet-manager/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">ZeroBin</h1>
              <p className="text-xs text-slate-300">Fleet Manager</p>
            </div>
          </Link>
        </div>

        {managerInfo && (
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-blue-500/20">
                <span className="text-lg font-bold text-blue-300">
                  {managerInfo.name?.charAt(0)?.toUpperCase() || 'M'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white truncate">{managerInfo.name}</p>
                <p className="text-xs text-slate-300">Fleet Manager</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                  : 'text-slate-300 hover:bg-white/10 hover:backdrop-blur-sm hover:text-white'
              }`}
            >
              <div className={isActive(item.path) ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-300'}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-slate-300 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-300 transition-colors" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default FleetManagerDrawer;
