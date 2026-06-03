import React, { useState, useRef, useCallback } from "react";
import { AxiosResponse } from "axios";
import api from "../../api/client";
import { getApiErrorMessage } from "../../api/errorMessage";
import classes from "./AdminReg.module.css";
import { Spinner } from "react-bootstrap";
import { passwordRequirementsMessage, validEmail, validPassword } from "./Regex";
import { useNavigate } from "react-router-dom";

const AdminReg: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const submitHandler = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");
      const enteredUsername = usernameInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;
      const enteredEmail = emailInputRef.current!.value;
      if (!validEmail.test(enteredEmail)) {
        setError("Enter a valid email address.");
        setLoading(false);
        return;
      }

      if (!validPassword.test(enteredPassword)) {
        setError(passwordRequirementsMessage);
        setLoading(false);
        return;
      }
      await api
        .post<AxiosResponse>(
          "/api/Admin/register-admin",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          }
        )
        .then(() => {
          setMessage("Admin registration successful.");
          setLoading(false);
          navigate("/profile");
        })
        .catch((requestError) => {
          setLoading(false);
          setError(
            getApiErrorMessage(requestError, {
              fallback: "Admin registration failed. Please check the details and try again.",
            })
          );
        });
    },
    [navigate]
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
        {message && <p className={classes.message}>{message}</p>}
        {error && <p className={classes.error}>{error}</p>}
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
