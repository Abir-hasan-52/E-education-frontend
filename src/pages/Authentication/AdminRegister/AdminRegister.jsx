import React from "react";

const AdminRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        <h1 className="text-2xl font-semibold text-purple-600">
          Admin Registration
        </h1>
        <p className="text-gray-500 text-sm -mt-4">
          Only admins can create an account using a valid Admin Secret Key.
        </p>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:outline-none"
              placeholder="Create password"
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

          <div>
            <label className="text-sm font-medium text-purple-600">
              Admin Secret Key
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-purple-100 focus:outline-none border border-purple-300"
              placeholder="Enter admin secret key"
            />
          </div>
        </div>

        <button className="w-full bg-purple-600 text-white p-3 rounded-xl text-lg font-medium shadow-md">
          Register as Admin
        </button>

        <p className="text-gray-500 text-sm mt-2">
          Admin access only • Secure verification
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
