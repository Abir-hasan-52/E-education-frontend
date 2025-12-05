import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminAssignmentReview = () => {
  const axiosSecure = useAxiosSecure();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [moduleIndex, setModuleIndex] = useState("all");

  const [submissions, setSubmissions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState("");

  // Load courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await axiosSecure.get("/api/admin/courses");
        setCourses(res.data.courses || res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [axiosSecure]);

  const handleLoadSubmissions = async (e) => {
    e?.preventDefault?.();
    if (!selectedCourseId) {
      setError("Please select a course first.");
      return;
    }

    try {
      setLoadingSubmissions(true);
      setError("");
      setSubmissions([]);

      const params =
        moduleIndex === "all"
          ? {}
          : { moduleIndex: Number(moduleIndex) };

      const res = await axiosSecure.get(
        `/api/enrollments/${selectedCourseId}/assignments/admin`,
        { params }
      );

      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load submissions."
      );
    } finally {
      setLoadingSubmissions(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Assignment Review</h1>
          <p className="text-sm text-base-content/70">
            View and review assignment submissions from students.
          </p>
        </div>
      </div>

      {/* Filter card */}
      <form
        onSubmit={handleLoadSubmissions}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course select */}
          <div className="form-control">
            <label className="label text-xs font-medium">
              Select Course
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={loadingCourses}
            >
              <option value="">-- Choose a course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} {c.batch ? `(${c.batch})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Module filter (optional) */}
          <div className="form-control">
            <label className="label text-xs font-medium">
              Filter by Module (optional)
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered input-sm w-full"
              placeholder="Module number (1, 2, 3...) or leave blank"
              value={moduleIndex === "all" ? "" : moduleIndex + 1}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) setModuleIndex("all");
                else setModuleIndex(Number(val) - 1); // store 0-based
              }}
            />
            <span className="text-[10px] text-base-content/60 mt-1">
              Stored as 0-based index in DB. Here you type 1-based number.
            </span>
          </div>

          {/* Button */}
          <div className="form-control md:justify-end">
            <button
              type="submit"
              className="btn btn-sm btn-primary mt-4 md:mt-0"
              disabled={loadingCourses || loadingSubmissions}
            >
              {loadingSubmissions ? "Loading..." : "Load Submissions"}
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

      {/* Summary + Table */}
      {selectedCourseId && !loadingSubmissions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <p className="text-base-content/70">
              {submissions.length
                ? `Total submissions: ${submissions.length}`
                : "No submissions found for this filter."}
            </p>
          </div>

          {submissions.length > 0 && (
            <div className="card bg-base-100 shadow-sm border border-base-200 overflow-x-auto">
              <div className="card-body p-0">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr className="text-xs">
                      <th>#</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Module</th>
                      <th>Link</th>
                      <th>Answer (snippet)</th>
                      <th>Submitted At</th>
                      <th>Status / Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{s.student?.name || "-"}</td>
                        <td className="text-xs">{s.student?.email}</td>
                        <td className="text-xs">
                          {s.course?.title || "-"}
                        </td>
                        <td className="text-xs">
                          {s.course?.batch || "-"}
                        </td>
                        <td className="text-xs">
                          Module {Number(s.moduleIndex) + 1}
                        </td>
                        <td className="text-xs max-w-[120px] truncate">
                          {s.link ? (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              className="link link-primary link-hover"
                            >
                              Open
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-[11px] max-w-[200px] truncate">
                          {s.answerText || "-"}
                        </td>
                        <td className="text-[11px]">
                          {s.submittedAt
                            ? new Date(s.submittedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="text-[11px]">
                          <div className="flex flex-col gap-1">
                            <span>{s.status || "submitted"}</span>
                            {typeof s.score === "number" && (
                              <span className="badge badge-ghost badge-xs">
                                Score: {s.score}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {loadingSubmissions && (
        <p className="text-sm text-base-content/60">
          Loading submissions...
        </p>
      )}
    </div>
  );
};

export default AdminAssignmentReview;
