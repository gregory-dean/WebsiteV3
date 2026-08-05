import Link from "next/link";
import { CopyEmail } from "@/components/CopyEmail";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { SkillsSection } from "@/components/SkillsSection";
import { SocialLinks } from "@/components/SocialLinks";
import { WorkList } from "@/components/WorkList";
import { WritingList } from "@/components/WritingList";
import { site } from "@/data/site";
import { getAllWriting } from "@/lib/content";

export default function HomePage() {
  const posts = getAllWriting();

  return (
    <main className="flex w-full flex-col items-center gap-8 pt-10 pb-40 sm:gap-16 sm:pt-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <Hero />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <WorkList />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <SkillsSection />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <WritingList posts={posts} />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <Section>
          <p className="text-base text-title">Education & training</p>
          <p className="text-base text-description [&>a]:text-title [&>a]:hover:text-white">
            Cybersecurity Apprentice at Evolve Security Academy (2025), ESCP
            certified. Hands-on labs across penetration testing, threat
            hunting, malware analysis, and live incident response. CompTIA
            Security+ expected in 2026. Based in {site.location}.
          </p>
        </Section>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-3 align-top sm:px-6 md:px-0">
        <Section>
          <p className="text-base text-title">What&apos;s next</p>
          <p className="text-base text-description [&>a]:text-title [&>a]:hover:text-white">
            If any of the labs or writeups resonate with what you&apos;re
            building,{" "}
            <a
              data-cuelume-press
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>let&apos;s connect</span>
            </a>
            . I&apos;m actively looking for SOC Analyst I or Junior Penetration
            Tester roles where I can contribute and grow under experienced
            practitioners. Or email <CopyEmail />.
          </p>
          <SocialLinks />
          <p className="pt-4 text-xs text-dark-400">
            © {new Date().getFullYear()} {site.name} ·{" "}
            <Link href="/writing" className="hover:text-title">
              Projects & writing
            </Link>
          </p>
        </Section>
      </div>
    </main>
  );
}
