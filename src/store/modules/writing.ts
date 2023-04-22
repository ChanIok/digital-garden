import { defineStore } from "pinia";

export interface IWritingStore {
  currentWritingText: string;
  currentWritingPath: string;
}

export const useWritingStore = defineStore("writing", {
  state: (): IWritingStore => ({
    currentWritingText: "",
    currentWritingPath: "/writings/index.md",
  }),
  getters: {
    currentWritingPathArray: (state) => {
      const temp = state.currentWritingPath.split("/");
      temp.shift();
      return temp;
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
