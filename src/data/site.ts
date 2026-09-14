export const site = {
  name: "Gregory Dean",
  shortName: "Greg Dean",
  title: "Gregory Dean · Cybersecurity Professional",
  description:
    "Cybersecurity professional in Boise. SOC analysis, web app penetration testing, and IT infrastructure. Writeups, projects, and a homelab rebuilt on new hardware.",
  url: "https://gregory-dean.com",
  email: "gregdeancyber@proton.me",
  location: "Boise, ID",
  focus: "Defend systems, document what I find, and build tooling when the work requires it.",
  links: {
    github: "https://github.com/gregory-dean",
    linkedin: "https://www.linkedin.com/in/gregorydean-/",
    website: "https://gregory-dean.com/",
    homelab: "https://github.com/gregory-dean/Homelab",
    websiteSource: "https://github.com/gregory-dean/WebsiteV3",
  },
} as const;

export const DURATION_TOTAL_REVEAL = 0.95;

export const PARTICLE_FRAME_CLASS =
  "relative mt-3 h-30 w-full overflow-hidden rounded-md border border-dark-700 border-t-hairline sm:h-35 md:h-45";

export const reveal = {
  hidden: { translateY: 8, opacity: 0 },
  visible: {
    translateY: 0,
    opacity: 1,
    transition: { ease: "easeOut" as const, duration: 0.25 },
  },
};

export const revealBig = {
  hidden: { translateY: 12, opacity: 0 },
  visible: {
    translateY: 0,
    opacity: 1,
    transition: { ease: "easeOut" as const, duration: 0.5 },
  },
};

export const list = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.15, staggerChildren: 0.15 },
  },
};

export const skillsRows = [
  [
    "Python",
    "Bash",
    "PowerShell",
    "Linux",
    "Kali Linux",
    "Windows Server",
    "Active Directory",
    "Group Policy",
    "DNS",
  ],
  [
    "Nmap",
    "Burp Suite",
    "Metasploit",
    "Wireshark",
    "Nessus",
    "OpenVAS",
    "Sysmon",
    "Zeek",
    "Wazuh",
  ],
  [
    "ELK Stack",
    "Splunk",
    "MITRE ATT&CK",
    "OWASP Top 10",
    "NIST CSF",
    "CIS Controls",
    "ISO 27001",
    "Detection Engineering",
  ],
  [
    "Penetration Testing",
    "Incident Response",
    "Threat Hunting",
    "Log Analysis",
    "SIEM",
    "AWS",
    "Docker",
    "Git",
    "GitHub",
  ],
] as const;

/** A single animated gauge widget inside a work detail panel. */
export type WorkStat = {
  /** Big number rendered at the center of the gauge. */
  value: number;
  /** Digits shown after the decimal (kept for the razgraf-style readout). */
  decimals?: number;
  /** Short unit or label rendered next to the value (e.g. "%", "hrs"). */
  unit?: string;
  /** Secondary line under the value (e.g. "of 1,500 assets"). */
  sub: string;
  /** Caption rendered under the whole widget. */
  caption: string;
  /** Arc fill from 0 to 1. */
  progress: number;
  /** `accent` uses the theme accent color, `neutral` a muted tone. */
  tone: "accent" | "neutral";
};

/** A titled narrative block inside a work detail panel. */
export type WorkSection = {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
};

/** The expandable detail content for a work item (razgraf-style panel). */
export type WorkDetail = {
  /** Intro paragraphs shown under the header. */
  summary: string[];
  /** Optional cover image rendered in a fixed 16:9 frame. */
  image?: { src: string; alt: string };
  /** Optional gauge widgets (up to two). Omit when no real metric exists. */
  stats?: WorkStat[];
  /** Optional arrow-list of concrete things done in the role. */
  highlights?: string[];
  /** Narrative sections (e.g. "The idea"). */
  sections: WorkSection[];
};

/** External / internal jump target for the arrow (↗) action on a row. */
export type WorkLink = {
  href: string;
  /** Tooltip / accessible label. */
  label: string;
};

export type ExperienceItem = {
  id: string;
  name: string;
  position: string;
  years: string[];
  description: string;
  icon: "building" | "shield" | "wifi";
  /** Arrow (↗) "take me elsewhere" target. `null` hides the arrow. */
  link: WorkLink | null;
  detail: WorkDetail;
};

export const experience: ExperienceItem[] = [
  {
    id: "kd-roofing",
    name: "KD Roofing",
    position: "Security Systems Analyst",
    years: ["2026 to Present"],
    description:
      "I build internal platforms, run security assessments, and harden the systems the company depends on.",
    icon: "building",
    link: { href: "https://kdroofing.com/", label: "Visit KD Roofing" },
    detail: {
      summary: [
        "KD Roofing is a regional roofing contractor. I own the systems that keep the office and field teams running, from access control to the software they use every day.",
        "Most of the work is the same problem from two sides: you cannot protect assets you cannot see, and you cannot run a business on data that lives in three spreadsheets that disagree.",
      ],
      highlights: [
        "Building Keystone, an internal CMDB that gives the company one view of its people, hardware, and software",
        "Completed an identity and access audit across the internal network",
        "Configured security rules in Google Workspace and Microsoft 365",
        "Building agentic services that take repetitive steps out of everyday workflows",
        "Writing technical and workplace SOPs so a process survives the person who wrote it",
        "Configuring devices and IT equipment for office and field teams",
        "Day-to-day troubleshooting and phishing analysis",
      ],
      sections: [
        {
          heading: "Keystone, the internal CMDB",
          body: [
            "The same information lived in spreadsheets, inboxes, and whiteboards, and none of it agreed. Keystone is the CMDB I am building to model that information once and keep it accurate.",
            "It is becoming the source of truth for people, hardware, and software. That also makes the security work possible. You cannot protect assets you cannot see.",
          ],
        },
        {
          heading: "Security work",
          body: [
            "I finished an identity and access audit across the internal network, then used what I found to tighten rules in both the Google and Microsoft workspaces.",
            "The rest is the weekly work: phishing analysis, device hardening, and SOPs that make the secure path the default path.",
          ],
        },
      ],
    },
  },
  {
    id: "evolve",
    name: "Evolve Security Academy",
    position: "Cybersecurity Apprentice",
    years: ["2025"],
    description:
      "Hands-on offense and defense through Evolve Security Academy. I earned the ESCP and finished on a live client penetration test.",
    icon: "shield",
    link: null,
    detail: {
      summary: [
        "Evolve Security Academy is an apprenticeship-style program built around labs instead of slide decks. I trained on both offense and defense and earned the Evolve Security Certified Professional (ESCP) certification.",
        "The program ended with a team-based penetration test for the Drug Policy Alliance. Live client environment, real findings, real report.",
      ],
      stats: [
        {
          value: 24,
          sub: "Validated findings from a live client engagement",
          caption: "Penetration test",
          progress: 1,
          tone: "accent",
        },
        {
          value: 7,
          unit: "mo",
          sub: "Hands-on offense and defense apprenticeship",
          caption: "Lab immersion",
          progress: 0.58,
          tone: "neutral",
        },
      ],
      highlights: [
        "Supported a live penetration test for the Drug Policy Alliance across recon, validation, and reporting",
        "Identified and documented 24 validated vulnerabilities with CVSS-based prioritization",
        "Wrote findings that both technical and non-technical stakeholders could act on",
        "Built a Python tool on the HIBP API to automate email exposure checks for the engagement report",
        "Created SIEM dashboards in Splunk and ELK and mapped log findings to MITRE ATT&CK",
        "Analyzed network traffic with Wireshark and Zeek and tested web apps against the OWASP Top 10",
        "Built AWS lab environments with segmented subnets and applied NIST CSF, CIS Controls, and ISO 27001",
      ],
      sections: [
        {
          heading: "The Drug Policy Alliance engagement",
          body: [
            "The capstone was a team-based penetration test of a live client environment, run through Evolve. I worked the internal and external assessments with Nmap, Nessus, Burp Suite, and DirBuster.",
            "We validated 24 vulnerabilities, prioritized them with CVSS, and wrote remediation the client could execute. Translating the finding for the person who has to fix it was half the job.",
          ],
        },
        {
          heading: "What stuck",
          body: [
            "Security clicks when you attack and defend the same system. The labs pushed both sides until the path was obvious.",
            "I kept notes throughout. The arrow on this row goes to those write-ups.",
          ],
        },
      ],
    },
  },
  {
    id: "soiltech",
    name: "Soiltech Wireless",
    position: "IT Technician",
    years: ["2024 to 2026"],
    description:
      "I imaged and configured 50+ endpoints and kept the wireless and office systems working.",
    icon: "wifi",
    link: {
      href: "https://www.soiltechwireless.com/",
      label: "Visit Soiltech Wireless",
    },
    detail: {
      summary: [
        "Soiltech Wireless builds rugged sensors and wireless telemetry for agriculture. If the IT is down, the field data stops.",
        "I handled support across users, systems, and wireless infrastructure. I used the role to put a security baseline in place instead of only closing tickets.",
      ],
      stats: [
        {
          value: 50,
          unit: "+",
          sub: "Imaged, configured, and diagnosed across a distributed environment",
          caption: "Endpoint fleet",
          progress: 0.85,
          tone: "accent",
        },
      ],
      highlights: [
        "Imaged, configured, and diagnosed 50+ endpoint devices across a distributed environment",
        "Applied hardening baselines and access control so systems stayed defensible",
        "Assisted with patch management and baseline endpoint security configuration",
        "Wrote and maintained SOPs, network diagrams, and asset documentation",
        "Resolved system and network issues and kept the change notes current",
      ],
      sections: [
        {
          heading: "The idea",
          body: [
            "Most of the job was keeping the field and office teams from having to think about their tools. Steady infrastructure, fast fixes, written down.",
            "The documentation habit I built here, with SOPs, diagrams, and asset records, carried straight into the security work.",
          ],
        },
      ],
    },
  },
];
