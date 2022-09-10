import React, { useState } from "react";
import { ISliderProps } from "../../interfaces/ISliderModel";
import classes from "./ImageSlider.module.css";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { MdMale, MdFemale } from "react-icons/md";

const ImageSlider: React.FC<ISliderProps> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!Array.isArray(props.slides) || props.slides.length <= 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex(
      currentIndex === props.slides.length - 1 ? 0 : currentIndex + 1
    );
  };

  const previousSlide = () => {
    setCurrentIndex(
      currentIndex === 0 ? props.slides.length - 1 : currentIndex - 1
    );
  };

  return (
    <section className={classes.slider}>
      <button className={classes.leftArrow} onClick={previousSlide}>
        <FaArrowAltCircleLeft />
      </button>
      <button className={classes.rightArrow} onClick={nextSlide}>
        <FaArrowAltCircleRight />
      </button>
      {props.slides.map((image, index) => {
        return (
          <div key={index}>
            {index === currentIndex && (
              <>
                <p>
                  {image.sex === "male" ? (
                    <MdMale className={classes.symbol}></MdMale>
                  ) : (
                    <MdFemale className={classes.symbol}></MdFemale>
                  )}
                </p>
                <img
                  key={image.currentIndex}
                  src={image.url}
                  alt="poodle red"
                  className={classes.sliderImage}
                />
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ImageSlider;
