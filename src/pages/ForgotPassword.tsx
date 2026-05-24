import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api/client";
import classes from "../components/Authentication/LoginForm.module.css";

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<string>;

  if (typeof axiosError.response?.data === "string") {
    return axiosError.response.data;
  }

  if (axiosError.response?.status === 429) {
    return "Too many password reset requests. Try again later.";
  }

  return "Password reset request failed. Please try again.";
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post<string>("/api/Authentication/forgot-password", {
        email,
      });
      setMessage(response.data);
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
            <label htmlFor="email">E-mail address</label>
            <input
              id="email"
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={classes.actions}>
            <button
              type="submit"
              className={classes.primaryAction}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
