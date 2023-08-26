import { loadImgs, loadManifest } from './loader';
import { useStore } from '@/store';

export const init = async () => {
  const store = useStore();
  try {
    await Promise.all([loadImgs(), loadManifest()]);
    store.loadCompleted();
  } catch (error) {
    store.isLoadError = true;
  }
};
