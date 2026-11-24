import { useEffect, useState } from "react";
import api from "../api/client";
import { ISliderImage } from "../interfaces/ISliderModel";

const useAboutSlider = () => {
  const [slides, setSlides] = useState<ISliderImage[]>([]);

  useEffect(() => {
    let active = true;
    api.get<ISliderImage[]>("/api/Images/about-slider")
      .then((response) => {
        if (active) setSlides(response.data.filter((image) => image.url));
      })
      .catch(() => {
        if (active) setSlides([]);
      });
    return () => { active = false; };
  }, []);

  return slides;
};

export default useAboutSlider;
