import { useState, useEffect } from "react";
import api from "../api/client";

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

  useEffect(() => {
    const getImages = async () => {
      await api
        .get<Image[]>("/api/Images")
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
  }, []);

  return {
    images: imgs,
    selectImgOption: selectImgOption,
    setSelectedImgOption: setSelectedImgOption,
    selectedImgName: imgs[selectImgOption - 1]?.name,
  };
};

export default useGetImgUr;
