import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";
import { accountPath, languageForPath } from "../i18n/siteLanguage";
import AuthSeo from "../components/SEO/AuthSeo";

const ConfirmEmail: React.FC = () => {
  const language = languageForPath(useLocation().pathname);
  const sr = language === "sr";
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirm = async () => {
    if (!email || !token) {
      setError(sr ? "Link za potvrdu nije važeći. Zatražite novi link." : "Confirmation link is invalid. Request a new link.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await api.post<string>("/api/Authentication/confirm-email", {
        email,
        token,
      });
      setMessage(sr ? "Adresa e-pošte je potvrđena. Sada možete da se prijavite." : response.data);
    } catch (requestError) {
      setError(sr ? "Potvrda nije uspela. Zatražite novi link." : getApiErrorMessage(requestError, {
        fallback: "Confirmation failed. Request a new link.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <AuthSeo language={language} page="confirm-email" />
      <section className={classes.auth}>
        <div className={classes.form}>
          <h1>{sr ? "Potvrdite adresu e-pošte" : "Confirm your email"}</h1>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          {!message && (
            <button type="button" className={classes.primaryAction} onClick={confirm} disabled={isLoading || !email || !token}>
              {isLoading ? (sr ? "Potvrđivanje..." : "Confirming...") : (sr ? "Potvrdi e-poštu" : "Confirm email")}
            </button>
          )}
          <Link to={accountPath(language, "login")} className={classes.helperLink}>{sr ? "Nazad na prijavu" : "Back to login"}</Link>
          <Link to={accountPath(language, "resend-confirmation")} className={classes.helperLink}>{sr ? "Zatraži novi link" : "Request a new link"}</Link>
        </div>
      </section>
    </main>
  );
};

export default ConfirmEmail;
