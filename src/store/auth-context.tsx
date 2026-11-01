import React, { useCallback, useEffect, useState } from "react";
import { ChildrenProp } from "../interfaces/IPoodleModel";
import { logoutSession, onSessionChange, refreshSession, SessionResponse } from "../api/client";

export interface IAuthContext {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isReady: boolean;
  login: (role: string, expiration: string, refreshExpiration: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  isAdmin: false,
  isReady: false,
  login: () => {},
  logout: async () => {},
});

export const AuthContextProvider: React.FC<ChildrenProp> = ({ children }) => {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Remove the old UI-only session values. Authentication now comes from server cookies.
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
    let active = true;
    const unsubscribe = onSessionChange((updatedSession) => {
      if (active) setSession(updatedSession);
    });
    refreshSession()
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    let timer: ReturnType<typeof setTimeout>;
    const renew = () => {
      refreshSession().catch((error) => {
        if (error.response?.status !== 401) {
          timer = setTimeout(renew, 60_000);
        }
      });
    };
    const refreshRemaining = new Date(session.refreshExpiration).getTime() - Date.now();
    const accessRemaining = new Date(session.expiration).getTime() - Date.now();
    if (refreshRemaining <= 0) {
      setSession(null);
      return undefined;
    }
    if (refreshRemaining <= 60_000 && accessRemaining >= refreshRemaining - 1_000) {
      timer = setTimeout(() => setSession(null), refreshRemaining);
    } else {
      timer = setTimeout(renew, Math.max(1_000, accessRemaining - 60_000));
    }
    return () => clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    if (!session) return undefined;
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible"
        && new Date(session.expiration).getTime() - Date.now() < 60_000) {
        refreshSession().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [session]);

  const loginHandler = useCallback((role: string, expiration: string, refreshExpiration: string) => {
    setSession({ role, expiration, refreshExpiration });
    setIsReady(true);
  }, []);

  const logoutHandler = useCallback(async () => {
    await logoutSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!session,
      isAdmin: session?.role === "Admin",
      isReady,
      login: loginHandler,
      logout: logoutHandler,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
