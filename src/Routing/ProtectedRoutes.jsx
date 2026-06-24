import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  if (localStorage.getItem("myToken") && localStorage.getItem("userData")) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
}
