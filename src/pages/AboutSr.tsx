import React from "react";
import classes from "./About.module.css";
import ImageSlider from "../components/UI/ImageSlider";
import imageData from "../components/UI/ImageData";
import { Card, Container } from "react-bootstrap";
import Seo from "../components/SEO/Seo";
import { Link } from "react-router-dom";

const images = imageData;

const AboutSr: React.FC = () => {
  const aboutDescription =
    "Von Apalusso je porodična odgajivačnica toy i patuljastih pudli u Novom Sadu, sa tradicijom od 1984. godine.";
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "O nama - odgajivačnica pudli Von Apalusso",
    url: "https://poodlesvonapalusso.com/o-nama",
    inLanguage: "sr",
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
        title="O nama | Toy i patuljaste (mini) pudle Novi Sad | Von Apalusso"
        description={aboutDescription}
        canonical="https://poodlesvonapalusso.com/o-nama"
        lang="sr"
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
        <h1>O nama - odgajivačnica pudli Von Apalusso u Srbiji</h1>
        <Card>
          <Container>
            <p>
              Von Apalusso je odgajivačnica u Novom Sadu, u Srbiji, sa dugom
              porodičnom tradicijom u odgoju i izlaganju pasa. Osnovana je
              1984. godine, najpre sa nemačkim ovčarima, a pudle su deo naše
              porodice od početka devedesetih godina.
            </p>
            <p>
              Danas se bavimo prvenstveno crvenim i aprikot toy i patuljastim
              pudlama. Naši psi odrastaju u kućnim uslovima, žive sa nama kao
              deo porodice, a pri odabiru vodimo računa o temperamentu, zdravlju,
              građi i standardu rase.
            </p>
            <p>
              Naše pudle učestvuju na izložbama pasa, imaju obavljene zdravstvene
              preglede i proverene čašice kolena. Važni su nam odgovoran odgoj,
              dobra socijalizacija i pronalaženje odgovarajućeg doma za svako
              štene.
            </p>
            <p>
              Na našem sajtu možete pronaći informacije o našim psima, leglima,
              <Link to="/stenci-pudle"> dostupnim štencima</Link> i načinu rezervacije.
            </p>
          </Container>
        </Card>
      </section>
      <div className={classes.sliderWrap}>
        <h2>Neki od naših štenaca</h2>
        <ImageSlider slides={images} />
      </div>
      <Card.Footer className={classes.footer}>
        Ako ste zainteresovani za naše pudle ili štence, možete nas kontaktirati
        preko društvenih mreža u gornjem delu sajta. <Link to="/about">English</Link>
      </Card.Footer>
    </>
  );
};

export default AboutSr;
