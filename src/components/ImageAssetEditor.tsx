import React, { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import classes from "./ImageAssetEditor.module.css";

export type ImageRecord = {
  id: number;
  name: string | null;
  url: string | null;
  pedigreeUrl: string | null;
};

type Props = {
  image: ImageRecord;
  onSaved: (image: ImageRecord) => void;
  onCancel?: () => void;
};

const ImageAssetEditor = ({ image, onSaved, onCancel }: Props) => {
  const [name, setName] = useState(image.name ?? "");
  const [url, setUrl] = useState(image.url ?? "");
  const [pedigreeUrl, setPedigreeUrl] = useState(image.pedigreeUrl ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [pedigree, setPedigree] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);
  const pedigreeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(image.name ?? "");
    setUrl(image.url ?? "");
    setPedigreeUrl(image.pedigreeUrl ?? "");
    setPhoto(null);
    setPedigree(null);
    setError("");
    setMessage("");
  }, [image.id]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ([photo, pedigree].some((file) => file && file.size > 5 * 1024 * 1024)) {
      setError("Each file must be 5 MB or smaller.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = new FormData();
      data.append("name", name.trim());
      data.append("url", url.trim());
      data.append("pedigreeUrl", pedigreeUrl.trim());
      if (photo) data.append("photo", photo);
      if (pedigree) data.append("pedigree", pedigree);

      const response = await api.put<ImageRecord>(`/api/Images/${image.id}/manage`, data);
      setName(response.data.name ?? "");
      setUrl(response.data.url ?? "");
      setPedigreeUrl(response.data.pedigreeUrl ?? "");
      setPhoto(null);
      setPedigree(null);
      if (photoInput.current) photoInput.current.value = "";
      if (pedigreeInput.current) pedigreeInput.current.value = "";
      setMessage("Photo and pedigree details saved.");
      onSaved(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, { fallback: "Could not save image details." }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={submit}>
      <p className={classes.hint}>Photo and pedigree are independent. Choose a file to replace either one, or edit its URL. A selected file takes priority over the URL field.</p>
      <label className={classes.field}>
        <span>Image name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} required />
      </label>
      <label className={classes.field}>
        <span>Photo URL</span>
        <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} required={!photo} />
      </label>
      <label className={classes.field}>
        <span>Replace photo (optional, JPG/PNG/WebP, up to 5 MB)</span>
        <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
      </label>
      <label className={classes.field}>
        <span>Pedigree image URL (leave empty to remove)</span>
        <input type="url" value={pedigreeUrl} onChange={(event) => setPedigreeUrl(event.target.value)} />
      </label>
      <label className={classes.field}>
        <span>Replace pedigree image (optional, JPG/PNG/WebP, up to 5 MB)</span>
        <input ref={pedigreeInput} type="file" accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPedigree(event.target.files?.[0] ?? null)} />
      </label>
      <p className={classes.hint}>This image entry may be used by more than one poodle. Changes to it appear wherever it is assigned.</p>
      {error && <p className={classes.error} role="alert">{error}</p>}
      {message && <p className={classes.success} role="status">{message}</p>}
      <div className={classes.actions}>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save photo and pedigree"}</button>
        {onCancel && <button type="button" className={classes.secondary} disabled={saving} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default ImageAssetEditor;
