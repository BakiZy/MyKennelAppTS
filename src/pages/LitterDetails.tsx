import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/SEO/Seo";
import { LitterModel, PuppyModel } from "../interfaces/IPuppyModel";
import { poodlePath } from "../i18n/siteLanguage";
import {
  litterDescription, litterDetailPath, puppyColor, puppyDescription,
  puppyDetailPath, puppyListPath, puppyStatus, PuppyLanguage,
} from "../puppiesI18n";
import classes from "./LitterDetails.module.css";

const LitterDetails: React.FC<{ language: PuppyLanguage }> = ({ language }) => {
  const isSerbian = language === "sr";
  const { litterId } = useParams();
  const [litter, setLitter] = useState<LitterModel | null>(null);
  const [puppies, setPuppies] = useState<PuppyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    Promise.all([
      api.get<LitterModel[]>("/api/puppies/litters"),
      api.get<PuppyModel[]>("/api/puppies"),
    ])
      .then(([litterResponse, puppyResponse]) => {
        if (!active) return;
        const id = Number(litterId);
        setLitter(litterResponse.data.find((item) => item.id === id) || null);
        setPuppies(puppyResponse.data.filter((puppy) => puppy.litterId === id));
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [litterId]);

  const backLink = <Link className={classes.backLink} to={puppyListPath(language)}>
    {isSerbian ? "← Svi štenci i legla" : "← All puppies and litters"}
  </Link>;

  if (loading || failed || !litter) return (
    <main className={classes.page}>
      {backLink}
      <p role="status">{loading
        ? (isSerbian ? "Učitavanje legla..." : "Loading litter...")
        : failed
          ? (isSerbian ? "Podaci o leglu trenutno nisu dostupni." : "Litter details are currently unavailable.")
          : (isSerbian ? "Leglo nije pronađeno." : "Litter not found.")}</p>
    </main>
  );

  const name = litter.name || (isSerbian ? "Leglo Von Apalusso" : "Von Apalusso litter");
  const description = litterDescription(litter, language);
  const canonical = `https://poodlesvonapalusso.com${litterDetailPath(language, litter.id)}`;
  const date = litter.dateOfBirth
    ? new Date(litter.dateOfBirth).toLocaleDateString(isSerbian ? "sr-RS" : "en-GB")
    : (isSerbian ? "Biće objavljeno" : "To be announced");
  const title = isSerbian ? `${name} | Leglo pudli | Von Apalusso` : `${name} | Poodle litter | Von Apalusso`;

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        image={litter.coverImageUrl}
        lang={language}
        alternates={[
          { hrefLang: "en", href: `https://poodlesvonapalusso.com${litterDetailPath("en", litter.id)}` },
          { hrefLang: "sr", href: `https://poodlesvonapalusso.com${litterDetailPath("sr", litter.id)}` },
          { hrefLang: "x-default", href: `https://poodlesvonapalusso.com${litterDetailPath("en", litter.id)}` },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          url: canonical,
          description,
          inLanguage: language,
        }}
      />
      <main className={classes.page}>
        {backLink}
        <div className={classes.layout}>
          <div className={classes.photoPanel}>
            {litter.coverImageUrl ? (
              <a href={litter.coverImageUrl} target="_blank" rel="noopener noreferrer" aria-label={isSerbian ? "Otvori fotografiju legla" : "Open litter photo"}>
                <img src={litter.coverImageUrl} alt={isSerbian ? `${name}, leglo Von Apalusso` : `${name}, Von Apalusso litter`} />
              </a>
            ) : (
              <div className={classes.placeholder}>
                <img src="/poodle.svg" alt="" />
                <span>{isSerbian ? "Fotografija legla uskoro" : "Litter photo coming soon"}</span>
              </div>
            )}
          </div>
          <article className={classes.details}>
            <p className={classes.kicker}>{isSerbian ? "Leglo Von Apalusso" : "Von Apalusso litter"}</p>
            <h1>{name}</h1>
            <span className={classes.status}>{puppyStatus(litter.status, language)}</span>
            <p className={classes.description}>{description}</p>
            <dl>
              <div><dt>{isSerbian ? "Datum rođenja" : "Born"}</dt><dd>{date}</dd></div>
              <div><dt>{isSerbian ? "Otac" : "Father"}</dt><dd>{litter.fatherId && litter.fatherName ? <Link to={poodlePath(language, litter.fatherId)}>{litter.fatherName}</Link> : (isSerbian ? "Biće objavljeno" : "To be announced")}</dd></div>
              <div><dt>{isSerbian ? "Majka" : "Mother"}</dt><dd>{litter.motherId && litter.motherName ? <Link to={poodlePath(language, litter.motherId)}>{litter.motherName}</Link> : (isSerbian ? "Biće objavljeno" : "To be announced")}</dd></div>
              <div><dt>{isSerbian ? "Štenaca u leglu" : "Puppies in litter"}</dt><dd>{litter.puppyCount}</dd></div>
              <div><dt>{isSerbian ? "Dostupno" : "Available"}</dt><dd>{litter.availablePuppyCount}</dd></div>
            </dl>
          </article>
        </div>
        <section className={classes.puppySection}>
          <h2>{isSerbian ? "Štenci iz ovog legla" : "Puppies in this litter"}</h2>
          {puppies.length === 0 ? (
            <p>{isSerbian ? "Štenci iz ovog legla još nisu pojedinačno objavljeni." : "Puppies from this litter have not been listed individually yet."}</p>
          ) : (
            <div className={classes.puppyGrid}>
              {puppies.map((puppy) => {
                const puppyName = puppy.name || (isSerbian ? "Štene" : "Puppy");
                const photo = puppy.imageUrl || puppy.imageUrl2 || puppy.imageUrl3;
                return (
                  <article className={classes.puppyCard} key={puppy.id}>
                    <Link to={puppyDetailPath(language, puppy.id)}>
                      <img src={photo || "/poodle.svg"} alt={photo ? puppyName : ""} className={photo ? undefined : classes.puppyPlaceholder} loading="lazy" />
                    </Link>
                    <div className={classes.puppyInfo}>
                      <span>{puppyStatus(puppy.status, language)} · {puppyColor(puppy.color, language)}</span>
                      <h3>{puppyName}</h3>
                      <p>{puppyDescription(puppy, language)}</p>
                      <Link to={puppyDetailPath(language, puppy.id)}>{isSerbian ? "Pogledaj štene" : "View puppy"}</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default LitterDetails;
