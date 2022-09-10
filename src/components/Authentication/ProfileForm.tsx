import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import classes from "./ProfileForm.module.css";
import { Button, Spinner } from "react-bootstrap";
import ErrorModal from "../UI/ErrorModal";

const ProfileForm = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const confirmPasswordInput = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    title: "",
    popup: false,
  });

  const logoutHandler = () => {
    authContext.logout();
    navigate("/");
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = usernameInputRef.current!.value;
    const currentPassword = currentPasswordInput.current!.value;
    const newPassword = newPasswordInput.current!.value;
    const confirmPassword = confirmPasswordInput!.current!.value;

    const token = authContext.token;

    if (newPassword.length < 7 || newPassword !== confirmPassword) {
      setError({
        message: "invalid password or passwords don't match",
        title: "Password error",
        popup: true,
      });
      return;
    }
    const config = {
      headers: { Authorization: "Bearer " + token },
    };
    const bodyParameters = {
      username: username,
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    const changePassword = async () => {
      setIsLoading(true);
      await axios
        .post(
          "https://poodlesvonapalusso.dog/api/Authentication/change-password",
          bodyParameters,
          config
        )
        .then(function (response) {
          if (response.status !== 200) {
            setError({
              message: "invalid password or passwords don't match",
              title: "Password error",
              popup: true,
            });
          }
          alert("password successfully  changed");
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setError({
            message: "invalid password or passwords don't match",
            title: "Password error",
            popup: true,
          });
        });
    };
    changePassword();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Spinner animation="border" variant="info" className={classes.spinner}>
        Load
      </Spinner>
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
          title={error.title}
          onConfirm={errorHandler}
        />
      )}
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" ref={usernameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            required
            minLength={7}
            ref={currentPasswordInput}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="new-password">New password</label>
          <input
            type="password"
            id="new-password"
            required
            minLength={7}
            ref={newPasswordInput}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            required
            ref={confirmPasswordInput}
          />
        </div>
        <br />
        <div className="col-md-12 text-center">
          <Button type="submit" variant="dark" style={{ fontSize: "1.6rem" }}>
            Change password
          </Button>
          <Button
            onClick={logoutHandler}
            variant="dark"
            style={{ fontSize: "1.6rem" }}
          >
            Logout{" "}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
