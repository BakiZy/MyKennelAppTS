import React, { useState, useEffect, useContext } from "react";
import { PoodleSize } from "../interfaces/IPoodleModel";
import axios from "axios";
import AuthContext from "../store/auth-context";

interface PoodleSizeProps {
  sizes: PoodleSize[];
  selectSizeOption: number;
  setSelectedSizeOption: (value: React.SetStateAction<number>) => void;
  selectedSizeName: string;
}

const useGetSizes = (): PoodleSizeProps => {
  const [sizes, setSizes] = useState<PoodleSize[]>([]);
  //using 1 as default for size ID: 1 = toy
  const [selectSizeOption, setSelectedSizeOption] = useState<number>(0);
  const authContext = useContext(AuthContext);
  const token = authContext.token;
  useEffect(() => {
    const fetchSizes = async () => {
      await axios
        .get<PoodleSize[]>(
          "https://poodlesvonapalusso.dog/api/poodles/list-sizes",
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          const loadedData: PoodleSize[] = [];
          const responseData = response.data;
          for (const key in responseData) {
            loadedData.push({
              id: responseData[key].id,
              name: responseData[key].name,
            });
          }
          setSizes(loadedData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchSizes();
  }, [token]);
  return {
    sizes: sizes,
    selectSizeOption: selectSizeOption,
    setSelectedSizeOption: setSelectedSizeOption,
    selectedSizeName: sizes[selectSizeOption - 1]?.name,
  };
};

export default useGetSizes;
