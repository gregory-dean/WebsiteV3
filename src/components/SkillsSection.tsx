"use client";

import { ArrowDown, ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { reveal } from "@/data/site";
import { SkillsMarquee } from "@/components/SkillsMarquee";

export function SkillsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={reveal}
      className="flex w-full flex-col gap-6"
    >
      <p className="text-base text-title">Skills</p>
      <p className="text-base text-description [&>span]:text-dark-200">
        In pursuit of <i>practical mastery</i>, I went from{" "}
        <span>supporting</span> systems and users, to{" "}
        <span>breaking</span> and defending them in labs,{" "}
        <span>mapping</span> attacker paths with MITRE ATT&CK, and{" "}
        <span>documenting</span> detection work others can reuse. Today I&apos;m
        sharpening SOC analysis, detection engineering, and clear remediation
        writing.
      </p>

      <div className="flex w-full flex-col gap-1">
        <div className="flex flex-row items-center justify-between">
          <p className="flex items-end gap-0.5 text-sm text-description">
            I can help with{" "}
            <ArrowDownRight className="hidden size-4 text-dark-400 sm:block" />
            <ArrowDown className="size-4 text-dark-400 sm:hidden" />
          </p>
          <p className="hidden items-end gap-0.5 text-sm text-description sm:flex">
            <ArrowDownLeft className="size-4 text-dark-400" /> You&apos;re
            looking for
          </p>
        </div>
        <SkillsMarquee />
        <p className="mt-2 flex items-center gap-0.5 text-sm text-description sm:hidden">
          <ArrowDown className="size-4 rotate-180 text-dark-400" /> You&apos;re
          looking for
        </p>
      </div>
    </motion.section>
  );
}
