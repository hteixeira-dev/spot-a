"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

type RiveCardProps = {
  desktopSrc?: string;
  mobileSrc?: string;
  desktopArtboard?: string;
  mobileArtboard?: string;
  desktopStateMachines?: string[];
  mobileStateMachines?: string[];
  autoplay?: boolean;
  fit?: Fit;
  alignment?: Alignment;

  imgSrc?: string;
  imgAlt?: string;
  priority?: boolean;

  className?: string;

  ctaHref?: string;
  ctaTarget?: "_self" | "_blank";
  ctaStateName?: string;

  scale?: number;
  offsetX?: number;
  offsetY?: number;
  desktopScale?: number;
  mobileScale?: number;
  desktopOffsetX?: number;
  desktopOffsetY?: number;
  mobileOffsetX?: number;
  mobileOffsetY?: number;
};

function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);
  return isMobile;
}

function getRiveStateName(evt: { data?: unknown }): string {
  if (!evt) return "";
  const data = (evt as unknown as { data?: unknown }).data;
  if (typeof data === "object" && data !== null) {
    const maybe = data as { stateName?: unknown; name?: unknown };
    if (typeof maybe.stateName === "string") return maybe.stateName;
    if (typeof maybe.name === "string") return maybe.name;
  }
  return "";
}

export default function RiveCard({
  desktopSrc,
  mobileSrc,
  desktopArtboard,
  mobileArtboard,
  desktopStateMachines,
  mobileStateMachines,
  autoplay = true,
  fit = Fit.Contain,
  alignment = Alignment.Center,
  imgSrc,
  imgAlt = "",
  priority,
  className,
  scale,
  offsetX,
  offsetY,
  desktopScale,
  mobileScale,
  desktopOffsetX,
  desktopOffsetY,
  mobileOffsetX,
  mobileOffsetY,
  ctaHref,
  ctaTarget,
  ctaStateName,
}: RiveCardProps) {
  const isMobile = useIsMobile();

  const willUseRive = !!desktopSrc || !!mobileSrc;

  const config = useMemo(() => {
    if (!willUseRive) return null;
    return isMobile
      ? {
          src: mobileSrc ?? desktopSrc!,
          artboard: mobileArtboard,
          stateMachines: mobileStateMachines,
        }
      : {
          src: desktopSrc ?? mobileSrc!,
          artboard: desktopArtboard,
          stateMachines: desktopStateMachines,
        };
  }, [
    willUseRive,
    isMobile,
    desktopSrc,
    mobileSrc,
    desktopArtboard,
    mobileArtboard,
    desktopStateMachines,
    mobileStateMachines,
  ]);

  const instanceKey = config
    ? `${config.src}|${config.artboard ?? ""}|${(config.stateMachines ?? []).join(",")}`
    : "image";

  const rive = useRive(
    willUseRive
      ? {
          src: config!.src,
          artboard: config!.artboard,
          stateMachines: config!.stateMachines,
          autoplay,
          layout: new Layout({ fit, alignment }),
          onStateChange: (evt) => {
            const state = getRiveStateName(evt);
            const expect = ctaStateName || "CTA_Click";
            if (state === expect && ctaHref) {
              window.open(ctaHref, ctaTarget || "_self");
            }
          },
        }
      : undefined
  );

  const RiveComponent = rive?.RiveComponent;

  const computedScale = isMobile ? (mobileScale ?? scale ?? 1) : (desktopScale ?? scale ?? 1);
  const computedOffsetX = isMobile ? (mobileOffsetX ?? offsetX ?? 0) : (desktopOffsetX ?? offsetX ?? 0);
  const computedOffsetY = isMobile ? (mobileOffsetY ?? offsetY ?? 0) : (desktopOffsetY ?? offsetY ?? 0);

  return (
    <div
      key={instanceKey}
      className={className ?? "relative w-[342px] h-[362px] rounded-3xl bg-[#0B1220] overflow-hidden"}
      style={{ position: "relative", touchAction: "pan-y" }}
    >
      {willUseRive && RiveComponent ? (
        <RiveComponent
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            transformOrigin: "center center",
            transform: `translate3d(${computedOffsetX}px, ${computedOffsetY}px, 0) scale(${computedScale})`,
            // LIBERA O SCROLL NO MOBILE (o canvas não intercepta os gestos)
            pointerEvents: isMobile ? "none" : "auto",
            touchAction: "pan-y",
          }}
          aria-label="Rive animation"
          role="img"
        />
      ) : (
        <Image
          src={imgSrc ?? "/fallback.png"}
          alt={imgAlt}
          fill
          priority={priority}
          className="object-contain"
        />
      )}
    </div>
  );
}
