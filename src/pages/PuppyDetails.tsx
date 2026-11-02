import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/SEO/Seo";
import { PuppyModel } from "../interfaces/IPuppyModel";
import classes from "./PuppyDetails.module.css";

const PuppyDetails: React.FC = () => {
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

  if (loading) return <main className={classes.page}><p>Loading puppy...</p></main>;
  if (!puppy) return (
    <main className={classes.page}>
      <h1>Puppy not found</h1>
      <Link to="/puppies">Back to puppies</Link>
    </main>
  );

  const photos = [puppy.imageUrl, puppy.imageUrl2, puppy.imageUrl3]
    .filter((url): url is string => !!url);
  const date = puppy.dateOfBirth
    ? new Date(puppy.dateOfBirth).toLocaleDateString("en-GB")
    : "To be announced";
  const name = puppy.name || "Von Apalusso puppy";
  const description = puppy.description || `${name}, a ${puppy.color || "poodle"} puppy from Von Apalusso kennel in Serbia.`;
  const canonical = `https://poodlesvonapalusso.com/puppies/${puppy.id}`;
  const photoIndex = Math.min(activePhoto, Math.max(photos.length - 1, 0));

  return (
    <>
      <Seo
        title={`${name} | Von Apalusso puppy`}
        description={description}
        canonical={canonical}
        image={photos[0]}
        type="profile"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: `${name} | Von Apalusso`,
          url: canonical,
          description,
          image: photos,
        }}
      />
      <main className={classes.page}>
        <Link className={classes.backLink} to="/puppies">← All puppies</Link>
        <div className={classes.layout}>
          <section className={classes.gallery} aria-label={`${name} photos`}>
            {photos.length > 0 ? (
              <>
                <a href={photos[photoIndex]} target="_blank" rel="noopener noreferrer" aria-label="Open current photo in full size">
                  <img className={classes.mainPhoto} src={photos[photoIndex]} alt={`${name}, photo ${photoIndex + 1} of ${photos.length}`} />
                </a>
                {photos.length > 1 && (
                  <>
                    <div className={classes.galleryControls}>
                      <button type="button" onClick={() => setActivePhoto((photoIndex + photos.length - 1) % photos.length)} aria-label="Previous photo">‹</button>
                      <span>{photoIndex + 1} / {photos.length}</span>
                      <button type="button" onClick={() => setActivePhoto((photoIndex + 1) % photos.length)} aria-label="Next photo">›</button>
                    </div>
                    <div className={classes.thumbnails}>
                      {photos.map((photo, index) => (
                        <button key={photo} type="button" className={index === photoIndex ? classes.selected : ""}
                          onClick={() => setActivePhoto(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={index === photoIndex}>
                          <img src={photo} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : <p className={classes.noPhoto}>Photos coming soon.</p>}
          </section>
          <section className={classes.details}>
            <p className={classes.kicker}>Von Apalusso puppy</p>
            <h1>{name}</h1>
            <span className={classes.status}>{puppy.status || "Available"}</span>
            <p className={classes.description}>{description}</p>
            <dl>
              <div><dt>Born</dt><dd>{date}</dd></div>
              <div><dt>Sex</dt><dd>{puppy.sex || "To be confirmed"}</dd></div>
              <div><dt>Color</dt><dd>{puppy.color || "To be confirmed"}</dd></div>
              <div><dt>Litter</dt><dd>{puppy.litterName || "Not assigned"}</dd></div>
            </dl>
            <Link className={classes.contactLink} to="/about">Ask about this puppy</Link>
          </section>
        </div>
      </main>
    </>
  );
};

export default PuppyDetails;
