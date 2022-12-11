import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";
import Profile from "./Views/Profile";
import EditProfile from "./Views/EditProfile";
import Scripts from "./components/Scripts";
import Login from "./Views/Login";
import SignUp from "./Views/SignUp";
import App from "./Views/App";
import Search from "./Views/SearchTest";
import ProfileVisit from "./Views/ProfileVisit";

import axios from "axios";

if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/profile/:id", element: <ProfileVisit /> },
  { path: "/profile", element: <Profile /> },
  { path: "/profile/edit", element: <EditProfile /> },
  { path: "/test", element: <Search /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Scripts />
    <RouterProvider router={router} />
  </React.StrictMode>
);
