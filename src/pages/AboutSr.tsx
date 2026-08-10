import React from "react";
import classes from "./About.module.css";
import ImageSlider from "../components/UI/ImageSlider";
import imageData from "../components/UI/ImageData";
import { Card, Container } from "react-bootstrap";
import Seo from "../components/SEO/Seo";

const images = imageData;

const AboutSr: React.FC = () => {
  const aboutDescription =
    "Von Apalusso je porodicna odgajivacnica toy, patuljastih i mini pudli u Novom Sadu, Srbija, sa vise od 30 godina iskustva.";
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "O nama - Von Apalusso odgajivacnica pudli",
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
        title="O nama | Toy, patuljaste i mini pudle Novi Sad | Von Apalusso"
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
        <h1>O nama - Von Apalusso odgajivacnica pudli</h1>
        <Card>
          <Container>
            <p>
              Von Apalusso je porodicna odgajivacnica pudli u Novom Sadu,
              Srbija. Tradicija nase odgajivacnice traje vise od 30 godina, od
              prvih izlozbi pasa i nemackih ovcara do danasnjeg rada sa toy,
              patuljastim i mini pudlama.
            </p>
            <p>
              Bavimo se pre svega crvenim i aprikot pudlama koje odrastaju u
              kucnim uslovima. Nasi psi su deo porodice, naviknuti su na ljude,
              svakodnevni zivot u domu i pazljivo odabranu socijalizaciju.
            </p>
            <p>
              U odgoju nam nisu bitni samo izgled i boja, vec temperament,
              zdravlje, pedigre, standard rase, genetski testovi i provera
              patela. Zelimo da svako stene pudle ode u dom koji razume potrebe
              ove rase, negu dlake i odgovornost koju nosi kupovina psa.
            </p>
            <p>
              Ako trazite toy pudlu, patuljastu pudlu, mini pudlu, stene pudle
              ili odgovornu odgajivacnicu pudli u Novom Sadu i Srbiji, na nasem
              sajtu mozete pronaci informacije o nasim psima, leglima,
              dostupnim stencima i nacinu rezervacije.
            </p>
          </Container>
        </Card>
      </section>
      <div className={classes.sliderWrap}>
        <h2>Neki od nasih stenaca</h2>
        <ImageSlider slides={images} />
      </div>
      <Card.Footer className={classes.footer}>
        Ako ste zainteresovani za nase pudle ili stence, mozete nas kontaktirati
        preko drustvenih mreza u gornjem delu sajta. <a href="/about">English</a>
      </Card.Footer>
    </>
  );
};

export default AboutSr;
