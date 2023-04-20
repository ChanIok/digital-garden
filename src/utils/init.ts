import { initHandler } from "./handler";
import { loadImgs, loadManifest, loadThemeConfig } from "./loader";

export const state = { isLoadManifestCompleted: false };


export const init = async () => {
  window.parent.postMessage(
    { app: "PlaneOfEuthymia", event: "continueLoading" },
    "*"
  );
  initHandler();
  loadThemeConfig();
  await loadImgs();
  if (!state.isLoadManifestCompleted) {
    await loadManifest();
  }
  window.parent.postMessage(
    { app: "PlaneOfEuthymia", event: "loadCompleted" },
    "*"
  );
};
