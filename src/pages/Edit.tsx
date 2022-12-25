import React, { useContext, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./Edit.module.css";
import { Button } from "react-bootstrap";
import AuthContext from "../store/auth-context";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import useGetImgUr from "../hooks/getImgUrHook";
import axios, { AxiosResponse } from "axios";
import { PoodleModel } from "../interfaces/IPoodleModel";

let controller = new AbortController();
const EditPoodle: React.FC = () => {
  const { poodleId } = useParams();
  const authContext = useContext(AuthContext);
  const token = authContext.token;

  const [gender, setGender] = useState("");
  const [geneticTest, setGeneticTest] = React.useState(false);
  const { images, selectImgOption, setSelectedImgOption } = useGetImgUr();
  const { selectSizeOption, setSelectedSizeOption, sizes } = useGetSizes();
  const { selectColorOption, setSelectedColorOption, colors } = useGetColors();
  const [poodle, setPoodle] = useState<PoodleModel>({
    id: 0,
    name: "",
    imageUrl: "",
    imagePedigreeUrl: "",
    dateOfBirth: new Date(),
    pedigreeNumber: "",
    geneticTests: false,
    poodleSizeName: "",
    sex: "",
    poodleColorName: "",
    isPuppy: false,
    nickName: "",
  });
  const poodleName = useRef<HTMLInputElement>(null);
  const poodleDate = useRef<HTMLInputElement>(null);
  const poodlePedigreeNumber = useRef<HTMLInputElement>(null);
  const poodleNick = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchReservedPoodle = async () => {
      await axios
        .get<PoodleModel>(
          `https://poodlesvonapalusso.dog/api/poodles/${poodleId}`
        )
        .then((response: AxiosResponse<PoodleModel>) => {
          setPoodle(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchReservedPoodle();
    return () => {
      controller?.abort();
    };
  }, [poodleId]);

  const updateHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredPoodleName = poodleName.current!.value;
    const enteredPoodleDate = poodleDate.current!.value;
    const enteredPedigreeNumber = poodlePedigreeNumber.current!.value;
    const enteredPoodleNick = poodleNick.current!.value;

    const updatePoodle = async () => {
      await axios
        .put<AxiosResponse>(
          `https://poodlesvonapalusso.dog/api/poodles/${poodleId}`,
          {
            id: poodleId,
            name: enteredPoodleName,
            dateOfBirth: enteredPoodleDate,
            geneticTests: geneticTest,
            imageId: selectImgOption,
            pedigreeNumber: enteredPedigreeNumber,
            poodleSizeId: selectSizeOption,
            poodleColorId: selectColorOption,
            sex: gender,
            nickName: enteredPoodleNick,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          alert("edited info in DB");
        })
        .catch((error: string) => {
          alert(error);
        });
    };
    updatePoodle();
  };

  const genderHandler = (e) => {
    setGender(e.target.value);
  };
  const geneticTestHandler = () => {
    setGeneticTest((prevstate) => !prevstate);
  };

  const changeSelectSizeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSizeOption(parseInt(e.target.value));
  };

  const changeSelectColorHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedColorOption(parseInt(e.target.value));
  };

  const imgSelectedHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImgOption(parseInt(e.target.value));
  };

  if (!authContext.isAdmin) {
    return <div>Not authorized </div>;
  }

  return (
    <div>
      <h1>Edit current poodle</h1>

      <form onSubmit={updateHandler} className={classes.control}>
        <div className={classes.control}>
          <label htmlFor="poodleName">Name</label>
          <input
            type="text"
            id="poodleName"
            required
            ref={poodleName}
            defaultValue={poodle.name}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="poodleNick">Nickname</label>
          <input
            type="text"
            id="poodleNick"
            required
            ref={poodleNick}
            defaultValue={poodle.nickName}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="poodlePedigree">Number of pedigree</label>
          <input
            type="text"
            id="poodlePedigree"
            required
            ref={poodlePedigreeNumber}
            defaultValue={poodle.pedigreeNumber}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="poodleDate">Date of birth</label>
          <input type="date" id="poodleDate" required ref={poodleDate} />
        </div>
        <div className={classes.control}>
          <label>Gender</label>
          <label htmlFor="gender">Male</label>
          <input
            type="radio"
            name="gender"
            value="Male"
            onChange={genderHandler}
          />
          <label htmlFor="gender">Female</label>
          <input
            type="radio"
            name="gender"
            value="Female"
            defaultChecked={true}
            onChange={genderHandler}
          />
        </div>
        <div className={classes.control}>
          <label>Genetic test</label>
          <label htmlFor="geneticTest">Yes</label>
          <input
            type="radio"
            name="geneticTest"
            onChange={geneticTestHandler}
          />
          <label htmlFor="geneticTest">No</label>
          <input
            type="radio"
            name="geneticTest"
            defaultChecked={true}
            onChange={geneticTestHandler}
          />
        </div>

        <div className={classes.control}>
          <label htmlFor="sizeName">Select size of poodle</label>
          <select
            id="sizeName"
            name="sizeName"
            value={selectSizeOption}
            onChange={changeSelectSizeHandler}
          >
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="colorName">Select color of poodle</label>
          <select
            id="colorName"
            name="colorName"
            value={selectColorOption}
            onChange={changeSelectColorHandler}
          >
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="img">Select image</label>
          <select
            id="img"
            name="img"
            value={selectImgOption}
            onChange={imgSelectedHandler}
          >
            {images.map((image) => (
              <option key={image.id} value={image.id}>
                {image.name}
              </option>
            ))}
          </select>
        </div>
        <br></br>
        <div className={classes.control}>
          <Button type="submit" variant="dark" style={{ fontSize: "1.6rem" }}>
            Update info
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPoodle;
