import React, { useEffect, useState } from "react";
import FleetManagerDrawer from "../components/FleetManagerDrawer";
import { BarChart3, Map, TrendingUp, Users, Truck, PackageCheck, Activity } from "lucide-react";
import FleetManagerAuthService from "../../../api/fleetManagerApi";
import { useNavigate } from "react-router-dom";

const FleetManagerDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    activeBins: 0,
    pendingRoutes: 0,
    trucksOnline: 0,
    averageFillLevel: 0,
    totalCollectors: 0,
    activeSchedules: 0,
    completedCollections: 0,
    servicedAreasCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await FleetManagerAuthService.getAnalyticsOverview();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const metrics = [
    {
      title: "Active Bins",
      value: analytics.activeBins,
      icon: <Activity className="h-6 w-6 text-white" />,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "Smart bins currently active"
    },
    {
      title: "Pending Routes",
      value: analytics.pendingRoutes,
      icon: <Map className="h-6 w-6 text-white" />,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      description: "Routes awaiting assignment"
    },
    {
      title: "Trucks Online",
      value: analytics.trucksOnline,
      icon: <Truck className="h-6 w-6 text-white" />,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      description: "Active collection vehicles"
    },
    {
      title: "Avg Fill Level",
      value: `${analytics.averageFillLevel}%`,
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      gradient: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50",
      description: "Average bin capacity"
    }
  ];

  const quickActions = [
    {
      title: "Generate Routes",
      description: "Optimize collection routes",
      icon: <Map className="h-5 w-5" />,
      onClick: () => navigate("/fleet-manager/schedules/create"),
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "View Live Fleet",
      description: "Track active collectors",
      icon: <Truck className="h-5 w-5" />,
      onClick: () => navigate("/fleet-manager/collectors"),
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "View Reports",
      description: "Analytics & insights",
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => navigate("/fleet-manager/transactions"),
      color: "from-orange-500 to-amber-600"
    }
  ];

  if (loading) {
    return (
      <FleetManagerDrawer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </FleetManagerDrawer>
    );
  }

  return (
    <FleetManagerDrawer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Fleet Manager Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Monitor and optimize your waste collection operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Today's Summary
            </h2>
            <div className="space-y-4">
              <SummaryItem
                label="Total Collectors"
                value={analytics.totalCollectors}
                icon={<Users className="h-5 w-5 text-blue-600" />}
              />
              <SummaryItem
                label="Active Schedules"
                value={analytics.activeSchedules}
                icon={<Activity className="h-5 w-5 text-green-600" />}
              />
              <SummaryItem
                label="Completed Collections"
                value={analytics.completedCollections}
                icon={<PackageCheck className="h-5 w-5 text-orange-600" />}
              />
              <SummaryItem
                label="Service Areas"
                value={analytics.servicedAreasCount}
                icon={<Map className="h-5 w-5 text-teal-600" />}
              />
            </div>
          </div>
        </div>
      </div>
    </FleetManagerDrawer>
  );
};

const MetricCard = ({ title, value, icon, gradient, bgGradient, description }) => (
  <div className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group hover:scale-105`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-4xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  </div>
);

const QuickActionCard = ({ title, description, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 text-left`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-bold mb-1">{title}</h3>
    <p className="text-sm opacity-90">{description}</p>
  </button>
);

const SummaryItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <span className="text-lg font-bold text-slate-800">{value}</span>
  </div>
);

export default FleetManagerDashboard;
