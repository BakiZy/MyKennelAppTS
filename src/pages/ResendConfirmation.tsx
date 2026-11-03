import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";
import { accountPath, languageForPath } from "../i18n/siteLanguage";
import AuthSeo from "../components/SEO/AuthSeo";

const ResendConfirmation: React.FC = () => {
  const language = languageForPath(useLocation().pathname);
  const sr = language === "sr";
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
      setMessage(sr ? "Ako nalog postoji, poslali smo novi link za potvrdu e-pošte." : response.data);
    } catch (requestError) {
      setError(sr ? "Zahtev nije uspeo. Pokušajte ponovo kasnije." : getApiErrorMessage(requestError, {
        fallback: "Could not request a confirmation link. Try again later.",
        statusMessages: { 429: "Too many requests. Try again later." },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <AuthSeo language={language} page="resend-confirmation" />
      <section className={classes.auth}>
        <form onSubmit={submit} className={classes.form}>
          <h1>{sr ? "Ponovo pošalji link za potvrdu" : "Resend confirmation email"}</h1>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          <div className={classes.control}>
            <label htmlFor="email">{sr ? "Adresa e-pošte" : "E-mail address"}</label>
            <input id="email" type="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className={classes.actions}>
            <button type="submit" className={classes.primaryAction} disabled={isLoading}>
              {isLoading ? (sr ? "Slanje..." : "Sending...") : (sr ? "Pošalji link za potvrdu" : "Send confirmation link")}
            </button>
            <Link to={accountPath(language, "login")} className={classes.helperLink}>{sr ? "Nazad na prijavu" : "Back to login"}</Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ResendConfirmation;
