import styles from "./main-content.css" assert { type: "css" };

function MainContent() {};

export default {
  styles,
  init: MainContent,
  template: import.meta.url,
};