import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "json-viewer": any;
    }
    interface Directives {
      clickOutside?: () => void;
    }
  }
}
