import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../store/auth-context";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import useGetImgUr from "../hooks/getImgUrHook";
import api from "../api/client";
import { PoodleModel } from "../interfaces/IPoodleModel";
import classes from "./Edit.module.css";
import ImageAssetEditor, { ImageRecord } from "../components/ImageAssetEditor";
import { getApiErrorMessage } from "../api/errorMessage";

const toInputDate = (value: string | Date) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const EditPoodle: React.FC = () => {
  const { poodleId } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { images } = useGetImgUr();
  const { sizes } = useGetSizes();
  const { colors } = useGetColors();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedImageId, setSavedImageId] = useState("");
  const [imageOverride, setImageOverride] = useState<ImageRecord | null>(null);
  const [extraPhotos, setExtraPhotos] = useState<(string | null)[]>([null, null]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [savingPhotos, setSavingPhotos] = useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    pedigreeNumber: "",
    sex: "Female",
    geneticTests: false,
    description: "",
    descriptionSr: "",
    isRetired: false,
    poodleSizeId: "",
    poodleColorId: "",
    imageId: "",
  });

  useEffect(() => {
    const fetchPoodle = async () => {
      try {
        const response = await api.get<PoodleModel>(`/api/poodles/${poodleId}`);
        const poodle = response.data;

        setForm({
          name: poodle.name ?? "",
          dateOfBirth: toInputDate(poodle.dateOfBirth),
          pedigreeNumber: poodle.pedigreeNumber ?? "",
          sex: poodle.sex || "Female",
          geneticTests: !!poodle.geneticTests,
          description: poodle.description ?? "",
          descriptionSr: poodle.descriptionSr ?? "",
          isRetired: !!poodle.isRetired,
          poodleSizeId: poodle.poodleSizeId ? poodle.poodleSizeId.toString() : "",
          poodleColorId: poodle.poodleColorId ? poodle.poodleColorId.toString() : "",
          imageId: poodle.imageId ? poodle.imageId.toString() : "",
        });
        setSavedImageId(poodle.imageId ? poodle.imageId.toString() : "");
        setImageOverride(null);
        setExtraPhotos([poodle.imageUrl2 ?? null, poodle.imageUrl3 ?? null]);
      } catch (error) {
        console.log(error);
        setMessage("Could not load poodle.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoodle();
  }, [poodleId]);

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = event.target;
    const checked =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : false;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "imageId") setImageOverride(null);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.put(`/api/poodles/${poodleId}`, {
        name: form.name,
        dateOfBirth: form.dateOfBirth,
        geneticTests: form.geneticTests,
        description: form.description,
        descriptionSr: form.descriptionSr,
        isRetired: form.isRetired,
        imageId: form.imageId ? parseInt(form.imageId) : null,
        pedigreeNumber: form.pedigreeNumber,
        poodleSizeId: form.poodleSizeId ? parseInt(form.poodleSizeId) : null,
        poodleColorId: form.poodleColorId ? parseInt(form.poodleColorId) : null,
        sex: form.sex,
      });

      setMessage("Poodle updated.");
      setSavedImageId(form.imageId);
    } catch (error) {
      console.log(error);
      setMessage("Could not update poodle.");
    } finally {
      setSaving(false);
    }
  };

  const uploadPhotos = async () => {
    const freeSlots = extraPhotos.filter((url) => !url).length;
    if (!photoFiles.length || photoFiles.length > freeSlots || photoFiles.some((file) => file.size === 0 || file.size > 5 * 1024 * 1024)) {
      setMessage(`Choose 1 to ${freeSlots} photos, up to 5 MB each.`);
      return;
    }
    setSavingPhotos(true);
    setMessage("");
    try {
      const data = new FormData();
      photoFiles.forEach((file) => data.append("photos", file));
      const response = await api.post<{ imageUrl2?: string; imageUrl3?: string }>(`/api/poodles/${poodleId}/photos`, data);
      setExtraPhotos([response.data.imageUrl2 ?? null, response.data.imageUrl3 ?? null]);
      setPhotoFiles([]);
      if (photoInputRef.current) photoInputRef.current.value = "";
      setMessage("Photos uploaded.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, { fallback: "Could not upload photos." }));
    } finally {
      setSavingPhotos(false);
    }
  };

  const removePhoto = async (slot: number) => {
    if (!window.confirm(`Remove photo ${slot}?`)) return;
    setSavingPhotos(true);
    try {
      await api.delete(`/api/poodles/${poodleId}/photos/${slot}`);
      setExtraPhotos((current) => slot === 2 ? [current[1], null] : [current[0], null]);
      setMessage("Photo removed.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, { fallback: "Could not remove photo." }));
    } finally {
      setSavingPhotos(false);
    }
  };

  if (!authContext.isAdmin) {
    return <main className={classes.page}>Not authorized.</main>;
  }

  if (loading) {
    return <main className={classes.page}>Loading...</main>;
  }

  const selectedImage = imageOverride?.id.toString() === form.imageId
    ? imageOverride
    : images.find((image) => image.id.toString() === form.imageId);

  return (
    <main className={classes.page}>
      <section className={classes.panel}>
        <div className={classes.header}>
          <button type="button" onClick={() => navigate("/")}>
            Back
          </button>
          <div>
            <p>Admin</p>
            <h1>Edit poodle</h1>
          </div>
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
            <p className={classes.imageHint}>Choose the image entry assigned to this poodle. Its photo and pedigree can be changed independently below.</p>
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

          <div className={classes.field}>
            <label htmlFor="description">Description in English</label>
            <textarea id="description" name="description" value={form.description} onChange={changeHandler} maxLength={2000} placeholder="Height, temperament and specific health tests" />
          </div>
          <div className={classes.field}>
            <label htmlFor="descriptionSr">Opis na srpskom</label>
            <textarea id="descriptionSr" name="descriptionSr" value={form.descriptionSr} onChange={changeHandler} maxLength={2000} placeholder="Visina, karakter i konkretni zdravstveni testovi" />
          </div>
          <label className={classes.checkbox}>
            <input type="checkbox" name="isRetired" checked={form.isRetired} onChange={changeHandler} />
            Retired (still shown on the site)
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update poodle"}
          </button>
        </form>
        <section className={classes.imageSection} aria-label="Additional poodle photos">
          <h2>Additional photos</h2>
          <p>The main photo and one pedigree image are managed below. Add up to two more photos here.</p>
          <div className={classes.extraPhotos}>
            {extraPhotos.map((url, index) => url && (
              <div key={`${index}-${url}`}>
                <img src={url} alt={`${form.name} photo ${index + 2}`} />
                <button type="button" onClick={() => removePhoto(index + 2)} disabled={savingPhotos}>Remove</button>
              </div>
            ))}
          </div>
          {savedImageId && form.imageId === savedImageId && extraPhotos.some((url) => !url) && (
            <div className={classes.photoUpload}>
              <label htmlFor="poodleExtraPhotos">Upload photos (5 MB each)</label>
              <input ref={photoInputRef} id="poodleExtraPhotos" type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={(event) => setPhotoFiles(Array.from(event.target.files ?? []))} />
              <button type="button" onClick={uploadPhotos} disabled={savingPhotos || !photoFiles.length}>
                {savingPhotos ? "Uploading..." : "Upload photos"}
              </button>
            </div>
          )}
        </section>
        <section className={classes.imageSection} aria-labelledby="image-details-heading">
          <h2 id="image-details-heading">Photo and pedigree image</h2>
          {form.imageId !== savedImageId ? (
            <p>Save the poodle above to assign the selected image, then edit its photo or pedigree here.</p>
          ) : selectedImage ? (
            <ImageAssetEditor key={selectedImage.id} image={selectedImage}
              onSaved={(updated) => setImageOverride(updated)} />
          ) : (
            <p>No image entry is assigned. <Link to="/images">Add an image</Link>, then select it above and save the poodle.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default EditPoodle;
