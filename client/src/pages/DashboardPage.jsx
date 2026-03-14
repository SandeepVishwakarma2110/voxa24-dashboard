
import React, { useEffect, useState } from "react";
import CallTable from "../components/CallTable";
import Charts from "../components/Charts";
import DateRangeFilter from "../components/DateRangeFilter";

const API_URL = "/api/dashboard";

const DashboardPage = () => {

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

      const res = await fetch(url);
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
    loadData(days);
  }, [days]);

  const handleDateRangeApply = (selectedRange) => {
    setRange([selectedRange]);
    loadData(null, selectedRange);
  };

  return (

    <div className="relative min-h-screen bg-[#ffebf3]">

      {/* OPEN SIDEBAR BUTTON */}

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-4 z-50 bg-[#ef8db4] text-gray-800 px-3 py-2 rounded shadow-lg"
      >
        →
      </button>

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
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={() => setSidebarOpen(false)}
          className="mb-6 text-right w-full text-xl hover:scale-110 transition"
        >
          ←
        </button>

        <h2 className="text-xl font-bold mb-8 tracking-wide">
          Dashboards
        </h2>

        <div className="space-y-6">

          {/* DASHBOARD 1 */}

          <button
            onClick={() => {
              setActiveDashboard(1);
              setSidebarOpen(false);
            }}
            className={`w-full text-left 
      rounded-2xl 
      border border-white/20
      p-6 
      backdrop-blur-md
      bg-white/5
      hover:bg-white/20
      hover:scale-105
      transition-all duration-300
      
      ${activeDashboard === 1 ? "bg-white/30" : ""}
      `}
          >
            <p className="text-lg font-semibold">Usage Analytics</p>
            <p className="text-sm text-gray-200 mt-1">
              View usage statistics
            </p>
          </button>


          {/* DASHBOARD 2 */}

          <button
            onClick={() => {
              setActiveDashboard(2);
              setSidebarOpen(false);
            }}
            className={`w-full text-left 
      rounded-2xl 
      border border-white/20
      p-6
      backdrop-blur-md
      bg-white/5
      hover:bg-white/20
      hover:scale-105
      transition-all duration-300
      
      ${activeDashboard === 2 ? "bg-white/30" : ""}
      `}
          >
            <p className="text-lg font-semibold">Business Analytics</p>
            <p className="text-sm text-gray-200 mt-1">
              Revenue & insights
            </p>
          </button>


          {/* DASHBOARD 3 */}

          <button
            onClick={() => {
              setActiveDashboard(3);
              setSidebarOpen(false);
            }}
            className={`w-full text-left 
      rounded-2xl 
      border border-white/20
      p-6
      backdrop-blur-md
      bg-white/5
      hover:bg-white/20
      hover:scale-105
      transition-all duration-300
      
      ${activeDashboard === 3 ? "bg-white/30" : ""}
      `}
          >
            <p className="text-lg font-semibold">
              Prediction & Forecasting
            </p>
            <p className="text-sm text-gray-200 mt-1">
              AI predictions
            </p>
          </button>

        </div>

      </div>

      {/* DASHBOARD CONTENT */}

      <div
        className={`p-6 transition-opacity duration-300 ${sidebarOpen ? "opacity-40" : "opacity-100"
          }`}
      >

        {activeDashboard === 1 && (
          <>
            <h1 className="text-2xl font-bold text-[#FE9EC7] mb-6 text-center">
              Usage Analytics
            </h1>

            {/* TIME FILTER */}

            {/* <div className="flex justify-around items-center mb-6">

              <div className="flex gap-3">

                {[1, 3, 7, 30, 365].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-4 py-2 rounded hover:scale-110 ${
                      days === d
                        ? "bg-[#1c398e] text-white"
                        : "bg-[#2276B6] text-white"
                    }`}
                  >
                    Last {d} Days
                  </button>
                ))}

              </div>

              <DateRangeFilter onApply={handleDateRangeApply} />

            </div> */}
            <div className="flex justify-start items-center mb-6 gap-3">



              <div>

                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="px-4 py-2 rounded-lg border border-#2276B6 
  bg-[#e9df8e] backdrop-blur-md text-gray-800 
  hover:bg-[#e9df8e] transition"
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

            {/* KPI CARDS */}

            <div className="grid grid-cols-4 gap-4 mb-6 text-gray-800">

              <div className="bg-[#f0b83b67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Total Calls</p>
                <h2 className="text-2xl font-bold">{analytics.totalCalls}</h2>
              </div>

              <div className="bg-[#9cd59e67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Max Duration (mins)</p>
                <h2 className="text-2xl font-bold">
                  {analytics.maxDuration.toFixed(2)}
                </h2>
              </div>

              <div className="bg-[#acd3ea67] shadow p-4 rounded hover:scale-105 smooth-transition">
                <p>Total Duration (mins)</p>
                <h2 className="text-2xl font-bold">
                  {analytics.totalDuration.toFixed(2)}
                </h2>
              </div>

              <div className="bg-[#e7a7a767] shadow p-4 rounded hover:scale-105  smooth-transition">
                <p>Total Users</p>
                <h2 className="text-2xl font-bold">{analytics.totalUsers}</h2>
              </div>

            </div>

            <Charts calls={calls} />

            {loading ? <p>Loading...</p> : <CallTable calls={calls} />}

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

      </div>

    </div>
  );

};

export default DashboardPage;