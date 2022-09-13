import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import { ChildrenProp } from "../interfaces/IPoodleModel";

let logoutTimer: NodeJS.Timeout;

interface IToken {
  token: string | null;
  expiration: string | null;
  role: string | null;
}

export interface IAuthContext {
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, role: string, expiration: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthContext>({
  token: "",
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

const retrieveStoredUserInfo = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpiration = localStorage.getItem("expiration");
  const storedRole = localStorage.getItem("role");

  return {
    token: storedToken,
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
  let initialToken: IToken["token"] = "";
  let initialExpiration: IToken["expiration"] = "";
  let initialRole: IToken["role"] = "";

  const tokenData = retrieveStoredUserInfo();
  const [isAdmin, setIsAdmin] = useState(false);

  if (tokenData) {
    initialToken = tokenData.token;
    initialExpiration = tokenData.expiration;
    initialRole = tokenData.role;
  }
  initialExpiration?.toString();
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
  }, []);

  const loginHandler = (
    token: string,
    role: string,
    expirationTime: string
  ) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationTime);
    localStorage.setItem("role", role);
    const remainingTime = calculateExpirationTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, parseInt(remainingTime));
  };

  useEffect(() => {
    if (initialRole === "Admin") {
      setIsAdmin(true);
    }
  }, [initialRole]);

  useEffect(() => {
    if (tokenData != null) {
      logoutTimer = setTimeout(logoutHandler, Number(tokenData.expiration));
      clearTimeout(logoutTimer);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isAdmin: isAdmin,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
