import { Navigate } from "react-router-dom";

export default function ProtectedAuthRoutes({ children }) {
  if (localStorage.getItem("myToken")) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
}
