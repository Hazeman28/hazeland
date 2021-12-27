export function getTemplateFetchParams(template) {
  return (Array.isArray(template) || typeof template === "object")
    ? template
    : typeof template === "string"
    ? [
      `./${template.split("/").pop()?.replace(/\..+$/, ".html")}`,
      template
    ]
    : [];
}

export async function fetchTemplate(
  templatePath,
  moduleURL,
) {
  if (!templatePath) return null;

  try {
    const templateURL = new URL(templatePath, moduleURL).href;

    const response = await fetch(templateURL);
    const text = await response.text();

    const document = new DOMParser().parseFromString(text, "text/html");
    const template = document.querySelector("template");

    return template?.content.cloneNode(true);

  } catch (error) {
    console.error(error);
    return null;
  }
};

export function formatCustomElementName(name) {
  return name
    ?.trim()
    .split("")
    .map((char, index, array) => {
      const lowerCase = char.toLowerCase();
      const upperCase = char.toUpperCase();

      const previous = index > 0 ? array[index - 1] : "";
      const next = index < array.length - 1 ? array[index + 1] : "";

      const isNotFirst = index > 0;
      const isUpperCase = char === upperCase;
      const previousIsUpperCase = previous === previous?.toUpperCase();
      const nextIsUpperCase = next === next?.toUpperCase();

      if (
        isNotFirst &&
        isUpperCase &&
        !(previousIsUpperCase && nextIsUpperCase) &&
        !lowerCase.startsWith("-")
      ) {
        return `-${lowerCase}`;
      }

      return lowerCase;
    }).join("")
}

export function trimInnerHTML(element) {
  return element?.innerHTML.trim();
}

