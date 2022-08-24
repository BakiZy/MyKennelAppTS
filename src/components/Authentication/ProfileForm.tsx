import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import classes from "./ProfileForm.module.css";
import { Button } from "react-bootstrap";

const ProfileForm = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const confirmPasswordInput = useRef<HTMLInputElement>(null);

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
    console.log(token + "token iz profila");

    if (newPassword.length < 7 || newPassword !== confirmPassword) {
      alert("Passwords must match and be in proper form");
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
      axios
        .post(
          "http://bakisan-001-site1.ctempurl.com/api/Authentication/change-password",
          bodyParameters,
          config
        )
        .then(function () {
          alert("password successfully  changed");
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    changePassword();
  };

  return (
    <>
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
          <Button
            type="submit"
            variant="outline-dark"
            style={{ background: "rgba(216, 176, 226, 0.815)" }}
          >
            Change password
          </Button>
          <Button
            onClick={logoutHandler}
            variant="outline-dark"
            style={{ background: "rgba(216, 176, 226, 0.815)" }}
          >
            Logout{" "}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
