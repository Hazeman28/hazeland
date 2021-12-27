const PREFERRED_COLOR_SCHEME_LOCAL_STORAGE_KEY = "preferred-color-scheme";

const COLOR_SCHEME = Object.freeze({
  system: "system",
  dark: "dark",
  light: "light",
});

function ColorSchemeSelect(element) {
  const colorSchemeSelect = element.shadowRoot.querySelector("select");

  const colorSchemeOptions = [...colorSchemeSelect?.children];

  const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

  let preferredColorScheme = localStorage.getItem(
    PREFERRED_COLOR_SCHEME_LOCAL_STORAGE_KEY
  ) ?? COLOR_SCHEME.system;

  const isSystemColorScheme = () => preferredColorScheme === COLOR_SCHEME.system;

  const currentColorScheme = () => colorSchemeMedia.matches
    ? COLOR_SCHEME.dark
    : COLOR_SCHEME.light;

  const selectColorSchemeOption = (targetScheme) => {
    const colorScheme = targetScheme === COLOR_SCHEME.system
      ? currentColorScheme()
      : targetScheme;
    
    document.body.setAttribute(
      "data-color-scheme",
      colorScheme
    );

    document.body.style.setProperty(
      "--color-scheme-is-dark",
      colorScheme === COLOR_SCHEME.dark ? 1 : 0,
    );

    colorSchemeOptions.forEach((option) => option.removeAttribute("selected"));

    colorSchemeOptions
      .find((child) => child.value === targetScheme)
      ?.setAttribute("selected", "");
  };

  colorSchemeMedia.addEventListener(
    "change",
    (event) => isSystemColorScheme() && selectColorSchemeOption(
      event.matches
        ? COLOR_SCHEME.dark
        : COLOR_SCHEME.light
    )
  );

  colorSchemeSelect?.addEventListener(
    "change",
    (event) => {
      preferredColorScheme = COLOR_SCHEME[event.target.value];
      
      localStorage.setItem(
        PREFERRED_COLOR_SCHEME_LOCAL_STORAGE_KEY,
        preferredColorScheme
      );

      selectColorSchemeOption(preferredColorScheme);
    }
  );

  selectColorSchemeOption(preferredColorScheme);
};

export default {
  init: ColorSchemeSelect,
  template: import.meta.url,
};