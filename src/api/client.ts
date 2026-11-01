import axios, { AxiosRequestConfig } from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://api.poodlesvonapalusso.com";
const csrfHeaderName = "X-CSRF-TOKEN";
const unsafeMethods = new Set(["post", "put", "patch", "delete"]);
let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

export type SessionResponse = { role: string; expiration: string; refreshExpiration: string };
type RetryConfig = AxiosRequestConfig & { csrfRetried?: boolean; sessionRetried?: boolean };
let refreshPromise: Promise<SessionResponse> | null = null;
let sessionListener: ((session: SessionResponse | null) => void) | null = null;
let logoutPromise: Promise<void> | null = null;
let logoutInProgress = false;

export const onSessionChange = (listener: (session: SessionResponse | null) => void) => {
  sessionListener = listener;
  return () => {
    if (sessionListener === listener) sessionListener = null;
  };
};

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const refreshSession = (): Promise<SessionResponse> => {
  if (logoutInProgress) return Promise.reject(new Error("Logout in progress"));
  if (!refreshPromise) {
    refreshPromise = api.post<SessionResponse>("/api/Authentication/refresh")
      .then((response) => {
        sessionListener?.(response.data);
        return response.data;
      })
      .catch((error) => {
        if (error.response?.status === 401) sessionListener?.(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const logoutSession = (): Promise<void> => {
  if (!logoutPromise) {
    logoutInProgress = true;
    logoutPromise = (async () => {
      // A pending refresh response must not restore the access cookie after logout.
      await refreshPromise?.catch(() => undefined);
      await api.post("/api/Authentication/logout");
      sessionListener?.(null);
    })().finally(() => {
      logoutInProgress = false;
      logoutPromise = null;
    });
  }
  return logoutPromise;
};

const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfTokenRequest) {
    csrfTokenRequest = axios
      .get<{ token: string }>("/api/antiforgery/token", {
        baseURL: apiBaseUrl,
        withCredentials: true,
      })
      .then((response) => {
        csrfToken = response.data.token;
        return csrfToken;
      })
      .finally(() => {
        csrfTokenRequest = null;
      });
  }

  return csrfTokenRequest;
};

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  if (method && unsafeMethods.has(method)) {
    const token = await getCsrfToken();
    config.headers = {
      ...(config.headers ?? {}),
      [csrfHeaderName]: token,
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const path = response.config.url?.toLowerCase();
    if (path?.endsWith("/api/authentication/login") || path?.endsWith("/api/authentication/logout")
      || path?.endsWith("/api/authentication/refresh")) {
      // Antiforgery tokens are tied to the identity in the auth cookie.
      csrfToken = null;
    }
    return response;
  },
  async (error) => {
    const rejectedCsrfToken = error.response?.status === 400
      && error.response?.data === "Invalid CSRF token.";
    if (rejectedCsrfToken) {
      csrfToken = null;
      const config = error.config as RetryConfig | undefined;
      if (config && !config.csrfRetried) {
        config.csrfRetried = true;
        return api.request(config);
      }
    }

    const config = error.config as RetryConfig | undefined;
    const path = config?.url?.toLowerCase() ?? "";
    if (error.response?.status === 401 && config && !config.sessionRetried
      && !path.startsWith("/api/authentication/")) {
      config.sessionRetried = true;
      try {
        await refreshSession();
        return api.request(config);
      } catch {
        // Return the original protected-request failure after refresh fails.
      }
    }

    return Promise.reject(error);
  }
);

export default api;
