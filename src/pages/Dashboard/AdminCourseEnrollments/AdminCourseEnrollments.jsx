import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminCourseEnrollments = () => {
  const axiosSecure = useAxiosSecure();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [enrollments, setEnrollments] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [error, setError] = useState("");

  // 1) Load all courses (admin created)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");
        const res = await axiosSecure.get("/api/admin/courses");
        const list = res.data.courses || res.data || [];
        setCourses(list);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load courses for admin."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [axiosSecure]);

  // 2) When course select changes, set selectedCourse & reset enrollments
  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourseId(id);
    setEnrollments([]);
    setError("");

    const found = courses.find((c) => c._id === id);
    setSelectedCourse(found || null);
  };

  // 3) Load enrollments for selected course
  const handleLoadEnrollments = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError("Please select a course first.");
      return;
    }

    try {
      setLoadingEnrollments(true);
      setError("");
      setEnrollments([]);

      const res = await axiosSecure.get(
        `/api/enrollments/by-course/${selectedCourseId}`
      );

      setEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load enrollments for this course."
      );
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // summary
  const totalStudents = enrollments.length;
  const completedCount = enrollments.filter(
    (e) => e.status === "completed" || (e.progress || 0) >= 100
  ).length;
  const avgProgress =
    totalStudents > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            totalStudents
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Enrollment Management</h1>
          <p className="text-sm text-base-content/70">
            Select a course, check its batch, and see all enrolled students.
          </p>
        </div>
      </div>

      {/* Filter card */}
      <form
        onSubmit={handleLoadEnrollments}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course select */}
          <div className="form-control">
            <label className="label text-xs font-medium">
              Course (select first)
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={selectedCourseId}
              onChange={handleCourseChange}
              disabled={loadingCourses}
            >
              <option value="">-- Choose a course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}{" "}
                  {c.batch ? `(${c.batch})` : ""}
                </option>
              ))}
            </select>
            {loadingCourses && (
              <p className="text-[11px] text-base-content/60 mt-1">
                Loading courses...
              </p>
            )}
          </div>

          {/* Batch view (from selected course) */}
          <div className="form-control">
            <label className="label text-xs font-medium">
              Batch (auto from course)
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={selectedCourse?.batch || ""}
              placeholder="Select course to see batch"
              readOnly
            />
            <span className="text-[10px] text-base-content/60 mt-1">
              This batch value comes from the course info.
            </span>
          </div>

          {/* Button */}
          <div className="form-control md:justify-end">
            <button
              type="submit"
              className="btn btn-sm btn-primary mt-4 md:mt-0"
              disabled={loadingCourses || loadingEnrollments}
            >
              {loadingEnrollments ? "Loading..." : "View Enrolled Students"}
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Summary + table */}
      {selectedCourse && !loadingEnrollments && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body py-3 px-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-base-content/60">Course</p>
                  <p className="text-sm font-semibold">
                    {selectedCourse.title}
                  </p>
                  {selectedCourse.batch && (
                    <p className="text-[11px] text-base-content/60">
                      Batch: {selectedCourse.batch}
                    </p>
                  )}
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-[11px] text-base-content/60">
                      Total Enrolled
                    </p>
                    <p className="font-semibold text-base">
                      {totalStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-base-content/60">
                      Completed
                    </p>
                    <p className="font-semibold text-base">
                      {completedCount}{" "}
                      <span className="text-[11px] text-base-content/60">
                        {totalStudents
                          ? `(${Math.round(
                              (completedCount / totalStudents) * 100
                            )}%)`
                          : "(0%)"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-base-content/60">
                      Avg Progress
                    </p>
                    <p className="font-semibold text-base">
                      {avgProgress}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-base-content/60 mb-1">
                  <span>Overall course progress</span>
                  <span>{avgProgress}%</span>
                </div>
                <progress
                  className="progress progress-primary h-2 w-full"
                  value={avgProgress}
                  max="100"
                ></progress>
              </div>
            </div>
          </div>

          {/* Table */}
          {enrollments.length > 0 ? (
            <div className="card bg-base-100 shadow-sm border border-base-200 overflow-x-auto">
              <div className="card-body p-0">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr className="text-xs">
                      <th>#</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Enrolled At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e, idx) => (
                      <tr key={e._id}>
                        <td>{idx + 1}</td>
                        <td>{e.student?.name || "-"}</td>
                        <td className="text-xs">{e.student?.email}</td>
                        <td className="text-xs">{e.student?.role}</td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">
                              {e.progress || 0}%{" "}
                              {e.status === "completed" && (
                                <span className="badge badge-success badge-xs ml-1">
                                  Completed
                                </span>
                              )}
                            </span>
                            <progress
                              className="progress progress-primary h-1 w-20"
                              value={e.progress || 0}
                              max="100"
                            ></progress>
                          </div>
                        </td>
                        <td className="text-xs">
                          {e.status || "enrolled"}
                        </td>
                        <td className="text-xs">
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedCourseId ? (
            <p className="text-sm text-base-content/60">
              No students enrolled in this course yet.
            </p>
          ) : null}
        </div>
      )}

      {loadingEnrollments && (
        <p className="text-sm text-base-content/60">
          Loading enrollments...
        </p>
      )}
    </div>
  );
};

export default AdminCourseEnrollments;
