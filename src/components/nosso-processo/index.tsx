"use client";

import React from "react";
import Link from "next/link";
import ResponsiveRive from "@/components/nosso-processo/NPRive";

export default function HeroSection() {
  return (
    <section className="relative bg-[#010510] w-full overflow-visible">
      {/* Bloco da animação */}
      <div
        className="
          relative w-full mx-auto
          [clip-path:inset(0_0_56px_0)]   /* MOBILE: recorta 56px da base */
          md:[clip-path:inset(0_0_0_0)]   /* DESKTOP/TABLET: sem recorte */
          z-0
        "
        style={{ touchAction: "pan-y" }}
      >
        <ResponsiveRive
          desktopSrc="/NossoProcesso/section_3.riv"
          mobileSrc="/NossoProcesso/mobile_3.riv"
          desktopArtboard="SECTION_3"
          mobileArtboard="MOBILE_3"
          desktopStateMachines={["State Machine 1"]}
          mobileStateMachines={["State Machine 1"]}
          desktopScale={1}
          mobileScale={1}
          desktopOffsetX={0}
          desktopOffsetY={0}
          mobileOffsetX={0}
          mobileOffsetY={0}
          className="
            block w-full mx-auto
            aspect-[430/1454]      /* mobile: cards em coluna */
            md:aspect-[1920/1181]  /* desktop: cards em linha */
          "
        />

        {/* Botão ABSOLUTO no desktop/tablet */}
        <div
          className="
            hidden md:flex
            md:absolute md:left-1/2 md:-translate-x-1/2
            md:bottom-[108px] lg:bottom-[128px]
            z-30 w-full items-center justify-center
          "
        >
          <Link
            href="https://wa.me/5511986542748?text=Olá! Gostaria de saber mais sobre os serviços de tráfego pago da Spot-A. Podem me ajudar a atrair leads qualificados e escalar minhas vendas?"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              rounded-[33.9px] border border-[#F3C53D]/60 bg-black/20 backdrop-blur-md
              px-6 md:px-8
              h-[54px] md:h-[60px] lg:h-[64px]
              w-[66%] md:w-[280px] lg:w-[320px]
              text-sm md:text-lg
              transition-colors hover:border-[#F3C53D]
            "
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Botão no mobile (fora da animação, scroll livre) */}
      <div className="md:hidden relative z-10 flex w-full items-center justify-center mt-[14px]">
        <Link
          href="https://wa.me/5511986542748?text=Olá! Gostaria de saber mais sobre os serviços de tráfego pago da Spot-A. Podem me ajudar a atrair leads qualificados e escalar minhas vendas?"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center justify-center
            rounded-[33.9px] border border-[#F3C53D]/60 bg-black/20 backdrop-blur-md
            px-6 h-[54px] w-[66%] text-sm
            transition-colors hover:border-[#F3C53D]
          "
        >
          Saiba mais
        </Link>
      </div>

      <div className="md:hidden h-6" />
    </section>
  );
}
