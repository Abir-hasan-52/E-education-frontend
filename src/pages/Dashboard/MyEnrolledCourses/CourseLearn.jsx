import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

// Helper: convert normal YouTube URL to embed URL
const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    // fallback: return original
    return url;
  } catch {
    return url;
  }
};

const CourseLearn = () => {
  const { courseId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Assignment state
  const [assignmentLink, setAssignmentLink] = useState("");
  const [assignmentText, setAssignmentText] = useState("");
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState("");

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState([]); // array of selected option index
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // {score,total,correctAnswers}

  // Load course + enrollment
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/courses/${courseId}/learn` } });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosSecure.get(
          `/api/enrollments/course/${courseId}`
        );
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);

        // default active module/lesson
        const mods = res.data.course.modules || [];
        if (mods.length > 0) {
          setActiveModuleIndex(0);
          if (Array.isArray(mods[0].lessons) && mods[0].lessons.length > 0) {
            setActiveLessonIndex(0);
          } else {
            setActiveLessonIndex(0);
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load course learning view."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure, courseId, user, navigate]);

  const modules = course?.modules || [];

  const currentModule = useMemo(
    () => modules[activeModuleIndex] || null,
    [modules, activeModuleIndex]
  );
  const currentLesson = useMemo(
    () => currentModule?.lessons?.[activeLessonIndex] || null,
    [currentModule, activeLessonIndex]
  );

  const isLessonCompleted = (mIndex, lIndex) => {
    if (!enrollment?.completedLessons) return false;
    return enrollment.completedLessons.some(
      (cl) => cl.moduleIndex === mIndex && cl.lessonIndex === lIndex
    );
  };

  const handleSelectLesson = (mIndex, lIndex) => {
    setActiveModuleIndex(mIndex);
    setActiveLessonIndex(lIndex);
    setQuizResult(null); // quiz result clear when lesson change
  };

  const handleMarkCompleted = async () => {
    if (!currentModule || !currentLesson || !enrollment) return;

    try {
      setActionLoading(true);
      const res = await axiosSecure.post(
        `/api/enrollments/${courseId}/lessons/complete`,
        {
          moduleIndex: activeModuleIndex,
          lessonIndex: activeLessonIndex,
        }
      );
      setEnrollment(res.data.enrollment);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || "Failed to mark lesson as completed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Assignment: get last submission for current module
  const lastAssignment = useMemo(() => {
    if (!enrollment?.assignments) return null;
    const filtered = enrollment.assignments.filter(
      (a) => a.moduleIndex === activeModuleIndex
    );
    if (!filtered.length) return null;
    return filtered[filtered.length - 1];
  }, [enrollment, activeModuleIndex]);

  useEffect(() => {
    if (lastAssignment) {
      setAssignmentLink(lastAssignment.link || "");
      setAssignmentText(lastAssignment.answerText || "");
    } else {
      setAssignmentLink("");
      setAssignmentText("");
    }
    setAssignmentMessage("");
  }, [lastAssignment, activeModuleIndex]);

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentLink && !assignmentText) {
      setAssignmentMessage("Please enter a link or answer text.");
      return;
    }

    try {
      setAssignmentSubmitting(true);
      setAssignmentMessage("");

      const res = await axiosSecure.post(
        `/api/enrollments/${courseId}/assignments`,
        {
          moduleIndex: activeModuleIndex,
          link: assignmentLink,
          answerText: assignmentText,
        }
      );

      setEnrollment(res.data.enrollment);
      setAssignmentMessage("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
      setAssignmentMessage(
        err?.response?.data?.message || "Failed to submit assignment."
      );
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // Quiz answers initial setup when module changes
  useEffect(() => {
    if (currentModule?.quiz && Array.isArray(currentModule.quiz)) {
      setQuizAnswers(new Array(currentModule.quiz.length).fill(null));
      setQuizResult(null);
    } else {
      setQuizAnswers([]);
      setQuizResult(null);
    }
  }, [currentModule]);

  const handleQuizOptionChange = (qIndex, optionIndex) => {
    setQuizAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optionIndex;
      return copy;
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!currentModule?.quiz || !currentModule.quiz.length) return;

    // check all answered
    const allAnswered = quizAnswers.every((val) => typeof val === "number");
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setQuizSubmitting(true);
      const res = await axiosSecure.post(
        `/api/enrollments/${courseId}/quizzes`,
        {
          moduleIndex: activeModuleIndex,
          answers: quizAnswers,
        }
      );

      setEnrollment(res.data.enrollment);
      setQuizResult({
        score: res.data.score,
        total: res.data.total,
        correctAnswers: res.data.correctAnswers,
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 bg-base-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-base-200 rounded w-1/4 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="h-64 bg-base-200 rounded-2xl animate-pulse md:col-span-2" />
          <div className="h-64 bg-base-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !course || !enrollment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-lg font-semibold text-error">
          {error || "Something went wrong."}
        </p>
        <Link to="/dashboard/my-courses" className="btn btn-outline btn-sm">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(currentLesson?.videoUrl);
  const courseProgress = enrollment.progress || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-xs mb-1"
          >
            ← Back
          </button>
          <h1 className="text-xl md:text-2xl font-semibold">{course.title}</h1>
          <p className="text-xs text-base-content/70">
            Progress: {courseProgress}% completed
          </p>
        </div>
        <div className="w-full md:w-64">
          <div className="flex items-center justify-between text-[11px] text-base-content/60 mb-1">
            <span>Overall Progress</span>
            <span>{courseProgress}%</span>
          </div>
          <progress
            className="progress progress-primary h-2 w-full"
            value={courseProgress}
            max="100"
          ></progress>
        </div>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* LEFT: Sidebar curriculum */}
        <aside className="md:col-span-1 card bg-base-100 shadow-sm border border-base-200 h-fit max-h-[75vh] overflow-y-auto">
          <div className="card-body space-y-3">
            <h2 className="text-sm font-semibold">Course Content</h2>
            <div className="space-y-2">
              {modules.map((mod, mIndex) => (
                <details
                  key={mIndex}
                  className="collapse collapse-arrow bg-base-100 border rounded-xl"
                  open={mIndex === activeModuleIndex}
                >
                  <summary className="collapse-title text-xs font-semibold flex justify-between items-center gap-2">
                    <span>
                      Module {mIndex + 1}: {mod.title || "Untitled module"}
                    </span>
                    {Array.isArray(mod.lessons) && (
                      <span className="text-[10px] text-base-content/60">
                        {mod.lessons.length} lessons
                      </span>
                    )}
                  </summary>
                  <div className="collapse-content space-y-1">
                    {Array.isArray(mod.lessons) && mod.lessons.length > 0 ? (
                      mod.lessons.map((lesson, lIndex) => {
                        const completed = isLessonCompleted(mIndex, lIndex);
                        const isActive =
                          mIndex === activeModuleIndex &&
                          lIndex === activeLessonIndex;

                        return (
                          <button
                            key={lIndex}
                            onClick={() => handleSelectLesson(mIndex, lIndex)}
                            className={`w-full text-left text-[12px] px-2 py-1 rounded-lg flex items-center justify-between ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-base-200"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[10px]">
                                {completed ? "✔" : isActive ? "▶" : "•"}
                              </span>
                              <span className="line-clamp-1">
                                {lIndex + 1}.{" "}
                                {lesson.title || "Untitled lesson"}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-[11px] text-base-content/60">
                        No lessons in this module.
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: main content */}
        <main className="md:col-span-2 space-y-4">
          {/* Video + lesson header */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body space-y-3">
              {/* Video */}
              <div className="aspect-video bg-base-200 rounded-xl overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={currentLesson?.title || "Lesson video"}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                    No video URL provided for this lesson.
                  </div>
                )}
              </div>

              {/* Lesson title + complete button */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs text-base-content/60">
                    Module {activeModuleIndex + 1}
                  </p>
                  <h2 className="text-base font-semibold">
                    {currentLesson?.title || "Untitled lesson"}
                  </h2>
                </div>

                <button
                  onClick={handleMarkCompleted}
                  disabled={
                    actionLoading ||
                    isLessonCompleted(activeModuleIndex, activeLessonIndex)
                  }
                  className="btn btn-sm btn-primary"
                >
                  {isLessonCompleted(activeModuleIndex, activeLessonIndex)
                    ? "Completed"
                    : actionLoading
                    ? "Marking..."
                    : "Mark as Completed"}
                </button>
              </div>
            </div>
          </div>

          {/* Assignment & Quiz Tabs */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body space-y-4">
              <div className="tabs tabs-bordered">
                {/* Fake tabs using radio inputs */}
                <input
                  type="radio"
                  name="learn-tabs"
                  role="tab"
                  className="tab"
                  aria-label="Assignment"
                  defaultChecked
                />
                <div role="tabpanel" className="tab-content py-4">
                  {/* Assignment content */}
                  <h3 className="text-sm font-semibold mb-2">
                    Assignment for Module {activeModuleIndex + 1}
                  </h3>
                  {currentModule?.assignmentDescription ? (
                    <p className="text-xs text-base-content/80 mb-3 whitespace-pre-line">
                      {currentModule.assignmentDescription}
                    </p>
                  ) : (
                    <p className="text-xs text-base-content/60 mb-3">
                      No assignment description provided for this module.
                    </p>
                  )}

                  <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                    <div className="form-control">
                      <label className="label text-xs font-medium">
                        Google Drive link (or any URL)
                      </label>
                      <input
                        type="url"
                        value={assignmentLink}
                        onChange={(e) => setAssignmentLink(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label text-xs font-medium">
                        Answer / Notes (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        className="textarea textarea-bordered textarea-sm w-full"
                        placeholder="Write your answer or notes here..."
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={assignmentSubmitting}
                        className="btn btn-sm btn-primary"
                      >
                        {assignmentSubmitting
                          ? "Submitting..."
                          : "Submit Assignment"}
                      </button>

                      {lastAssignment && (
                        <p className="text-[11px] text-base-content/60">
                          Last submitted:{" "}
                          {new Date(
                            lastAssignment.submittedAt
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {assignmentMessage && (
                      <p className="text-[11px] text-info mt-1">
                        {assignmentMessage}
                      </p>
                    )}
                  </form>
                </div>

                <input
                  type="radio"
                  name="learn-tabs"
                  role="tab"
                  className="tab"
                  aria-label="Quiz"
                />
                <div role="tabpanel" className="tab-content py-4">
                  {/* Quiz content */}
                  <h3 className="text-sm font-semibold mb-2">
                    Quiz for Module {activeModuleIndex + 1}
                  </h3>

                  {!currentModule?.quiz || !currentModule.quiz.length ? (
                    <p className="text-xs text-base-content/60">
                      No quiz available for this module.
                    </p>
                  ) : (
                    <form onSubmit={handleQuizSubmit} className="space-y-3">
                      {currentModule.quiz.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="border border-base-200 rounded-lg p-3 space-y-2"
                        >
                          <p className="text-xs font-medium">
                            Q{qIndex + 1}. {q.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, optIndex) => (
                              <label
                                key={optIndex}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`q-${qIndex}`}
                                  className="radio radio-xs radio-primary"
                                  checked={quizAnswers[qIndex] === optIndex}
                                  onChange={() =>
                                    handleQuizOptionChange(qIndex, optIndex)
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="submit"
                          disabled={quizSubmitting}
                          className="btn btn-sm btn-primary"
                        >
                          {quizSubmitting ? "Submitting..." : "Submit Quiz"}
                        </button>
                      </div>

                      {quizResult && (
                        <div className="mt-3 text-xs space-y-1">
                          <p className="font-medium">
                            Score: {quizResult.score} / {quizResult.total} (
                            {Math.round(
                              (quizResult.score / quizResult.total) * 100
                            )}
                            %)
                          </p>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseLearn;
