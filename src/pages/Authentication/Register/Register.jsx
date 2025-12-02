import React from "react";
import { Link } from "react-router";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-gray-500 text-sm -mt-4">
          Sign up to start creating documents and collaborating.
        </p>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Re-enter password"
            />
          </div>
        </div>

        <button className="w-full bg-black text-white p-3 rounded-xl text-lg font-medium shadow-md">
          Sign Up
        </button>

        <div className="text-gray-500 text-sm">
          Have an account?{" "}
          <Link to="/login" className="text-red-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
