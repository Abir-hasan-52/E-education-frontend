import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyEnrolledCourses = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load enrolled courses for logged-in student
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosSecure.get("/api/enrollments/my");
        setEnrollments(res.data.enrollments || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load your enrolled courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [axiosSecure, user]);

  // ✅ Calculate summary stats for title bar
  const summary = useMemo(() => {
    if (!enrollments.length) {
      return {
        total: 0,
        completed: 0,
        avgProgress: 0,
      };
    }

    const total = enrollments.length;

    let completed = 0;
    let totalProgress = 0;

    enrollments.forEach((e) => {
      const p = typeof e.progress === "number" ? e.progress : 0;
      totalProgress += p;

      if (p >= 100 || e.status === "completed") {
        completed += 1;
      }
    });

    const avgProgress = Math.round(totalProgress / total);

    return { total, completed, avgProgress };
  }, [enrollments]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* =========================
          TITLE + SUMMARY BAR
         ========================= */}
      <div className="flex flex-col gap-4">
        {/* Top row: title + button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">My Enrolled Courses</h1>
            <p className="text-sm text-base-content/70">
              {user?.email
                ? `Courses enrolled as ${user.email}`
                : "Login to view your enrolled courses."}
            </p>
          </div>

          <Link to="/courses" className="btn btn-sm btn-outline">
            Browse More Courses
          </Link>
        </div>

        {/* Summary bar */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-3 px-4 space-y-3">
            {/* Top summary stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <span className="text-xs uppercase text-base-content/60">
                  Total Enrolled
                </span>
                <p className="font-semibold text-base">{summary.total}</p>
              </div>

              <div>
                <span className="text-xs uppercase text-base-content/60">
                  Completed
                </span>
                <p className="font-semibold text-base">
                  {summary.completed}{" "}
                  <span className="text-xs text-base-content/60">
                    (
                    {summary.total
                      ? Math.round((summary.completed / summary.total) * 100)
                      : 0}
                    %)
                  </span>
                </p>
              </div>

              <div>
                <span className="text-xs uppercase text-base-content/60">
                  Avg. Progress
                </span>
                <p className="font-semibold text-base">
                  {summary.avgProgress}%
                </p>
              </div>
            </div>

            {/* Overall progress bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-base-content/60 mb-1">
                <span>Overall course completion</span>
                <span>{summary.avgProgress}%</span>
              </div>
              <progress
                className="progress progress-primary h-2 w-full"
                value={summary.avgProgress}
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* =========================
          CONTENT AREA
         ========================= */}
      {loading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card bg-base-100 shadow-sm animate-pulse">
              <div className="h-32 bg-base-200 rounded-t-2xl" />
              <div className="card-body space-y-3">
                <div className="h-4 bg-base-200 rounded w-2/3" />
                <div className="h-3 bg-base-200 rounded w-1/2" />
                <div className="h-3 bg-base-200 rounded w-full" />
                <div className="h-2 bg-base-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !user?.email ? (
        <p className="text-sm text-base-content/70">
          Please login to see your enrollments.
        </p>
      ) : enrollments.length === 0 ? (
        <div className="text-sm text-base-content/70">
          You haven&apos;t enrolled in any course yet.
        </div>
      ) : (
        // Courses grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((enroll) => {
            const c = enroll.course; // populated course
            if (!c) return null;

            const progress =
              typeof enroll.progress === "number" ? enroll.progress : 0;

            const price = c.isFree
              ? "Free"
              : `BDT ${c.discountPrice || c.price || 0}`;

            return (
              <div
                key={enroll._id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition border border-base-200"
              >
                {/* Thumbnail */}
                <figure className="h-32 bg-base-200 rounded-t-2xl overflow-hidden">
                  {c.thumbnail ? (
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                      No Thumbnail
                    </div>
                  )}
                </figure>

                <div className="card-body space-y-2">
                  {/* Title & price */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="card-title text-sm line-clamp-2">
                        {c.title}
                      </h2>
                      <p className="text-[11px] text-base-content/60 line-clamp-1">
                        {c.shortDescription || "No description provided."}
                      </p>
                    </div>
                    <span className="badge badge-outline text-xs shrink-0">
                      {price}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-base-content/60">
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

                  {/* Progress bar (per course) */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] text-base-content/60 mb-1">
                      <span>
                        Progress{" "}
                        {enroll.status === "completed" && (
                          <span className="badge badge-success badge-xs ml-1">
                            Completed
                          </span>
                        )}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <progress
                      className="progress progress-primary h-2 w-full"
                      value={progress}
                      max="100"
                    ></progress>
                  </div>

                  {/* Bottom row: date + continue */}
                  <div className="card-actions mt-3 justify-between items-center">
                    <span className="text-[11px] text-base-content/60">
                      Enrolled at:{" "}
                      {new Date(enroll.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/dashboard/MyCourses/${c._id}/learn`}
                      className="btn btn-xs btn-primary"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
