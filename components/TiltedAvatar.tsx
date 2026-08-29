"use client";

import TiltedCard from "./TiltedCard";

const SIZE = 128;

/** The portrait, on a card that leans toward the pointer. The tooltip is off —
 *  the name is already set in 100px of serif directly underneath. */
export default function TiltedAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="kc-avatar kc-pop"
      style={{ animationDelay: "40ms", width: SIZE, height: SIZE }}
    >
      <TiltedCard
        imageSrc={src}
        altText={alt}
        containerWidth={`${SIZE}px`}
        containerHeight={`${SIZE}px`}
        imageWidth={`${SIZE}px`}
        imageHeight={`${SIZE}px`}
        scaleOnHover={1.06}
        rotateAmplitude={16}
        showMobileWarning={false}
        showTooltip={false}
      />
    </div>
  );
}
