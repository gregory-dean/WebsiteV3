"use client";

import { useEffect, useState } from "react";
import { DURATION_TOTAL_REVEAL, site } from "@/data/site";
import { EmphasizedLink } from "@/components/LinkOrnament";
import { ParticleHost } from "@/components/ParticleHost";
import { SocialLinks } from "@/components/SocialLinks";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function Hero() {
  const [step, setStep] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let elapsed = 0;
    let last = performance.now();
    let hidden = document.hidden;
    let frame = 0;

    const onVisibility = () => {
      hidden = document.hidden;
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!hidden) {
        elapsed += dt;
        const next = Math.max(
          0,
          Math.floor((elapsed - DURATION_TOTAL_REVEAL) / 6),
        );
        setStep(next % 3);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="hero-reveal text-lg text-title">
        Hey, I&apos;m {site.shortName}!
      </p>

      <p className="hero-reveal hero-reveal-2 text-base text-description [&>span]:text-title">
        I&apos;m a{" "}
        <EmphasizedLink
          value="cybersecurity professional"
          active={step === 0}
          href={site.links.linkedin}
        />{" "}
        with experience across a few different sectors. My focus is SOC
        analysis, web app penetration testing, and IT infrastructure. I&apos;m
        comfortable with the usual red and blue team tooling, and I&apos;ve
        built networks and then secured them.
        <br />
        I approach every problem with curiosity. I want to understand the
        underlying system before I try to defend it.
      </p>

      <div className="hero-reveal hero-reveal-3 flex w-full flex-col gap-6">
        <p className="text-base text-description [&>span]:text-title">
          Below you&apos;ll find my experience, plus{" "}
          <EmphasizedLink
            value="writeups and projects"
            active={step === 1}
            href="/writing"
          />{" "}
          I found interesting. My most recent project was a full rebuild of my
          homelab on new physical hardware.{" "}
          <EmphasizedLink
            value="Check it out here"
            active={step === 2}
            href="/writing/homelab-foundation"
          />
          !
        </p>
        <ParticleHost />
        <SocialLinks />
      </div>
    </div>
  );
}
