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
        alternates={[
          {
            hrefLang: "en",
            href: "https://poodlesvonapalusso.com/about",
          },
          {
            hrefLang: "sr",
            href: "https://poodlesvonapalusso.com/o-nama",
          },
          {
            hrefLang: "x-default",
            href: "https://poodlesvonapalusso.com/about",
          },
        ]}
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
              <h2>Toy, patuljaste i mini pudle u Srbiji</h2>
              <p>
                Von Apalusso je porodična odgajivačnica pudli u Srbiji, sa
                tradicijom dugom više od 30 godina. Nalazimo se u Novom Sadu i
                bavimo se toy pudlama, patuljastim pudlama i mini pudlama,
                posebno crvenim i aprikot linijama.
              </p>
              <p>
                Naše pudle odrastaju u kućnim uslovima i deo su porodice.
                Posebnu pažnju posvećujemo temperamentu, socijalizaciji,
                pedigreu, standardu rase, genetskim testovima i proveri patela.
              </p>
              <p>
                Ako tražite štene toy pudle, patuljastu pudlu, mini pudlu ili
                odgovornu odgajivačnicu pudli u Novom Sadu i Srbiji, na našem
                sajtu možete pronaći informacije o psima, leglima, dostupnim
                štencima i načinu rezervacije.
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
        . <a href="/o-nama">O nama</a>
      </Card.Footer>
    </>
  );
};

export default About;
