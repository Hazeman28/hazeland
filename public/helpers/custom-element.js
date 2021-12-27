import { useAttribute } from "./hooks.js";
import { fetchTemplate, formatCustomElementName, getTemplateFetchParams } from "./utils.js";
import globalStyles from "../index.css" assert { type: "css" };

export async function createCustomElementDefinition({
  extends: baseElement,
  init,
  name,
  observeAttributes,
  observedAttributes,
  onAdopt,
  onAttributeChange,
  onConnect,
  onDisconnect,
  styles,
  template,
}) {
  const templateParamsOrTemplateNode = getTemplateFetchParams(template);

  const elementTemplate = Array.isArray(templateParamsOrTemplateNode)
    ? await fetchTemplate(...templateParamsOrTemplateNode)
    : templateParamsOrTemplateNode;

  const customElementName = formatCustomElementName(name || init?.name);

  if (!customElementName) {
    throw Error(
      "Custom element must have a name. Provide a non-anonymous function with a name as the `init` parameter, or specify the `name` parameter"
    );
  }

  const BaseElement = (
    baseElement
      ? document.createElement(baseElement).constructor
      : HTMLElement
  );

  class CustomElement extends BaseElement {
    constructor() {
      super();

      if (!baseElement) {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        if (elementTemplate) {
          shadowRoot.appendChild(elementTemplate);
        }

        if (styles) {
          shadowRoot.adoptedStyleSheets = [globalStyles, styles].flat();
        }
      }

      this.addEventListener = this.addEventListener.bind(this);
      this.querySelector = this.querySelector.bind(this);
      this.useAttribute = this.useAttribute.bind(this);

      init?.(this);
    }

    connectedCallback() {
      onConnect?.(this);
    }

    disconnectedCallback() {
      onDisconnect?.(this)
    }

    adoptedCallback() {
      onAdopt?.(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      observeAttributes?.[name]?.(oldValue, newValue, this);
      onAttributeChange?.(name, oldValue, newValue, this);
    }

    useAttribute(attributeName, defaultValue) {
      return useAttribute(this, attributeName, defaultValue);
    }

    static get observedAttributes() {
      return [
        ...(observedAttributes ?? []),
        ...(Object.keys(observeAttributes ?? {}).reduce((attributes, attributeName) => [
          ...attributes,
          attributeName
        ], [])),
      ];
    }
  }

  return [
    customElementName,
    CustomElement,
    baseElement ? { extends: baseElement } : undefined
  ];
};

export async function registerCustomElements(...definitionParams) {
  for (const params of definitionParams) {
    const [
      name,
      constructorFunction,
      options,
    ] = await createCustomElementDefinition(params);

    customElements.define(name, constructorFunction, options);
  }
}
