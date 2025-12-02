import React from "react";
import { CgLogIn } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            <CgLogIn />
          </div>
        </div>

        <h1 className="text-2xl font-semibold">Sign in with email</h1>
        <p className="text-gray-500 text-sm -mt-4">
          Make a new doc to bring your words, data, and teams together. For free
        </p>
        <div className="text-gray-500 text-sm">
          {" "}
          Doesn't have an Account?{" "}
          <Link to="/register" className="text-red-400">
            Register
          </Link>{" "}
        </div>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
                placeholder="Password"
              />
              <span className="absolute right-4 top-4 text-gray-500">👁️‍🗨️</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-black text-white p-3 rounded-xl text-lg font-medium shadow-md">
          Get Started
        </button>

        <div className="text-gray-500 text-sm">
          {" "}
           Only Admin?{" "}
          <Link to="/admin-register" className="text-red-400">
            Admin Portal
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default Login;
