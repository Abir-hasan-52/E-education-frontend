import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router";

const AdminAllCourses = () => {
  const axiosSecure = useAxiosSecure();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all admin courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/admin/courses");
      setCourses(res.data.courses || res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Delete course
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting a course cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/api/admin/courses/${id}`);
          Swal.fire("Deleted!", "Course has been removed.", "success");
          loadCourses();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to delete course", "error");
        }
      }
    });
  };

  // Publish / Draft toggle
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      await axiosSecure.patch(`/api/admin/courses/${id}`, {
        status: newStatus,
      });
      Swal.fire(
        "Updated",
        `Course is now ${newStatus.toUpperCase()}`,
        "success"
      );
      loadCourses();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update course status", "error");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">All Courses (Admin)</h1>
      <p className="text-sm text-base-content/70">
        Manage, edit, publish or delete your created courses.
      </p>

      {courses.length === 0 ? (
        <p className="text-center text-base-content/60 py-10">
          No courses found. Create one from Add Course.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((c) => (
            <div
              key={c._id}
              className="card bg-base-100 shadow border border-base-200"
            >
              <figure className="h-40 overflow-hidden">
                <img
                  src={
                    c.thumbnail ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={c.title}
                  className="w-full object-cover"
                />
              </figure>

              <div className="card-body space-y-2">
                <h2 className="card-title text-lg">{c.title}</h2>

                <p className="text-xs text-base-content/60">{c.batch}</p>

                <p className="text-sm">
                  {c.shortDescription?.slice(0, 90)}...
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      c.status === "published"
                        ? "badge-success"
                        : "badge-warning"
                    } badge-sm`}
                  >
                    {c.status}
                  </span>
                  <span className="badge badge-outline badge-sm">
                    {c.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="card-actions justify-between mt-4">
                  {/* Edit */}
                  <Link
                    to={`/dashboard/edit-course/${c._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </Link>

                  {/* Publish/Unpublish */}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleToggleStatus(c._id, c.status)}
                  >
                    {c.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  {/* Delete */}
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllCourses;
