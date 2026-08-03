export const site = {
  name: "Gregory Dean",
  title: "Gregory Dean — Cybersecurity Practitioner",
  description:
    "Gregory Dean is a cybersecurity practitioner focused on defending systems, clarifying risk, and building practical security work.",
  url: "https://gregory-dean.com",
  email: "gregdeancyber@proton.me",
  location: "Boise, ID",
  focus:
    "Defending systems, clarifying risk, and building practical security work.",
  links: {
    github: "https://github.com/gregory-dean",
    linkedin: "https://www.linkedin.com/in/gregorydean-/",
    website: "https://gregory-dean.com/",
    email: "mailto:gregdeancyber@proton.me",
  },
} as const;

export const DURATION_TOTAL_REVEAL = 0.95;

export const reveal = {
  hidden: { translateY: 8, filter: "blur(4px)", opacity: 0 },
  visible: {
    translateY: 0,
    filter: "blur(0px)",
    opacity: 1,
    transition: { ease: "easeOut" as const, duration: 0.25 },
  },
};

export const revealBig = {
  hidden: { translateY: 12, filter: "blur(4px)", opacity: 0 },
  visible: {
    translateY: 0,
    filter: "blur(0px)",
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
  /** Optional flag used to visually mark placeholder/template content. */
  placeholder?: boolean;
};

/** The expandable detail content for a work item (razgraf-style panel). */
export type WorkDetail = {
  /** Intro paragraphs shown under the header. */
  summary: string[];
  /** Exactly two gauge widgets, mirroring the reference layout. */
  stats: [WorkStat, WorkStat];
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
    position: "Business Systems Analyst",
    years: ["2026 — Present"],
    description:
      "Drive operational improvements by bridging business processes and technology. Design internal software, perform IT and security assessments, and help teams adopt more effective systems.",
    icon: "building",
    link: null,
    detail: {
      summary: [
        "KD Roofing is a regional roofing contractor where I sit between the operations team and the technology that keeps the business running.",
        "I design internal software, run IT and security assessments, and help crews and office staff adopt systems that actually fit how they work.",
      ],
      stats: [
        {
          value: 1240,
          sub: "assets tracked in the CMDB",
          caption: "CMDB — single source of truth",
          progress: 0.82,
          tone: "accent",
        },
        {
          value: 37,
          unit: "%",
          sub: "less manual data entry",
          caption: "Process automation",
          progress: 0.37,
          tone: "neutral",
        },
      ],
      sections: [
        {
          heading: "CMDB software",
          placeholder: true,
          body: [
            "Placeholder — this is where I'll highlight the custom CMDB (Configuration Management Database) I built for KD Roofing.",
            "The write-up will cover the data model for people, hardware, vehicles and software, the relationships between them, and how the tool became the operational source of truth for the business.",
            "Swap this copy (and the gauges above) for the real story, screenshots, and metrics when ready.",
          ],
        },
        {
          heading: "The idea",
          body: [
            "Most process problems here were really data problems — the same information re-entered across spreadsheets, inboxes, and whiteboards.",
            "The plan is to model that information once, keep it accurate, and let the software do the reconciling so the team can focus on the work instead of the paperwork.",
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
      "Immersive offensive and defensive training across penetration testing, threat detection, incident response, Active Directory, and security operations. Earned ESCP certification.",
    icon: "shield",
    link: { href: "/writing/evolve-security-academy", label: "Read my notes" },
    detail: {
      summary: [
        "Evolve Security Academy is an apprenticeship-style program that trains practitioners through hands-on offensive and defensive labs rather than slideware.",
        "I worked across penetration testing, threat detection, incident response, and Active Directory, and earned the ESCP certification.",
      ],
      stats: [
        {
          value: 320,
          unit: "hrs",
          sub: "hands-on lab time",
          caption: "Offense + defense labs",
          progress: 0.9,
          tone: "accent",
        },
        {
          value: 100,
          unit: "%",
          sub: "ESCP exam completed",
          caption: "Certified practitioner",
          progress: 1,
          tone: "neutral",
        },
      ],
      sections: [
        {
          heading: "The idea",
          body: [
            "Security clicks when you attack and defend the same system — so the labs pushed both sides until the concepts stuck.",
            "I kept detailed notes throughout; the arrow on this row links to those write-ups.",
          ],
        },
      ],
    },
  },
  {
    id: "soiltech",
    name: "Soiltech Wireless",
    position: "IT Technician",
    years: ["2024 — 2026"],
    description:
      "Technical support for users, systems, and wireless infrastructure. Diagnosed hardware and software issues and kept day-to-day operations reliable.",
    icon: "wifi",
    link: { href: "https://www.soiltechwireless.com/", label: "Visit Soiltech Wireless" },
    detail: {
      summary: [
        "Soiltech Wireless builds rugged sensors and wireless telemetry for the field, so reliable day-to-day IT is what keeps the operation moving.",
        "I supported users, systems, and wireless infrastructure — diagnosing hardware and software issues and keeping operations dependable.",
      ],
      stats: [
        {
          value: 98,
          unit: "%",
          sub: "systems uptime maintained",
          caption: "Reliable operations",
          progress: 0.98,
          tone: "accent",
        },
        {
          value: 450,
          sub: "support tickets resolved",
          caption: "User + hardware support",
          progress: 0.7,
          tone: "neutral",
        },
      ],
      sections: [
        {
          heading: "The idea",
          body: [
            "Good IT support is mostly about removing friction before people notice it.",
            "The goal was steady infrastructure and fast fixes so the field and office teams never had to think about their tools.",
          ],
        },
      ],
    },
  },
];
