import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import classes from "./LoginForm.module.css";
import AuthContext from "../../store/auth-context";
import { ILoginResponse } from "../../interfaces/IAuthModel";
import { Button } from "react-bootstrap";
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

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
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
          "https://localhost:44373/api/Authentication/login",
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
          console.log(response.data);
          if (response.data.username === "AdminZ") {
            authContext.isAdmin = true;
          }
          setIsLogin(true);
          setIsLoading(false);
          alert("login successful");
          navigate("/");
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
        alert("entered values must be valid");
        setIsLoading(false);
        return;
      }

      await axios
        .post<AxiosResponse>(
          "https://localhost:44373/api/Authentication/register",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          }
        )
        .then((response) => {
          console.log(response.data);
          alert("register successful");
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
        <div className="col-md-12 text-center">
          {!isLoading && (
            <Button type="submit" variant="outline-dark">
              {isLogin ? "Login" : "Create account"}
            </Button>
          )}
          {isLoading && <div>Loading...</div>}
          <br />
          <Button
            type="button"
            onClick={switchLoginHandler}
            variant="outline-dark"
          >
            {isLogin ? "Create a new account" : "Login with existing account"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
