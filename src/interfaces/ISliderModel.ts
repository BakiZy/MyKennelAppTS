export interface ISliderProps {
  slides: ISliderImage[];
  language: "en" | "sr";
}

export interface ISliderImage {
  id: number;
  url: string;
  name: string;
}
