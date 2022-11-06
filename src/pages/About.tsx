import React from "react";
import classes from "./About.module.css";
//import { ISliderImage } from "../interfaces/ISliderModel";
import ImageSlider from "../components/UI/ImageSlider";
import imageData from "../components/UI/ImageData";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Card, Container } from "react-bootstrap";

const images = imageData;

const About: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        {" "}
        <html lang="en" />
        <title>About poodles Von Apalusso kennel</title>
        <meta
          name="description"
          content="Toy, miniature, red and fawn Poodle kennel from Serbia"
        />
        <meta
          name="poodles, pudle, red poodle, apricot poodle, fawn poodle, toy poodle, miniature poodle, toy pudla, pudla, pudle srbija"
          content="About us "
        />
        <meta name="robots" content="noindex, nofollow" />
        {/* https://ogp.me/ */}
        <meta
          property="og:url"
          content="https://poodlesvonapalusso.xyz/about"
        />
        <meta property="og:title" content="About our poodle kennel" />
        <meta
          property="og:description"
          content="Toy, miniature, red and fawn Poodle kennel from Serbia"
        />
        <meta property="og:type" content="..." />
        <meta
          property="og:image"
          content={"https://i.imgur.com/6Ll5PQL.jpeg"}
        />
        {/* https://moz.com/blog/meta-referrer-tag */}
        <meta name="referrer" content="origin-when-crossorigin" />
      </Helmet>
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
      <div style={{ width: "500px", height: "800px", margin: "0 auto" }}>
        <h1>Currently available puppies</h1>
        <ImageSlider slides={images} />
      </div>
      <Card.Footer className={classes.footer}>
        If you are interested in any of our puppies, you can contact us through
        our social media links in upper corner or through our{" "}
        <a
          href="https://poodlesvonapalusso.xyz/poodles/4"
          target="_blank"
          rel="noreferrer"
        >
          contact page
        </a>
      </Card.Footer>
    </HelmetProvider>
  );
};

export default About;
