import { isLoadCompleted } from "@/store";
import ClipboardJS from "clipboard";
import { initHandler } from "./handler";
import { loadImgs, loadManifest, loadThemeConfig } from "./loader";

export const state = { isLoadManifestCompleted: false };

export const initUtils = () => {
  const clipboard = new ClipboardJS(".btn");
};

export const init = async () => {
  window.parent.postMessage(
    { app: "PlaneOfEuthymia", event: "continueLoading" },
    "*"
  );
  initHandler();
  initUtils();
  loadThemeConfig();
  await loadImgs();
  if (!state.isLoadManifestCompleted) {
    await loadManifest();
  }
  window.parent.postMessage(
    { app: "PlaneOfEuthymia", event: "loadCompleted" },
    "*"
  );
  isLoadCompleted.value = true;
};
