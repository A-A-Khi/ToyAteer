"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SchoolShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = root.current;
      if (!wrap) return;

      gsap.from(".js-navbar-inner", {
        opacity: 0,
        y: -18,
        duration: 0.55,
        ease: "power2.out",
      });

      const revealEls = gsap.utils.toArray<HTMLElement>(
        wrap.querySelectorAll(".js-reveal")
      );
      revealEls.forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      const statsBlock = wrap.querySelector<HTMLElement>(".js-stats");
      if (statsBlock) {
        ScrollTrigger.create({
          trigger: statsBlock,
          start: "top 82%",
          once: true,
          onEnter: () => {
            statsBlock.querySelectorAll<HTMLElement>(".js-stat-num").forEach(
              (node) => {
                const target = Number(node.dataset.target ?? 0);
                const state = { v: 0 };
                gsap.to(state, {
                  v: target,
                  duration: 2.2,
                  ease: "power2.out",
                  onUpdate: () => {
                    node.textContent = Math.round(state.v).toLocaleString("ar-EG");
                  },
                });
              }
            );
          },
        });
      }

      const domainGrid = wrap.querySelector<HTMLElement>(".js-domains-grid");
      if (domainGrid) {
        const cards = domainGrid.querySelectorAll<HTMLElement>(".js-domain-card");
        gsap.from(cards, {
          opacity: 0,
          y: 42,
          duration: 0.75,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: domainGrid,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: root }
  );

  return (
    <div ref={root} className="flex min-h-screen flex-1 flex-col">
      {children}
    </div>
  );
}
