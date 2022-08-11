import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./Edit.module.css";
import { Button } from "react-bootstrap";
import AuthContext from "../store/auth-context";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import useGetImgUr from "../hooks/getImgUrHook";
import axios, { AxiosResponse } from "axios";
import { PoodleModel } from "../interfaces/IPoodleModel";

export interface PoodleModelEdit {
  id: number;
  name: string;
  dateOfBirth: string;
  geneticTests: boolean;
  pedigreeNumber: string;
  poodleSizeId: number;
  poodleColorId: number;
  imageId: number;
}

const EditPoodle: React.FC = () => {
  const { poodleId } = useParams();
  const authContext = useContext(AuthContext);
  const token = authContext.token;
  const [geneticTest, setGeneticTest] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
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
    poodleColorName: "",
  });

  useEffect(() => {
    const fetchReservedPoodle = async () => {
      await axios
        .get<PoodleModel>(`https://localhost:44373/api/poodles/${poodleId}`)
        .then((response: AxiosResponse<PoodleModel>) => {
          console.log(response.data);
          setPoodle(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchReservedPoodle();
    setLoading(false);
  }, [poodleId]);

  // const dateOfBirth = new Date(poodle.dateOfBirth);
  // const parsedDate =
  //   dateOfBirth.getFullYear() +
  //   "-" +
  //   (dateOfBirth.getMonth() + 1) +
  //   "-" +
  //   dateOfBirth.getDay();

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name: poodle.name,
      dateOfBirth: poodle.dateOfBirth,
      geneticTests: geneticTest,
      imageId: selectImgOption,
      pedigreeNumber: poodle.pedigreeNumber,
      poodleSizeId: selectSizeOption,
      poodleColorId: selectColorOption,
    };
    const updatePoodle = async () => {
      await axios
        .put<AxiosResponse>(
          `https://localhost:44373/api/poodles/${poodleId}`,
          {
            data,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response.data);
          alert("edited info in DB");
        })
        .catch((error: string) => {
          alert(error);
        });
    };

    updatePoodle();
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

  const setDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setPoodle({ ...poodle, dateOfBirth: date });
  };

  if (!authContext.isAdmin) {
    return <div></div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Edit current poodle</h1>
      <section className={classes.control}>
        <form onSubmit={updateHandler}>
          <div className={classes.control}>
            <label htmlFor="poodleName">Name</label>
            <input
              type="text"
              id="poodleName"
              required
              value={poodle.name}
              onChange={(e) => setPoodle({ ...poodle, name: e.target.value })}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="poodleDate">Date of birth</label>
            <input
              type="date"
              id="poodleDate"
              required
              onChange={setDateHandler}
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
            <label htmlFor="poodlePedigree">Number of pedigree</label>
            <input
              type="text"
              id="poodlePedigree"
              required
              value={poodle.pedigreeNumber}
              onChange={(e) =>
                setPoodle({ ...poodle, pedigreeNumber: e.target.value })
              }
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
          <div className={classes.control}>
            <Button
              type="submit"
              variant="outline-dark"
              style={{ background: "rgba(216, 176, 226, 0.815)" }}
            >
              Update info
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditPoodle;
