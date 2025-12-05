import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

import useAxiosPublic from "../../../hooks/useAxiosPublic";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const axiosPublic = useAxiosPublic();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);
    // console.log(createUser);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);

        axiosPublic
          .post("/api/auth/register", {
            name: data.fullName,
            email: data.email,
            role: "student",
            password: data.password,
          })
          .then((res) => {
            console.log(res.data);
          });
        // fullname update
        updateUserProfile({
          displayName: data.fullName,
        })
          .then(() => {
            console.log("User profile updated");
          })
          .catch((error) => {
            console.log(error);
          });
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${data.email}`,
        });
        navigate(from, { replace: true });

        // axiosPublic.post("/", {
        //   name: data.fullName,
        //   email: data.email,
        //   role: "student",
        // });
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-gray-500 text-sm -mt-4">
          Create your SkillSpace account to start learning.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3 text-left">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "focus:ring-red-400"
                    : "focus:ring-primary/40"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-400" : "focus:ring-primary/40"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full mt-1 p-3 rounded-xl bg-gray-100 pr-12 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-400"
                      : "focus:ring-primary/40"
                  }`}
                  placeholder="Create a password"
                />

                {/* Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`w-full mt-1 p-3 rounded-xl bg-gray-100 pr-12 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-400"
                      : "focus:ring-primary/40"
                  }`}
                  placeholder="Re-enter password"
                />

                {/* Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium btn-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
