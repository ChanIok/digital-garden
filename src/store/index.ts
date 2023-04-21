import { defineStore } from "pinia";
import { IManifest } from "@/typings";

export { useLoadingBarStore } from "@/store/modules/loading-bar";
export { useWritingStore } from "@/store/modules/writing";

export interface IAppState {
  isDark: boolean;
  windowWidth: number;
  manifest: IManifest | null;
}

export const useStore = defineStore("app", {
  state: (): IAppState => ({
    isDark: false,
    windowWidth: 0,
    manifest: null,
  }),
  actions: {
    setManifest(val: IManifest) {
      this.manifest = val;
    },
  },
});
