import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/SEO/Seo";
import { PuppyModel } from "../interfaces/IPuppyModel";
import classes from "./PuppyDetails.module.css";
import { puppyColor, puppyDescription, puppyDetailPath, puppyListPath, puppySex, puppyStatus, PuppyLanguage } from "../puppiesI18n";

const PuppyDetails: React.FC<{ language: PuppyLanguage }> = ({ language }) => {
  const isSerbian = language === "sr";
  const { puppyId } = useParams();
  const [puppy, setPuppy] = useState<PuppyModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPuppy(null);
    setActivePhoto(0);
    api.get<PuppyModel>(`/api/puppies/${puppyId}`)
      .then((response) => { if (active) setPuppy(response.data); })
      .catch(() => { if (active) setPuppy(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [puppyId]);

  if (loading) return <main className={classes.page}><p>{isSerbian ? "Učitavanje šteneta..." : "Loading puppy..."}</p></main>;
  if (!puppy) return (
    <main className={classes.page}>
      <h1>{isSerbian ? "Štene nije pronađeno" : "Puppy not found"}</h1>
      <Link to={puppyListPath(language)}>{isSerbian ? "Nazad na štence" : "Back to puppies"}</Link>
    </main>
  );

  const photos = [puppy.imageUrl, puppy.imageUrl2, puppy.imageUrl3]
    .filter((url): url is string => !!url);
  const date = puppy.dateOfBirth
    ? new Date(puppy.dateOfBirth).toLocaleDateString(isSerbian ? "sr-RS" : "en-GB")
    : (isSerbian ? "Biće objavljeno" : "To be announced");
  const name = puppy.name || (isSerbian ? "Štene Von Apalusso" : "Von Apalusso puppy");
  const description = puppyDescription(puppy, language);
  const canonical = `https://poodlesvonapalusso.com${puppyDetailPath(language, puppy.id)}`;
  const photoIndex = Math.min(activePhoto, Math.max(photos.length - 1, 0));

  return (
    <>
      <Seo
        title={isSerbian ? `${name} | Štene toy ili patuljaste pudle | Von Apalusso` : `${name} | Toy or miniature poodle puppy | Von Apalusso`}
        description={description}
        canonical={canonical}
        image={photos[0]}
        type="profile"
        lang={language}
        alternates={[
          { hrefLang: "en", href: `https://poodlesvonapalusso.com${puppyDetailPath("en", puppy.id)}` },
          { hrefLang: "sr", href: `https://poodlesvonapalusso.com${puppyDetailPath("sr", puppy.id)}` },
          { hrefLang: "x-default", href: `https://poodlesvonapalusso.com${puppyDetailPath("en", puppy.id)}` },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: `${name} | Von Apalusso`,
          url: canonical,
          description,
          image: photos,
          inLanguage: language,
        }}
      />
      <main className={classes.page}>
        <Link className={classes.backLink} to={puppyListPath(language)}>{isSerbian ? "← Svi štenci" : "← All puppies"}</Link>
        <div className={classes.layout}>
          <section className={classes.gallery} aria-label={isSerbian ? `Fotografije šteneta ${name}` : `${name} photos`}>
            {photos.length > 0 ? (
              <>
                <a href={photos[photoIndex]} target="_blank" rel="noopener noreferrer" aria-label={isSerbian ? "Otvori fotografiju u punoj veličini" : "Open current photo in full size"}>
                  <img className={classes.mainPhoto} src={photos[photoIndex]} alt={isSerbian ? `${name}, fotografija ${photoIndex + 1} od ${photos.length}` : `${name}, photo ${photoIndex + 1} of ${photos.length}`} />
                </a>
                {photos.length > 1 && (
                  <>
                    <div className={classes.galleryControls}>
                      <button type="button" onClick={() => setActivePhoto((photoIndex + photos.length - 1) % photos.length)} aria-label={isSerbian ? "Prethodna fotografija" : "Previous photo"}>‹</button>
                      <span>{photoIndex + 1} / {photos.length}</span>
                      <button type="button" onClick={() => setActivePhoto((photoIndex + 1) % photos.length)} aria-label={isSerbian ? "Sledeća fotografija" : "Next photo"}>›</button>
                    </div>
                    <div className={classes.thumbnails}>
                      {photos.map((photo, index) => (
                        <button key={photo} type="button" className={index === photoIndex ? classes.selected : ""}
                          onClick={() => setActivePhoto(index)} aria-label={isSerbian ? `Prikaži fotografiju ${index + 1}` : `Show photo ${index + 1}`} aria-pressed={index === photoIndex}>
                          <img src={photo} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : <p className={classes.noPhoto}>{isSerbian ? "Fotografije uskoro." : "Photos coming soon."}</p>}
          </section>
          <section className={classes.details}>
            <p className={classes.kicker}>{isSerbian ? "Štene Von Apalusso" : "Von Apalusso puppy"}</p>
            <h1>{name}</h1>
            <span className={classes.status}>{puppyStatus(puppy.status, language)}</span>
            <p className={classes.description}>{description}</p>
            <dl>
              <div><dt>{isSerbian ? "Rođeno" : "Born"}</dt><dd>{date}</dd></div>
              <div><dt>{isSerbian ? "Pol" : "Sex"}</dt><dd>{puppySex(puppy.sex, language)}</dd></div>
              <div><dt>{isSerbian ? "Boja" : "Color"}</dt><dd>{puppyColor(puppy.color, language)}</dd></div>
              <div><dt>{isSerbian ? "Leglo" : "Litter"}</dt><dd>{puppy.litterName || (isSerbian ? "Nije dodeljeno" : "Not assigned")}</dd></div>
            </dl>
            <Link className={classes.contactLink} to={isSerbian ? "/o-nama" : "/about"}>{isSerbian ? "Pitajte nas o ovom štenetu" : "Ask about this puppy"}</Link>
          </section>
        </div>
      </main>
    </>
  );
};

export default PuppyDetails;
