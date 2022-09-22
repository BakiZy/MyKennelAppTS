import React, { useEffect, useState, useCallback } from "react";
import PoodleList from "../components/PoodleComp/PoodleList";
import axios, { AxiosResponse } from "axios";
import { PoodleModel } from "../interfaces/IPoodleModel";
import classes from "./Home.module.css";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import { Button, Spinner } from "react-bootstrap";
import ErrorModal from "../components/UI/ErrorModal";
import { Helmet } from "react-helmet";

interface FilterProps {
  filteredPoodles: PoodleModel[];
}

const Home: React.FC = () => {
  const [poodles, setPoodles] = useState<PoodleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    message: "",
    title: "",
    popup: false,
  });

  const { selectSizeOption, setSelectedSizeOption, sizes, selectedSizeName } =
    useGetSizes();

  const {
    selectColorOption,
    setSelectedColorOption,
    colors,
    selectedColorName,
  } = useGetColors();

  const PoodleFilter: React.FC<FilterProps> = () => {
    const getFilters = useCallback(
      async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const params = {
          colorName: selectedColorName,
          sizeName: selectedSizeName,
        };
        await axios
          .get("https://poodlesvonapalusso.dog/api/filters/color-and-size", {
            params,
          })
          .then((response) => {
            const loadedData: PoodleModel[] = [];
            if (response.data.length < 1) {
              setLoading(false);
              setError({
                message: "Currently we don't have this combination of poodle",
                title: "Search error",
                popup: true,
              });
            } else {
              for (const key in response.data) {
                loadedData.push({
                  id: response.data[key].id,
                  name: response.data[key].name,
                  dateOfBirth: response.data[key].dateOfBirth,
                  geneticTests: response.data[key].geneticTests,
                  pedigreeNumber: response.data[key].pedigreeNumber,
                  poodleSizeName: response.data[key].poodleSizeName,
                  poodleColorName: response.data[key].poodleColorName,
                  sex: response.data[key].sex,
                  imageUrl: response.data[key].imageUrl,
                  imagePedigreeUrl: response.data[key].imagePedigreeUrl,
                });
                setPoodles(loadedData);
                setLoading(false);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
        return setLoading(false);
      },
      []
    );

    const onReset = useCallback(async () => {
      await axios
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
              sex: response.data[i].sex,
              imagePedigreeUrl: response.data[i].imagePedigreeUrl,
            });
          }
          setPoodles(loadedData);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      return setLoading(false);
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
          <div>
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
          <div className={classes.filters}>
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
            Show all
          </Button>
        </div>
      </form>
    );
  };

  useEffect(() => {
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
            sex: response.data[i].sex,
            imagePedigreeUrl: response.data[i].imagePedigreeUrl,
          });
        }
        setLoading(false);
        setPoodles(loadedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onRemoveHandler = async (id: number) => {
    await axios
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

  const errorHandler = () => {
    setError({
      message: "",
      title: "",
      popup: false,
    });
  };

  if (loading) {
    return (
      <Spinner animation="border" variant="info">
        Load
      </Spinner>
    );
  }
  return (
    <>
      <Helmet>
        {" "}
        <html lang="en" />
        <title>Poodles Von Apalusso website</title>
        <meta
          name="description"
          content="Toy, miniature, red and fawn Poodle kennel from Serbia"
        />
        <link rel="canonical" href="https://poodlesvonapalusso.xyz/" />
        <meta
          name="poodles, pudle, red poodle, apricot poodle, fawn poodle, toy poodle, miniature poodle, toy pudla, pudla, pudle srbija"
          content="Toy, miniature, red and fawn Poodle kennel from Serbia"
        />
        <meta name="robots" content="index,follow" />
        {/* https://ogp.me/ */}
        <meta property="og:url" content="https://poodlesvonapalusso.xyz/" />
        <meta property="og:title" content="Poodles Von Apalusso website" />
        <meta
          property="og:description"
          content="Toy, miniature, red and fawn Poodle kennel from Serbia"
        />
        <meta property="og:type" content="..." />
        <meta
          property="og:image"
          content={"https://i.imgur.com/6Ll5PQL.jpeg"}
        />
        {/* https://moz.com/blog/meta-referrer-tag */}
        <meta name="referrer" content="origin-when-crossorigin" />
      </Helmet>
      {error.popup && (
        <ErrorModal
          message={error!.message}
          title={error!.title}
          onConfirm={errorHandler}
        />
      )}
      <PoodleFilter filteredPoodles={poodles} />
      <PoodleList poodles={poodles} onRemove={onRemoveHandler} />
    </>
  );
};

export default Home;
