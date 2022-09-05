import React from "react";
import classes from "./About.module.css";
//import { ISliderImage } from "../interfaces/ISliderModel";
import ImageSlider from "../components/UI/ImageSlider";
import imageData from "../components/UI/ImageData";

const images = imageData;

const About: React.FC = () => {
  return (
    <>
      <section className={classes.about}>
        <h1>Welcome to Von Apalusso kennel page</h1>
        <div className={classes.container}>
          <p>
            Kennel Von Apalusso was created almost 40 years a go, back in 1984,
            by my father who was big German Shepherd Dog lover. He was very
            competitive about dog shows, and was very successful as a breeder.
            In early 90s me and my sister wanted poodles as pets, and of course
            our father got us one. Ever since then we've had at least one poodle
            in our house.
          </p>
          <p>
            AFter a while me and my girlfriend have decided to get more serious
            about with our poodles, get into shows and started competing.
            Therefore all our dogs have completed health testing and have their
            patellas checked, and are very well set in standards of a poodle
            race. Our dogs, and their descendants have been rewarded in dog
            shows multiple times.
          </p>
          <p>
            We choose poodles because they are very smart, agile, playful and
            loyal. They have very special characters and they are very unique .
            They don't shed, which is big part of why people like them , but
            that's why their coat and skin requires a lot of care. They need to
            be groomed regularly, and their hair requires a lot of nursing . We
            keep all our poodles with us in our house, and all puppies that
            leave our kennel are already used to living in good home conditions,
            therefore we expect new owners to continue in such a way.
          </p>
        </div>
      </section>
      <div style={{ width: "500px", height: "800px", margin: "0 auto" }}>
        <h1>Currently available puppies</h1>
        <ImageSlider slides={images} />
      </div>
      <div></div>
    </>
  );
};

export default About;
