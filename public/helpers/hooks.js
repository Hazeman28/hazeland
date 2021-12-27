function getAttributeValue(
  element,
  attributeName,
  defaultValue
) {
  const attribute = element.attributes?.getNamedItem(attributeName);

  if (attribute && !attribute.value) return true;
  return attribute?.value ?? defaultValue;
}

export function useAttribute(
  element,
  attributeName,
  defaultValue
) {
  const value = getAttributeValue(element, attributeName, defaultValue);

  const setValue = (newValueOrCallback) => {
    if (typeof newValueOrCallback === "function") {
      element.setAttribute?.(
        attributeName,
        newValueOrCallback(getAttributeValue(element, attributeName))
      );

      return;
    }

    element.setAttribute?.(attributeName, newValueOrCallback);
  };

  return [value, setValue];
}
