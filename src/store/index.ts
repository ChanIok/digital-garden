import { defineStore } from "pinia";
import { IManifest } from "@/typings";

export interface IAppState {
  isDark: boolean;
  loadingBarAction: string | null;
  isLoadCompleted: boolean;
  windowWidth: number;
  currentWritingText: string;
  manifest: IManifest | null;
}

export const useStore = defineStore("app", {
  state: (): IAppState => ({
    isDark: false,
    loadingBarAction: null,
    isLoadCompleted: false,
    windowWidth: 0,
    currentWritingText: "",
    manifest: null,
  }),
  actions: {
    setCurrentWritingText(val: string) {
      this.currentWritingText = val;
    },
    setLoadingBarAction(val: string) {
      this.loadingBarAction = val;
    },
    setManifest(val: IManifest) {
      this.manifest = val;
    },
  },
});
