"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MOBILE_MAX = 820;

type ItemKey = "google" | "youtube" | "meta" | "diagnostico";

type Item = {
  key: ItemKey;
  title: string;
  html: string;
  img: string;         // logo universal
  imgMobile: string;   // mantido mas não utilizado
  alt: string;
  whatsappMsg: string;
};

const ITEMS: Item[] = [
  {
    key: "google",
    title: "Google Ads",
    html:
      'Atraia <strong>Anúncios</strong> com foco em <strong>Resultados</strong><br/>domine o <strong>Google</strong> e conquiste <strong>Cliques Qualificados</strong>.',
    img: "/NossosServicos/google.png",
    imgMobile: "/NossosServicos/google-mobile.png",
    alt: "Google Ads",
    whatsappMsg:
      "Olá! Tenho interesse em Google Ads da Spot-A. Podem me ajudar a atrair leads qualificados?",
  },
  {
    key: "youtube",
    title: "YouTube Ads",
    html:
      '<strong>Anúncios</strong> no <strong>YouTube</strong> para fortalecer sua presença,<br/>impulsionar <strong>Marcas</strong> ou alavancar <strong>Produtos</strong>.',
    img: "/NossosServicos/youtube.png",
    imgMobile: "/NossosServicos/youtube-mobile.png",
    alt: "YouTube Ads",
    whatsappMsg:
      "Olá! Tenho interesse em YouTube Ads da Spot-A. Podem me ajudar a escalar meus resultados?",
  },
  {
    key: "meta",
    title: "Meta Ads",
    html:
      'Campanhas de <strong>Anúncios</strong> no <strong>Facebook</strong> e <strong>Instagram</strong><br/>com segmentação avançada por <strong>Segmentos</strong><br/>para ampliar alcance e conversões.',
    img: "/NossosServicos/meta.png",
    imgMobile: "/NossosServicos/meta-mobile.png",
    alt: "Meta Ads",
    whatsappMsg:
      "Olá! Tenho interesse em Meta Ads (Facebook/Instagram) da Spot-A. Podemos falar?",
  },
  {
    key: "diagnostico",
    title: "Diagnóstico Ads",
    html:
      '<strong>Análise</strong> profunda das suas contas,<br/>revisão de <strong>Campanhas</strong> e <strong>Oportunidades</strong>,<br/>plano de <strong>Otimizações</strong> imediato.',
    img: "/NossosServicos/diagnostico.png",
    imgMobile: "/NossosServicos/diagnostico-mobile.png",
    alt: "Diagnóstico de Mídia",
    whatsappMsg:
      "Olá! Quero um diagnóstico das minhas campanhas de Ads. Podem analisar e orientar as otimizações?",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const upd = () => setIsMobile(window.innerWidth <= MOBILE_MAX);
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  return isMobile;
}

function GradientBorderButton({
  href,
  children,
  ariaLabel,
  rounded = 24,
  height = 50,
  paddingX = 28,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  rounded?: number;
  height?: number;
  paddingX?: number;
}) {
  return (
    <div
      className="inline-flex group"
      style={{
        padding: 1.5,
        borderRadius: rounded,
        backgroundImage: "linear-gradient(83deg, #708FD8 0%, #2300FD 100%)",
        boxShadow: "0 0 14px rgba(35,0,253,0.18)",
        backgroundSize: "200% 100%",
        backgroundPosition: "0% 0%",
        transition: "background-position 220ms ease, filter 180ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.06)";
        (e.currentTarget as HTMLDivElement).style.backgroundPosition = "100% 0%";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.filter = "";
        (e.currentTarget as HTMLDivElement).style.backgroundPosition = "0% 0%";
      }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center text-white"
        style={{
          borderRadius: rounded - 1,
          height,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          backgroundColor: "rgba(0,0,0,0.20)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: "transform 140ms ease, background-color 180ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.20)";
        }}
      >
        {children}
      </Link>
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
  ariaLabel,
}: {
  dir: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="
        grid place-items-center
        w-[48px] h-[48px]
        rounded-[12px]
        border border-[#7CC1FFCC]
        backdrop-blur-[2px]
        bg-transparent
        shadow-[0_0_10px_rgba(124,193,255,0.35)]
        transition-all duration-150
        hover:bg-white/10
        hover:border-[#AEE0FF]
        hover:shadow-[0_0_14px_rgba(174,224,255,0.45)]
        hover:scale-[1.02]
      "
    >
      <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
        {dir === "left" ? (
          <polygon points="9,2 3,7 9,12" fill="#FFFFFF" />
        ) : (
          <polygon points="5,2 11,7 5,12" fill="#FFFFFF" />
        )}
      </svg>
    </button>
  );
}

export default function NossosServicos() {
  const isMobile = useIsMobile();
  const [idx, setIdx] = useState(0);
  const item = useMemo(() => ITEMS[idx], [idx]);

  const next = () => setIdx((i) => (i + 1) % ITEMS.length);
  const prev = () => setIdx((i) => (i - 1 + ITEMS.length) % ITEMS.length);

  // Caminhos de fundo (desktop e mobile iguais)
  const sessionBgDesktop = (i: number) => `/NossosServicos/fundo${i + 1}.png`;
  const cardBgUniversal = (i: number) => `/NossosServicos/divfundo${i + 1}.png`;

  const sectionBgStyle: React.CSSProperties = isMobile
    ? { backgroundColor: "#010510" }
    : {
        backgroundImage: `url("${sessionBgDesktop(idx)}")`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#010510",
      };

  return (
    <section id="nossos-servicos" className="relative w-full overflow-hidden" style={sectionBgStyle}>
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-center min-h-[100dvh] md:min-h-[1500px] py-8 md:py-10">
          {/* Cabeçalho */}
          <header className="text-center max-w-[1100px] mx-auto -translate-y-[5px]">
            <h1 className="font-semibold tracking-tight text-[28px] sm:text-[34px] md:text-[46px] lg:text-[54px] leading-[1.15] bg-[linear-gradient(91.64deg,_#04070D_-6.08%,_#D5DBE6_37.96%)] bg-clip-text text-transparent">
              Nossos Serviços
            </h1>
            <p className="mt-3 md:mt-4 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[1.45] sm:leading-[1.55] text-[#D5DBE6]">
              <span className="capitalize">Para</span>{" "}
              <span className="capitalize">atrair,</span>{" "}
              <span className="capitalize">qualificar</span>{" "}
              <span className="lowercase">e</span>{" "}
              <span className="capitalize">converter</span>{" "}
              <span className="capitalize">leads</span>
            </p>
          </header>

          {/* ===== Desktop ===== */}
          {!isMobile && (
            <div className="w-full mt-8 md:mt-10 lg:mt-12 flex flex-col items-center">
              <div className="relative mx-auto w-full max-w-[1200px] rounded-2xl overflow-hidden border border-white/10 bg-transparent backdrop-blur-[6px] shadow-[0_0_40px_rgba(115,175,255,0.15)] px-6 md:px-8 lg:px-10 py-7 md:py-9">
                {/* BG card desktop (universal) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[-2px] rounded-[inherit] -z-10"
                  style={{
                    backgroundImage: `url("${cardBgUniversal(idx)}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                {/* véu */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit] -z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(1,5,22,0.08) 0%, rgba(1,5,22,0.16) 100%)",
                  }}
                />

                <div className="grid grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-center">
                  <div className="col-span-12 md:col-span-7">
                    <h2 className="text-white font-semibold text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] leading-[1.2]">
                      {item.title}
                    </h2>

                    <div className="mt-6 md:mt-7 lg:mt-8" />

                    <p
                      className="text-[#E6ECF8] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[1.6]"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    />

                    <div className="mt-4 md:mt-5">
                      <GradientBorderButton
                        href={`https://wa.me/5511986542748?text=${encodeURIComponent(item.whatsappMsg)}`}
                        ariaLabel="Adquirir este serviço"
                      >
                        Adquirir este serviço
                      </GradientBorderButton>
                    </div>
                  </div>

                  {/* Logo (desktop) */}
                  <div className="col-span-12 md:col-span-5 flex items-center justify-end">
                    <div className="relative w-[440px] sm:w-[520px] md:w-[600px] lg:w-[640px] aspect-[16/10]">
                      <Image
                        src={item.img}
                        alt={item.alt}
                        fill
                        className="object-contain pointer-events-none select-none"
                        sizes="(max-width: 1280px) 600px, 640px"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Setas */}
              <div className="mt-8 md:mt-9 lg:mt-10 translate-y-[6px] flex items-center justify-center">
                <div className="flex items-center justify-center gap-[3px]">
                  <ArrowButton dir="left" onClick={prev} ariaLabel="Anterior" />
                  <ArrowButton dir="right" onClick={next} ariaLabel="Próximo" />
                </div>
              </div>
            </div>
          )}

          {/* ===== Mobile (logo universal + fundo universal sem -mobile) ===== */}
          {isMobile && (
            <div className="w-full mt-8 sm:mt-10 grid grid-cols-1 gap-[30px]">
              {ITEMS.map((it, i) => {
                const bg = cardBgUniversal(i);
                return (
                  <article
                    key={it.key}
                    className="relative w-full rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_36px_rgba(124,193,255,0.18)] px-4 py-6 backdrop-blur-[10px]"
                    style={{ backgroundColor: "transparent" }}
                  >
                    {/* BG do card (AGORA universal) */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-[-2px] rounded-[inherit]"
                      style={{
                        backgroundImage: `url("${bg}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    {/* véu */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[inherit]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(1,5,22,0.08) 0%, rgba(1,5,22,0.16) 100%)",
                      }}
                    />

                    <div className="relative">
                      {/* Logo (universal) */}
                      <div className="w-full flex items-center justify-center">
                        <div className="relative w-[92%] max-w-[460px] aspect-[16/10] -translate-x-[2px]">
                          <Image
                            src={it.img}
                            alt={it.alt}
                            fill
                            className="object-contain pointer-events-none select-none"
                            sizes="95vw"
                            priority={it.key === "google"}
                            style={{ objectPosition: "right bottom" }}
                            quality={100}
                          />
                        </div>
                      </div>

                      <h3 className="mt-4 text-center text-white font-semibold text-[20px] leading-[1.22]">
                        {it.title}
                      </h3>

                      <p
                        className="mt-3 text-center text-[#E6ECF8] text-[15px] leading-[1.55]"
                        dangerouslySetInnerHTML={{ __html: it.html }}
                      />

                      <div className="mt-4 flex items-center justify-center">
                        <GradientBorderButton
                          href={`https://wa.me/5511986542748?text=${encodeURIComponent(it.whatsappMsg)}`}
                          ariaLabel="Adquirir este serviço"
                          rounded={22}
                          height={44}
                          paddingX={20}
                        >
                          Adquirir este serviço
                        </GradientBorderButton>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
