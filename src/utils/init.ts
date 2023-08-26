import { loadImgs, loadManifest } from './loader';
import { useStore } from '@/store';

export const init = async () => {
  const store = useStore();
  await loadImgs();
  await loadManifest();
  store.loadCompleted();
};
