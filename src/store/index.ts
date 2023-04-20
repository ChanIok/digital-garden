import { defineStore } from "pinia";
import { IManifest } from "@/typings";

export { useLoadingBarStore } from "@/store/modules/loading-bar";

export interface IAppState {
  isDark: boolean;
  loadingBarAction: string | null;
  windowWidth: number;
  currentWritingText: string;
  manifest: IManifest | null;
}

export const useStore = defineStore("app", {
  state: (): IAppState => ({
    isDark: false,
    loadingBarAction: null,
    windowWidth: 0,
    currentWritingText: "",
    manifest: null,
  }),
  actions: {
    setCurrentWritingText(val: string) {
      this.currentWritingText = val;
    },
    setManifest(val: IManifest) {
      this.manifest = val;
    },
    startLoadingBar() {
      this.loadingBarAction = "start";
    },
    finishLoadingBar() {
      this.loadingBarAction = "finish";
    },
    errorLoadingBar() {
      this.loadingBarAction = "error";
    },
  },
});
