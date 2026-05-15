import React, { useState } from "react";
import api from "../api/client";
import classes from "./ImageUr.module.css";

const ImagePage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
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
    setSaving(true);
    setMessage("");

    try {
      await api.post("/api/Images", form);
      setMessage("Image added.");
      setForm({
        name: "",
        url: "",
        pedigreeUrl: "",
      });
    } catch (error) {
      console.log(error);
      setMessage("Could not add image.");
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
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.field}>
            <label htmlFor="name">Image name</label>
            <input id="name" name="name" value={form.name} onChange={changeHandler} required />
          </div>
          <div className={classes.field}>
            <label htmlFor="url">Image URL</label>
            <input id="url" name="url" value={form.url} onChange={changeHandler} required />
          </div>
          <div className={classes.field}>
            <label htmlFor="pedigreeUrl">Pedigree URL</label>
            <input
              id="pedigreeUrl"
              name="pedigreeUrl"
              value={form.pedigreeUrl}
              onChange={changeHandler}
            />
          </div>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add image"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ImagePage;
