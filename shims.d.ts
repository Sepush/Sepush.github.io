/// <reference types="unocss/preset-attributify" />

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes {
      [key: string]: any;
    }
  }
}

export {};
