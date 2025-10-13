import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import StudentDashboardLayout from "../pages/studentDashboard/StudentDashboard";
import TeacherDashboardLayout from "../pages/teacherDashboard/TeacherDashboard";
import Profile from "../pages/studentDashboard/profile/Profile";
import StudentDashboard from "../pages/studentDashboard/dashboard/Dashboard";
import Courses from "../pages/studentDashboard/courses/Courses";
import CourseView from "../pages/courseView/CourseView";
import Messages from "../pages/studentDashboard/messages/Messages";
import TeacherDashboard from "../pages/teacherDashboard/dashboard/Dashboard";
import TeacherCourses from "../pages/teacherDashboard/courses/Courses";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import SignUp from "../pages/signUp/SignUp";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        element: <ProtectedRoute allowedRoles={["STUDENT"]} />,
        children: [
            {
                path: "/student",
                element: <StudentDashboardLayout />,
                children: [
                    {
                        index: true, element: <StudentDashboard />
                    },
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "courses",
                        element: <Courses />
                    },
                    {
                        path: "courses/:id",
                        element: <CourseView />
                    },
                    {
                        path: "messages",
                        element: <Messages />
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={["TEACHER"]} />,
        children: [
            {
                path: "/teacher",
                element: <TeacherDashboardLayout />,
                children: [
                    {
                        index: true, element: <TeacherDashboard />
                    },
                    {
                        path: "courses",
                        element: <TeacherCourses />
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={["MANAGEMENT"]} />,
        children: [
            {
                path: "/management",
                element: <AdminDashboard />
            }
        ]
    }
]);