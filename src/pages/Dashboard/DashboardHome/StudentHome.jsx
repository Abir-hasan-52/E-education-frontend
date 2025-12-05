import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const StudentHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Load enrolled courses for current student
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        setError("");

        const res = await axiosSecure.get("/api/enrollments/my");
        // expect: { enrollments: [ { course: {...}, progressPercent?, ... } ] }
        setEnrollments(res.data.enrollments || []);
      } catch (err) {
        console.error("Student dashboard error:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load your enrolled courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [axiosSecure, user?.email]);

  // 🔹 Small stats from enrollments
  const stats = useMemo(() => {
    if (!enrollments.length) {
      return {
        total: 0,
        completed: 0,
        avgProgress: 0,
      };
    }

    let total = enrollments.length;
    let completed = 0;
    let sumProgress = 0;

    enrollments.forEach((en) => {
      // backend e jodi progressPercent thake:
      const p =
        typeof en.progressPercent === "number"
          ? en.progressPercent
          : typeof en.progress?.percentage === "number"
          ? en.progress.percentage
          : 0;

      if (p >= 99.5) completed += 1;
      sumProgress += p;
    });

    const avgProgress = total ? Math.round(sumProgress / total) : 0;

    return { total, completed, avgProgress };
  }, [enrollments]);

  const firstName = user?.displayName?.split(" ")[0] || user?.email || "Student";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* ========= Header ========= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, <span className="text-primary">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-base-content/70">
            Track your learning progress and continue your courses from here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/courses"
            className="btn btn-sm btn-primary"
          >
            Browse Courses
          </Link>
          <Link
            to="/dashboard/MyCourses"
            className="btn btn-sm btn-outline border-base-300"
          >
            My Enrolled Courses
          </Link>
        </div>
      </div>

      {/* ========= Error alert ========= */}
      {error && (
        <div className="alert alert-warning text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* ========= Stats cards ========= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Enrolled courses */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Enrolled Courses
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                stats.total
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Total active courses you joined
            </p>
          </div>
        </div>

        {/* Completed courses */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Completed Courses
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                stats.completed
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              100% finished courses
            </p>
          </div>
        </div>

        {/* Average progress */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-4 px-5">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Average Progress
            </p>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                `${stats.avgProgress}%`
              )}
            </p>
            <p className="text-[11px] text-base-content/60">
              Across all enrolled courses
            </p>
          </div>
        </div>
      </div>

      {/* ========= Enrolled courses list ========= */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="card-title text-base">
                Your enrolled courses
              </h2>
              <p className="text-xs text-base-content/60">
                Continue where you left off.
              </p>
            </div>
            <Link
              to="/dashboard/MyCourses"
              className="btn btn-xs btn-outline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-10 text-sm text-base-content/60">
              You haven&apos;t enrolled in any course yet.
              <div className="mt-3">
                <Link to="/courses" className="btn btn-sm btn-primary">
                  Explore courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 4).map((enrollment) => {
                const c = enrollment.course || {};
                const progress =
                  typeof enrollment.progressPercent === "number"
                    ? enrollment.progressPercent
                    : typeof enrollment.progress?.percentage === "number"
                    ? enrollment.progress.percentage
                    : 0;

                return (
                  <div
                    key={enrollment._id}
                    className="border border-base-200 rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-3 md:items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-40 h-28 md:h-20 rounded-lg overflow-hidden bg-base-200 shrink-0">
                      {c.thumbnail ? (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-base-content/50">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Middle info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-sm md:text-base">
                          {c.title || "Untitled course"}
                        </h3>
                        {c.batch && (
                          <span className="badge badge-xs badge-outline">
                            {c.batch}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-base-content/60 line-clamp-2">
                        {c.shortDescription || "No description available."}
                      </p>

                      <div className="flex flex-wrap gap-2 items-center mt-1">
                        {c.category && (
                          <span className="badge badge-ghost badge-xs">
                            {c.category}
                          </span>
                        )}
                        {c.level && (
                          <span className="badge badge-ghost badge-xs">
                            {c.level}
                          </span>
                        )}
                        {c.duration && (
                          <span className="badge badge-ghost badge-xs">
                            {c.duration}
                          </span>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px] text-base-content/60">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <progress
                          className="progress progress-primary w-full"
                          value={Math.round(progress)}
                          max="100"
                        ></progress>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-2 md:w-40 justify-end md:justify-center">
                      <Link
                        to={`/dashboard/MyCourses/${c._id}/learn`}
                        className="btn btn-xs md:btn-sm btn-primary w-full"
                      >
                        Continue
                      </Link>
                      <Link
                        to={`/courses/${c._id}`}
                        className="btn btn-xs md:btn-sm btn-outline w-full"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
