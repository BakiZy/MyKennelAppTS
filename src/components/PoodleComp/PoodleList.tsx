import React, { useContext } from "react";
import classes from "./PoodleList.module.css";
//import { Link } from "react-router-dom";
import { PoodleListProps } from "../../interfaces/IPoodleModel";
import AuthContext from "../../store/auth-context";
import { Link } from "react-router-dom";
import { localizedColor, localizedSex, localizedSize, poodlePath } from "../../i18n/siteLanguage";

const PoodleList: React.FC<PoodleListProps> = (props) => {
  const authContext = useContext(AuthContext);
  return (
    <section className={classes.grid} aria-label={props.language === "sr" ? "Lista pudli" : "Poodle list"}>
      {props.poodles.map((poodle) => {
        const parseDate = new Date(poodle.dateOfBirth).toLocaleDateString(
          props.language === "sr" ? "sr-RS" : "en-GB"
        );

        //change date format from yyyy-mm-dd to dd-mm-yyyy

        return (
          <article key={poodle.id} className={classes.cardProperty}>
            <Link className={classes.imageLink} to={poodlePath(props.language, poodle.id)}>
              <img
                src={poodle.imageUrl}
                className={classes.imageProp}
                alt={props.language === "sr"
                  ? `${poodle.name}, ${localizedColor(poodle.poodleColorName, "sr")} ${localizedSize(poodle.poodleSizeName, "sr")} pudla Von Apalusso`
                  : `${poodle.name}, ${poodle.poodleColorName} ${poodle.poodleSizeName} poodle from Von Apalusso kennel`}
              />
            </Link>
            <div className={classes.cardContent}>
              <div className={classes.cardHeader}>
                <div>
                  <p className={classes.kicker}>
                    {localizedSize(poodle.poodleSizeName, props.language)} / {localizedColor(poodle.poodleColorName, props.language)}
                  </p>
                  <h2>{poodle.name}</h2>
                </div>
                <span className={classes.sexBadge}>{localizedSex(poodle.sex, props.language)}</span>
              </div>
              <dl className={classes.metaList}>
                <div>
                  <dt>{props.language === "sr" ? "Rođena/rođen" : "Born"}</dt>
                  <dd>{parseDate}</dd>
                </div>
                <div>
                  <dt>{props.language === "sr" ? "Genetski testovi" : "Genetic tests"}</dt>
                  <dd>{poodle.geneticTests ? (props.language === "sr" ? "Da" : "Yes") : (props.language === "sr" ? "Ne" : "No")}</dd>
                </div>
                {authContext.isLoggedIn ? (
                  <div>
                    <dt>{props.language === "sr" ? "Rodovnik" : "Pedigree"}</dt>
                    <dd>{poodle.pedigreeNumber}</dd>
                  </div>
                ) : null}
              </dl>
              <div className={classes.cardActions}>
                <Link className={classes.linkZ} to={poodlePath(props.language, poodle.id)}>
                  {props.language === "sr" ? "Pogledaj profil" : "View profile"}
                </Link>
                {authContext.isAdmin && (
                  <div className={classes.adminActions}>
                    <button
                      className={classes.removeButton}
                      type="button"
                      onClick={() => props.onRemove(poodle.id)}
                    >
                      Remove
                    </button>
                    <Link
                      className={classes.editLink}
                      to={`/edit-poodle/${poodle.id}`}
                    >
                      Edit DB data
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default PoodleList;
