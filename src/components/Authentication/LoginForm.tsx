import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { getApiErrorMessage } from "../../api/errorMessage";
import classes from "./LoginForm.module.css";
import AuthContext from "../../store/auth-context";
import { ILoginResponse } from "../../interfaces/IAuthModel";
import { Spinner } from "react-bootstrap";
import { passwordRequirementsMessage, validEmail, validPassword } from "./Regex";
import ErrorModal from "../UI/ErrorModal";
import { accountPath, homePath, SiteLanguage } from "../../i18n/siteLanguage";
import AuthSeo from "../SEO/AuthSeo";

const LoginForm = ({ language }: { language: SiteLanguage }) => {
  const sr = language === "sr";
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    title: "",
    popup: false,
  });
  const authContext = useContext(AuthContext);

  const switchLoginHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const loginFetch = async () => {
      setIsLoading(true);
      const enteredUsername = usernameInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;

      if (!enteredPassword) {
        setError({
          message: sr ? "Lozinka je obavezna." : "Password is required.",
          title: sr ? "Greška pri prijavi" : "Login error",
          popup: true,
        });
        setIsLoading(false);
        return;
      }

      await api
        .post<ILoginResponse>(
          "/api/Authentication/login",
          {
            username: enteredUsername,
            password: enteredPassword,
          }
        )
        .then((response) => {
          authContext.login(
            response.data.role,
            response.data.expiration,
            response.data.refreshExpiration
          );
          setIsLogin(true);
          setIsLoading(false);
          navigate(homePath(language));
          return response;
        })
        .catch((error) => {
          setError({
            message: sr ? "Prijava nije uspela. Proverite korisničko ime, lozinku i potvrdu e-pošte." : getApiErrorMessage(error, {
              fallback: "Login failed. Please try again.",
              statusMessages: {
                401: "Username or password is incorrect.",
                404: "User was not found. Create an account first.",
              },
            }),
            title: sr ? "Greška pri prijavi" : "Login error",
            popup: true,
          });
          setIsLoading(false);
        });
    };

    const registerFetch = async () => {
      setIsLoading(true);
      const enteredUsername = usernameInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;
      const enteredEmail = emailInputRef.current!.value;

      if (!validEmail.test(enteredEmail)) {
        setError({
          message: sr ? "Unesite ispravnu adresu e-pošte." : "Enter a valid email address.",
          title: sr ? "Greška pri registraciji" : "Registration error",
          popup: true,
        });
        setIsLoading(false);
        return;
      }

      if (!validPassword.test(enteredPassword)) {
        setError({
          message: sr ? "Lozinka mora imati najmanje 8 znakova, veliko i malo slovo, broj i poseban znak." : passwordRequirementsMessage,
          title: sr ? "Greška pri registraciji" : "Registration error",
          popup: true,
        });
        setIsLoading(false);
        return;
      }

      await api
        .post<string>(
          "/api/Authentication/register",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          }
        )
        .then((response) => {
          setIsLoading(false);
          setError({
            message: sr
              ? (response.data.includes("could not be sent")
                ? "Nalog je kreiran, ali poruka za potvrdu nije poslata. Zatražite novi link za potvrdu."
                : "Nalog je kreiran. Potvrdite adresu e-pošte pre prijave.")
              : response.data,
            title: sr ? "Nalog je kreiran" : "Account created",
            popup: true,
          });
          setIsLogin(true);
        })
        .catch((error) => {
          setIsLoading(false);
          setError({
            message: sr ? "Registracija nije uspela. Proverite podatke ili pokušajte sa drugim korisničkim imenom i adresom e-pošte." : getApiErrorMessage(error, {
              fallback: "Registration failed. Please check your details and try again.",
            }),
            title: sr ? "Greška pri registraciji" : "Registration error",
            popup: true,
          });
        });
    };

    if (isLogin) {
      loginFetch();
    } else {
      registerFetch();
    }
  };

  if (isLoading) {
    return (
      <main className={classes.page}>
        <div className={classes.loadingState}>
          <Spinner animation="border" variant="dark" />
        </div>
      </main>
    );
  }

  const errorHandler = () => {
    setError({
      message: "",
      title: "",
      popup: false,
    });
  };

  return (
    <>
      <AuthSeo language={language} page="login" />
      {error.popup && (
        <ErrorModal
          message={error.message}
          onConfirm={errorHandler}
          title={error.title}
          language={language}
        />
      )}
      <main className={classes.page}>
        <section className={classes.auth}>
          <form onSubmit={submitHandler} className={classes.form}>
            <h1>{isLogin ? (sr ? "Prijava" : "Login") : (sr ? "Registracija" : "Create account")}</h1>
            {!isLogin && (
              <div className={classes.control}>
                <label htmlFor="email">{sr ? "Adresa e-pošte" : "E-mail address"}</label>
                <input type="email" id="email" required ref={emailInputRef} />
              </div>
            )}
            <div className={classes.control}>
              <label htmlFor="username">{sr ? "Korisničko ime" : "Username"}</label>
              <input type="text" id="username" required ref={usernameInputRef} />
            </div>

            <div className={classes.control}>
              <label htmlFor="password">{sr ? "Lozinka" : "Password"}</label>
              <input
                type="password"
                id="password"
                required
                ref={passwordInputRef}
              />
            </div>
            <div className={classes.actions}>
              {!isLoading && (
                <button type="submit" className={classes.primaryAction}>
                  {isLogin ? (sr ? "Prijavi se" : "Login") : (sr ? "Napravi nalog" : "Create account")}
                </button>
              )}
              {isLoading && <div>{sr ? "Učitavanje..." : "Loading..."}</div>}
              <button
                type="button"
                onClick={switchLoginHandler}
                className={classes.secondaryAction}
              >
                {isLogin
                  ? (sr ? "Napravi novi nalog" : "Create a new account")
                  : (sr ? "Prijavi se postojećim nalogom" : "Login with existing account")}
              </button>
              {isLogin && (
                <Link to={accountPath(language, "forgot-password")} className={classes.helperLink}>
                  {sr ? "Zaboravili ste lozinku?" : "Forgot password?"}
                </Link>
              )}
              {isLogin && (
                <Link to={accountPath(language, "resend-confirmation")} className={classes.helperLink}>
                  {sr ? "Pošalji ponovo poruku za potvrdu" : "Resend confirmation email"}
                </Link>
              )}
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default LoginForm;
