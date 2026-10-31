import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirm = async () => {
    if (!email || !token) {
      setError("Confirmation link is invalid. Request a new link.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await api.post<string>("/api/Authentication/confirm-email", {
        email,
        token,
      });
      setMessage(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, {
        fallback: "Confirmation failed. Request a new link.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <section className={classes.auth}>
        <div className={classes.form}>
          <h1>Confirm your email</h1>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          {!message && (
            <button type="button" className={classes.primaryAction} onClick={confirm} disabled={isLoading || !email || !token}>
              {isLoading ? "Confirming..." : "Confirm email"}
            </button>
          )}
          <Link to="/login" className={classes.helperLink}>Back to login</Link>
          <Link to="/resend-confirmation" className={classes.helperLink}>Request a new link</Link>
        </div>
      </section>
    </main>
  );
};

export default ConfirmEmail;
