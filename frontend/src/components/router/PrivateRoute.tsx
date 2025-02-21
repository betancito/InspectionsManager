import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  //Check if authencicated, otherwise will take user to login view
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  //if Authenticated will take user to the requested children component view
  return children;
};

export default PrivateRoute;
