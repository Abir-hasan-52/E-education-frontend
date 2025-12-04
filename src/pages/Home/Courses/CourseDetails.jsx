import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { AiFillLock } from "react-icons/ai";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

// import useAxiosPublic from "../../hooks/useAxiosPublic";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

const CourseDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnroll, setCheckingEnroll] = useState(false);

  // =========================
  // Load course details
  // =========================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosPublic.get(`/api/courses/${id}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [axiosPublic, id]);

  // =========================
  // Check enrollment status (logged-in user)
  // =========================
  useEffect(() => {
    if (!user || !course) return;

    const checkStatus = async () => {
      try {
        setCheckingEnroll(true);
        const res = await axiosSecure.get(`/api/enrollments/status/${id}`);
        setIsEnrolled(res.data.isEnrolled);
      } catch (err) {
        console.error("Enroll status error:", err);
      } finally {
        setCheckingEnroll(false);
      }
    };

    checkStatus();
  }, [user, id, course, axiosSecure]);

  // =========================
  // Handle Enroll (popup + backend)
  // =========================
  const handleEnroll = async () => {
    // Login check
    if (!user) {
      const goLogin = await Swal.fire({
        icon: "info",
        title: "Login required",
        text: "You need to login to enroll in this course.",
        showCancelButton: true,
        confirmButtonText: "Go to login",
        cancelButtonText: "Cancel",
      });

      if (goLogin.isConfirmed) {
        navigate("/login", { state: { from: `/courses/${id}` } });
      }
      return;
    }

    // Confirm popup
    const result = await Swal.fire({
      icon: "question",
      title: "Enroll in this course?",
      html: `
        <div style="text-align:left;font-size:14px;">
          <p><b>${course.title}</b></p>
          <p style="margin-top:4px;">Price: ${
            course.isFree
              ? "Free"
              : `BDT ${course.discountPrice || course.price || 0}`
          }</p>
          <p style="margin-top:8px;color:#666;">
            You will get access to all lessons, assignments and quizzes.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, enroll me",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.post("/api/enrollments", {
        courseId: id,
      });

      if (res.data.alreadyEnrolled) {
        Swal.fire({
          icon: "info",
          title: "Already enrolled",
          text: "You already have access to this course.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Enrolled successfully",
          text: "You now have full access to this course.",
        });
      }

      setIsEnrolled(true);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Enrollment failed",
        text: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // =========================
  // Loading / Error UI
  // =========================
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="btn btn-ghost btn-sm mb-2" />
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 bg-base-200 rounded w-3/4" />
            <div className="h-4 bg-base-200 rounded w-1/2" />
            <div className="h-4 bg-base-200 rounded w-full" />
            <div className="h-4 bg-base-200 rounded w-2/3" />
          </div>
          <div className="h-40 bg-base-200 rounded-2xl" />
        </div>
        <div className="h-6 bg-base-200 rounded w-32" />
        <div className="h-40 bg-base-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-lg font-semibold text-error">
          {error || "Course not found"}
        </p>
        <button className="btn btn-outline btn-sm" onClick={handleBack}>
          Go Back
        </button>
      </div>
    );
  }

  // =========================
  // Destructure course
  // =========================
  const {
    title,
    batch,
    category,
    level,
    language,
    duration,
    price,
    discountPrice,
    isFree,
    shortDescription,
    description,
    thumbnail,
    instructorName,
    instructorTitle,
    learningOutcomes = [],
    modules = [],
  } = course;

  const displayPrice = isFree ? "Free" : `BDT ${discountPrice || price || 0}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="btn btn-ghost btn-sm mb-2 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Hero: info + enroll card */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Info side */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
            {shortDescription && (
              <p className="text-sm text-base-content/70">
                {shortDescription}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-base-content/70">
            {batch && (
              <span className="badge badge-ghost badge-sm">Batch: {batch}</span>
            )}
            {category && (
              <span className="badge badge-ghost badge-sm">{category}</span>
            )}
            {level && (
              <span className="badge badge-ghost badge-sm">
                Level: {level}
              </span>
            )}
            {language && (
              <span className="badge badge-ghost badge-sm">
                Language: {language}
              </span>
            )}
            {duration && (
              <span className="badge badge-ghost badge-sm">
                Duration: {duration}
              </span>
            )}
          </div>

          {/* Instructor */}
          {(instructorName || instructorTitle) && (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-xs font-semibold">
                {instructorName
                  ? instructorName.charAt(0).toUpperCase()
                  : "I"}
              </div>
              <div className="text-sm">
                {instructorName && (
                  <p className="font-medium">{instructorName}</p>
                )}
                {instructorTitle && (
                  <p className="text-base-content/70 text-xs">
                    {instructorTitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Full description */}
          {description && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold mb-1">
                About this course
              </h2>
              <p className="text-sm text-base-content/80 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Right side: thumbnail + price + enroll */}
        <div className="card bg-base-100 shadow-md">
          <figure className="h-40 bg-base-200 rounded-t-2xl overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                No Thumbnail
              </div>
            )}
          </figure>
          <div className="card-body space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">{displayPrice}</span>
              {!isFree && discountPrice && price && discountPrice < price && (
                <span className="text-xs line-through text-base-content/60">
                  BDT {price}
                </span>
              )}
            </div>

            <p className="text-xs text-base-content/70">
              Lifetime access • Certificate on completion (demo text)
            </p>

            <div className="card-actions">
              <button
                className="btn btn-primary btn-block"
                onClick={handleEnroll}
                disabled={isEnrolled || checkingEnroll}
              >
                {checkingEnroll
                  ? "Checking..."
                  : isEnrolled
                  ? "Already Enrolled"
                  : "Enroll Now"}
              </button>
            </div>

            {!isEnrolled && (
              <p className="text-[11px] text-base-content/60">
                Not enrolled yet. Only free preview lessons are available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* What you'll learn */}
      {learningOutcomes.length > 0 && (
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="text-base font-semibold mb-2">
              What you'll learn
            </h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-1 text-success text-xs">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body space-y-3">
          <h2 className="text-base font-semibold">Course Curriculum</h2>

          {!isEnrolled && (
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              <AiFillLock className="text-error" />
              Full content is locked. Enroll to unlock all lessons, assignments
              and quizzes. Free preview lessons are still accessible.
            </p>
          )}

          {modules.length === 0 ? (
            <p className="text-sm text-base-content/70">
              Curriculum is not available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {modules.map((mod, mIndex) => (
                <details
                  key={mIndex}
                  className="collapse collapse-arrow bg-base-100 border rounded-xl"
                  open={mIndex === 0}
                >
                  <summary className="collapse-title text-sm font-semibold flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <span>
                      Module {mIndex + 1}: {mod.title || "Untitled module"}
                    </span>
                    <span className="text-[11px] text-base-content/60 flex flex-wrap gap-2">
                      {Array.isArray(mod.lessons) && (
                        <span>
                          {mod.lessons.length} lesson
                          {mod.lessons.length !== 1 && "s"}
                        </span>
                      )}
                      {mod.assignmentUrl && <span>• Assignment</span>}
                      {Array.isArray(mod.quiz) && mod.quiz.length > 0 && (
                        <span>
                          • {mod.quiz.length} quiz
                          {mod.quiz.length !== 1 && "zes"}
                        </span>
                      )}
                    </span>
                  </summary>

                  <div className="collapse-content space-y-4 text-sm">
                    {/* Lessons list */}
                    {Array.isArray(mod.lessons) && mod.lessons.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-xs uppercase text-base-content/60">
                          Lessons
                        </p>
                        <ul className="space-y-1">
                          {mod.lessons.map((lesson, lIndex) => {
                            const isFreePreview =
                              typeof mod.freeLessonIndex !== "undefined" &&
                              Number(mod.freeLessonIndex) === lIndex;

                            const locked =
                              !isEnrolled && !isFreePreview;

                            return (
                              <li
                                key={lIndex}
                                className="flex items-center justify-between gap-2 border-b last:border-b-0 py-1"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-base-content/60">
                                    {lIndex + 1}.
                                  </span>
                                  <span>
                                    {lesson.title || "Untitled lesson"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-[11px]">
                                  {lesson.videoUrl && !locked && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="link link-primary"
                                    >
                                      Watch
                                    </a>
                                  )}

                                  {locked && (
                                    <span className="flex items-center gap-1 text-error">
                                      <AiFillLock /> Locked
                                    </span>
                                  )}

                                  {isFreePreview && (
                                    <span className="badge badge-success badge-xs">
                                      Free preview
                                    </span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Assignment */}
                    {(mod.assignmentUrl || mod.assignmentDescription) && (
                      <div className="space-y-1">
                        <p className="font-medium text-xs uppercase text-base-content/60">
                          Assignment
                        </p>

                        {!isEnrolled ? (
                          <p className="text-xs text-base-content/60 flex items-center gap-1">
                            <AiFillLock className="text-error" />
                            Enroll in this course to access assignments.
                          </p>
                        ) : (
                          <>
                            {mod.assignmentDescription && (
                              <p className="text-sm text-base-content/80">
                                {mod.assignmentDescription}
                              </p>
                            )}
                            {mod.assignmentUrl && (
                              <a
                                href={mod.assignmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-xs btn-outline"
                              >
                                Open Assignment
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Quiz summary */}
                    {Array.isArray(mod.quiz) && mod.quiz.length > 0 && (
                      <div className="space-y-1">
                        <p className="font-medium text-xs uppercase text-base-content/60">
                          Quiz
                        </p>

                        {!isEnrolled ? (
                          <p className="text-xs text-base-content/60 flex items-center gap-1">
                            <AiFillLock className="text-error" />
                            Enroll to attempt quizzes for this module.
                          </p>
                        ) : (
                          <p className="text-sm text-base-content/80">
                            This module contains {mod.quiz.length} quiz
                            {mod.quiz.length !== 1 && "zes"}.
                          </p>
                        )}

                        {/* TODO: enrolled user der jonno quiz attempt UI add korbe */}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="flex justify-between items-center text-xs text-base-content/60">
        <span>SkillSpace • Learn by doing</span>
        <Link to="/courses" className="link link-primary">
          Browse more courses →
        </Link>
      </div>
    </div>
  );
};

export default CourseDetails;
