import React, { useCallback, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { LitterModel, PuppyModel } from "../interfaces/IPuppyModel";
import { PoodleModel } from "../interfaces/IPoodleModel";
import AuthContext from "../store/auth-context";
import classes from "./Puppies.module.css";

const Puppies: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [puppies, setPuppies] = useState<PuppyModel[]>([]);
  const [litters, setLitters] = useState<LitterModel[]>([]);
  const [poodles, setPoodles] = useState<PoodleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const [litterForm, setLitterForm] = useState({
    name: "",
    dateOfBirth: "",
    fatherId: "",
    motherId: "",
    status: "Available",
    coverImageUrl: "",
    description: "",
  });

  const [puppyForm, setPuppyForm] = useState({
    name: "",
    sex: "Male",
    color: "",
    dateOfBirth: "",
    status: "Available",
    imageUrl: "",
    description: "",
    litterId: "",
  });

  const fetchPuppies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [puppyResponse, litterResponse, poodleResponse] = await Promise.all([
        api.get<PuppyModel[]>("/api/puppies"),
        api.get<LitterModel[]>("/api/puppies/litters"),
        api.get<PoodleModel[]>("/api/poodles"),
      ]);

      setPuppies(puppyResponse.data);
      setLitters(litterResponse.data);
      setPoodles(poodleResponse.data);
    } catch (requestError) {
      console.log(requestError);
      setError("Puppies are not available in the local database yet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPuppies();
  }, [fetchPuppies]);

  const formatDate = (value?: string) => {
    if (!value) {
      return "Date to be announced";
    }

    return new Date(value).toLocaleDateString("en-GB");
  };

  const submitLitterHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      await api.post(
        "/api/puppies/litters",
        {
          name: litterForm.name,
          dateOfBirth: litterForm.dateOfBirth || null,
          fatherId: litterForm.fatherId ? parseInt(litterForm.fatherId) : null,
          motherId: litterForm.motherId ? parseInt(litterForm.motherId) : null,
          status: litterForm.status,
          coverImageUrl: litterForm.coverImageUrl,
          description: litterForm.description,
        }
      );

      setAdminMessage("Litter added.");
      setLitterForm({
        name: "",
        dateOfBirth: "",
        fatherId: "",
        motherId: "",
        status: "Available",
        coverImageUrl: "",
        description: "",
      });
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not add litter. Check admin session and database migration.");
    }
  };

  const submitPuppyHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      await api.post(
        "/api/puppies",
        {
          name: puppyForm.name || "Puppy X",
          sex: puppyForm.sex,
          color: puppyForm.color,
          dateOfBirth: puppyForm.dateOfBirth || null,
          status: puppyForm.status,
          imageUrl: puppyForm.imageUrl,
          description: puppyForm.description,
          litterId: puppyForm.litterId ? parseInt(puppyForm.litterId) : null,
        }
      );

      setAdminMessage("Puppy added.");
      setPuppyForm({
        name: "",
        sex: "Male",
        color: "",
        dateOfBirth: "",
        status: "Available",
        imageUrl: "",
        description: "",
        litterId: "",
      });
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not add puppy. Check admin session and database migration.");
    }
  };

  return (
    <main className={classes.page}>
      <section className={classes.hero}>
        <p className={classes.eyebrow}>Von Apalusso puppies</p>
        <h1>Available puppies and young poodles</h1>
        <p>
          Follow our current and upcoming litters, meet the parents, and ask us
          about puppies that may be the right match for your family.
        </p>
      </section>

      {loading && <p className={classes.statusMessage}>Loading puppies...</p>}

      {authContext.isAdmin && (
        <section className={classes.adminPanel}>
          <div className={classes.sectionHeader}>
            <h2>Admin puppy manager</h2>
            <span>Admin</span>
          </div>
          {adminMessage && <p className={classes.adminMessage}>{adminMessage}</p>}
          <div className={classes.adminForms}>
            <form onSubmit={submitLitterHandler} className={classes.adminForm}>
              <h3>Add litter</h3>
              <label htmlFor="litterName">Litter name</label>
              <input
                id="litterName"
                value={litterForm.name}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Spring 2026 litter"
              />
              <label htmlFor="litterDate">Date of birth</label>
              <input
                id="litterDate"
                type="date"
                value={litterForm.dateOfBirth}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    dateOfBirth: event.target.value,
                  }))
                }
              />
              <label htmlFor="fatherId">Father</label>
              <select
                id="fatherId"
                value={litterForm.fatherId}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    fatherId: event.target.value,
                  }))
                }
              >
                <option value="">To be announced</option>
                {poodles.map((poodle) => (
                  <option key={poodle.id} value={poodle.id}>
                    {poodle.name}
                  </option>
                ))}
              </select>
              <label htmlFor="motherId">Mother</label>
              <select
                id="motherId"
                value={litterForm.motherId}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    motherId: event.target.value,
                  }))
                }
              >
                <option value="">To be announced</option>
                {poodles.map((poodle) => (
                  <option key={poodle.id} value={poodle.id}>
                    {poodle.name}
                  </option>
                ))}
              </select>
              <label htmlFor="litterStatus">Status</label>
              <select
                id="litterStatus"
                value={litterForm.status}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Planned">Planned</option>
                <option value="Born">Born</option>
                <option value="Available">Available</option>
                <option value="Closed">Closed</option>
              </select>
              <label htmlFor="coverImageUrl">Cover image URL</label>
              <input
                id="coverImageUrl"
                value={litterForm.coverImageUrl}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    coverImageUrl: event.target.value,
                  }))
                }
                placeholder="https://..."
              />
              <label htmlFor="litterDescription">Description</label>
              <textarea
                id="litterDescription"
                value={litterForm.description}
                onChange={(event) =>
                  setLitterForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
              <button type="submit">Add litter</button>
            </form>

            <form onSubmit={submitPuppyHandler} className={classes.adminForm}>
              <h3>Add puppy</h3>
              <label htmlFor="puppyName">Name</label>
              <input
                id="puppyName"
                value={puppyForm.name}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Puppy X"
              />
              <label htmlFor="puppyLitterId">Litter</label>
              <select
                id="puppyLitterId"
                value={puppyForm.litterId}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    litterId: event.target.value,
                  }))
                }
              >
                <option value="">Not assigned</option>
                {litters.map((litter) => (
                  <option key={litter.id} value={litter.id}>
                    {litter.name || `Litter ${litter.id}`}
                  </option>
                ))}
              </select>
              <label htmlFor="puppySex">Sex</label>
              <select
                id="puppySex"
                value={puppyForm.sex}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    sex: event.target.value,
                  }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="puppyColor">Color</label>
              <input
                id="puppyColor"
                value={puppyForm.color}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
                placeholder="Red, apricot..."
              />
              <label htmlFor="puppyDate">Date of birth</label>
              <input
                id="puppyDate"
                type="date"
                value={puppyForm.dateOfBirth}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    dateOfBirth: event.target.value,
                  }))
                }
              />
              <label htmlFor="puppyStatus">Status</label>
              <select
                id="puppyStatus"
                value={puppyForm.status}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
              <label htmlFor="puppyImageUrl">Image URL</label>
              <input
                id="puppyImageUrl"
                value={puppyForm.imageUrl}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                placeholder="https://..."
              />
              <label htmlFor="puppyDescription">Description</label>
              <textarea
                id="puppyDescription"
                value={puppyForm.description}
                onChange={(event) =>
                  setPuppyForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
              <button type="submit">Add puppy</button>
            </form>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className={classes.emptyState}>
          <h2>Puppies section is ready</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && litters.length > 0 && (
        <section className={classes.section}>
          <div className={classes.sectionHeader}>
            <h2>Litters</h2>
            <span>{litters.length}</span>
          </div>
          <div className={classes.litterGrid}>
            {litters.map((litter) => (
              <article key={litter.id} className={classes.litterCard}>
                {litter.coverImageUrl && (
                  <img src={litter.coverImageUrl} alt={litter.name} />
                )}
                <div className={classes.cardBody}>
                  <div className={classes.cardTopLine}>
                    <h3>{litter.name || "Upcoming litter"}</h3>
                    <span>{litter.status || "Planned"}</span>
                  </div>
                  <p>{litter.description || "More details coming soon."}</p>
                  <dl>
                    <div>
                      <dt>Born</dt>
                      <dd>{formatDate(litter.dateOfBirth)}</dd>
                    </div>
                    <div>
                      <dt>Father</dt>
                      <dd>{litter.fatherName || "To be announced"}</dd>
                    </div>
                    <div>
                      <dt>Mother</dt>
                      <dd>{litter.motherName || "To be announced"}</dd>
                    </div>
                    <div>
                      <dt>Available</dt>
                      <dd>{litter.availablePuppyCount}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className={classes.section}>
          <div className={classes.sectionHeader}>
            <h2>Puppies</h2>
            <span>{puppies.length}</span>
          </div>
          {puppies.length === 0 ? (
            <div className={classes.emptyState}>
              <h2>No puppies listed right now</h2>
              <p>
                New litters and available puppies will be added here when they
                are ready to be presented.
              </p>
            </div>
          ) : (
            <div className={classes.puppyGrid}>
              {puppies.map((puppy) => (
                <article key={puppy.id} className={classes.puppyCard}>
                  {puppy.imageUrl && <img src={puppy.imageUrl} alt={puppy.name} />}
                  <div className={classes.cardBody}>
                    <div className={classes.cardTopLine}>
                      <h3>{puppy.name || "Puppy X"}</h3>
                      <span>{puppy.status || "Available"}</span>
                    </div>
                    <p>{puppy.description || "Details coming soon."}</p>
                    <dl>
                      <div>
                        <dt>Born</dt>
                        <dd>{formatDate(puppy.dateOfBirth)}</dd>
                      </div>
                      <div>
                        <dt>Sex</dt>
                        <dd>{puppy.sex || "To be confirmed"}</dd>
                      </div>
                      <div>
                        <dt>Color</dt>
                        <dd>{puppy.color || "To be confirmed"}</dd>
                      </div>
                      <div>
                        <dt>Litter</dt>
                        <dd>{puppy.litterName || "Not assigned"}</dd>
                      </div>
                    </dl>
                    <a className={classes.inquiryLink} href="/about">
                      Send an inquiry
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Puppies;
