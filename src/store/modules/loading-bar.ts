import { defineStore } from "pinia";

export interface ILoadingBar {
  loadingBarAction: null | "start" | "finish" | "error";
}

export const useLoadingBarStore = defineStore("loading-bar", {
  state: (): ILoadingBar => ({
    loadingBarAction: null,
  }),
  actions: {
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
