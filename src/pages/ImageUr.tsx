import React, { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import ImageAssetEditor, { ImageRecord } from "../components/ImageAssetEditor";
import classes from "./ImageUr.module.css";

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
  const [sliderIds, setSliderIds] = useState<number[]>([]);
  const [savedSliderIds, setSavedSliderIds] = useState<number[]>([]);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [sliderSaving, setSliderSaving] = useState(false);
  const [sliderMessage, setSliderMessage] = useState("");
  const [sliderError, setSliderError] = useState("");
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

  useEffect(() => {
    api.get<Array<{ id: number }>>("/api/Images/about-slider")
      .then((response) => {
        const ids = response.data.map((image) => image.id);
        setSliderIds(ids);
        setSavedSliderIds(ids);
      })
      .catch(() => setSliderError("Could not load the About slider selection."))
      .finally(() => setSliderLoading(false));
  }, []);

  const toggleSliderImage = (id: number) => {
    setSliderMessage("");
    setSliderError("");
    setSliderIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 20 ? [...current, id] : current);
  };

  const moveSliderImage = (index: number, direction: -1 | 1) => {
    setSliderIds((current) => {
      const next = [...current];
      const other = index + direction;
      if (other < 0 || other >= next.length) return current;
      [next[index], next[other]] = [next[other], next[index]];
      return next;
    });
    setSliderMessage("");
  };

  const saveSlider = async () => {
    setSliderSaving(true);
    setSliderMessage("");
    setSliderError("");
    try {
      await api.put("/api/Images/about-slider", { imageIds: sliderIds });
      setSavedSliderIds([...sliderIds]);
      setSliderMessage("About slider saved. The public page updates immediately.");
    } catch (requestError) {
      setSliderError(getApiErrorMessage(requestError, { fallback: "Could not save the About slider." }));
    } finally {
      setSliderSaving(false);
    }
  };

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

      setMessage("Image added. You can now select it for the About slider or a poodle.");
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
    setListError("");
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
        statusMessages: { 409: "This image is assigned to a poodle or used in the About slider. Remove it from use first." },
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
      <section className={`${classes.panel} ${classes.listPanel}`} aria-labelledby="about-slider-heading">
        <div className={classes.header}>
          <p>Admin</p>
          <h2 id="about-slider-heading">About page slider</h2>
        </div>
        <p>Upload a photo above or choose existing images below. Select up to 20 and set their display order.</p>
        {sliderError && <p role="alert" className={classes.error}>{sliderError}</p>}
        {sliderMessage && <p role="status" className={classes.message}>{sliderMessage}</p>}
        {sliderLoading ? <p>Loading slider selection...</p> : (
          <>
            <p>{sliderIds.length} selected</p>
            {sliderIds.length > 0 && <ol className={classes.sliderSelection}>
              {sliderIds.map((id, index) => {
                const image = images.find((item) => item.id === id);
                return <li key={id}>
                  {image?.url && <img src={image.url} alt="" />}
                  <span>{image?.name || `Image ${id}`}</span>
                  <div className={classes.sliderControls}>
                    <button type="button" onClick={() => moveSliderImage(index, -1)} disabled={index === 0} aria-label={`Move ${image?.name || `image ${id}`} earlier`}>↑</button>
                    <button type="button" onClick={() => moveSliderImage(index, 1)} disabled={index === sliderIds.length - 1} aria-label={`Move ${image?.name || `image ${id}`} later`}>↓</button>
                    <button type="button" onClick={() => toggleSliderImage(id)} aria-label={`Remove ${image?.name || `image ${id}`} from slider`}>Remove</button>
                  </div>
                </li>;
              })}
            </ol>}
            <button className={classes.saveSliderButton} type="button" onClick={() => void saveSlider()}
              disabled={sliderSaving || sliderIds.join(",") === savedSliderIds.join(",")}>
              {sliderSaving ? "Saving..." : "Save slider selection"}
            </button>
          </>
        )}
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
                {image.url && <label className={classes.sliderCheckbox}>
                  <input type="checkbox" checked={sliderIds.includes(image.id)}
                    disabled={sliderLoading || sliderSaving || (!sliderIds.includes(image.id) && sliderIds.length >= 20)}
                    onChange={() => toggleSliderImage(image.id)} />
                  Show in About slider
                </label>}
                <div className={classes.imageSummary}>
                  {image.url && <img src={image.url} alt={image.name || `Image ${image.id}`} loading="lazy" />}
                  <div>
                    <h3>{image.name || `Image ${image.id}`}</h3>
                    <p>ID: {image.id}</p>
                    {image.pedigreeUrl && <a href={image.pedigreeUrl} target="_blank" rel="noreferrer">View pedigree</a>}
                  </div>
                </div>
                {editingId === image.id ? (
                  <ImageAssetEditor image={image} onCancel={() => setEditingId(null)}
                    onSaved={(updated) => {
                      setImages((current) => current.map((item) => item.id === updated.id ? updated : item));
                      setMessage("Image updated.");
                    }} />
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
