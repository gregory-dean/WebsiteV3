export const SIGNAL_EVENT = "gd-signal";

export type SignalEventDetail = {
  on: boolean;
};

let lastDetail: SignalEventDetail = { on: false };

export function setLastSignal(detail: SignalEventDetail) {
  lastDetail = detail;
}

export function getLastSignal() {
  return lastDetail;
}
