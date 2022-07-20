import React, { useContext } from "react";
import classes from "./PoodleList.module.css";
//import { Link } from "react-router-dom";
import { PoodleListProps } from "../../interfaces/IPoodleModel";
import AuthContext from "../../store/auth-context";
import { Card, Col, Row, Button } from "react-bootstrap";

const PoodleList: React.FC<PoodleListProps> = (props) => {
  const authContext = useContext(AuthContext);
  return (
    <Row lg={3} className={classes.rowContent}>
      {props.poodles.map((poodle) => {
        const parseDate = new Date(poodle.dateOfBirth).toLocaleDateString();
        return (
          <Col key={poodle.id}>
            <Card key={poodle.id} className={classes.cardProperty}>
              <Card.Body>
                <Card.Img src={poodle.image} className={classes.imageProp} />
                <Card.Title>
                  <h2>{poodle.name}</h2>
                </Card.Title>
                <Card.Text>Date of birth : {parseDate}</Card.Text>
                {authContext.isAdmin ? (
                  <Card.Text>
                    Pedigree number: {poodle.pedigreeNumber}
                  </Card.Text>
                ) : null}
                {poodle.geneticTests ? (
                  <Card.Text> Genetic testings : yes </Card.Text>
                ) : (
                  <Card.Text> Genetic testings : no </Card.Text>
                )}
                <Card.Text>Size : {poodle.poodleSizeName}</Card.Text>
                <Card.Text>Color : {poodle.poodleColorName}</Card.Text>
                <Button
                  onClick={() => props.onSelect}
                  style={{
                    backgroundColor: " rgb(107, 14, 117)",
                    borderRadius: "1rem",
                    borderColor: "rgb(107, 14, 117)",
                  }}
                >
                  Interested in this poodle pups?
                </Button>
                {authContext.isAdmin && (
                  <Button
                    onClick={() => props.onRemove(poodle.id)}
                    style={{
                      backgroundColor: " rgb(107, 14, 117)",
                      borderRadius: "1rem",
                      borderColor: "rgb(107, 14, 117)",
                    }}
                  >
                    Remove (admin only!)
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default PoodleList;
