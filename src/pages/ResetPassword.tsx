import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api/client";
import classes from "../components/Authentication/LoginForm.module.css";

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<string>;

  if (typeof axiosError.response?.data === "string") {
    return axiosError.response.data;
  }

  return "Password reset failed. Please request a new reset link.";
};

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email || !token) {
      setError("Password reset link is invalid or expired.");
      return;
    }

    if (newPassword.length < 7 || newPassword !== confirmPassword) {
      setError("Passwords must match and must contain at least 7 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<string>("/api/Authentication/reset-password", {
        email,
        token,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data);
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <section className={classes.auth}>
        <form onSubmit={submitHandler} className={classes.form}>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          <div className={classes.control}>
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              required
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              required
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <div className={classes.actions}>
            <button
              type="submit"
              className={classes.primaryAction}
              disabled={isLoading || !email || !token}
            >
              {isLoading ? "Saving..." : "Reset password"}
            </button>
            <Link to="/login" className={classes.helperLink}>
              Back to login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
