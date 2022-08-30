import classes from "./ErrorModal.module.css";
import { Button, Card } from "react-bootstrap";
import { IErrorProps } from "../../interfaces/IAuthModel";

const ErrorModal = (props: IErrorProps) => {
  return (
    <>
      <div className={classes.backdrop} onClick={props.onConfirm}></div>
      <Card className={classes.modal}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.message}</Card.Text>
          <Card.Footer>
            <Button onClick={props.onConfirm}>Okay</Button>
          </Card.Footer>
        </Card.Body>{" "}
      </Card>
      ;
    </>
  );
};

export default ErrorModal;
