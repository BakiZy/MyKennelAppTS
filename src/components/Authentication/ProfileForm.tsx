import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import api from "../../api/client";
import classes from "./ProfileForm.module.css";
import ErrorModal from "../UI/ErrorModal";
import { homePath, SiteLanguage } from "../../i18n/siteLanguage";
import AuthSeo from "../SEO/AuthSeo";

const ProfileForm = ({ language }: { language: SiteLanguage }) => {
  const sr = language === "sr";
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    message: "",
    title: "",
    popup: false,
  });
  const [message, setMessage] = useState("");

  const logoutHandler = async () => {
    try {
      await authContext.logout();
      navigate(homePath(language));
    } catch {
      setError({ message: sr ? "Odjava nije uspela. Pokušajte ponovo." : "Logout failed. Please try again.", title: sr ? "Greška pri odjavi" : "Logout error", popup: true });
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (form.newPassword.length < 7 || form.newPassword !== form.confirmPassword) {
      setError({
        message: sr ? "Lozinka mora imati najmanje 7 znakova i oba unosa moraju biti ista." : "Password must be at least 7 characters and both values must match.",
        title: sr ? "Greška sa lozinkom" : "Password error",
        popup: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/api/Authentication/change-password", form);
      setMessage(sr ? "Lozinka je promenjena." : "Password changed.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      console.log(requestError);
      setError({
        message: sr ? "Lozinka nije promenjena. Proverite trenutnu lozinku i pokušajte ponovo." : "Could not change password. Check the current password and try again.",
        title: sr ? "Greška sa lozinkom" : "Password error",
        popup: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const errorHandler = () => {
    setError({
      message: "",
      title: "",
      popup: false,
    });
  };

  return (
    <>
      <AuthSeo language={language} page="profile" />
      {error.popup && (
        <ErrorModal
          message={error.message}
          title={error.title}
          onConfirm={errorHandler}
          language={language}
        />
      )}
      <main className={classes.page}>
        <section className={classes.panel}>
          <div className={classes.header}>
            <p>{sr ? "Nalog" : "Account"}</p>
            <h1>{sr ? "Profil" : "Profile"}</h1>
          </div>
          {message && <p className={classes.message}>{message}</p>}
          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.field}>
              <label htmlFor="currentPassword">{sr ? "Trenutna lozinka" : "Current password"}</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                minLength={7}
                value={form.currentPassword}
                onChange={changeHandler}
              />
            </div>
            <div className={classes.field}>
              <label htmlFor="newPassword">{sr ? "Nova lozinka" : "New password"}</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                minLength={7}
                value={form.newPassword}
                onChange={changeHandler}
              />
            </div>
            <div className={classes.field}>
              <label htmlFor="confirmPassword">{sr ? "Potvrdite lozinku" : "Confirm password"}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={7}
                value={form.confirmPassword}
                onChange={changeHandler}
              />
            </div>
            <div className={classes.actions}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? (sr ? "Čuvanje..." : "Saving...") : (sr ? "Promeni lozinku" : "Change password")}
              </button>
              <button type="button" onClick={logoutHandler} className={classes.secondary}>
                {sr ? "Odjava" : "Logout"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default ProfileForm;
