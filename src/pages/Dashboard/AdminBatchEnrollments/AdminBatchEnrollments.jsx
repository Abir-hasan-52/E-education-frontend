import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminBatchEnrollments = () => {
  const axiosSecure = useAxiosSecure();

  const [batch, setBatch] = useState("");
  const [data, setData] = useState(null); // { batch, totalCourses, totalEnrollments, enrollments }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!batch.trim()) {
      setError("Please enter a batch name (e.g. Batch 1, Summer 2025)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await axiosSecure.get(`/api/enrollments/by-batch/${encodeURIComponent(batch.trim())}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load enrollments for this batch."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Batch-wise Enrollments</h1>
          <p className="text-sm text-base-content/70">
            View all students enrolled under a specific batch.
          </p>
        </div>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="card-body flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="label text-xs font-medium">
              Batch Name / ID
            </label>
            <input
              type="text"
              className="input input-bordered w-full input-sm"
              placeholder="e.g. Batch 1, MERN Batch 02, Summer 2025"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Result summary + table */}
      {data && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200">
              <div className="stat-title text-xs">Batch</div>
              <div className="stat-value text-lg">{data.batch}</div>
            </div>

            <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200">
              <div className="stat-title text-xs">Total Courses</div>
              <div className="stat-value text-lg">
                {data.totalCourses || 0}
              </div>
            </div>

            <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200">
              <div className="stat-title text-xs">Total Enrollments</div>
              <div className="stat-value text-lg">
                {data.totalEnrollments || 0}
              </div>
            </div>
          </div>

          {/* Table */}
          {data.enrollments && data.enrollments.length > 0 ? (
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
                      <th>Progress</th>
                      <th>Enrolled At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.enrollments.map((enroll, idx) => (
                      <tr key={enroll._id}>
                        <td>{idx + 1}</td>
                        <td>{enroll.student?.name || "-"}</td>
                        <td className="text-xs">{enroll.student?.email}</td>
                        <td className="text-xs">
                          {enroll.course?.title || "-"}
                        </td>
                        <td className="text-xs">
                          {enroll.course?.batch || data.batch}
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">
                              {enroll.progress || 0}%{" "}
                              {enroll.status === "completed" && (
                                <span className="badge badge-success badge-xs ml-1">
                                  Completed
                                </span>
                              )}
                            </span>
                            <progress
                              className="progress progress-primary h-1 w-24"
                              value={enroll.progress || 0}
                              max="100"
                            ></progress>
                          </div>
                        </td>
                        <td className="text-xs">
                          {new Date(enroll.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-base-content/60">
              No enrollments found for this batch.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBatchEnrollments;
