import styles from "./scroll-snap-root.css" assert { type: "css" };

function ScrollSnapRoot(element) {
  const assignedNodes = element.shadowRoot
    .querySelector("slot[name=\"main-content\"]")
    ?.assignedNodes();

  const mainContent = assignedNodes[0];

  mainContent?.scrollIntoView();
};

export default {
  styles,
  init: ScrollSnapRoot,
  template: import.meta.url,
};