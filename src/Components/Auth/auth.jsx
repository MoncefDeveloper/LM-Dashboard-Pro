import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useGlobalContext } from "../../context/context";

const Auth = ({ roles }) => {
  const { admin } = useGlobalContext();
  const location = useLocation();

  return (
    <>
      {!admin ?
        false
        : roles.includes(admin.type) ?
          <Outlet /> :
          <Navigate to='/Error/unauthorized' state={{ from: location }} replace />}
    </>
  );
}

export default Auth;
