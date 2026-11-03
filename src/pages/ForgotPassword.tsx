import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";
import { accountPath, languageForPath } from "../i18n/siteLanguage";
import AuthSeo from "../components/SEO/AuthSeo";

const getErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, {
    fallback: "Password reset request failed. Please try again.",
    statusMessages: {
      429: "Too many password reset requests. Try again later.",
    },
  });
};

const ForgotPassword: React.FC = () => {
  const language = languageForPath(useLocation().pathname);
  const sr = language === "sr";
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
      setMessage(sr ? "Ako nalog postoji, poslali smo link za promenu lozinke na vašu adresu e-pošte." : response.data);
    } catch (requestError) {
      setError(sr ? "Zahtev nije uspeo. Pokušajte ponovo kasnije." : getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <AuthSeo language={language} page="forgot-password" />
      <section className={classes.auth}>
        <form onSubmit={submitHandler} className={classes.form}>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          <div className={classes.control}>
            <label htmlFor="email">{sr ? "Adresa e-pošte" : "E-mail address"}</label>
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
              {isLoading ? (sr ? "Slanje..." : "Sending...") : (sr ? "Pošalji link za promenu lozinke" : "Send reset link")}
            </button>
            <Link to={accountPath(language, "login")} className={classes.helperLink}>
              {sr ? "Nazad na prijavu" : "Back to login"}
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ForgotPassword;
