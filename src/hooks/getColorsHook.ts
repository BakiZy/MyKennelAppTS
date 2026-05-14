import { PoodleColor } from "../interfaces/IPoodleModel";
import { useState, useEffect } from "react";
import api from "../api/client";

interface PoodleColorProps {
  colors: PoodleColor[];
  selectColorOption: number;
  setSelectedColorOption: (value: number) => void;
  loadingColors: boolean;
  selectedColorName: string;
}

const useGetColors = (): PoodleColorProps => {
  const [colors, setColors] = useState<PoodleColor[]>([]);
  //using 1 for default selected value of color = black
  const [selectColorOption, setSelectedColorOption] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchColors = async () => {
      await api
        .get<PoodleColor[]>("/api/poodles/list-colors")
        .then((response) => {
          const loadedData: PoodleColor[] = [];
          const responseData = response.data;
          for (const key in responseData) {
            loadedData.push({
              id: responseData[key].id,
              name: responseData[key].name,
            });
          }
          setColors(loadedData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchColors();
  }, []);
  return {
    colors: colors,
    selectColorOption: selectColorOption,
    setSelectedColorOption: setSelectedColorOption,
    loadingColors: loading,
    selectedColorName:
      colors.find((color) => color.id === selectColorOption)?.name ?? "",
  };
};

export default useGetColors;
