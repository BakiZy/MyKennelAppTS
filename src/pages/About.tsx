import React from "react";
import classes from "./About.module.css";

const About: React.FC = () => {
  return (
    <section id="poodlesetup">
      <h1
        style={{
          textAlign: "center",
          fontSize: "2em",
          textAlignLast: "center",
        }}
      >
        Welcome to Von Apalusso kennel page
      </h1>
      <div className={classes.container}>
        <p>
          Kennel Von Apalusso was created almost 40 years a go, by my father who
          was big German shepherd dog lover. When i was young I got poodle as
          pet back when we were kids, 20 ages + a go, and we've had poodles ever
          since.
        </p>
        <br></br>
        <p>
          We choose poodles because they are very smart, agile, playful and
          loyal. They have very special characteristics and they are very
          unique.
        </p>
      </div>
    </section>
  );
};

export default About;
