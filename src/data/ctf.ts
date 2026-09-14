export const CTF_STORAGE_KEY = "gd-ctf";
export const CTF_EVENT = "gd-ctf";

/** Base64 of flag{base64_is_not_encryption}, shown as a session id. */
export const CTF_SESSION_ID = "ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259";

export const PARTICLE_FLAG_TEXT = "flag{dots}";

export type CtfFlagId =
  | "source"
  | "console"
  | "security"
  | "base64"
  | "dots";

export type CtfFlag = {
  id: CtfFlagId;
  label: string;
  hint: string;
  hash: string;
  reveal: string;
};

/**
 * SHA-256 of the lowercase flag string.
 * Regenerate: node -e "require('crypto').createHash('sha256').update('flag{...}').digest('hex')"
 */
export const CTF_FLAGS: readonly CtfFlag[] = [
  {
    id: "source",
    label: "source",
    hint: "Every page has two faces.",
    hash: "0bab938379ee682e05f376499c23b65d8ad01e751e4fda3b4213b8edf89fa72e",
    reveal: "HTML comment at the top of the body.",
  },
  {
    id: "console",
    label: "console",
    hint: "Developers leave notes where users don't look.",
    hash: "a8984465c3f6cc801aa698d0b64c692549a0b4e53ee601f9a346e86059334809",
    reveal: "Printed to the browser console when the hunt starts.",
  },
  {
    id: "security",
    label: "security.txt",
    hint: "Researchers know where to send a report.",
    hash: "95e41c2647057c3fd369037879c5be158fc1b0c1b7302819d55f7e8c4577c651",
    reveal: "/.well-known/security.txt, advertised from robots.txt.",
  },
  {
    id: "base64",
    label: "sid",
    hint: "Not everything that looks encrypted is.",
    hash: "d7ba614676b457e3e6c432df3d5965368400fd07723d23b85ddbbba4e8e781c3",
    reveal: "The sid in this panel is the flag, base64-encoded.",
  },
  {
    id: "dots",
    label: "dots",
    hint: "Watch the dots.",
    hash: "6065f27461b182ae7ebdab1e5cd40e5c038566857d5b2cac129bf46f48f11701",
    reveal: "The particle field spelled it.",
  },
];

export const CTF_TOTAL = CTF_FLAGS.length;

export const CTF_FLAG_IDS = new Set<string>(CTF_FLAGS.map((flag) => flag.id));
