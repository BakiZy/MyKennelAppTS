import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";

const ResendConfirmation: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await api.post<string>("/api/Authentication/resend-confirmation", { email });
      setMessage(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, {
        fallback: "Could not request a confirmation link. Try again later.",
        statusMessages: { 429: "Too many requests. Try again later." },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <section className={classes.auth}>
        <form onSubmit={submit} className={classes.form}>
          <h1>Resend confirmation email</h1>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          <div className={classes.control}>
            <label htmlFor="email">E-mail address</label>
            <input id="email" type="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className={classes.actions}>
            <button type="submit" className={classes.primaryAction} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send confirmation link"}
            </button>
            <Link to="/login" className={classes.helperLink}>Back to login</Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ResendConfirmation;
