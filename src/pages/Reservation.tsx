import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
//import { Form } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import classes from "./Reservation.module.css";
import { PoodleModel } from "../interfaces/IPoodleModel";
import { Card, Col, Row } from "react-bootstrap";

//import axios from "axios";

const Reservation = () => {
  const formInputRef = useRef<HTMLFormElement>(null);
  const { poodleId } = useParams();
  const [poodle, setPoodle] = useState<PoodleModel>({
    id: 0,
    name: "",
    image: "",
    dateOfBirth: new Date(),
    pedigreeNumber: "",
    geneticTests: false,
    poodleSizeName: "",
    poodleColorName: "",
  });

  useEffect(() => {
    const fetchReservedPoodle = async () => {
      await fetch(`https://localhost:44373/api/poodles/${poodleId}`, {
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setPoodle(data);
        });
    };
    fetchReservedPoodle();
  }, [poodleId]);

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
    <div>
      <Row lg={3} className={classes.rowContent}>
        <Col key={poodle!.id}>
          <Card key={poodle!.id} className={classes.cardProperty}>
            <Card.Body>
              <Card.Img src={poodle!.image} className={classes.imageProp} />
              <Card.Title>
                <h2>{poodle!.name}</h2>
              </Card.Title>

              {poodle!.geneticTests ? (
                <Card.Text> Genetic testings : yes </Card.Text>
              ) : (
                <Card.Text> Genetic testings : no </Card.Text>
              )}
              <Card.Text>Size : {poodle!.poodleSizeName}</Card.Text>
              <Card.Text>Color : {poodle!.poodleColorName}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <h1>Interested in {poodle.name}'s puppies? Write to us!</h1>
          <form
            ref={formInputRef}
            className={classes.form}
            onSubmit={sendEmail}
          >
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
        </Col>
      </Row>
    </div>
  );
};

export default Reservation;
