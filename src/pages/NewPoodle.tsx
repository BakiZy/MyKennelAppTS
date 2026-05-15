import React, { useContext, useState } from "react";
import api from "../api/client";
import classes from "./NewPoodle.module.css";
import AuthContext from "../store/auth-context";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import useGetImgUr from "../hooks/getImgUrHook";

const NewPoodle: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { images } = useGetImgUr();
  const { sizes } = useGetSizes();
  const { colors } = useGetColors();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    pedigreeNumber: "",
    sex: "Female",
    geneticTests: false,
    poodleSizeId: "",
    poodleColorId: "",
    imageId: "",
  });

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = event.target;
    const checked =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : false;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.post("/api/poodles", {
        name: form.name,
        dateOfBirth: form.dateOfBirth,
        geneticTests: form.geneticTests,
        imageId: form.imageId ? parseInt(form.imageId) : null,
        pedigreeNumber: form.pedigreeNumber,
        poodleSizeId: form.poodleSizeId ? parseInt(form.poodleSizeId) : null,
        poodleColorId: form.poodleColorId ? parseInt(form.poodleColorId) : null,
        sex: form.sex,
      });

      setMessage("Poodle added.");
      setForm({
        name: "",
        dateOfBirth: "",
        pedigreeNumber: "",
        sex: "Female",
        geneticTests: false,
        poodleSizeId: "",
        poodleColorId: "",
        imageId: "",
      });
    } catch (error) {
      console.log(error);
      setMessage("Could not add poodle.");
    } finally {
      setSaving(false);
    }
  };

  if (!authContext.isAdmin) {
    return <main className={classes.page}>You are not authorized to access this page.</main>;
  }

  return (
    <main className={classes.page}>
      <section className={classes.panel}>
        <div className={classes.header}>
          <p>Admin</p>
          <h1>Add poodle</h1>
        </div>
        {message && <p className={classes.message}>{message}</p>}
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.field}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={changeHandler} required />
          </div>

          <div className={classes.field}>
            <label htmlFor="pedigreeNumber">Pedigree number</label>
            <input
              id="pedigreeNumber"
              name="pedigreeNumber"
              value={form.pedigreeNumber}
              onChange={changeHandler}
              minLength={5}
              maxLength={13}
              required
            />
          </div>

          <div className={classes.grid}>
            <div className={classes.field}>
              <label htmlFor="dateOfBirth">Date of birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={changeHandler}
                required
              />
            </div>
            <div className={classes.field}>
              <label htmlFor="sex">Sex</label>
              <select id="sex" name="sex" value={form.sex} onChange={changeHandler}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className={classes.grid}>
            <div className={classes.field}>
              <label htmlFor="poodleSizeId">Size</label>
              <select
                id="poodleSizeId"
                name="poodleSizeId"
                value={form.poodleSizeId}
                onChange={changeHandler}
              >
                <option value="">Select size</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={classes.field}>
              <label htmlFor="poodleColorId">Color</label>
              <select
                id="poodleColorId"
                name="poodleColorId"
                value={form.poodleColorId}
                onChange={changeHandler}
              >
                <option value="">Select color</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={classes.field}>
            <label htmlFor="imageId">Image</label>
            <select id="imageId" name="imageId" value={form.imageId} onChange={changeHandler}>
              <option value="">Select image</option>
              {images.map((image) => (
                <option key={image.id} value={image.id}>
                  {image.name}
                </option>
              ))}
            </select>
          </div>

          <label className={classes.checkbox}>
            <input
              type="checkbox"
              name="geneticTests"
              checked={form.geneticTests}
              onChange={changeHandler}
            />
            Genetic tests completed
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add poodle"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewPoodle;
