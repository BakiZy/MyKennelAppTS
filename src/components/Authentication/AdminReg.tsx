import React, { useState, useRef, useContext, useCallback } from "react";
import { AxiosResponse } from "axios";
import api from "../../api/client";
import AuthContext from "../../store/auth-context";
import classes from "./AdminReg.module.css";
import { Spinner } from "react-bootstrap";
import { validEmail, validPassword } from "./Regex";
import { useNavigate } from "react-router-dom";

const AdminReg: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const authContext = useContext(AuthContext);
  const token = authContext.token;
  const navigate = useNavigate();
  const submitHandler = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
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
        setLoading(false);
        return;
      }
      const config = {
        headers: { Authorization: "Bearer " + token },
      };

      await api
        .post<AxiosResponse>(
          "/api/Admin/register-admin",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          },
          config
        )
        .then(() => {
          alert("admin registration successful");
          navigate("/profile");
        })
        .catch((error: string) => {
          setLoading(false);
          console.log(error);
        });
    },
    [token, navigate]
  );

  if (loading) {
    return (
      <main className={classes.page}>
        <div className={classes.loadingState}>
          <Spinner animation="border" variant="dark" />
        </div>
      </main>
    );
  }
  return (
    <main className={classes.page}>
      <section className={classes.auth}>
        <div className={classes.intro}>
          <p className={classes.eyebrow}>Admin access</p>
          <h1>Register admin account</h1>
        </div>
      <form onSubmit={submitHandler} className={classes.form}>
        <div className={classes.control}>
          <label htmlFor="email">E-mail address</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>

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
          <button type="submit" className={classes.primaryAction}>
            Create account
          </button>
        </div>
      </form>
      </section>
    </main>
  );
};

export default AdminReg;
