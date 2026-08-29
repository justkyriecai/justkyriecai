import type { CSSProperties } from "react";

/** Scramble-then-reveal text, vendored from the react-bits registry. */
export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "hover" | "view" | "click" | "inViewHover";
  clickMode?: "once" | "toggle";
  style?: CSSProperties;
}

declare const DecryptedText: (props: DecryptedTextProps) => JSX.Element;
export default DecryptedText;
