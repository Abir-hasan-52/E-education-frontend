import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-purple-600 font-bold" : "text-gray-600"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-purple-600 font-bold" : "text-gray-600"
          }
        >
          about
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "text-purple-600 font-bold" : "text-gray-600"
          }
        >
          contact us
        </NavLink>
      </li>
      {user &&
       <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "text-purple-600 font-bold" : "text-gray-600"
          }
        >
          contact us
        </NavLink>
      </li>
       }
    </>
  );

  const handleLogout = () => {
    logOut()
      .then(() => {
        setOpenDropdown(false);
        Swal.fire({
          icon: "success",
          title: "Signed Out",
          text: "Hope to see you again!",
          timer: 1800,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
        navigate("/");
      })
      .catch((error) => console.log(error));

  };

  return (
    <div className="navbar bg-gray-100 shadow-sm  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center w-full ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <div className="btn btn-ghost text-xl">
            <Logo />
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="cursor-pointer"
              >
                <img
                  src={"https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-500 hover:ring-2 hover:ring-purple-300 transition"
                />
              </div>

              {/* Dropdown menu */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-purple-200 rounded-xl shadow-lg z-50">
                  <div className="px-4 py-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-t-xl">
                    <h4 className="font-semibold text-gray-800">
                      {user.displayName || "User"}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                        onClick={() => setOpenDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="mr-4 font-medium text-gray-700 hover:text-purple-600"
            >
              <button>login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
