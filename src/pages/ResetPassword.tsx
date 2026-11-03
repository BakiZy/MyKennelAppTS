import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "../components/Authentication/LoginForm.module.css";
import { accountPath, languageForPath } from "../i18n/siteLanguage";
import AuthSeo from "../components/SEO/AuthSeo";

const getErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, {
    fallback: "Password reset failed. Please request a new reset link.",
  });
};

const ResetPassword: React.FC = () => {
  const language = languageForPath(useLocation().pathname);
  const sr = language === "sr";
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
      setError(sr ? "Link za promenu lozinke nije važeći ili je istekao." : "Password reset link is invalid or expired.");
      return;
    }

    if (newPassword.length < 7 || newPassword !== confirmPassword) {
      setError(sr ? "Lozinke moraju biti iste i imati najmanje 7 znakova." : "Passwords must match and must contain at least 7 characters.");
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
      setMessage(sr ? "Lozinka je promenjena. Sada možete da se prijavite." : response.data);
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(sr ? "Promena lozinke nije uspela. Zatražite novi link." : getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <AuthSeo language={language} page="reset-password" />
      <section className={classes.auth}>
        <form onSubmit={submitHandler} className={classes.form}>
          {message && <p className={classes.statusMessage}>{message}</p>}
          {error && <p className={classes.errorMessage}>{error}</p>}
          <div className={classes.control}>
            <label htmlFor="newPassword">{sr ? "Nova lozinka" : "New password"}</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              required
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="confirmPassword">{sr ? "Potvrdite lozinku" : "Confirm password"}</label>
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
              {isLoading ? (sr ? "Čuvanje..." : "Saving...") : (sr ? "Promeni lozinku" : "Reset password")}
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

export default ResetPassword;
