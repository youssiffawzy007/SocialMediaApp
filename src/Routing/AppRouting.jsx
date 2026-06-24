import { createBrowserRouter } from "react-router-dom";
import UserLauout from "../layouts/UserLauout/UserLauout";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import ProtectedAuthRoutes from "./ProtectedAuthRoutes";
import Notifications from "../pages/Notifications/Notifications";
import Feed from "../pages/HomeChildren/Feed/Feed";
import MyPosts from "../pages/HomeChildren/MyPosts/MyPosts";
import Community from "../pages/HomeChildren/Community/Community";
import Saved from "../pages/HomeChildren/Saved/Saved";
import PostDetails from "../components/shared/PostDetails/PostDetails";

export const router = createBrowserRouter([
  {
    path: "",
    element: <UserLauout />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
        children: [
          { index: true, element: <Feed /> },
          { path: "MyPosts", element: <MyPosts /> },
          { path: "Community", element: <Community /> },
          { path: "Saved", element: <Saved /> },
        ],
      },
      {
        path: "profile/:id?",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoutes>
            <Notifications />
          </ProtectedRoutes>
        ),
      },
      {
        path: "post/:id",
        element: (
          <ProtectedRoutes>
            <PostDetails />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtectedAuthRoutes>
            <Login />
          </ProtectedAuthRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedAuthRoutes>
            <Register />
          </ProtectedAuthRoutes>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
