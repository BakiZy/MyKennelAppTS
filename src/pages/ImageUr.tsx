import React, { useContext, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import AuthContext from "../store/auth-context";
import classes from "./ImageUr.module.css";
import { Button } from "react-bootstrap";

const ImagePage: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const imageName = useRef<HTMLInputElement>(null);
  const imageUrl = useRef<HTMLInputElement>(null);
  const pedigreeUrl = useRef<HTMLInputElement>(null);
  const token = authCtx.token;
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredImgName = imageName.current!.value;
    const enteredImgUrl = imageUrl.current!.value;
    const enteredPedigreeUrl = pedigreeUrl.current!.value;

    const addNewImage = async () => {
      await axios.post<AxiosResponse>(
        "https://poodlesvonapalusso.dog/api/Images",
        {
          name: enteredImgName,
          url: enteredImgUrl,
          pedigreeUrl: enteredPedigreeUrl,
        },
        {
          headers: { Authorization: "Bearer " + token },
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
        <Button
          type="submit"
          variant="outline-dark"
          style={{ background: "rgba(216, 176, 226, 0.815)" }}
        >
          Add image
        </Button>
      </form>
    </div>
  );
};

export default ImagePage;
