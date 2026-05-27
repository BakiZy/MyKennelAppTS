import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://api.poodlesvonapalusso.com";
const csrfHeaderName = "X-CSRF-TOKEN";
const unsafeMethods = new Set(["post", "put", "patch", "delete"]);
let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

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
  (response) => response,
  (error) => {
    if (error.response?.status === 400 || error.response?.status === 419) {
      csrfToken = null;
    }

    return Promise.reject(error);
  }
);

export default api;
