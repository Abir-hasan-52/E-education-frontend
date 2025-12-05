// src/pages/Admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router"; 
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState("");

  // small date label helper
  const formatDateLabel = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  // 🔹 Load summary + chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setChartLoading(true);
        setError("");

        // 1) Summary
        const summaryRes = await axiosSecure.get(
          "/api/admin/analytics/summary"
        );
        setSummary(summaryRes.data);

        // 2) Enrollments over time (last 30 days)
        const chartRes = await axiosSecure.get(
          "/api/admin/analytics/enrollments-over-time?range=30d"
        );

        const raw = chartRes.data.data || [];
        const mapped = raw.map((item) => ({
          date: formatDateLabel(item.date),
          count: item.count,
        }));

        setChartData(mapped);
      } catch (err) {
        console.error("Admin analytics error:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load admin analytics data."
        );
        // ❌ no dummy data here — just keep chartData = []
        setChartData([]);
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* ===== Header & quick info ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-base-content/70">
            Overview of SkillSpace activity – enrollments, courses & students.
          </p>
          <p className="text-xs text-base-content/60 mt-1">
            Today • <span className="font-medium">{today}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/AddCourse" className="btn btn-sm btn-primary">
            + Add New Course
          </Link>
          <Link
            to="/dashboard/AllCourse"
            className="btn btn-sm btn-outline border-base-300"
          >
            Manage Courses
          </Link>
          <Link
            to="/dashboard/enrollments"
            className="btn btn-sm btn-outline border-base-300"
          >
            Enrollment Management
          </Link>
        </div>
      </div>

      {/* ===== Error alert (optional) ===== */}
      {error && (
        <div className="alert alert-warning text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* ===== Summary cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Total Students
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                summary?.totalStudents ?? 0
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Active learners in SkillSpace
            </p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Total Courses
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                summary?.totalCourses ?? 0
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Draft + Published
            </p>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Total Enrollments
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                summary?.totalEnrollments ?? 0
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Across all batches
            </p>
          </div>
        </div>

        {/* Active Batches */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Active Batches
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                summary?.activeBatches ?? 0
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Running right now
            </p>
          </div>
        </div>
      </div>

      {/* ===== Main analytics row: Chart + side panel ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Enrollments chart */}
        <div className="card bg-base-100 shadow-md border border-base-200 lg:col-span-2 min-w-0">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title text-base">
                  Enrollments over time
                </h2>
                <p className="text-xs text-base-content/60">
                  Last 30 days enrollment trend
                </p>
              </div>
            </div>

            {/* chart container */}
            <div className="w-full min-h-[260px]">
              {chartLoading ? (
                <div className="flex justify-center items-center h-[260px]">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex justify-center items-center h-[260px] text-sm text-base-content/60">
                  No enrollment data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorEnroll"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      allowDecimals={false}
                      tickMargin={4}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fill="url(#colorEnroll)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Side panel: quick links / recent info */}
        <div className="space-y-4">
          {/* Quick admin actions */}
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body space-y-3">
              <h2 className="card-title text-base">Quick actions</h2>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  to="/dashboard/AddCourse"
                  className="btn btn-sm btn-primary w-full"
                >
                  Create new course
                </Link>
                <Link
                  to="/dashboard/AllCourse"
                  className="btn btn-sm btn-outline w-full"
                >
                  Review all courses
                </Link>
                <Link
                  to="/dashboard/enrollments"
                  className="btn btn-sm btn-outline w-full"
                >
                  View enrollments by course
                </Link>
              </div>
            </div>
          </div>

          {/* Small info card */}
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body space-y-2 text-sm">
              <h2 className="card-title text-base">Admin Notes</h2>
              <p className="text-xs text-base-content/70">
                Use this dashboard to monitor course performance, see which
                batches have the most activity, and quickly jump into course &
                enrollment management.
              </p>
              <p className="text-[11px] text-base-content/60">
                Later you can extend this page with: top-performing courses,
                most active students, revenue charts, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
