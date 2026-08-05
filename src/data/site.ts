export const site = {
  name: "Gregory Dean",
  title: "Gregory Dean · Cybersecurity Practitioner",
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
      "I sit between business operations and the technology behind them. I build internal platforms, run security assessments, and harden the systems the company depends on every day.",
    icon: "building",
    link: null,
    detail: {
      summary: [
        "KD Roofing is a regional roofing contractor, and I run point on the systems that keep it moving. The role covers everything from security assessments to internal software, so no two weeks look the same.",
        "My focus is making the company measurably harder to compromise while making the day-to-day work easier. That means better data, tighter access, and tooling the team actually wants to use.",
      ],
      highlights: [
        "Building Keystone, an internal CMDB platform that gives the company one accurate view of its assets",
        "Completed an internal security audit covering identity and access across the whole network",
        "Configured security rules and controls across Google Workspace and Microsoft 365",
        "Building agentic services that take repetitive steps out of everyday workflows",
        "Writing technical and workplace SOPs so processes survive beyond one person's memory",
        "Configuring devices and IT equipment for office and field teams",
        "Day-to-day troubleshooting and phishing analysis",
      ],
      sections: [
        {
          heading: "Keystone, the internal CMDB",
          body: [
            "Most process problems here were really data problems. The same information lived in spreadsheets, inboxes, and whiteboards, and none of it agreed. Keystone is the internal CMDB platform I am building to model that information once and keep it accurate.",
            "It is becoming the operational source of truth for people, hardware, and software, which also makes the security work easier. You cannot protect assets you cannot see.",
          ],
        },
        {
          heading: "Security work",
          body: [
            "I completed an identity and access audit across the internal network, then used what I found to tighten security rules in both the Google and Microsoft workspaces.",
            "The rest is steady practice: phishing analysis, device hardening, and SOPs that make the secure path the easy path.",
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
      "Immersive offensive and defensive training across penetration testing, threat detection, incident response, and security operations. Earned the ESCP certification.",
    icon: "shield",
    link: { href: "/writing/evolve-security-academy", label: "Read my notes" },
    detail: {
      summary: [
        "Evolve Security Academy is an apprenticeship style program built around hands-on labs instead of slide decks. I trained across both offense and defense and earned the Evolve Security Certified Professional (ESCP) certification.",
        "The program ended with the real thing: a team based penetration test for the Drug Policy Alliance, a live client environment with real stakes and real reporting.",
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
        "Identified and documented 24 validated vulnerabilities with CVSS based prioritization",
        "Delivered written findings that both technical and non-technical stakeholders could act on",
        "Built a Python tool on the HIBP API to automate email exposure checks for the engagement report",
        "Created SIEM dashboards in Splunk and ELK and mapped log findings to MITRE ATT&CK",
        "Analyzed network traffic with Wireshark and Zeek and tested web apps against the OWASP Top 10",
        "Built AWS lab environments with segmented subnets and applied NIST CSF, CIS Controls, and ISO 27001",
      ],
      sections: [
        {
          heading: "The Drug Policy Alliance engagement",
          body: [
            "The capstone was a team based penetration test of a live client environment, run through Evolve. I worked across the internal and external assessments using Nmap, Nessus, Burp Suite, and Dirbuster.",
            "We validated 24 vulnerabilities, prioritized them with CVSS, and wrote remediation guidance the client could actually execute. Translating technical findings for non-technical stakeholders turned out to be half the job.",
          ],
        },
        {
          heading: "What stuck",
          body: [
            "Security clicks when you attack and defend the same system, so the labs pushed both sides until the concepts stuck.",
            "I kept detailed notes throughout. The arrow on this row links to those write-ups.",
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
      "Technical support for users, systems, and wireless infrastructure. I imaged and configured 50+ endpoint devices and kept day-to-day operations dependable.",
    icon: "wifi",
    link: { href: "https://www.soiltechwireless.com/", label: "Visit Soiltech Wireless" },
    detail: {
      summary: [
        "Soiltech Wireless builds rugged sensors and wireless telemetry for agriculture, so dependable IT is what keeps the field data flowing.",
        "I handled support across users, systems, and wireless infrastructure, and I used the role to build a real security baseline instead of just closing tickets.",
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
        "Applied hardening baselines and access control configurations to keep systems defensible",
        "Assisted with patch management and baseline endpoint security configuration",
        "Developed and maintained SOPs, network diagrams, and asset documentation",
        "Resolved system and network issues while keeping change documentation current",
      ],
      sections: [
        {
          heading: "The idea",
          body: [
            "Good IT support is mostly about removing friction before anyone notices it. Steady infrastructure and fast fixes meant the field and office teams never had to think about their tools.",
            "The documentation habit I built here, with SOPs, diagrams, and asset records, carried straight into my security work.",
          ],
        },
      ],
    },
  },
];
