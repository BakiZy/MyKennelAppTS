import { AxiosError } from "axios";

type ErrorMessageOptions = {
  fallback: string;
  statusMessages?: Record<number, string>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeKnownMessage = (message: string) => {
  if (message.includes("Email already exists") || message.includes("already taken")) {
    return "An account with this email address already exists.";
  }

  if (message.includes("User already exists")) {
    return "This username is already taken.";
  }

  return message;
};

const extractMessages = (data: unknown): string[] => {
  if (typeof data === "string" && data.trim().length > 0) {
    return [data.trim()];
  }

  if (!isRecord(data)) {
    return [];
  }

  if (isRecord(data.errors)) {
    return Object.values(data.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .map((value) => value.trim());
  }

  return Object.entries(data)
    .filter(([key]) => !["status", "traceId", "type"].includes(key))
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
};

export const getApiErrorMessage = (error: unknown, options: ErrorMessageOptions) => {
  const axiosError = error as AxiosError<unknown>;
  const status = axiosError.response?.status;
  const extractedMessages = extractMessages(axiosError.response?.data);

  if (extractedMessages.length > 0) {
    return normalizeKnownMessage(extractedMessages.join(" "));
  }

  if (status && options.statusMessages?.[status]) {
    return options.statusMessages[status];
  }

  if (status && status >= 500) {
    return "The server could not process the request. Please try again later.";
  }

  if (axiosError.request && !axiosError.response) {
    return "The request could not complete because the server did not return a usable response. Please try again.";
  }

  return options.fallback;
};
