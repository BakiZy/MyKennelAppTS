import { useRef } from "react";
//import { Form } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import classes from "./Reservation.module.css";

const Reservation = () => {
  const formInputRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_e8k7bnc",
        "template_pwtqeke",
        formInputRef.current!,
        "k69W5Ww8YXIigaQE4"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <>
      <h1>Interested in our puppies? Write to us!</h1>
      <form ref={formInputRef} className={classes.form} onSubmit={sendEmail}>
        <div className={classes.formGroup}>
          <label>Name</label>
          <input type="text" name="user_name" />
        </div>
        <div className={classes.formGroup}>
          <label>Email</label>
          <input type="email" name="user_email" />
        </div>
        <div className={classes.formGroup}>
          <label>Message</label>
          <textarea name="message" />
          <input type="submit" value="Send" />
        </div>
      </form>
    </>
  );
};

export default Reservation;
