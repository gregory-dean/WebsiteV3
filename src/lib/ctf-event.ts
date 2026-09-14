import { CTF_EVENT, CTF_TOTAL } from "@/data/ctf";

export { CTF_EVENT };

export type CtfEventDetail = {
  found: number;
  total: number;
};

let lastDetail: CtfEventDetail = { found: 0, total: CTF_TOTAL };

export function setLastCtf(detail: CtfEventDetail) {
  lastDetail = detail;
}

export function getLastCtf() {
  return lastDetail;
}
