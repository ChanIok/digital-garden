import { defineStore } from "pinia";
import { IManifest } from "@/typings";
import { useStorage, RemovableRef, StorageSerializers } from "@vueuse/core";

export { useLoadingBarStore } from "@/store/modules/loading-bar";
export { useWritingStore } from "@/store/modules/writing";

export interface IAppState {
  manifest: RemovableRef<IManifest | null>;
}

export const useStore = defineStore("app", {
  state: (): IAppState => ({
    manifest: useStorage("manifest", null, localStorage, {
      serializer: StorageSerializers.object,
    }),
  }),
  actions: {
    setManifest(val: IManifest) {
      this.manifest = val;
    },
  },
});
