import React, { useRef, useState } from "react";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "./ImageUr.module.css";

const ImagePage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [pedigree, setPedigree] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pedigreeInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    pedigreeUrl: "",
  });

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
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, {
        fallback: "Could not add image. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

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
    </main>
  );
};

export default ImagePage;
