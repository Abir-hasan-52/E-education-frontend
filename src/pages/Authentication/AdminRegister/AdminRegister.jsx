import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";

const AdminRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const { createUser } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    //  Secret key check
    const adminSecretFromEnv = import.meta.env.VITE_ADMIN_SECRET_KEY;

    if (data.adminSecretKey !== adminSecretFromEnv) {
      setError("adminSecretKey", {
        type: "manual",
        message: "Invalid Admin Secret Key",
      });
      return;
    }

    try {
      // 2️⃣ Firebase / backend registration
      const result = await createUser(data.email, data.password);
      console.log(result.user);
      //  todo: ekhane pore role "admin" hisebe DB te save korbo
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${data.email}`,
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
      setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <h1 className="text-2xl font-semibold text-purple-600">
          Admin Registration
        </h1>
        <p className="text-gray-500 text-sm -mt-4">
          Only admins can create an account using a valid Admin Secret Key.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3 text-left">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "focus:ring-red-400"
                    : "focus:ring-purple-300"
                }`}
                placeholder="Enter full name"
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
                    message: "Please enter a valid email",
                  },
                })}
                className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-400" : "focus:ring-purple-300"
                }`}
                placeholder="Enter email"
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
                      : "focus:ring-purple-300"
                  }`}
                  placeholder="Create password"
                />
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
                      : "focus:ring-purple-300"
                  }`}
                  placeholder="Re-enter password"
                />
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

            {/* Admin Secret Key */}
            <div>
              <label className="text-sm font-medium text-purple-600">
                Admin Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  {...register("adminSecretKey", {
                    required: "Admin Secret Key is required",
                  })}
                  className={`w-full mt-1 p-3 rounded-xl bg-purple-100 pr-12 focus:outline-none border ${
                    errors.adminSecretKey
                      ? "border-red-400"
                      : "border-purple-300"
                  }`}
                  placeholder="Enter admin secret key"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600"
                >
                  {showSecret ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.adminSecretKey && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.adminSecretKey.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white mt-3 p-3 rounded-xl text-lg font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register as Admin"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-2">
          Admin access only • Secure verification
        </p>
        <h5 className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Login here
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default AdminRegister;
