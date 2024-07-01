import { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { ref } from 'vue';

const loadingBarRef = ref<LoadingBarInst | null>(null);

export const useGlobalLoadingBar = () => {
  const setLoadingBar = (instance: LoadingBarInst) => {
    loadingBarRef.value = instance;
  };

  const start = () => loadingBarRef.value?.start();
  const finish = () => loadingBarRef.value?.finish();
  const error = () => loadingBarRef.value?.error();

  return {
    setLoadingBar,
    start,
    finish,
    error,
  };
};
