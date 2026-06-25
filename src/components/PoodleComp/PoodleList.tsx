import React, { useContext } from "react";
import classes from "./PoodleList.module.css";
//import { Link } from "react-router-dom";
import { PoodleListProps } from "../../interfaces/IPoodleModel";
import AuthContext from "../../store/auth-context";
import { Link } from "react-router-dom";

const PoodleList: React.FC<PoodleListProps> = (props) => {
  const authContext = useContext(AuthContext);
  return (
    <section className={classes.grid} aria-label="Poodle list">
      {props.poodles.map((poodle) => {
        const parseDate = new Date(poodle.dateOfBirth).toLocaleDateString(
          "en-GB"
        );

        //change date format from yyyy-mm-dd to dd-mm-yyyy

        return (
          <article key={poodle.id} className={classes.cardProperty}>
            <Link className={classes.imageLink} to={`/poodles/${poodle.id}`}>
              <img
                src={poodle.imageUrl}
                className={classes.imageProp}
                alt={`${poodle.name}, ${poodle.poodleColorName} ${poodle.poodleSizeName} poodle from Von Apalusso kennel`}
              />
            </Link>
            <div className={classes.cardContent}>
              <div className={classes.cardHeader}>
                <div>
                  <p className={classes.kicker}>
                    {poodle.poodleSizeName} / {poodle.poodleColorName}
                  </p>
                  <h2>{poodle.name}</h2>
                </div>
                <span className={classes.sexBadge}>{poodle.sex}</span>
              </div>
              <dl className={classes.metaList}>
                <div>
                  <dt>Born</dt>
                  <dd>{parseDate}</dd>
                </div>
                <div>
                  <dt>Genetic tests</dt>
                  <dd>{poodle.geneticTests ? "Yes" : "No"}</dd>
                </div>
                {authContext.isLoggedIn ? (
                  <div>
                    <dt>Pedigree</dt>
                    <dd>{poodle.pedigreeNumber}</dd>
                  </div>
                ) : null}
              </dl>
              <div className={classes.cardActions}>
                <Link className={classes.linkZ} to={`/poodles/${poodle.id}`}>
                  View profile
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
