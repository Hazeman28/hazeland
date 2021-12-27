import colorProperties from "./components/color-properties/color-properties.js";
import colorSchemeSelect from "./components/color-scheme-select/color-scheme-select.js";
import scrollSnapRoot from "./components/scroll-snap-root/scroll-snap-root.js";
import sideNav from "./components/side-nav/side-nav.js";
import { registerCustomElements } from "./helpers/custom-element.js";

registerCustomElements(
  colorProperties,
  colorSchemeSelect,
  scrollSnapRoot,
  sideNav
);
