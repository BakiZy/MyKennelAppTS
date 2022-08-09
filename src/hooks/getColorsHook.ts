import { PoodleColor } from "../interfaces/IPoodleModel";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../store/auth-context";
import axios from "axios";

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
  const authContext = useContext(AuthContext);
  const token = authContext.token;

  useEffect(() => {
    const fetchColors = async () => {
      await axios
        .get<PoodleColor[]>("https://localhost:44373/api/poodles/list-colors", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          const loadedData: PoodleColor[] = [];
          const responseData = response.data;
          console.log(responseData);
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
  }, [token]);
  return {
    colors: colors,
    selectColorOption: selectColorOption,
    setSelectedColorOption: setSelectedColorOption,
    loadingColors: loading,
    selectedColorName: colors[selectColorOption - 1]?.name,
  };
};

export default useGetColors;
