import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import classes from "./Reservation.module.css";
import { PoodleModel } from "../interfaces/IPoodleModel";
import { Button, Spinner } from "react-bootstrap";
import { AxiosResponse } from "axios";
import api from "../api/client";
import Seo from "../components/SEO/Seo";

const Reservation = () => {
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const formInputRef = useRef<HTMLFormElement>(null);
  const { poodleId } = useParams();
  const [poodle, setPoodle] = useState<PoodleModel>({
    id: 0,
    name: "",
    imageUrl: "",
    imagePedigreeUrl: "",
    dateOfBirth: new Date(),
    pedigreeNumber: "",
    geneticTests: false,
    poodleSizeName: "",
    sex: "",
    poodleColorName: "",
    isPuppy: false,
    nickName: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchReservedPoodle = async () => {
      setLoading(true);
      api
        .get<PoodleModel>(`/api/poodles/${poodleId}`)
        .then((response: AxiosResponse<PoodleModel>) => {
          if (isMounted) {
            setPoodle(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    };

    fetchReservedPoodle();

    return () => {
      isMounted = false;
    };
  }, [poodleId]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formInputRef.current || isSending) {
      return;
    }

    setFormMessage("");
    setFormError("");

    const formData = new FormData(formInputRef.current);
    const honeypotValue = formData.get("website");
    if (typeof honeypotValue === "string" && honeypotValue.trim().length > 0) {
      setFormMessage("Thank you. Your message has been sent.");
      formInputRef.current.reset();
      return;
    }

    const lastInquiryAt = Number(localStorage.getItem("lastPoodleInquiryAt") ?? "0");
    const cooldownMs = 120000;

    if (Date.now() - lastInquiryAt < cooldownMs) {
      setFormError("Please wait a moment before sending another inquiry.");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_e8k7bnc";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_pwtqeke";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "k69W5Ww8YXIigaQE4";

    setIsSending(true);

    try {
      await emailjs.sendForm(serviceId, templateId, formInputRef.current, publicKey);
      localStorage.setItem("lastPoodleInquiryAt", Date.now().toString());
      setFormMessage("Thank you. Your message has been sent.");
      formInputRef.current.reset();
    } catch {
      setFormError("Message could not be sent. Please try again or contact us directly.");
    } finally {
      setIsSending(false);
    }
  };
  if (loading) {
    return (
      <Spinner animation="border" variant="info" className={classes.spinner}>
        loading
      </Spinner>
    );
  }

  if (!poodle) {
    return <div>No poodle found</div>;
  }

  const displayName = poodle.nickName || poodle.name;
  const birthDate = poodle.dateOfBirth
    ? new Date(poodle.dateOfBirth).toLocaleDateString("en-GB")
    : "Unknown";
  const poodleDescription = `${displayName} is a ${poodle.poodleColorName || ""} ${
    poodle.poodleSizeName || ""
  } poodle from Von Apalusso kennel in Serbia.`.replace(/\s+/g, " ");
  const poodleStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${displayName} | Von Apalusso`,
    url: `https://poodlesvonapalusso.com/poodles/${poodle.id}`,
    description: poodleDescription,
    image: poodle.imageUrl,
  };

  return (
    <>
      <Seo
        title={`${displayName} | ${poodle.poodleColorName || "Poodle"} ${
          poodle.poodleSizeName || ""
        } | Von Apalusso`}
        description={poodleDescription}
        canonical={`https://poodlesvonapalusso.com/poodles/${poodle.id}`}
        image={poodle.imageUrl || undefined}
        type="profile"
        structuredData={poodleStructuredData}
      />
      <main className={classes.page}>
        <section className={classes.profilePanel} aria-labelledby="poodle-title">
        <div className={classes.photoPanel}>
          <img
            src={poodle.imageUrl}
            alt={`${displayName}, ${poodle.poodleColorName || "poodle"} ${poodle.poodleSizeName || ""} from Von Apalusso kennel`}
            className={classes.imageProp}
          />
        </div>

        <div className={classes.detailsPanel}>
          <p className={classes.kicker}>{poodle.isPuppy ? "Available puppy" : "Von Apalusso poodle"}</p>
          <h1 id="poodle-title">{displayName}</h1>
          {poodle.nickName && <p className={classes.registeredName}>{poodle.name}</p>}

          <dl className={classes.metaGrid}>
            <div>
              <dt>Sex</dt>
              <dd>{poodle.sex || "Unknown"}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{poodle.poodleSizeName || "Unknown"}</dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{poodle.poodleColorName || "Unknown"}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>{birthDate}</dd>
            </div>
            <div>
              <dt>Pedigree</dt>
              <dd>{poodle.pedigreeNumber || "Available on request"}</dd>
            </div>
            <div>
              <dt>Genetic testing</dt>
              <dd>{poodle.geneticTests ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        {poodle.imagePedigreeUrl && (
          <aside className={classes.pedigreePanel} aria-label={`${poodle.name} family tree`}>
            <a href={poodle.imagePedigreeUrl} target="_blank" rel="noreferrer">
              <img
                src={poodle.imagePedigreeUrl}
                alt={`${poodle.name} pedigree and family tree`}
                className={classes.pedigreeImg}
              />
            </a>
            <p>{poodle.name}'s family tree</p>
          </aside>
        )}
        </section>

        <section className={classes.contactPanel} aria-labelledby="contact-title">
        <div className={classes.contactIntro}>
          <p className={classes.kicker}>Inquiry</p>
          <h2 id="contact-title">
            {poodle.isPuppy
              ? `Interested in ${displayName}?`
              : `Interested in ${displayName}'s puppies?`}
          </h2>
        </div>

        <form ref={formInputRef} className={classes.form} onSubmit={sendEmail}>
          {formMessage && <p className={classes.formStatus}>{formMessage}</p>}
          {formError && <p className={classes.formError}>{formError}</p>}
          <input
            type="text"
            name="website"
            className={classes.honeypot}
            tabIndex={-1}
            autoComplete="off"
          />
          <input type="hidden" name="poodle_name" value={displayName} />
          <input type="hidden" name="poodle_id" value={poodle.id} />
          <div className={classes.formGrid}>
            <div className={classes.formGroup}>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                maxLength={80}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">Your email</label>
              <input
                id="email"
                type="email"
                name="mail"
                autoComplete="email"
                maxLength={120}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                maxLength={40}
              />
            </div>
            <div className={`${classes.formGroup} ${classes.messageField}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className={classes.textarea}
                name="message"
                maxLength={1200}
                placeholder="Tell us what kind of puppy would you like"
                required
              />
            </div>
          </div>

          <div className={classes.formFooter}>
            <Button
              type="submit"
              variant="dark"
              className={classes.submitButton}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send information"}
            </Button>
            <p>
              You do not need an account for this inquiry. We only need a valid way
              to contact you back.
            </p>
          </div>
        </form>
        </section>
      </main>
    </>
  );
};

export default Reservation;
