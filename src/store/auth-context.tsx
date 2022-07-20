import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { ChildrenProp } from "../interfaces/IPoodleModel";

interface IToken {
  token: string | null;
  username: string | null;
  expiration: string;
}

export interface IAuthContext {
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, username: string) => void;
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

  return {
    token: storedToken,
    username: storedUsername,
  };
};

// const calculateExpirationTime = (tokenExpiration: string) => {
//   const currentTime = -new Date().getTime();
//   const tokenExpirationTime = new Date(tokenExpiration).getTime();
//   const expirationTime = tokenExpirationTime - currentTime;
//   return expirationTime.toString();
// };

export const AuthContextProvider: React.FC<ChildrenProp> = ({ children }) => {
  let initialToken: IToken["token"] = "";
  let initialUsername: IToken["username"] = "";
  const tokenData = retrieveStoredUserInfo();
  const [isAdmin, setIsAdmin] = useState(false);

  if (tokenData) {
    initialToken = tokenData.token;
    initialUsername = tokenData.username;
  }

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

  const loginHandler = (token: string, storedUsername: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", storedUsername);
    setTimeout(logoutHandler, 1000 * 60 * 30);
  };

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
