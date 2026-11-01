import React, { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "./ImageUr.module.css";

type ImageRecord = { id: number; name: string | null; url: string | null; pedigreeUrl: string | null };

const ImagePage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [pedigree, setPedigree] = useState<File | null>(null);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", url: "", pedigreeUrl: "" });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pedigreeInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    pedigreeUrl: "",
  });

  const loadImages = async () => {
    try {
      const response = await api.get<ImageRecord[]>("/api/Images");
      setImages(response.data.slice().sort((a, b) => b.id - a.id));
      setListError("");
    } catch (requestError) {
      setListError(getApiErrorMessage(requestError, { fallback: "Could not load images." }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadImages(); }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "upload" && !photo) {
      setError("Choose a photo first.");
      return;
    }

    if ([photo, pedigree].some((file) => file && file.size > 5 * 1024 * 1024)) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (mode === "upload") {
        const data = new FormData();
        data.append("name", form.name.trim());
        data.append("photo", photo!);
        if (pedigree) data.append("pedigree", pedigree);
        await api.post("/api/Images/upload", data);
      } else {
        await api.post("/api/Images", form);
      }

      setMessage("Image added. You can now select it when adding or editing a poodle.");
      setForm({
        name: "",
        url: "",
        pedigreeUrl: "",
      });
      setPhoto(null);
      setPedigree(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
      if (pedigreeInputRef.current) pedigreeInputRef.current.value = "";
      await loadImages();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, {
        fallback: "Could not add image. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (image: ImageRecord) => {
    setEditingId(image.id);
    setEditForm({ name: image.name ?? "", url: image.url ?? "", pedigreeUrl: image.pedigreeUrl ?? "" });
    setListError("");
  };

  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId === null) return;
    setBusyId(editingId);
    setListError("");
    try {
      await api.put(`/api/Images/${editingId}`, {
        name: editForm.name.trim(),
        url: editForm.url.trim(),
        pedigreeUrl: editForm.pedigreeUrl.trim() || null,
      });
      setEditingId(null);
      await loadImages();
      setMessage("Image updated.");
    } catch (requestError) {
      setListError(getApiErrorMessage(requestError, { fallback: "Could not update image." }));
    } finally {
      setBusyId(null);
    }
  };

  const deleteImage = async (image: ImageRecord) => {
    if (!window.confirm(`Delete image "${image.name || image.id}"? This cannot be undone.`)) return;
    setBusyId(image.id);
    setListError("");
    try {
      await api.delete(`/api/Images/${image.id}`);
      setImages((current) => current.filter((entry) => entry.id !== image.id));
      if (editingId === image.id) setEditingId(null);
      setMessage("Image deleted.");
    } catch (requestError) {
      setListError(getApiErrorMessage(requestError, {
        fallback: "Could not delete image.",
        statusMessages: { 409: "This image is assigned to a poodle. Change the poodle's image first." },
      }));
    } finally {
      setBusyId(null);
    }
  };

  const visibleImages = images.filter((image) =>
    `${image.name ?? ""} ${image.id}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <main className={classes.page}>
      <section className={classes.panel}>
        <div className={classes.header}>
          <p>Admin</p>
          <h1>Add image</h1>
        </div>
        {message && <p className={classes.message}>{message}</p>}
        {error && <p className={classes.error}>{error}</p>}
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.field}>
            <label htmlFor="image-mode">Image source</label>
            <select
              id="image-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value as "upload" | "url")}
              disabled={saving}
            >
              <option value="upload">Upload from computer</option>
              <option value="url">Use an existing image URL</option>
            </select>
          </div>
          <div className={classes.field}>
            <label htmlFor="name">Image name</label>
            <input id="name" name="name" value={form.name} onChange={changeHandler} required />
          </div>
          {mode === "upload" ? (
            <>
              <div className={classes.field}>
                <label htmlFor="photo">Photo (JPG, PNG or WebP, up to 5 MB)</label>
                <input id="photo" ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" required
                  onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
              </div>
              <div className={classes.field}>
                <label htmlFor="pedigree">Pedigree image (optional, up to 5 MB)</label>
                <input id="pedigree" ref={pedigreeInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setPedigree(event.target.files?.[0] ?? null)} />
              </div>
            </>
          ) : (
            <>
              <div className={classes.field}>
                <label htmlFor="url">Image URL</label>
                <input id="url" name="url" type="url" value={form.url} onChange={changeHandler} required />
              </div>
              <div className={classes.field}>
                <label htmlFor="pedigreeUrl">Pedigree URL</label>
                <input id="pedigreeUrl" name="pedigreeUrl" type="url" value={form.pedigreeUrl}
                  onChange={changeHandler} />
              </div>
            </>
          )}
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add image"}
          </button>
        </form>
      </section>
      <section className={`${classes.panel} ${classes.listPanel}`}>
        <div className={classes.header}>
          <p>Admin</p>
          <h2>Manage images</h2>
        </div>
        <div className={classes.field}>
          <label htmlFor="image-search">Search by name or ID</label>
          <input id="image-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {listError && <p role="alert" className={classes.error}>{listError}</p>}
        {loading ? <p>Loading images...</p> : visibleImages.length === 0 ? <p>No images found.</p> : (
          <div className={classes.imageList}>
            {visibleImages.map((image) => (
              <article className={classes.imageCard} key={image.id}>
                <div className={classes.imageSummary}>
                  {image.url && <img src={image.url} alt={image.name || `Image ${image.id}`} loading="lazy" />}
                  <div>
                    <h3>{image.name || `Image ${image.id}`}</h3>
                    <p>ID: {image.id}</p>
                    {image.pedigreeUrl && <a href={image.pedigreeUrl} target="_blank" rel="noreferrer">View pedigree</a>}
                  </div>
                </div>
                {editingId === image.id ? (
                  <form className={classes.form} onSubmit={saveEdit}>
                    <div className={classes.field}>
                      <label htmlFor={`edit-name-${image.id}`}>Image name</label>
                      <input id={`edit-name-${image.id}`} value={editForm.name} required
                        onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} />
                    </div>
                    <div className={classes.field}>
                      <label htmlFor={`edit-url-${image.id}`}>Image URL</label>
                      <input id={`edit-url-${image.id}`} type="url" value={editForm.url} required
                        onChange={(event) => setEditForm((current) => ({ ...current, url: event.target.value }))} />
                    </div>
                    <div className={classes.field}>
                      <label htmlFor={`edit-pedigree-${image.id}`}>Pedigree URL</label>
                      <input id={`edit-pedigree-${image.id}`} type="url" value={editForm.pedigreeUrl}
                        onChange={(event) => setEditForm((current) => ({ ...current, pedigreeUrl: event.target.value }))} />
                    </div>
                    <div className={classes.actions}>
                      <button type="submit" disabled={busyId !== null}>Save</button>
                      <button type="button" className={classes.secondaryButton} disabled={busyId !== null}
                        onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className={classes.actions}>
                    <button type="button" disabled={busyId !== null} onClick={() => startEditing(image)}>Edit</button>
                    <button type="button" className={classes.deleteButton} disabled={busyId !== null}
                      onClick={() => void deleteImage(image)}>Delete</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ImagePage;
