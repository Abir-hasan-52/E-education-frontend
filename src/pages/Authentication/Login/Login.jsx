import React from "react";
import { useForm } from "react-hook-form";
import { CgLogIn } from "react-icons/cg";
import { Link } from "react-router"; 
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const {signIn}=useAuth();

  const onSubmit = (data) => {
    console.log(data);
    //  todo: implement login logic here
    signIn(data.email, data.password)
    .then(result=>{
      console.log(result.user);
      console.log("User logged in successfully");
    })
    .catch(error=>{
      console.log(error.message);
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            <CgLogIn />
          </div>
        </div>

        <h1 className="text-2xl font-semibold">Sign in with email</h1>
        <p className="text-gray-500 text-sm -mt-2">
          Login to continue your learning journey on SkillSpace.
        </p>

        <div className="text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Register
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3 text-left">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-400" : "focus:ring-primary/40"
                }`}
                placeholder="you@example.com"
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
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-400"
                      : "focus:ring-primary/40"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Get Started"}
          </button>
        </form>

        <div className="text-gray-500 text-sm">
          Only admin?{" "}
          <Link to="/admin-register" className="text-primary font-medium">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
