import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api/client";
import classes from "./LoginForm.module.css";
import AuthContext from "../../store/auth-context";
import { ILoginResponse } from "../../interfaces/IAuthModel";
import { Spinner } from "react-bootstrap";
import { passwordRequirementsMessage, validEmail, validPassword } from "./Regex";
import ErrorModal from "../UI/ErrorModal";

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<string | Record<string, string[]>>;
  const responseData = axiosError.response?.data;

  if (typeof responseData === "string" && responseData.trim().length > 0) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const modelErrors = Object.values(responseData).flat();
    if (modelErrors.length > 0) {
      return modelErrors.join(" ");
    }
  }

  if (axiosError.response?.status === 404) {
    return "User was not found. Create an account first.";
  }

  if (axiosError.response?.status === 401) {
    return "Username or password is incorrect.";
  }

  return fallback;
};

const LoginForm = () => {
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
          message: "Password is required.",
          title: "Login error",
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
            response.data.expiration
          );
          setIsLogin(true);
          setIsLoading(false);
          navigate("/");
          return response;
        })
        .catch((error) => {
          setError({
            message: getErrorMessage(error, "Login failed. Please try again."),
            title: "Login error",
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
          message: "Enter a valid email address.",
          title: "Registration error",
          popup: true,
        });
        setIsLoading(false);
        return;
      }

      if (!validPassword.test(enteredPassword)) {
        setError({
          message: passwordRequirementsMessage,
          title: "Registration error",
          popup: true,
        });
        setIsLoading(false);
        return;
      }

      await api
        .post<AxiosResponse>(
          "/api/Authentication/register",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          }
        )
        .then(() => {
          setIsLoading(false);
          setError({
            message:
              "Registration successful. You can now log in with your account.",
            title: "Account created",
            popup: true,
          });
          setIsLogin(true);
        })
        .catch((error) => {
          setIsLoading(false);
          setError({
            message: getErrorMessage(
              error,
              "Registration failed. Please check your details and try again."
            ),
            title: "Registration error",
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
      {error.popup && (
        <ErrorModal
          message={error.message}
          onConfirm={errorHandler}
          title={error.title}
        />
      )}
      <main className={classes.page}>
        <section className={classes.auth}>
          <form onSubmit={submitHandler} className={classes.form}>
            {!isLogin && (
              <div className={classes.control}>
                <label htmlFor="email">E-mail address</label>
                <input type="email" id="email" required ref={emailInputRef} />
              </div>
            )}
            <div className={classes.control}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" required ref={usernameInputRef} />
            </div>

            <div className={classes.control}>
              <label htmlFor="password">Password</label>
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
                  {isLogin ? "Login" : "Create account"}
                </button>
              )}
              {isLoading && <div>Loading...</div>}
              <button
                type="button"
                onClick={switchLoginHandler}
                className={classes.secondaryAction}
              >
                {isLogin
                  ? "Create a new account"
                  : "Login with existing account"}
              </button>
              {isLogin && (
                <Link to="/forgot-password" className={classes.helperLink}>
                  Forgot password?
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
