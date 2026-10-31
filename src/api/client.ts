import axios, { AxiosRequestConfig } from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://api.poodlesvonapalusso.com";
const csrfHeaderName = "X-CSRF-TOKEN";
const unsafeMethods = new Set(["post", "put", "patch", "delete"]);
let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

type CsrfRetryConfig = AxiosRequestConfig & { csrfRetried?: boolean };

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

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
    if (path?.endsWith("/api/authentication/login") || path?.endsWith("/api/authentication/logout")) {
      // Antiforgery tokens are tied to the identity in the auth cookie.
      csrfToken = null;
    }
    return response;
  },
  (error) => {
    const rejectedCsrfToken = error.response?.status === 400
      && error.response?.data === "Invalid CSRF token.";
    if (rejectedCsrfToken) {
      csrfToken = null;
      const config = error.config as CsrfRetryConfig | undefined;
      if (config && !config.csrfRetried) {
        config.csrfRetried = true;
        return api.request(config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
