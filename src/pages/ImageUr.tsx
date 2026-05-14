import React, { useRef } from "react";
import { AxiosResponse } from "axios";
import api from "../api/client";
import classes from "./ImageUr.module.css";
import { Button } from "react-bootstrap";

const ImagePage: React.FC = () => {
  const imageName = useRef<HTMLInputElement>(null);
  const imageUrl = useRef<HTMLInputElement>(null);
  const pedigreeUrl = useRef<HTMLInputElement>(null);
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredImgName = imageName.current!.value;
    const enteredImgUrl = imageUrl.current!.value;
    const enteredPedigreeUrl = pedigreeUrl.current!.value;

    const addNewImage = async () => {
      await api.post<AxiosResponse>(
        "/api/Images",
        {
          name: enteredImgName,
          url: enteredImgUrl,
          pedigreeUrl: enteredPedigreeUrl,
        }
      );
    };
    addNewImage();
    alert("Image added");
  };
  return (
    <div>
      <h1>Images</h1>
      <form onSubmit={submitHandler} className={classes.control}>
        <div className={classes.control}>
          <label htmlFor="imageName">Image Name</label>
          <input type="text" name="imageName" id="imageName" ref={imageName} />
        </div>
        <div className={classes.control}>
          <label htmlFor="imageUrl">Image Url</label>
          <input type="text" name="imageUrl" id="imageUrl" ref={imageUrl} />
        </div>
        <div className={classes.control}>
          <label htmlFor="pedigreeUrl">Pedigree Url</label>
          <input
            type="text"
            name="pedigreeUrl"
            id="pedigreeUrl"
            ref={pedigreeUrl}
          />
        </div>
        <br></br>
        <Button type="submit" variant="dark" style={{ fontSize: "1.6rem" }}>
          Add image
        </Button>
      </form>
    </div>
  );
};

export default ImagePage;
