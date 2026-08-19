"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  DURATION_TOTAL_REVEAL,
  list,
  reveal,
  revealBig,
  site,
} from "@/data/site";
import { EmphasizedLink } from "@/components/LinkOrnament";
import { SocialLinks } from "@/components/SocialLinks";

const ParticleScene = dynamic(
  () =>
    import("@/components/ParticleScene").then((m) => m.ParticleScene),
  { ssr: false },
);

export function Hero() {
  const [step, setStep] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      className="flex w-full flex-col gap-6 will-change-transform"
      initial="hidden"
      animate="visible"
      variants={list}
    >
      <motion.p variants={reveal} className="text-lg text-title">
        Hi, I&apos;m {site.name}
      </motion.p>

      <motion.p
        variants={reveal}
        className="text-base text-description [&>span]:text-title"
      >
        I&apos;m a{" "}
        <EmphasizedLink
          value="cybersecurity practitioner"
          active={step === 0}
          href={site.links.linkedin}
        />{" "}
        focused on defending systems, clarifying risk, and building practical
        security work. <br />
        Trained through Evolve Security Academy, fluent in offense and defense
        across networks, Active Directory, and SOC tooling.
      </motion.p>

      <motion.div variants={revealBig} className="w-full">
        <div className="flex w-full flex-col gap-6">
          <p className="text-base text-description [&>span]:text-title">
            Recent adventures include a full{" "}
            <EmphasizedLink
              value="cybersecurity homelab"
              active={step === 2}
              href="https://github.com/gregory-dean/Homelab"
            />{" "}
            and hands-on apprentice work at Evolve. I&apos;m looking for SOC
            Analyst or Junior Penetration Tester roles.
          </p>
          <ParticleScene delay={DURATION_TOTAL_REVEAL} morphSeconds={6} />
          <SocialLinks />
        </div>
      </motion.div>
    </motion.div>
  );
}
