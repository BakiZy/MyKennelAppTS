import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import { ChildrenProp } from "../interfaces/IPoodleModel";

let logoutTimer: NodeJS.Timeout;

interface IToken {
  token: string | null;
  username: string | null;
  expiration: string | null;
}

export interface IAuthContext {
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, username: string, expiration: string) => void;
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
  const storedUsername = localStorage.getItem("username");
  const storedExpiration = localStorage.getItem("expiration");

  return {
    token: storedToken,
    username: storedUsername,
    expiration: storedExpiration,
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
  let initialUsername: IToken["username"] = "";
  let initialExpiration: IToken["expiration"] = "";

  const tokenData = retrieveStoredUserInfo();
  const [isAdmin, setIsAdmin] = useState(false);

  if (tokenData) {
    initialToken = tokenData.token;
    initialUsername = tokenData.username;
    initialExpiration = tokenData.expiration;
  }
  console.log(initialExpiration);
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  useEffect(() => {
    if (initialUsername === "AdminZ") {
      setIsAdmin(true);
    }
  }, [initialUsername]);

  const logoutHandler = useCallback(() => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }, []);

  const loginHandler = (
    token: string,
    storedUsername: string,
    expirationTime: string
  ) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", storedUsername);
    localStorage.setItem("expiration", expirationTime);

    const remainingTime = calculateExpirationTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, parseInt(remainingTime));
  };

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
