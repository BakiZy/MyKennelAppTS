import classes from "./ErrorModal.module.css";
import { IErrorProps } from "../../interfaces/IAuthModel";

const ErrorModal = (props: IErrorProps) => {
  return (
    <div className={classes.backdrop} role="presentation">
      <section className={classes.modal} role="alertdialog" aria-modal="true">
        <div className={classes.header}>
          <p>{props.language === "sr" ? "Greška" : "Error"}</p>
          <h2>{props.title}</h2>
        </div>
        <p className={classes.info}>{props.message}</p>
        <div className={classes.return}>
          <button type="button" onClick={props.onConfirm}>
            {props.language === "sr" ? "Nazad" : "Return"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ErrorModal;
