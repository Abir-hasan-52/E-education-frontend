import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: "Web Development",
      level: "Beginner",
      language: "English",
    },
  });

  const axiosSecure = useAxiosSecure();

  // =========================
  // Dynamic field state
  // =========================

  const [learningOutcomeIds, setLearningOutcomeIds] = useState([0]);

  const [modules, setModules] = useState([
    { id: 0, lessonIds: [0], quizQuestionIds: [0] },
  ]);

  // =========================
  // Learning outcome handlers
  // =========================

  const addOutcomeField = () => {
    setLearningOutcomeIds((prev) => [...prev, prev[prev.length - 1] + 1]);
  };

  const removeOutcomeField = (id) => {
    if (learningOutcomeIds.length === 1) return;
    setLearningOutcomeIds((prev) => prev.filter((x) => x !== id));
  };

  // =========================
  // Module handlers
  // =========================

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        id: Date.now(),
        lessonIds: [0],
        quizQuestionIds: [0],
      },
    ]);
  };

  const removeModule = (id) => {
    if (modules.length === 1) return;
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  // =========================
  // Lesson handlers
  // =========================

  const addLesson = (moduleId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessonIds: [
                ...m.lessonIds,
                m.lessonIds[m.lessonIds.length - 1] + 1,
              ],
            }
          : m
      )
    );
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessonIds:
                m.lessonIds.length === 1
                  ? m.lessonIds
                  : m.lessonIds.filter((id) => id !== lessonId),
            }
          : m
      )
    );
  };

  // =========================
  // Quiz handlers
  // =========================

  const addQuizQuestion = (moduleId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              quizQuestionIds: [
                ...m.quizQuestionIds,
                m.quizQuestionIds[m.quizQuestionIds.length - 1] + 1,
              ],
            }
          : m
      )
    );
  };

  const removeQuizQuestion = (moduleId, questionId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              quizQuestionIds:
                m.quizQuestionIds.length === 1
                  ? m.quizQuestionIds
                  : m.quizQuestionIds.filter((id) => id !== questionId),
            }
          : m
      )
    );
  };

  // =========================
  // Submit handlers
  // =========================

  // 🔴 Form error hole Swal alert
  const handleFormError = (formErrors) => {
    console.log("Validation errors:", formErrors);
    Swal.fire({
      icon: "error",
      title: "Please fix the errors",
      text: "Some required fields are missing or invalid. Check the red highlighted fields.",
    });
  };

  // ✅ Real submit (backend POST)
  const submitToBackend = async (data, status) => {
    const coursePayload = {
      ...data,
      status,
    };

    console.log("Course payload:", coursePayload);

    try {
      const res = await axiosSecure.post("/api/admin/courses", coursePayload);
      console.log("Course saved to backend:", res.data);

      Swal.fire({
        icon: "success",
        title:
          status === "published" ? "Course Published" : "Course Saved as Draft",
        text: "Course has been saved successfully.",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to save course",
        text: err?.response?.data?.message || "Something went wrong while saving the course.",
      });
    }
  };

  // Helper wrappers for draft/publish
  const handlePublish = (data) => submitToBackend(data, "published");
  const handleDraft = (data) => submitToBackend(data, "draft");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Add New Course</h1>
          <p className="text-sm text-base-content/70">
            Create a batch-based course with lessons, quizzes, and assignments.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handlePublish, handleFormError)}
        className="space-y-6"
      >
        {/* =========================
            COURSE INFORMATION
           ========================= */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="card-title">Course Information</h2>
              <span className="badge badge-outline text-xs">Basic details</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Course Title */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.title ? "input-error" : ""
                  }`}
                  placeholder="e.g. Complete MERN Stack Bootcamp"
                  {...register("title", { required: "Course title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Batch Name/ID */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Batch Name / ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.batch ? "input-error" : ""
                  }`}
                  placeholder="e.g. Batch 01, Summer 2025"
                  {...register("batch", { required: "Batch is required" })}
                />
                {errors.batch && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.batch.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.category ? "select-error" : ""
                  }`}
                  {...register("category", { required: "Category is required" })}
                >
                  <option>Web Development</option>
                  <option>Programming</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                  <option>Business</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Level */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.level ? "select-error" : ""
                  }`}
                  {...register("level", { required: "Level is required" })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                {errors.level && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.level.message}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.language ? "select-error" : ""
                  }`}
                  {...register("language", { required: "Language is required" })}
                >
                  <option>English</option>
                  <option>Bangla</option>
                </select>
                {errors.language && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration + Price */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Duration
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. 8 weeks, 40 hours"
                  {...register("duration")}
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">
                  Price (BDT)
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="e.g. 1999"
                  {...register("price", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">
                  Discount Price (optional)
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="e.g. 1499"
                  {...register("discountPrice", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Free toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register("isFree")}
                />
                <span className="label-text text-sm">
                  This is a free course (price will be ignored)
                </span>
              </label>
            </div>

            {/* Short Description */}
            <div className="form-control">
              <label className="label text-sm font-medium">
                Short Description
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                placeholder="A short summary shown in course cards."
                {...register("shortDescription")}
              />
            </div>

            {/* Full Description */}
            <div className="form-control">
              <label className="label text-sm font-medium">
                Full Description
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Describe what this course covers in detail."
                {...register("description")}
              />
            </div>
          </div>
        </div>

        {/* =========================
            MEDIA & INSTRUCTOR + LEARNING OUTCOMES
           ========================= */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Media & Instructor */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="card-title">Media & Instructor</h2>
                <span className="badge badge-outline text-xs">Optional</span>
              </div>

              {/* Thumbnail URL */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="https://image-url"
                  {...register("thumbnail")}
                />
              </div>

              {/* Instructor Name */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Instructor Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. Tanvir Kamal"
                  {...register("instructorName")}
                />
              </div>

              {/* Instructor Title */}
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Instructor Title
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. Senior MERN Developer"
                  {...register("instructorTitle")}
                />
              </div>
            </div>
          </div>

          {/* What will students learn */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="card-title">What will students learn?</h2>
                  <span className="badge badge-outline text-xs">
                    Recommended
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={addOutcomeField}
                >
                  + Add Outcome
                </button>
              </div>

              {learningOutcomeIds.map((id, index) => (
                <div key={id} className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={`Outcome ${index + 1}`}
                    {...register(`learningOutcomes.${index}`)}
                  />
                  {learningOutcomeIds.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => removeOutcomeField(id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            COURSE CURRICULUM
           ========================= */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="card-title">Course Curriculum</h2>
                <span className="badge badge-outline text-xs">
                  Module, lessons, quiz & assignment
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={addModule}
              >
                + Add Module
              </button>
            </div>

            {modules.map((module, mIndex) => (
              <div
                key={module.id}
                className="border rounded-xl p-4 space-y-4 bg-base-100/60"
              >
                {/* Module title + remove */}
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="w-full">
                    <label className="label text-xs font-medium">
                      Module Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered w-full ${
                        errors.modules?.[mIndex]?.title ? "input-error" : ""
                      }`}
                      placeholder={`Module ${mIndex + 1} title`}
                      {...register(`modules.${mIndex}.title`, {
                        required: mIndex === 0
                          ? "At least first module title is required"
                          : false,
                      })}
                    />
                    {errors.modules?.[mIndex]?.title && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.modules[mIndex].title.message}
                      </p>
                    )}
                  </div>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost md:self-end"
                      onClick={() => removeModule(module.id)}
                    >
                      Remove Module
                    </button>
                  )}
                </div>

                {/* Lessons section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Lessons (Module {mIndex + 1})
                    </h3>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline"
                      onClick={() => addLesson(module.id)}
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessonIds.map((lessonId, lIndex) => {
                    const lessonError =
                      errors.modules?.[mIndex]?.lessons?.[lIndex]?.title;

                    return (
                      <div
                        key={lessonId}
                        className="border rounded-lg p-3 space-y-2 bg-base-100"
                      >
                        <div className="flex flex-col md:flex-row gap-2">
                          {/* Lesson title */}
                          <div className="w-full">
                            <input
                              type="text"
                              className={`input input-bordered w-full ${
                                lessonError ? "input-error" : ""
                              }`}
                              placeholder={`Lesson ${lIndex + 1} title`}
                              {...register(
                                `modules.${mIndex}.lessons.${lIndex}.title`,
                                {
                                  required:
                                    mIndex === 0 && lIndex === 0
                                      ? "At least one lesson title is required"
                                      : false,
                                }
                              )}
                            />
                            {lessonError && (
                              <p className="text-xs text-red-500 mt-1">
                                {lessonError.message}
                              </p>
                            )}
                          </div>

                          {/* Lesson video URL */}
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Lesson video URL (optional)"
                            {...register(
                              `modules.${mIndex}.lessons.${lIndex}.videoUrl`
                            )}
                          />
                        </div>

                        {/* Free preview radio */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="label cursor-pointer justify-start gap-2">
                            <input
                              type="radio"
                              className="radio radio-primary"
                              value={lIndex}
                              {...register(
                                `modules.${mIndex}.freeLessonIndex`
                              )}
                            />
                            <span className="label-text text-xs">
                              Make this lesson free preview
                            </span>
                          </label>

                          {module.lessonIds.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-xs btn-ghost"
                              onClick={() =>
                                removeLesson(module.id, lessonId)
                              }
                            >
                              Remove Lesson
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Assignment section (per module) */}
                <div className="border rounded-lg p-3 space-y-2 bg-base-100">
                  <h3 className="font-semibold text-sm">
                    Assignment (Module {mIndex + 1})
                  </h3>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Assignment URL (Google Docs / Form link)"
                    {...register(`modules.${mIndex}.assignmentUrl`)}
                  />
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={2}
                    placeholder="Assignment description / instructions"
                    {...register(
                      `modules.${mIndex}.assignmentDescription`
                    )}
                  />
                </div>

                {/* Quiz section (per module) - MULTIPLE QUESTIONS */}
                <div className="border rounded-lg p-3 space-y-3 bg-base-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Quiz (Module {mIndex + 1})
                    </h3>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline"
                      onClick={() => addQuizQuestion(module.id)}
                    >
                      + Add Question
                    </button>
                  </div>

                  {module.quizQuestionIds.map((qId, qIndex) => (
                    <div
                      key={qId}
                      className="border rounded-lg p-3 space-y-3 bg-base-100/80"
                    >
                      {/* Question text + remove */}
                      <div className="flex items-start gap-2">
                        <span className="font-semibold mt-2 text-sm">
                          Q{qIndex + 1}.
                        </span>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          placeholder="Quiz question"
                          {...register(
                            `modules.${mIndex}.quiz.${qIndex}.question`
                          )}
                        />
                        {module.quizQuestionIds.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            onClick={() =>
                              removeQuizQuestion(module.id, qId)
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Options + correct option radio */}
                      <div className="grid md:grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              className="radio radio-primary"
                              value={optIndex}
                              {...register(
                                `modules.${mIndex}.quiz.${qIndex}.correctIndex`
                              )}
                            />
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              placeholder={`Option ${String.fromCharCode(
                                65 + optIndex
                              )}`}
                              {...register(
                                `modules.${mIndex}.quiz.${qIndex}.options.${optIndex}`
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            PUBLISH BUTTONS
           ========================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-base-content/70">
            You can save this course as draft or publish it immediately.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline"
              disabled={isSubmitting}
              onClick={handleSubmit(handleDraft, handleFormError)}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Course"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
