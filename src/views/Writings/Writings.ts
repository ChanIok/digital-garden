import { appEnv } from "@/config";
import { useLoadingBarStore } from "@/store/modules/loading-bar";
import { getFullPath } from "@/utils/artools";
import { nextTick } from "vue";
import { useStore, useWritingStore } from "@/store";
import { useRoute } from "vue-router";
import { getLocalWritingByPath } from "@/utils/dev";
import axios from "axios";

export const checkPath = async () => {
  const route = useRoute();
  const txIdTemp = route.params.txId;
  if (route.params.txId == undefined || route.params.txId == "") {
    return;
  }
  const path = await getFullPath(txIdTemp as string);
  if (path == "") {
    return;
  }
  const writingStore = useWritingStore();
  writingStore.setCurrentWritingPath(path);
};

export const loadWriting = async () => {
  const store = useStore();
  const writingStore = useWritingStore();
  const manifest = store.manifest;
  const currentWritingPath = writingStore.currentWritingPath;

  const loadingBarStore = useLoadingBarStore();
  loadingBarStore.startLoadingBar();
  if (appEnv.VITE_USE_LOCAL_WRITINGS) {
    const text = await getLocalWritingByPath(currentWritingPath);
    writingStore.setCurrentWritingText(text);
  } else {
    const text = (
      await axios.get(
        `https://arweave.net/${manifest!.paths[currentWritingPath].id}`
      )
    ).data;
    writingStore.setCurrentWritingText(text);
  }
  await nextTick();
  loadingBarStore.finishLoadingBar();
};
