import React, { useContext } from "react";
import classes from "./About.module.css";
//import { ISliderImage } from "../interfaces/ISliderModel";
import ImageSlider from "../components/UI/ImageSlider";
import useAboutSlider from "../hooks/useAboutSlider";
import { Card, Container } from "react-bootstrap";
import Seo from "../components/SEO/Seo";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

const About: React.FC = () => {
  const authContext = useContext(AuthContext);
  const images = useAboutSlider();
  const aboutDescription =
    "About Von Apalusso, a kennel in Novi Sad, Serbia, focused on red, fawn, toy and miniature poodles raised in home conditions.";
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
              Von Apalusso is a kennel in Novi Sad, Serbia, with a long family tradition in
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
              Our kennel is home to show dogs, and their offspring have become
              both beautiful show dogs and much-loved family companions. Our
              dogs have health checks, and we care about responsible breeding,
              good socialization and finding the right home for every puppy.
              You can see photos of some of our puppies in their new homes below.
            </p>
            <p>
              On our site you can learn about our dogs, litters, available
              puppies and how to make a reservation.
            </p>
          </Container>
        </Card>
      </section>
      {(images.length > 0 || authContext.isAdmin) && <div className={classes.sliderWrap}>
        {images.length > 0 && <>
          <div className={classes.sliderIntro}>
            <h2>Our puppies in their new homes</h2>
          </div>
          <ImageSlider slides={images} language="en" />
        </>}
        {authContext.isAdmin && <p><Link to="/images">Manage slider photos</Link></p>}
      </div>}
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
        . <Link to="/puppies">View available puppies</Link>
      </Card.Footer>
    </>
  );
};

export default About;
