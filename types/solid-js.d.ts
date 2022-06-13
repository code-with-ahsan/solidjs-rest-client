import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "json-viewer": any;
      "ion-icon": any;
    }
    interface Directives {
      clickOutside?: () => void;
    }
  }
}
