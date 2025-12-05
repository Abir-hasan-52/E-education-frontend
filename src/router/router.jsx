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
import Courses from "../pages/Home/Courses/Courses";
import CourseDetails from "../pages/Home/Courses/CourseDetails";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import MyEnrolledCourses from "../pages/Dashboard/MyEnrolledCourses/MyEnrolledCourses";
import CourseLearn from "../pages/Dashboard/MyEnrolledCourses/CourseLearn";
import AdminBatchEnrollments from "../pages/Dashboard/AdminBatchEnrollments/AdminBatchEnrollments";
import AdminAssignmentReview from "../pages/Dashboard/AdminAssignmentReview/AdminAssignmentReview";
import AdminAllCourses from "../pages/Dashboard/AdminAllCourses/AdminAllCourses";
import AdminCourseEnrollments from "../pages/Dashboard/AdminCourseEnrollments/AdminCourseEnrollments";
import EditCourse from "../pages/Dashboard/EditCourse/EditCourse";

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
        path: "/forbidden",
        element: <Forbidden></Forbidden>,
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
      {
        path: "/courses",
        Component: Courses,
      },
      {
        path: "/courses/:id",
        element: <CourseDetails></CourseDetails>,
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
        element: (
          <AdminRoute>
            <AddCourse></AddCourse>
          </AdminRoute>
        ),
      },
      {
        path: "AllCourse",
        element: (
          <AdminRoute>
            <AdminAllCourses></AdminAllCourses>
          </AdminRoute>
        ),
      },
      // {
      //   path: "batch-enrollments",
      //   element: (
      //     <AdminRoute>
      //       <AdminBatchEnrollments />
      //     </AdminRoute>
      //   ),
      // },
      {
        path:"edit-course/:id",
        element: <EditCourse></EditCourse>
      },
       {
      path: "enrollments",
      element: (
        <AdminRoute>
          <AdminCourseEnrollments />
        </AdminRoute>
      ),
    },
      {
        path: "assignments-review",
        element: (
          <AdminRoute>
            <AdminAssignmentReview />
          </AdminRoute>
        ),
      }
      ,
      {
        path: "MyCourses",
        element: <MyEnrolledCourses></MyEnrolledCourses>,
      },
      {
        path: "MyCourses/:courseId/learn",
        element: <CourseLearn></CourseLearn>,
      },
    ],
  },
]);
