import { defineStore } from "pinia";

export interface ILoadingBarStore {
  loadingBarAction: null | "start" | "finish" | "error";
}

export const useLoadingBarStore = defineStore("loading-bar", {
  state: (): ILoadingBarStore => ({
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
