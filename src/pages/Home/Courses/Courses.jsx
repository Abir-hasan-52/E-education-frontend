import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link } from "react-router";
// import useAxiosPublic from "../../hooks/useAxiosPublic";

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Web Development", value: "Web Development" },
  { label: "Programming", value: "Programming" },
  { label: "Data Science", value: "Data Science" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Business", value: "Business" },
];

const Courses = () => {
  const axiosPublic = useAxiosPublic();

  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // search change hole page reset
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", pagination.limit);
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (category && category !== "all") params.set("category", category);
        if (sort) params.set("sort", sort);

        const res = await axiosPublic.get(`/api/courses?${params.toString()}`);

        setCourses(res.data.courses || []);
        setPagination((prev) => ({
          ...prev,
          ...res.data.pagination,
        }));
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load courses. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [axiosPublic, page, debouncedSearch, category, sort]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const goToPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-base-content/70">
            Browse available SkillSpace courses and start learning.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="form-control">
            <label className="label py-0">
              <span className="label-text text-xs">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search by title or instructor..."
              className="input input-bordered input-sm md:input-md w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="form-control">
            <label className="label py-0">
              <span className="label-text text-xs">Category</span>
            </label>
            <select
              className="select select-bordered select-sm md:select-md w-full md:w-44"
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="form-control">
            <label className="label py-0">
              <span className="label-text text-xs">Sort by</span>
            </label>
            <select
              className="select select-bordered select-sm md:select-md w-full md:w-44"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status / info */}
      <div className="flex items-center justify-between text-xs text-base-content/70">
        <span>
          {pagination.totalItems > 0
            ? `Showing ${(pagination.currentPage - 1) * pagination.limit + 1}–${Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalItems
              )} of ${pagination.totalItems} courses`
            : "No courses found"}
        </span>
        {debouncedSearch && (
          <span className="badge badge-ghost badge-sm">
            Search: "{debouncedSearch}"
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Courses grid */}
      <div>
        {loading ? (
          // simple skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: pagination.limit }).map((_, idx) => (
              <div key={idx} className="card bg-base-100 shadow-sm animate-pulse">
                <div className="h-32 bg-base-200 rounded-t-2xl" />
                <div className="card-body space-y-3">
                  <div className="h-4 bg-base-200 rounded w-3/4" />
                  <div className="h-3 bg-base-200 rounded w-1/2" />
                  <div className="h-3 bg-base-200 rounded w-full" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-base-200 rounded w-16" />
                    <div className="h-8 bg-base-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 text-sm text-base-content/70">
            No courses match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="card bg-base-100 shadow-sm hover:shadow-md transition">
                {/* Thumbnail */}
                <figure className="h-40 bg-base-200 overflow-hidden rounded-t-2xl">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                      No Thumbnail
                    </div>
                  )}
                </figure>

                <div className="card-body space-y-2 bg-purple-50">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="card-title text-base line-clamp-2">
                      {course.title}
                    </h2>
                    {course.isFree ? (
                      <span className="badge badge-success">Free</span>
                    ) : (
                      <span className="badge badge-outline text-xs">
                        BDT {course.discountPrice || course.price || 0}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-base-content/70 line-clamp-2">
                    {course.shortDescription || "No description provided."}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-base-content/60 bg-purple-50 px-2 py-1 rounded-lg">
                    {course.instructorName && (
                      <span className="badge badge-ghost badge-xs bg-purple-200 hover:bg-purple-300 p-2">
                        {course.instructorName}
                      </span>
                    )}
                    {course.category && (
                      <span className="badge badge-ghost badge-xs bg-purple-200 hover:bg-purple-300 p-2">
                        {course.category}
                      </span>
                    )}
                    {course.level && (
                      <span className="badge badge-ghost badge-xs bg-purple-200 hover:bg-purple-300 p-2">
                        {course.level}
                      </span>
                    )}
                    {course.batch && (
                      <span className="badge badge-ghost badge-xs bg-purple-200 hover:bg-purple-300 p-2">
                        Batch: {course.batch}
                      </span>
                    )}
                  </div>

                  <div className="card-actions mt-3 justify-between items-center bg-purple-300/20 px-3 py-2 rounded-lg">
                    <span className="text-xs text-base-content/70  hover:text-base-content">
                      Duration: {course.duration || "N/A"}
                    </span>
                    {/* TODO: route link to course details page */}
                    <Link to={`/courses/${course._id}`}>
                    <button className="btn btn-sm bg-purple-500 hover:bg-purple-700 text-white">
                      View Details
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="btn btn-sm"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            « Prev
          </button>

          {/* simple page numbers */}
          {Array.from({ length: pagination.totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                className={`btn btn-sm ${
                  p === page ? "btn-active btn-primary" : "btn-ghost"
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            );
          })}

          <button
            className="btn btn-sm"
            onClick={() => goToPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
