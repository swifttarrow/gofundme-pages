export const APP_DATA_REFRESH_EVENT = "gosupportme:data-refresh";

export function emitAppDataRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(APP_DATA_REFRESH_EVENT));
}
