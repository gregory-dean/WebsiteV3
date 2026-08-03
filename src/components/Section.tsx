"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { reveal } from "@/data/site";

export function Section({
  children,
  variants = reveal,
}: {
  children: ReactNode;
  variants?: Variants;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={variants}
      className="flex w-full flex-col gap-6"
    >
      {children}
    </motion.div>
  );
}
