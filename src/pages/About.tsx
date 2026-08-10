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
        <h1>About Von Apalusso poodle kennel in Serbia</h1>
        <Card>
          <Container>
            <p>
              Von Apalusso is a Serbian kennel with a long family tradition in
              dogs and dog shows. The kennel was founded in 1984, first through
              German Shepherd Dogs, and poodles have been part of our family
              since the early 1990s.
            </p>
            <p>
              Today we are focused on red, fawn, toy and miniature poodles. Our
              dogs are raised in home conditions, live with us as family, and
              are selected with temperament, health, structure and breed
              standards in mind.
            </p>
            <p>
              Our poodles take part in dog shows, have completed health checks,
              and their patellas are checked. We care about responsible
              breeding, good socialization and finding suitable homes for every
              puppy.
            </p>
            <section className={classes.serbianSection} lang="sr">
              <h2>Von Apalusso odgajivačnica pudli u Srbiji</h2>
              <p>
                Von Apalusso je porodična odgajivačnica pudli u Srbiji. Bavimo
                se crvenim, aprikot, toy i patuljastim pudlama koje odrastaju u
                kućnim uslovima, uz pažnju, socijalizaciju i brigu o zdravlju.
              </p>
              <p>
                Naše pudle su deo porodice, naviknute su na ljude i svakodnevni
                život u domu. Posebnu pažnju posvećujemo temperamentu, nezi
                dlake, patelama, pedigreu i standardu rase.
              </p>
              <p>
                Ako tražite toy pudlu, patuljastu pudlu ili štene pudle u
                Srbiji, na sajtu možete pronaći informacije o našim psima,
                leglima i dostupnim štencima.
              </p>
            </section>
          </Container>
        </Card>
      </section>
      <div className={classes.sliderWrap}>
        <h2>Some of our beautiful puppies</h2>
        <ImageSlider slides={images} />
      </div>
      <Card.Footer className={classes.footer}>
        If you are interested in any of our puppies, you can contact us through
        our social media links in the upper corner or through our{" "}
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
