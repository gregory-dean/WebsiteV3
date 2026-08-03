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

export const experience = [
  {
    id: "kd-roofing",
    name: "KD Roofing",
    position: "Business Systems Analyst",
    years: ["2026 — Present"],
    description:
      "Drive operational improvements by bridging business processes and technology. Design internal software, perform IT and security assessments, and help teams adopt more effective systems.",
    href: "https://gregory-dean.com/",
    icon: "building",
  },
  {
    id: "evolve",
    name: "Evolve Security Academy",
    position: "Cybersecurity Apprentice",
    years: ["2025"],
    description:
      "Immersive offensive and defensive training across penetration testing, threat detection, incident response, Active Directory, and security operations. Earned ESCP certification.",
    href: "https://www.linkedin.com/in/gregorydean-/",
    story: "/writing/evolve-security-academy",
    icon: "shield",
  },
  {
    id: "soiltech",
    name: "Soiltech Wireless",
    position: "IT Technician",
    years: ["2024 — 2026"],
    description:
      "Technical support for users, systems, and wireless infrastructure. Diagnosed hardware and software issues and kept day-to-day operations reliable.",
    href: "https://gregory-dean.com/",
    icon: "wifi",
  },
] as const;
