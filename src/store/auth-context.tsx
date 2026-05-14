import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import { ChildrenProp } from "../interfaces/IPoodleModel";
import api from "../api/client";

let logoutTimer: ReturnType<typeof setTimeout>;

export interface IAuthContext {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (role: string, expiration: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

const retrieveStoredUserInfo = () => {
  localStorage.removeItem("token");
  const storedExpiration = localStorage.getItem("expiration");
  const storedRole = localStorage.getItem("role");
  const remainingTime = storedExpiration
    ? Number(calculateExpirationTime(storedExpiration))
    : 0;

  if (!storedExpiration || remainingTime <= 0) {
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
    return null;
  }

  return {
    expiration: storedExpiration,
    role: storedRole,
  };
};

const calculateExpirationTime = (tokenExpiration: string) => {
  const currentTime = new Date().getTime();
  const tokenExpirationTime = new Date(tokenExpiration).getTime();
  const expirationTime = tokenExpirationTime - currentTime;
  return expirationTime.toString();
};

export const AuthContextProvider: React.FC<ChildrenProp> = ({ children }) => {
  const tokenData = retrieveStoredUserInfo();
  const [isLoggedIn, setIsLoggedIn] = useState(!!tokenData?.expiration);
  const [isAdmin, setIsAdmin] = useState(tokenData?.role === "Admin");

  const logoutHandler = useCallback(() => {
    api.get("/api/Authentication/logout").catch(() => undefined);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
  }, []);

  const loginHandler = (
    role: string,
    expirationTime: string
  ) => {
    setIsLoggedIn(true);
    setIsAdmin(role === "Admin");
    localStorage.setItem("expiration", expirationTime);
    localStorage.setItem("role", role);
    const remainingTime = calculateExpirationTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, parseInt(remainingTime));
  };

  useEffect(() => {
    if (tokenData?.expiration) {
      const remainingTime = Number(calculateExpirationTime(tokenData.expiration));
      logoutTimer = setTimeout(logoutHandler, remainingTime);
      return () => clearTimeout(logoutTimer);
    }

    return undefined;
  }, [tokenData?.expiration, logoutHandler]);

  const contextValue = {
    isAdmin: isAdmin,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
