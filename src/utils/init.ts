import { loadImgs, loadManifest } from './loader';
import { useStore } from '@/store';

export const init = async () => {
  const store = useStore();
  try {
    await loadImgs();
    await loadManifest();
  } catch (error) {
    store.isLoadError = true;
  }
  store.loadCompleted();
};
