// import React, { useCallback, useRef, useState } from "react";
// import { PoodleModel } from "../interfaces/IPoodleModel";

// import axios from "axios";
// interface PoodleFilterProps {
//   poodlesFilter: PoodleModel[];
// }

// const PoodleFilter = (): PoodleFilterProps => {
//   const sizeInputRef = useRef<HTMLSelectElement>(null);
//   const colorInputRef = useRef<HTMLSelectElement>(null);
//   const [poodles, setPoodles] = useState<PoodleModel[]>([]);

//   const getFilters = useCallback((event) => {
//     event.preventDefault();
//     const selectedColor = colorInputRef.current!.value;
//     const selectedSize = sizeInputRef.current!.value;
//     const params = {
//       colorName: selectedColor,
//       sizeName: selectedSize,
//     };
//     axios
//       .get<PoodleModel[]>(
//         "https://localhost:44373/api/filters/color-and-size",
//         { params }
//       )
//       .then((response) => {
//         console.log(response.data);
//         const loadedData: PoodleModel[] = [];
//         for (const key in response.data) {
//           loadedData.push({
//             id: response.data[key].id,
//             name: response.data[key].name,
//             dateOfBirth: response.data[key].dateOfBirth,
//             geneticTests: response.data[key].geneticTests,
//             pedigreeNumber: response.data[key].pedigreeNumber,
//             poodleSizeName: response.data[key].poodleSizeName,
//             poodleColorName: response.data[key].poodleColorName,
//             image: response.data[key].image,
//           });
//           setPoodles(loadedData);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     getFilters(event : );
//   }, []);
//   return {
//     poodlesFilter: poodles,
//   };
// };

// export default PoodleFilter;
