import styles from "./side-nav.css" assert { type: "css" };

function SideNav() {}

export default {
  styles,
  init: SideNav,
  template: import.meta.url,
};