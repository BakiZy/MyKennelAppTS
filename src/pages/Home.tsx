import React, { useEffect, useState, useCallback } from "react";
import PoodleList from "../components/PoodleComp/PoodleList";
import axios, { AxiosResponse } from "axios";
import { PoodleModel } from "../interfaces/IPoodleModel";
import classes from "./Home.module.css";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import { Button } from "react-bootstrap";

interface FilterProps {
  filteredPoodles: PoodleModel[];
}

const Home: React.FC = () => {
  const [poodles, setPoodles] = useState<PoodleModel[]>([]);
  const [loading, setLoading] = useState(false);

  const { selectSizeOption, setSelectedSizeOption, sizes, selectedSizeName } =
    useGetSizes();

  const {
    selectColorOption,
    setSelectedColorOption,
    colors,
    selectedColorName,
  } = useGetColors();

  const PoodleFilter: React.FC<FilterProps> = () => {
    const getFilters = useCallback((event) => {
      event.preventDefault();
      setLoading(true);
      const params = {
        colorName: selectedColorName,
        sizeName: selectedSizeName,
      };
      axios
        .get<PoodleModel[]>(
          "https://poodlesvonapalusso.dog/api/filters/color-and-size",
          { params }
        )
        .then((response) => {
          const loadedData: PoodleModel[] = [];
          for (const key in response.data) {
            loadedData.push({
              id: response.data[key].id,
              name: response.data[key].name,
              dateOfBirth: response.data[key].dateOfBirth,
              geneticTests: response.data[key].geneticTests,
              pedigreeNumber: response.data[key].pedigreeNumber,
              poodleSizeName: response.data[key].poodleSizeName,
              poodleColorName: response.data[key].poodleColorName,
              imageUrl: response.data[key].imageUrl,
              imagePedigreeUrl: response.data[key].imagePedigreeUrl,
            });
            if (loadedData.length < 1) {
              alert("rip");
            }
            setPoodles(loadedData);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    const onReset = useCallback(() => {
      setLoading(true);
      axios
        .get<PoodleModel[]>("https://poodlesvonapalusso.dog/api/poodles")
        .then((response: AxiosResponse<PoodleModel[]>) => {
          const loadedData: PoodleModel[] = [];
          for (let i = 0; i < response.data.length; i++) {
            loadedData.push({
              id: response.data[i].id,
              name: response.data[i].name,
              dateOfBirth: response.data[i].dateOfBirth,
              geneticTests: response.data[i].geneticTests,
              pedigreeNumber: response.data[i].pedigreeNumber,
              poodleSizeName: response.data[i].poodleSizeName,
              poodleColorName: response.data[i].poodleColorName,
              imageUrl: response.data[i].imageUrl,
              imagePedigreeUrl: response.data[i].imagePedigreeUrl,
            });
          }
          setPoodles(loadedData);

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, []);

    const changeSelectSizeHandler = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setSelectedSizeOption(parseInt(e.target.value));
    };

    const changeSelectColorHandler = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setSelectedColorOption(parseInt(e.target.value));
    };

    return (
      <form onSubmit={getFilters} className={classes.filterMain}>
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
        <div className={classes.filterButtons}>
          <Button
            type="submit"
            variant="dark"
            style={{
              borderRadius: "1rem",
              borderColor: "rgb(44, 43, 43)",
              fontSize: "1.5rem",
              width: "7rem",
            }}
          >
            Filter
          </Button>
          <Button
            type="button"
            onClick={onReset}
            variant="dark"
            style={{
              borderRadius: "1rem",
              borderColor: "rgb(44, 43, 43)",
              fontSize: "1.5rem",
            }}
          >
            Reset filter
          </Button>
        </div>
      </form>
    );
  };

  useEffect(() => {
    axios
      .get<PoodleModel[]>("https://poodlesvonapalusso.dog/api/poodles")
      .then((response: AxiosResponse<PoodleModel[]>) => {
        const loadedData: PoodleModel[] = [];
        for (let i = 0; i < response.data.length; i++) {
          loadedData.push({
            id: response.data[i].id,
            name: response.data[i].name,
            dateOfBirth: response.data[i].dateOfBirth,
            geneticTests: response.data[i].geneticTests,
            pedigreeNumber: response.data[i].pedigreeNumber,
            poodleSizeName: response.data[i].poodleSizeName,
            poodleColorName: response.data[i].poodleColorName,
            imageUrl: response.data[i].imageUrl,
            imagePedigreeUrl: response.data[i].imagePedigreeUrl,
          });
        }
        setPoodles(loadedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const onRemoveHandler = (id) => {
    axios
      .delete(`https://poodlesvonapalusso.dog/api/poodles/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(() => {
        setPoodles(poodles.filter((poodle) => poodle.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <PoodleFilter filteredPoodles={poodles} />
      <PoodleList poodles={poodles} onRemove={onRemoveHandler} />
    </>
  );
};

export default Home;
