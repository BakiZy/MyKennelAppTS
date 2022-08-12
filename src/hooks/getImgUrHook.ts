import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";

interface Image {
  id: number;
  url: string;
  name: string;
  pedigreeUrl: string;
}

interface PoodleImageProps {
  images: Image[];
  selectImgOption: number;
  setSelectedImgOption: (value: React.SetStateAction<number>) => void;
  selectedImgName: string;
}

const useGetImgUr = (): PoodleImageProps => {
  const [imgs, setImgs] = useState<Image[]>([]);
  const [selectImgOption, setSelectedImgOption] = useState<number>(1);
  const authContext = useContext(AuthContext);
  const token = authContext.token;

  useEffect(() => {
    const getImages = async () => {
      await axios
        .get<Image[]>("https://localhost:44373/api/Images", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          const loadedData: Image[] = [];
          const responseData = res.data;
          for (const key in responseData) {
            loadedData.push({
              id: responseData[key].id,
              url: responseData[key].url,
              name: responseData[key].name,
              pedigreeUrl: responseData[key].pedigreeUrl,
            });
          }
          setImgs(loadedData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getImages();
  }, [token]);

  return {
    images: imgs,
    selectImgOption: selectImgOption,
    setSelectedImgOption: setSelectedImgOption,
    selectedImgName: imgs[selectImgOption - 1]?.name,
  };
};

export default useGetImgUr;
