import colors100 from "./colors.json" assert { type: "json" }; 
import styles from "./color-properties.css" assert { type: "css" }; 
import { useAttribute } from "../../helpers/hooks.js";

let colors = [];

const generateColorWeights = (startIndex = 1) =>
  Array(10).fill(null).map((_, index) => index * 100).slice(startIndex);

const generateColorProperties = (colorName, colorWeight, [hue, saturation, lightness]) => {
  const prefix = `--color-${colorName}-${colorWeight}`;

  const [hPrefix, sPrefix, lPrefix] = ["h", "s", "l"].map(
    (component) => `${prefix}-${component}`
  );

  return {
    [hPrefix]: hue,
    [sPrefix]: `${saturation}%`,
    [lPrefix]: `${lightness}%`,
    [prefix]: `var(${hPrefix}) var(${sPrefix}) var(${lPrefix})`,
  };
};

const injectColors = () => {
  colors = Object.keys(colors100)
    .reduce((colorProperties, colorName) => {
      const [baseHue, baseSaturation, baseLightness] = colors100[colorName];

      return [
        ...colorProperties,
        generateColorWeights().map(
          (weight, index) => generateColorProperties(
            colorName,
            weight,
            [baseHue, baseSaturation, baseLightness - 10 * index]
          )
        ),
      ];
    }, []);

  colors.flat().forEach((color) => Object.entries(color).forEach(
    ([colorName, colorValue]) => document.documentElement.style.setProperty(
      colorName,
      colorValue
    )
  ));
};

function ColorProperties(element) {
  injectColors();

  const [previewColors] = useAttribute(element, "preview-colors", false);

  if (previewColors) {
    const rootList = element.shadowRoot.querySelector("#color-properties");

    colors.forEach((colorShades) => {
      const colorLi = document.createElement("li");

      const colorH4 = document.createElement("h4");
      const colorOl = document.createElement("ol");

      colorH4.textContent = Object.keys(colorShades[0]).pop()
        .replace(/(--color|-\d{3})/g, "")
        .split("-")
        .join(" ");
    
      colorOl.classList.add("color");
      
      colorShades.forEach((shade) => {
        const colorName = Object.keys(shade).pop();
        const weightLi = document.createElement("li");

        weightLi.classList.add("color-weight");

        weightLi.setAttribute(
          "title",
          colorName.replace("--color", "").split("-").join(" ")
        );

        weightLi.style.setProperty(
          "background-color",
          `hsl(var(${colorName}))`
        );

        colorOl.appendChild(weightLi);
      });

      colorLi.appendChild(colorH4);
      colorLi.appendChild(colorOl);
      rootList.appendChild(colorLi);
    });
  }
};

export default {
  styles,
  init: ColorProperties,
  template: import.meta.url,
};