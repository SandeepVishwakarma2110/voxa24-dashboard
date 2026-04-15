import React, { useEffect, useState } from "react";
import CallTable from "../components/CallTable";
import Charts from "../components/Charts";
import DateRangeFilter from "../components/DateRangeFilter";
import Product from "../components/Product";
import { useNavigate } from "react-router-dom";
const API_URL = "/api/dashboard";


const DashboardPage = () => {
  const navigate = useNavigate();

  // Get token once at the top
  const token = localStorage.getItem("token");
  if (!token) return null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState(1);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [analytics, setAnalytics] = useState({
    totalCalls: 0,
    maxDuration: 0,
    totalDuration: 0,
    totalUsers: 0
  });
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const loadData = async (selectedDays, customRange) => {
    setLoading(true);
    try {
      let url = `${API_URL}/logs`;
      if (customRange) {
        const startDate = customRange.startDate.toISOString().split("T")[0];
        const endDate = customRange.endDate.toISOString().split("T")[0];
        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else {
        url += `?days=${selectedDays}`;
      }
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const logs = data.data || [];

      const mapped = logs.map((log) => {
        const start = new Date(log.startTime);
        const end = new Date(log.endTime);
        const duration = (end - start) / 1000;
        return {
          id: log.logId,
          customer: {
            name: log.userName,
            number: log.whatsappNumber,
          },
          startedAt: log.startTime,
          endedAt: log.endTime,
          duration: duration || 0,
          transcript: log.transcript || [],
        };
      });

      setCalls(mapped);

      const durations = mapped.map((c) => c.duration);
      const totalCalls = mapped.length;
      const maxDuration = Math.max(...durations, 0) / 60;
      const totalDuration = durations.reduce((a, b) => a + b, 0) / 60;
      const uniqueUsers = new Set(mapped.map((call) => call.customer?.number));

      setAnalytics({
        totalCalls,
        maxDuration,
        totalDuration,
        totalUsers: uniqueUsers.size,
      });

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData(days);
  }, [days, token]);

  const handleDateRangeApply = (selectedRange) => {
    setRange([selectedRange]);
    loadData(null, selectedRange);
  };

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-[#ffebf3]">
 {/* OPEN SIDEBAR BUTTON */}
{!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    className="fixed top-6 left-4 z-50 bg-[#ef8db4] text-gray-800 px-3 py-2 rounded shadow-lg"
  >
    →
  </button>
)}

{/* OVERLAY */}
{sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    className="fixed inset-0 bg-black bg-opacity-40 z-30"
  />
)}

{/* SIDEBAR */}
<div
  className={`fixed top-0 left-0 h-full w-72 
  bg-[#ef8db4]/20 backdrop-blur-xl 
  border-r border-white/20
  shadow-2xl
  text-white p-6 z-40
  transform transition-transform duration-500
  flex flex-col
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
  {/* CLOSE BUTTON */}
  <button
    onClick={() => setSidebarOpen(false)}
    className="mb-4 text-right w-full text-xl hover:scale-110 transition"
  >
    ←
  </button>

  <h2 className="text-xl font-bold mb-6 tracking-wide">Dashboards</h2>

  {/* SCROLLABLE AREA */}
 <div
  className="flex-1 overflow-y-auto pr-1"
  style={{
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(239,141,180,0.6) rgba(255,255,255,0.05)",
  }}
>
  <style>{`
    .sidebar-scroll::-webkit-scrollbar {
      width: 5px;
    }
    .sidebar-scroll::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    .sidebar-scroll::-webkit-scrollbar-thumb {
      background: rgba(239, 141, 180, 0.6);
      border-radius: 10px;
    }
    .sidebar-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(239, 141, 180, 0.9);
    }
  `}</style>

     <div className="sidebar-scroll space-y-6 flex items-center justify-center flex-col">

      {/* DASHBOARD 1 */}
      <button
        onClick={() => { setActiveDashboard(1); setSidebarOpen(false); }}
        className={`w-[90%] text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 1 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Usage Analytics</p>
        <p className="text-sm text-gray-200 mt-1">View usage statistics</p>
      </button>

      {/* DASHBOARD 2 */}
      <button
        onClick={() => { setActiveDashboard(2); setSidebarOpen(false); }}
        className={`w-[90%] text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 2 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Business Analytics</p>
        <p className="text-sm text-gray-200 mt-1">Revenue & insights</p>
      </button>

      {/* DASHBOARD 3 */}
      <button
        onClick={() => { setActiveDashboard(3); setSidebarOpen(false); }}
        className={`w-[90%] text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 3 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Prediction & Forecasting</p>
        <p className="text-sm text-gray-200 mt-1">AI predictions</p>
      </button>

      {/* DASHBOARD 4 */}
      <button
        onClick={() => { setActiveDashboard(4); setSidebarOpen(false); }}
        className={`w-[90%] text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 4 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Add & Manage Products</p>
        <p className="text-sm text-gray-200 mt-1">Create and manage your products</p>
      </button>

      {/* DASHBOARD 5 */}
      <button
        onClick={() => { setActiveDashboard(5); setSidebarOpen(false); }}
        className={`w-[90%]      text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 5 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Creative canvas</p>
        <p className="text-sm text-gray-200 mt-1">Product cards</p>
      </button>

      {/* DASHBOARD 6 */}
      <button
        onClick={() => { setActiveDashboard(6); setSidebarOpen(false); }}
        className={`w-[90%] text-left rounded-2xl border border-white/20 p-2 backdrop-blur-md bg-white/5 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${activeDashboard === 6 ? "bg-white/30" : ""}`}
      >
        <p className="text-md font-semibold">Appointments Scheduler</p>
        <p className="text-sm text-gray-200 mt-1">Schedule Appointments</p>
      </button>

    </div>
  </div>
</div>

      {/* DASHBOARD CONTENT */}
      <div className={`p-6 transition-opacity duration-300 ${sidebarOpen ? "opacity-40" : "opacity-100"}`}>

        {activeDashboard === 1 && (
          <>
            <h1 className="text-2xl font-bold text-[#FE9EC7] mb-6 text-center">
              Usage Analytics
            </h1>

            {/* TIME FILTER */}
            <div className="flex justify-between items-center mb-6 gap-3">
              <div className="flex justify-start items-center gap-3">
                <div>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border border-#2276B6 bg-[#e9df8e] backdrop-blur-md text-gray-800 hover:bg-[#e9df8e] transition"
                  >
                    <option value={1}>Last 1 Day</option>
                    <option value={3}>Last 3 Days</option>
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={365}>Last 365 Days</option>
                  </select>

                </div>

                <DateRangeFilter onApply={handleDateRangeApply} />
              </div>
              <div>
                <button
                  onClick={handlelogout}
                  className="px-4 py-2 rounded-lg border border-#2276B6 bg-[#f15a61] backdrop-blur-md text-gray-800 hover:bg-[#e98e8e] transition"
                >
                  Logout
                </button>
              </div>

            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-4 gap-4 mb-6 text-gray-800">

              <div className="bg-[#f0b83b67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Total Calls</p>
                <h2 className="text-2xl font-bold">{analytics.totalCalls}</h2>
              </div>

              <div className="bg-[#9cd59e67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Max Duration (mins)</p>
                <h2 className="text-2xl font-bold">{analytics.maxDuration.toFixed(2)}</h2>
              </div>

              <div className="bg-[#acd3ea67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Total Duration (mins)</p>
                <h2 className="text-2xl font-bold">{analytics.totalDuration.toFixed(2)}</h2>
              </div>

              <div className="bg-[#e7a7a767] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Total Users</p>
                <h2 className="text-2xl font-bold">{analytics.totalUsers}</h2>
              </div>

            </div>

            <Charts calls={calls} />

            {loading ? (
              <p>Loading...</p>
            ) : (
              <CallTable calls={calls} username={(calls[0]?.customer?.name) ?? "User"} />
            )}
          </>
        )}

        {activeDashboard === 2 && (
          <div className="flex items-center justify-center h-[70vh] text-3xl font-bold text-gray-500">
            Business Analytics - Coming Soon 🚧
          </div>
        )}

        {activeDashboard === 3 && (
          <div className="flex items-center justify-center h-[70vh] text-3xl font-bold text-gray-500">
            Prediction & Forecasting - Coming Soon 🚧
          </div>
        )}

       {activeDashboard === 4 && (
  <div className="w-full p-4">
    
     <Product />

  </div>
)}

          {activeDashboard === 5 && (
          <div className="flex items-center justify-center h-[70vh] text-3xl font-bold text-gray-500">
            Creative Canvas - Coming Soon 🚧
          </div>
        )}


          {activeDashboard === 6 && (
          <div className="flex items-center justify-center h-[70vh] text-3xl font-bold text-gray-500">
            Appointments Scheduler - Coming Soon 🚧
          </div>
        )}


      </div>
    </div>
  );
};

export default DashboardPage;