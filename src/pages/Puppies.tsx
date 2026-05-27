import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { LitterModel, PuppyModel } from "../interfaces/IPuppyModel";
import { PoodleModel } from "../interfaces/IPoodleModel";
import AuthContext from "../store/auth-context";
import classes from "./Puppies.module.css";

type LitterFormState = {
  name: string;
  dateOfBirth: string;
  fatherId: string;
  motherId: string;
  status: string;
  coverImageUrl: string;
  description: string;
};

type PuppyFormState = {
  name: string;
  sex: string;
  color: string;
  dateOfBirth: string;
  status: string;
  imageUrl: string;
  description: string;
  litterId: string;
};

const emptyLitterForm: LitterFormState = {
  name: "",
  dateOfBirth: "",
  fatherId: "",
  motherId: "",
  status: "Available",
  coverImageUrl: "",
  description: "",
};

const emptyPuppyForm: PuppyFormState = {
  name: "",
  sex: "Male",
  color: "",
  dateOfBirth: "",
  status: "Available",
  imageUrl: "",
  description: "",
  litterId: "",
};

const toDateInputValue = (value?: string) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
};

const Puppies: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [puppies, setPuppies] = useState<PuppyModel[]>([]);
  const [litters, setLitters] = useState<LitterModel[]>([]);
  const [poodles, setPoodles] = useState<PoodleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [editingLitterId, setEditingLitterId] = useState<number | null>(null);
  const [editingPuppyId, setEditingPuppyId] = useState<number | null>(null);
  const adminPanelRef = useRef<HTMLElement>(null);

  const [litterForm, setLitterForm] = useState<LitterFormState>(emptyLitterForm);
  const [puppyForm, setPuppyForm] = useState<PuppyFormState>(emptyPuppyForm);

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

  const resetLitterForm = () => {
    setEditingLitterId(null);
    setLitterForm(emptyLitterForm);
  };

  const resetPuppyForm = () => {
    setEditingPuppyId(null);
    setPuppyForm(emptyPuppyForm);
  };

  const getLitterPayload = () => ({
    name: litterForm.name,
    dateOfBirth: litterForm.dateOfBirth || null,
    fatherId: litterForm.fatherId ? parseInt(litterForm.fatherId) : null,
    motherId: litterForm.motherId ? parseInt(litterForm.motherId) : null,
    status: litterForm.status,
    coverImageUrl: litterForm.coverImageUrl,
    description: litterForm.description,
  });

  const getPuppyPayload = () => ({
    name: puppyForm.name || "Puppy X",
    sex: puppyForm.sex,
    color: puppyForm.color,
    dateOfBirth: puppyForm.dateOfBirth || null,
    status: puppyForm.status,
    imageUrl: puppyForm.imageUrl,
    description: puppyForm.description,
    litterId: puppyForm.litterId ? parseInt(puppyForm.litterId) : null,
  });

  const scrollToAdminPanel = () => {
    window.requestAnimationFrame(() => {
      adminPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const submitLitterHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      if (editingLitterId) {
        await api.put(`/api/puppies/litters/${editingLitterId}`, getLitterPayload());
        setAdminMessage("Litter updated.");
      } else {
        await api.post("/api/puppies/litters", getLitterPayload());
        setAdminMessage("Litter added.");
      }

      resetLitterForm();
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not save litter. Check admin session and database migration.");
    }
  };

  const submitPuppyHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      if (editingPuppyId) {
        await api.put(`/api/puppies/${editingPuppyId}`, getPuppyPayload());
        setAdminMessage("Puppy updated.");
      } else {
        await api.post("/api/puppies", getPuppyPayload());
        setAdminMessage("Puppy added.");
      }

      resetPuppyForm();
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not save puppy. Check admin session and database migration.");
    }
  };

  const startLitterEdit = (litter: LitterModel) => {
    setEditingLitterId(litter.id);
    setLitterForm({
      name: litter.name ?? "",
      dateOfBirth: toDateInputValue(litter.dateOfBirth),
      fatherId: litter.fatherId ? String(litter.fatherId) : "",
      motherId: litter.motherId ? String(litter.motherId) : "",
      status: litter.status ?? "Available",
      coverImageUrl: litter.coverImageUrl ?? "",
      description: litter.description ?? "",
    });
    setAdminMessage(`Editing ${litter.name || `litter ${litter.id}`}.`);
    scrollToAdminPanel();
  };

  const startPuppyEdit = (puppy: PuppyModel) => {
    setEditingPuppyId(puppy.id);
    setPuppyForm({
      name: puppy.name ?? "",
      sex: puppy.sex ?? "Male",
      color: puppy.color ?? "",
      dateOfBirth: toDateInputValue(puppy.dateOfBirth),
      status: puppy.status ?? "Available",
      imageUrl: puppy.imageUrl ?? "",
      description: puppy.description ?? "",
      litterId: puppy.litterId ? String(puppy.litterId) : "",
    });
    setAdminMessage(`Editing ${puppy.name || `puppy ${puppy.id}`}.`);
    scrollToAdminPanel();
  };

  const deleteLitterHandler = async (litter: LitterModel) => {
    if (!window.confirm(`Delete ${litter.name || "this litter"}? Puppies will stay listed without this litter.`)) {
      return;
    }

    try {
      await api.delete(`/api/puppies/litters/${litter.id}`);
      if (editingLitterId === litter.id) {
        resetLitterForm();
      }
      setAdminMessage("Litter deleted.");
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not delete litter.");
    }
  };

  const deletePuppyHandler = async (puppy: PuppyModel) => {
    if (!window.confirm(`Delete ${puppy.name || "this puppy"}?`)) {
      return;
    }

    try {
      await api.delete(`/api/puppies/${puppy.id}`);
      if (editingPuppyId === puppy.id) {
        resetPuppyForm();
      }
      setAdminMessage("Puppy deleted.");
      fetchPuppies();
    } catch (requestError) {
      console.log(requestError);
      setAdminMessage("Could not delete puppy.");
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
        <section className={classes.adminPanel} ref={adminPanelRef}>
          <div className={classes.sectionHeader}>
            <h2>Admin puppy manager</h2>
            <span>Admin</span>
          </div>
          {adminMessage && <p className={classes.adminMessage}>{adminMessage}</p>}
          <div className={classes.adminForms}>
            <form onSubmit={submitLitterHandler} className={classes.adminForm}>
              <div className={classes.formHeader}>
                <h3>{editingLitterId ? "Edit litter" : "Add litter"}</h3>
                {editingLitterId && (
                  <button type="button" className={classes.secondaryButton} onClick={resetLitterForm}>
                    Cancel
                  </button>
                )}
              </div>
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
              <button type="submit">{editingLitterId ? "Save litter" : "Add litter"}</button>
            </form>

            <form onSubmit={submitPuppyHandler} className={classes.adminForm}>
              <div className={classes.formHeader}>
                <h3>{editingPuppyId ? "Edit puppy" : "Add puppy"}</h3>
                {editingPuppyId && (
                  <button type="button" className={classes.secondaryButton} onClick={resetPuppyForm}>
                    Cancel
                  </button>
                )}
              </div>
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
              <button type="submit">{editingPuppyId ? "Save puppy" : "Add puppy"}</button>
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
                      <dd>
                        {litter.fatherId && litter.fatherName ? (
                          <Link className={classes.poodleLink} to={`/poodles/${litter.fatherId}`}>
                            {litter.fatherName}
                          </Link>
                        ) : (
                          "To be announced"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Mother</dt>
                      <dd>
                        {litter.motherId && litter.motherName ? (
                          <Link className={classes.poodleLink} to={`/poodles/${litter.motherId}`}>
                            {litter.motherName}
                          </Link>
                        ) : (
                          "To be announced"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Available</dt>
                      <dd>{litter.availablePuppyCount}</dd>
                    </div>
                  </dl>
                  {authContext.isAdmin && (
                    <div className={classes.cardActions}>
                      <button type="button" onClick={() => startLitterEdit(litter)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={classes.dangerButton}
                        onClick={() => deleteLitterHandler(litter)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
                    {authContext.isAdmin ? (
                      <div className={classes.cardActions}>
                        <button type="button" onClick={() => startPuppyEdit(puppy)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className={classes.dangerButton}
                          onClick={() => deletePuppyHandler(puppy)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <a className={classes.inquiryLink} href="/about">
                        Send an inquiry
                      </a>
                    )}
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
