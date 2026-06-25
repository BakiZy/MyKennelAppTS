import React, { useEffect, useState, useCallback } from "react";
import PoodleList from "../components/PoodleComp/PoodleList";
import { AxiosResponse } from "axios";
import api from "../api/client";
import { PoodleModel } from "../interfaces/IPoodleModel";
import classes from "./Home.module.css";
import useGetSizes from "../hooks/getSizesHook";
import useGetColors from "../hooks/getColorsHook";
import { Spinner } from "react-bootstrap";
import ErrorModal from "../components/UI/ErrorModal";
import Seo from "../components/SEO/Seo";

let controller = new AbortController();

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

  const PoodleFilter: React.FC = () => {
    const getFilters = useCallback(
      async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedColorName || !selectedSizeName) {
          setError({
            message: "Choose a size and color to filter the poodles.",
            title: "Search error",
            popup: true,
          });
          return;
        }
        setLoading(true);
        const params = {
          colorName: selectedColorName,
          sizeName: selectedSizeName,
        };
        await api
          .get("/api/filters/color-and-size", {
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
                  isPuppy: response.data[key].isPuppy,
                  nickName: response.data[key].nickName,
                });
                setPoodles(loadedData);
                setLoading(false);
              }
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
        return setLoading(false);
      },
      [selectedColorName, selectedSizeName]
    );

    const onReset = useCallback(async () => {
      setLoading(true);
      await api
        .get<PoodleModel[]>("/api/poodles")
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
              isPuppy: response.data[i].isPuppy,
              nickName: response.data[i].nickName,
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

    return (
      <form onSubmit={getFilters} className={classes.filterMain}>
        <div className={classes.filterHeader}>
          <div>
            <p className={classes.eyebrow}>Von Apalusso kennel</p>
            <h1>Family-raised poodles from Von Apalusso</h1>
            <p className={classes.leadText}>
              Meet the toy and miniature poodles who live with us as family,
              with health, temperament, and breed standards in focus.
            </p>
          </div>
        </div>
        <div className={classes.filterGroups}>
          <fieldset className={classes.filterGroup}>
            <legend>Find by size</legend>
            <div className={classes.chipList}>
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  className={`${classes.chip} ${
                    selectSizeOption === size.id ? classes.activeChip : ""
                  }`}
                  onClick={() => setSelectedSizeOption(size.id)}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={classes.filterGroup}>
            <legend>Find by color</legend>
            <div className={classes.chipList}>
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`${classes.chip} ${
                    selectColorOption === color.id ? classes.activeChip : ""
                  }`}
                  onClick={() => setSelectedColorOption(color.id)}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className={classes.filterButtons}>
          <p className={classes.resultCount}>
            Showing <strong>{poodles.length}</strong>{" "}
            {poodles.length === 1 ? "poodle" : "poodles"}
          </p>
          <button type="submit" className={classes.primaryAction}>
            Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className={classes.secondaryAction}
          >
            Show all
          </button>
        </div>
      </form>
    );
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<PoodleModel[]>("/api/poodles")
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
            isPuppy: response.data[i].isPuppy,
            nickName: response.data[i].nickName,
          });
        }
        setLoading(false);
        setPoodles(loadedData);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      controller?.abort();
    };
  }, []);

  const onRemoveHandler = async (id: number) => {
    await api
      .delete(`/api/poodles/${id}`)
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
      <main className={classes.page}>
        <div className={classes.loadingState}>
          <Spinner animation="border" variant="dark" />
        </div>
      </main>
    );
  }
  const homeDescription =
    "Red toy and miniature poodle kennel in Serbia. Meet Von Apalusso poodles raised with health, temperament, and breed standards in focus.";
  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Poodles Von Apalusso",
      url: "https://poodlesvonapalusso.com/",
      logo: "https://poodlesvonapalusso.com/logo512.png",
      sameAs: [
        "https://www.facebook.com/milos.petrov.10/photos_by",
        "https://www.instagram.com/vonappalusso/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+381646149512",
        contactType: "customer service",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Poodles Von Apalusso",
      url: "https://poodlesvonapalusso.com/",
    },
  ];

  return (
    <>
      <Seo
        title="Red toy and miniature poodle kennel in Serbia | Von Apalusso"
        description={homeDescription}
        canonical="https://poodlesvonapalusso.com/"
        structuredData={homeStructuredData}
      />
      {error.popup && (
        <ErrorModal
          message={error!.message}
          title={error!.title}
          onConfirm={errorHandler}
        />
      )}
      <main className={classes.page}>
        <PoodleFilter />
        <PoodleList poodles={poodles} onRemove={onRemoveHandler} />
      </main>
    </>
  );
};

export default Home;
