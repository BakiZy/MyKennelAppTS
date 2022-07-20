import React, { useState, useEffect } from "react";
import { PoodleSize } from "../interfaces/IPoodleModel";
import axios from "axios";

interface PoodleSizeProps {
  sizes: PoodleSize[];
  selectSizeOption: number;
  setSelectedSizeOption: (value: React.SetStateAction<number>) => void;
  selectedSizeName: string;
}

const useGetSizes = (): PoodleSizeProps => {
  const [sizes, setSizes] = useState<PoodleSize[]>([]);
  //using 1 as default for size ID: 1 = toy
  const [selectSizeOption, setSelectedSizeOption] = useState<number>(1);

  useEffect(() => {
    const fetchSizes = async () => {
      await axios
        .get<PoodleSize[]>("https://localhost:44373/api/poodles/list-sizes")
        .then((response) => {
          const loadedData: PoodleSize[] = [];
          const responseData = response.data;
          console.log(response.data);
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
  }, []);
  return {
    sizes: sizes,
    selectSizeOption: selectSizeOption,
    setSelectedSizeOption: setSelectedSizeOption,
    selectedSizeName: sizes[selectSizeOption - 1]?.name,
  };
};

export default useGetSizes;
