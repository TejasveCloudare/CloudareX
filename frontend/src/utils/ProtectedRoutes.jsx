import { Outlet, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";

const ProtectedRoutes = () => {
  const { user } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user && user.email ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
