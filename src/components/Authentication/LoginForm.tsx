import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import classes from "./LoginForm.module.css";
import AuthContext from "../../store/auth-context";
import { ILoginResponse } from "../../interfaces/IAuthModel";
import { Button, Spinner } from "react-bootstrap";
import { validEmail, validPassword } from "./Regex";

const LoginForm = () => {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

      if (!validPassword.test(enteredPassword)) {
        alert("entered values must be valid");
        setIsLoading(false);
        return;
      }

      await axios
        .post<ILoginResponse>(
          "https://poodlesvonapalusso.dog/api/Authentication/login",
          {
            username: enteredUsername,
            password: enteredPassword,
          }
        )
        .then((response) => {
          authContext.login(
            response.data.token,
            response.data.username,
            response.data.expiration
          );
          if (response.data.username === "AdminZ") {
            authContext.isAdmin = true;
          }
          setIsLogin(true);
          setIsLoading(false);
          navigate("/");
          return response;
        })
        .catch((error) => {
          alert(error.message);
          setIsLoading(false);
        });
    };

    const registerFetch = async () => {
      setIsLoading(true);
      const enteredUsername = usernameInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;
      const enteredEmail = emailInputRef.current!.value;

      if (
        !validEmail.test(enteredEmail) ||
        !validPassword.test(enteredPassword)
      ) {
        alert(
          "entered values must be valid, password must contain at least 1 number, 1 uppercase and one special character"
        );
        setIsLoading(false);
        return;
      }

      await axios
        .post<AxiosResponse>(
          "https://poodlesvonapalusso.dog/api/Authentication/register",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          }
        )
        .then(() => {
          alert("registration successful");
          setIsLoading(false);
          navigate("/");
        })
        .catch((error: string) => {
          setIsLoading(false);
          alert(error);
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
      <Spinner animation="border" variant="info" className={classes.spinner}>
        Load
      </Spinner>
    );
  }
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Register account"}</h1>
      <form onSubmit={submitHandler}>
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
        <br></br>
        <div className="col-md-12 text-center">
          {!isLoading && (
            <Button
              type="submit"
              variant="dark"
              style={{
                color: "#ffe2ed",
                fontSize: "1.6rem",
              }}
            >
              {isLogin ? "Login" : "Create account"}
            </Button>
          )}
          {isLoading && <div>Loading...</div>}
          <br />
          <Button
            type="button"
            onClick={switchLoginHandler}
            variant="dark"
            style={{
              color: "#ffe2ed",
              fontSize: "1.6rem",
            }}
          >
            {isLogin ? "Create a new account" : "Login with existing account"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
