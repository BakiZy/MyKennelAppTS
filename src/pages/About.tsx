import React from "react";
import classes from "./About.module.css";
//import { ISliderImage } from "../interfaces/ISliderModel";
import ImageSlider from "../components/UI/ImageSlider";
import imageData from "../components/UI/ImageData";
import { Card, Container } from "react-bootstrap";
import Seo from "../components/SEO/Seo";

const images = imageData;

const About: React.FC = () => {
  const aboutDescription =
    "About Von Apalusso, a Serbian kennel focused on red, fawn, toy and miniature poodles raised in home conditions.";
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Von Apalusso poodle kennel",
    url: "https://poodlesvonapalusso.com/about",
    description: aboutDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "Poodles Von Apalusso",
      url: "https://poodlesvonapalusso.com/",
    },
  };

  return (
    <>
      <Seo
        title="About Von Apalusso poodle kennel in Serbia"
        description={aboutDescription}
        canonical="https://poodlesvonapalusso.com/about"
        structuredData={aboutStructuredData}
      />
      <section className={classes.about}>
        <h1>Welcome to Von Apalusso kennel page</h1>
        <Card>
          <Container>
            <p>
              Kennel Von Apalusso was created almost 40 years a go, back in
              1984, by my father who was big German Shepherd Dog lover. He was
              very competitive about dog shows, and was very successful as a
              breeder. In early 90s me and my sister wanted poodles as pets, and
              of course our father got us one. Ever since then we've had at
              least one poodle in our house.
            </p>
            <p>
              AFter a while me and my girlfriend have decided to get more
              serious about with our poodles, get into shows and started
              competing. Therefore all our dogs have completed health testing
              and have their patellas checked, and are very well set in
              standards of a poodle race. Our dogs, and their descendants have
              been rewarded in dog shows multiple times.
            </p>
            <p>
              We choose poodles because they are very smart, agile, playful and
              loyal. They have very special characters and they are very unique
              . They don't shed, which is big part of why people like them , but
              that's why their coat and skin requires a lot of care. They need
              to be groomed regularly, and their hair requires a lot of nursing
              . We keep all our poodles with us in our house, and all puppies
              that leave our kennel are already used to living in good home
              conditions, therefore we expect new owners to continue in such a
              way.
            </p>
          </Container>
        </Card>
      </section>
      <div className={classes.sliderWrap}>
        <h2>some of our beautiful puppies</h2>
        <ImageSlider slides={images} />
      </div>
      <Card.Footer className={classes.footer}>
        If you are interested in any of our puppies, you can contact us through
        our social media links in upper corner or through our{" "}
        <a
          href="https://poodlesvonapalusso.com/poodles/4"
          target="_blank"
          rel="noreferrer"
        >
          contact page
        </a>
      </Card.Footer>
    </>
  );
};

export default About;
