import { checkValidGateway } from './artools';
import { loadImgs, loadManifest } from './loader';
import { useStore } from '@/store';

export const init = async () => {
  const store = useStore();
  try {
    await checkValidGateway();
    await Promise.all([loadImgs(), loadManifest()]);
    store.loadCompleted();
  } catch (error) {
    store.isLoadError = true;
    console.error(error)
  }
};
