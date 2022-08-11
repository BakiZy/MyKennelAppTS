import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import classes from "./Reservation.module.css";
import { PoodleModel } from "../interfaces/IPoodleModel";
import { Card, Col, Row, Image } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";

const Reservation = () => {
  const [loading, setLoading] = useState(true);
  const formInputRef = useRef<HTMLFormElement>(null);
  const { poodleId } = useParams();
  const [poodle, setPoodle] = useState<PoodleModel>({
    id: 0,
    name: "",
    imageUrl: "",
    imagePedigreeUrl: "",
    dateOfBirth: new Date(),
    pedigreeNumber: "",
    geneticTests: false,
    poodleSizeName: "",
    poodleColorName: "",
  });

  useEffect(() => {
    const fetchReservedPoodle = async () => {
      await axios
        .get<PoodleModel>(`https://localhost:44373/api/poodles/${poodleId}`)
        .then((response: AxiosResponse<PoodleModel>) => {
          setPoodle(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchReservedPoodle();
    setLoading(false);
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
          console.log(result.status);
          console.log(formInputRef.current!.value);
        },
        (error) => {
          console.log(error.text);
        }
      );
    alert("Email sent!");
    formInputRef.current!.reset();
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!poodle) {
    return <div>No poodle found</div>;
  }
  return (
    <>
      <div>
        <Row lg={3} className={classes.rowContent}>
          <Col key={poodle!.id}>
            <Card key={poodle!.id} className={classes.cardProperty}>
              <Card.Body>
                <Card.Img
                  src={poodle!.imageUrl}
                  className={classes.imageProp}
                />
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
                <label htmlFor="name">Your name</label>
                <input type="text" name="name" />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="email">Your email</label>
                <input type="email" name="mail" />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="phone">Phone number</label>
                <input type="tel" name="phone" placeholder="only numbers" />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  className={classes.textarea}
                  name="message"
                  placeholder="Tell us what kind of puppy would you like"
                />
              </div>
              <br></br>
              <div className={classes.formGroup}>
                <button
                  type="submit"
                  style={{ background: "rgba(216, 176, 226, 0.815)" }}
                >
                  Send information
                </button>
              </div>
            </form>
          </Col>
          <Col>
            <a href={poodle!.imagePedigreeUrl} target="_blank" rel="noreferrer">
              <Image
                src={poodle!.imagePedigreeUrl}
                className={classes.pedigree}
              />
            </a>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Reservation;
