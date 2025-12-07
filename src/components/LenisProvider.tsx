"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import Lenis from "lenis";

// Tipagem global para expor a instância no window (sem any)
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Inicializa Lenis com configurações otimizadas para a animação do hero
    lenisRef.current = new Lenis({
      duration: 1.1, // reduzir a duração melhora a resposta sem perder suavidade
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing suave
      lerp: 0.06, // menor lerp para reduzir a sensação de atraso
      smoothWheel: true,
      wheelMultiplier: 1.0, // resposta mais direta ao scroll do mouse
      touchMultiplier: 1.2, // toque ligeiramente suavizado
      infinite: false,
    });

    // Função de animação
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Expõe a instância do Lenis globalmente para integração com GSAP
  useEffect(() => {
    if (lenisRef.current) {
      window.lenis = lenisRef.current;
    }
    return () => {
      window.lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
