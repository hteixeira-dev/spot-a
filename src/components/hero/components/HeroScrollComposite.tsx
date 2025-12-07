"use client"

import ImageSequenceLite from "../ImagenSequenceLite";
import { useEffect, useState } from "react";

type Props = {
  progress?: number; // 0..1 do ScrollTrigger
  visible: boolean;
  // Aparência/transform comuns às duas sequências
  orient?: "none" | "flipY" | "flipX" | "rotate180";
  fit?: "cover" | "contain";
  yPct?: number;
  zoom?: number;
  // Percentual do scroll dedicado à primeira sequência (esteira com cubos)
  ratio?: number; // 0..1, default 0.35 (35% do scroll para a esteira)
};

// Componente composto: primeiro reproduz a seq-loop (esteira/cubos) uma vez,
// depois continua com a seq-scroll (queda) — tudo dirigido pelo scroll, sem repetir.
export default function HeroScrollComposite({
  progress = 0,
  visible,
  orient = "flipY",
  fit = "cover",
  yPct = 0,
  zoom = 1,
  ratio = 0.35,
}: Props) {
  // Gera fontes imediatamente (sem depender de manifest) e permite usar CDN via env NEXT_PUBLIC_CDN_BASE_SCROLL
  // Atenção: a sequência de queda (scroll) está nomeada como HERO_QUEDA###.png e contém 545 frames
  const sourcesScroll = (() => {
    const total = 545; // 001..545 conforme arquivos em /public/AnimationHero/seq-scroll
    // Se informado, use NEXT_PUBLIC_CDN_BASE_SCROLL ou NEXT_PUBLIC_CDN_BASE como diretório absoluto do CDN
    const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE_SCROLL || process.env.NEXT_PUBLIC_CDN_BASE;
    const baseDir = cdnBase && cdnBase.length > 0 ? cdnBase.replace(/\/$/, "") : "/AnimationHero/seq-scroll";
    const localPng = Array.from({ length: total }, (_, i) => {
      const idx = String(i + 1).padStart(3, "0");
      return `${baseDir}/HERO_QUEDA${idx}.png`;
    });
    return localPng;
  })();

  
  const p = Math.min(1, Math.max(0, progress));
  const pScroll = p;
  const showScroll = true;

  return (
    <>
      {/* Sequência de scroll (queda) – continua após terminar a esteira */}
      <ImageSequenceLite
        count={545}
        fps={24}
        dir="/AnimationHero/seq-scroll" // com 'sources' preenchido, 'dir' e 'base' servem como fallback
        base="HERO_QUEDA"
        pad={3}
        ext={'png'}
        // Evita tentar outros formatos
        extCandidates={["png"]}
        sources={sourcesScroll}
        maxCache={6}
        // Janela/concorrência mais generosas para suavidade com CDN
        netProfileOverride={{ MAX_INFLIGHT: 6, WINDOW: 24 }}
        prefetchWindow={20}
        start={1}
        progress={pScroll}
        loops={1}
        visible={visible}
        orient={orient}
        fit={fit}
        yPct={yPct}
        zoom={zoom}
      />
    </>
  );
}