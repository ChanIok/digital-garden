import { defineStore } from 'pinia';
import { IManifest } from '@/typings';
import { useStorage, RemovableRef, StorageSerializers } from '@vueuse/core';

export { useWritingStore } from '@/store/modules/writing';

export interface IAppState {
  isDark: RemovableRef<boolean>;
  manifest: RemovableRef<IManifest | null>;
  loadingProgress: number;
  isLoadError: boolean;
  gateway: RemovableRef<string>;
}

export const useStore = defineStore('app', {
  state: (): IAppState => ({
    isDark: useStorage('isDark', true, localStorage),
    manifest: useStorage('manifest', null, localStorage, {
      serializer: StorageSerializers.object,
    }),
    loadingProgress: 0,
    isLoadError: false,
    gateway: useStorage('gateway', 'https://arweave.net', localStorage),
  }),
  actions: {
    setManifest(val: IManifest) {
      this.manifest = val;
    },
    loadCompleted() {
      this.loadingProgress = 1;
    },
    setGateWay(val: string) {
      this.gateway = val;
    },
  },
});
