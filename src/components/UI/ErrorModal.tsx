import classes from "./ErrorModal.module.css";
import { Button, Card } from "react-bootstrap";
import { IErrorProps } from "../../interfaces/IAuthModel";

const ErrorModal = (props: IErrorProps) => {
  return (
    <div>
      <Card className={classes.modal}>
        <Card.Body className={classes.modalbody}>
          <Card.Title className={classes.header}>{props.title}</Card.Title>
          <Card.Text className={classes.info}>{props.message}</Card.Text>
          <div className={classes.return}>
            <Button variant="dark" onClick={props.onConfirm}>
              Return
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ErrorModal;
