import React from "react";
import { Link, NavLink, Outlet } from "react-router";

import { FaDonate } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Logo from "../pages/shared/Logo";
import useUserRole from "../hooks/useUserRole";

const DashboardLayOut = () => {
  const { role, isAdmin, RoleLoading, isStudent } = useUserRole();
  console.log("dashboard layout role:", role, isStudent);
  return (
    <div className="drawer lg:drawer-open ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden sticky top-0 z-50">
          <div className="flex-none  ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 lg:hidden flex-1 px-2">
            {" "}
            <Logo />
          </div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-purple-50 text-purple-900 min-h-full w-80 p-4 font-medium">
          {/* Logo */}
          <div className="mb-6">
            <Logo />
          </div>

          {/* Nav Items */}

          {/* admin */}

          {!RoleLoading && role === "admin" && isAdmin === true && (
            <>

              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-200 text-purple-700 font-semibold rounded"
                      : "hover:bg-purple-100 rounded"
                  }
                >
                  <FaDonate className="inline-block mr-2 text-lg" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/AddCourse"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-200 text-purple-700 font-semibold rounded"
                      : "hover:bg-purple-100 rounded"
                  }
                >
                  <FaDonate className="inline-block mr-2 text-lg" />
                  Add Course
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/AllCourse"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-200 text-purple-700 font-semibold rounded"
                      : "hover:bg-purple-100 rounded"
                  }
                >
                  <FaDonate className="inline-block mr-2 text-lg" />
                  All Course
                </NavLink>
              </li>
            </>
          )}
          {/* student */}
          {!RoleLoading && role==="student" && isStudent===true &&
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-200 text-purple-700 font-semibold rounded"
                      : "hover:bg-purple-100 rounded"
                  }
                >
                  <CgProfile className="inline-block mr-2 text-lg" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/MyCourses"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-200 text-purple-700 font-semibold rounded"
                      : "hover:bg-purple-100 rounded"
                  }
                >
                  <CgProfile className="inline-block mr-2 text-lg" />
                  My Course
                </NavLink>
              </li>
            </>
          }
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayOut;
