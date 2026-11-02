import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { LitterModel, PuppyModel } from "../interfaces/IPuppyModel";
import { PoodleModel } from "../interfaces/IPoodleModel";
import AuthContext from "../store/auth-context";
import classes from "./Puppies.module.css";
import Seo from "../components/SEO/Seo";
import PuppyGuide from "../components/PuppyGuide";
import { getApiErrorMessage } from "../api/errorMessage";

const puppyPhotos = (puppy: PuppyModel): string[] =>
  [puppy.imageUrl, puppy.imageUrl2, puppy.imageUrl3].filter((url): url is string => !!url);

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
  const [puppyFiles, setPuppyFiles] = useState<File[]>([]);
  const [savingPuppy, setSavingPuppy] = useState(false);
  const puppyPhotoInputRef = useRef<HTMLInputElement>(null);
  const puppiesDescription =
    "Available and upcoming red toy and miniature poodle puppies from Von Apalusso kennel in Serbia.";
  const puppiesStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Available red toy and miniature poodle puppies",
    url: "https://poodlesvonapalusso.com/puppies",
    description: puppiesDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "Poodles Von Apalusso",
      url: "https://poodlesvonapalusso.com/",
    },
  };

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
    setPuppyFiles([]);
    if (puppyPhotoInputRef.current) puppyPhotoInputRef.current.value = "";
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
    dateOfBirth: puppyForm.litterId
      ? litters.find((litter) => String(litter.id) === puppyForm.litterId)?.dateOfBirth || null
      : puppyForm.dateOfBirth || null,
    status: puppyForm.status,
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

    const existingPuppy = puppies.find((puppy) => puppy.id === editingPuppyId);
    const remainingSlots = 3 - (existingPuppy ? puppyPhotos(existingPuppy).length : 0);
    if (puppyFiles.length > remainingSlots) {
      setAdminMessage(`Choose at most ${remainingSlots} more photos.`);
      return;
    }
    if (puppyFiles.some((file) => file.size === 0 || file.size > 5 * 1024 * 1024)) {
      setAdminMessage("Each photo must be between 1 byte and 5 MB.");
      return;
    }

    setSavingPuppy(true);
    let savedPuppyId: number | null = null;

    try {
      if (editingPuppyId) {
        await api.put(`/api/puppies/${editingPuppyId}`, getPuppyPayload());
        savedPuppyId = editingPuppyId;
      } else {
        const response = await api.post<PuppyModel>("/api/puppies", getPuppyPayload());
        savedPuppyId = response.data.id;
      }

      if (puppyFiles.length > 0) {
        const data = new FormData();
        puppyFiles.forEach((file) => data.append("photos", file));
        await api.post(`/api/puppies/${savedPuppyId}/photos`, data);
      }

      setAdminMessage(editingPuppyId ? "Puppy updated." : "Puppy added.");
      resetPuppyForm();
      await fetchPuppies();
    } catch (requestError) {
      if (savedPuppyId && !editingPuppyId) setEditingPuppyId(savedPuppyId);
      setAdminMessage(getApiErrorMessage(requestError, {
        fallback: savedPuppyId
          ? "Puppy details were saved, but photos could not be uploaded. Try saving again."
          : "Could not save puppy. Please try again.",
      }));
      if (savedPuppyId) await fetchPuppies();
    } finally {
      setSavingPuppy(false);
    }
  };

  const deletePuppyPhoto = async (puppy: PuppyModel, slot: number) => {
    if (!window.confirm(`Remove photo ${slot} from ${puppy.name || "this puppy"}?`)) return;
    try {
      await api.delete(`/api/puppies/${puppy.id}/photos/${slot}`);
      setAdminMessage("Photo removed.");
      await fetchPuppies();
    } catch (requestError) {
      setAdminMessage(getApiErrorMessage(requestError, { fallback: "Could not remove photo." }));
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
    setPuppyFiles([]);
    if (puppyPhotoInputRef.current) puppyPhotoInputRef.current.value = "";
    setPuppyForm({
      name: puppy.name ?? "",
      sex: puppy.sex ?? "Male",
      color: puppy.color ?? "",
      dateOfBirth: toDateInputValue(puppy.dateOfBirth),
      status: puppy.status ?? "Available",
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
    <>
      <Seo
        title="Available red toy and miniature poodle puppies | Von Apalusso"
        description={puppiesDescription}
        canonical="https://poodlesvonapalusso.com/puppies"
        structuredData={puppiesStructuredData}
      />
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
                {poodles.filter((poodle) =>
                  poodle.sex?.trim().toLowerCase() === "female"
                  || String(poodle.id) === litterForm.motherId
                ).map((poodle) => (
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
              {puppyForm.litterId ? (
                <p className={classes.fieldNote}>
                  Date of birth comes from the selected litter: {formatDate(
                    litters.find((litter) => String(litter.id) === puppyForm.litterId)?.dateOfBirth
                  )}.
                </p>
              ) : (
                <>
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
                </>
              )}
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
              {editingPuppyId && (() => {
                const current = puppies.find((puppy) => puppy.id === editingPuppyId);
                return current && puppyPhotos(current).length > 0 ? (
                  <div className={classes.photoManager}>
                    <span>Current photos ({puppyPhotos(current).length}/3)</span>
                    <div className={classes.photoManagerGrid}>
                      {puppyPhotos(current).map((url, index) => (
                        <div key={url}>
                          <img src={url} alt={`${current.name || "Puppy"} photo ${index + 1}`} />
                          <button type="button" onClick={() => deletePuppyPhoto(current, index + 1)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
              <label htmlFor="puppyPhotos">Photos (up to 3, 5 MB each)</label>
              <input
                ref={puppyPhotoInputRef}
                id="puppyPhotos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={editingPuppyId !== null && puppyPhotos(puppies.find((puppy) => puppy.id === editingPuppyId) || { id: 0 }).length === 3}
                onChange={(event) => setPuppyFiles(Array.from(event.target.files || []))}
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
              <button type="submit" disabled={savingPuppy}>
                {savingPuppy ? "Saving..." : editingPuppyId ? "Save puppy" : "Add puppy"}
              </button>
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
                  <a className={classes.imageLink} href={litter.coverImageUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open full image of ${litter.name || "litter"}`}>
                    <img
                      src={litter.coverImageUrl}
                      alt={`${litter.name || "Upcoming litter"} from Von Apalusso poodle kennel`}
                      loading="lazy"
                    />
                  </a>
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
                  {puppy.imageUrl && (
                    <Link className={classes.imageLink} to={`/puppies/${puppy.id}`} aria-label={`View ${puppy.name || "puppy"} profile`}>
                      <img
                        src={puppy.imageUrl}
                        alt={`${puppy.name || "Puppy"}, ${puppy.color || "poodle"} puppy from Von Apalusso kennel`}
                        loading="lazy"
                      />
                    </Link>
                  )}
                  <div className={classes.cardBody}>
                    <div className={classes.cardTopLine}>
                      <h3>{puppy.name || "Puppy X"}</h3>
                      <span>{puppy.status || "Available"}</span>
                    </div>
                    <p>{puppy.description || "Details coming soon."}</p>
                    <dl>
                      <div>
                        <dt>Born</dt>
                        <dd>{formatDate(puppy.litterId
                          ? litters.find((litter) => litter.id === puppy.litterId)?.dateOfBirth
                          : puppy.dateOfBirth)}</dd>
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
                    <Link className={classes.inquiryLink} to={`/puppies/${puppy.id}`}>
                      View puppy and photos
                    </Link>
                    {authContext.isAdmin && (
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
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      <PuppyGuide />
      </main>
    </>
  );
};

export default Puppies;
