import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import AdminRegister from "../pages/Authentication/AdminRegister/AdminRegister";
import DashboardLayOut from "../LayOuts/DashboardLayOut";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AddCourse from "../pages/Dashboard/AddCourse/AddCourse";
import MyCourses from "../pages/Dashboard/MyCourses/MyCourses";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "*",
        element: <div className="text-error">404 Not Found</div>,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/admin-register",
        Component: AdminRegister,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayOut></DashboardLayOut>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "AddCourse",
        element:<AddCourse></AddCourse>,
      },
      {
        path: "MyCourses",
        element:<MyCourses></MyCourses>,
      }
    ],
  },
]);
