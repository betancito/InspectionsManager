import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

interface props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<props> = ({ children }) => {
  //Check for authenticated status
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  //Check if authencicated, otherwise will take user to login view
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  //if Authenticated will take user to the requested children component view
  return children;
};

export default PrivateRoute;
