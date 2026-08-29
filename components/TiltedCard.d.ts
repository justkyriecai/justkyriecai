import type { CSSProperties, ReactNode } from "react";

/** Pointer-tracked 3D tilt, vendored from the react-bits registry. */
export interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: ReactNode;
  displayOverlayContent?: boolean;
  style?: CSSProperties;
}

declare const TiltedCard: (props: TiltedCardProps) => JSX.Element;
export default TiltedCard;
