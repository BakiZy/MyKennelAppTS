import React, { useState } from "react";
import { ISliderProps } from "../../interfaces/ISliderModel";
import classes from "./ImageSlider.module.css";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const ImageSlider: React.FC<ISliderProps> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!Array.isArray(props.slides) || props.slides.length <= 0) {
    return null;
  }

  const visibleIndex = currentIndex % props.slides.length;

  const nextSlide = () => {
    setCurrentIndex((visibleIndex + 1) % props.slides.length);
  };

  const previousSlide = () => {
    setCurrentIndex((visibleIndex + props.slides.length - 1) % props.slides.length);
  };

  return (
    <section className={classes.slider}>
      <button
        className={classes.leftArrow}
        onClick={previousSlide}
        type="button"
        aria-label={props.language === "sr" ? "Prethodna fotografija šteneta" : "Previous puppy image"}
      >
        <FaArrowAltCircleLeft />
      </button>
      <button
        className={classes.rightArrow}
        onClick={nextSlide}
        type="button"
        aria-label={props.language === "sr" ? "Sledeća fotografija šteneta" : "Next puppy image"}
      >
        <FaArrowAltCircleRight />
      </button>
      {props.slides.map((image, index) => {
        return (
          <div key={image.id}>
            {index === visibleIndex && (
              <img
                src={image.url}
                alt={image.name || (props.language === "sr" ? "Štene pudle Von Apalusso" : "Von Apalusso poodle puppy")}
                className={classes.sliderImage}
              />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ImageSlider;
