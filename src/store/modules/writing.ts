import { defineStore } from "pinia";

export interface IWritingStore {
  currentWritingText: string;
  currentWritingPath: string;
}

export const useWritingStore = defineStore("writing", {
  state: (): IWritingStore => ({
    currentWritingText: "",
    currentWritingPath: "index.md",
  }),
  getters: {
    currentWritingPathArray: (state) => {
      return state.currentWritingPath.split("/");
    },
  },
  actions: {
    setCurrentWritingText(val: string) {
      this.currentWritingText = val;
    },
    setCurrentWritingPath(val: string) {
      this.currentWritingPath = val;
    },
  },
});
