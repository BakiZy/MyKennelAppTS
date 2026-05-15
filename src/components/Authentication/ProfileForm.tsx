import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import api from "../../api/client";
import classes from "./ProfileForm.module.css";
import ErrorModal from "../UI/ErrorModal";

const ProfileForm = () => {
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

  const logoutHandler = () => {
    authContext.logout();
    navigate("/");
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
        message: "Password must be at least 7 characters and both values must match.",
        title: "Password error",
        popup: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/api/Authentication/change-password", form);
      setMessage("Password changed.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      console.log(requestError);
      setError({
        message: "Could not change password. Check the current password and try again.",
        title: "Password error",
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
      {error.popup && (
        <ErrorModal
          message={error.message}
          title={error.title}
          onConfirm={errorHandler}
        />
      )}
      <main className={classes.page}>
        <section className={classes.panel}>
          <div className={classes.header}>
            <p>Account</p>
            <h1>Profile</h1>
          </div>
          {message && <p className={classes.message}>{message}</p>}
          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.field}>
              <label htmlFor="currentPassword">Current password</label>
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
              <label htmlFor="newPassword">New password</label>
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
              <label htmlFor="confirmPassword">Confirm password</label>
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
                {isLoading ? "Saving..." : "Change password"}
              </button>
              <button type="button" onClick={logoutHandler} className={classes.secondary}>
                Logout
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default ProfileForm;
