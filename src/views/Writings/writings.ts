import { appEnv } from "@/config";
import { useLoadingBarStore } from "@/store/modules/loading-bar";
import { getFullPath } from "@/utils/artools";
import { nextTick } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { getLocalWriting } from "@/utils/dev";
import axios from "axios";

export const loadWriting = async () => {
  const store = useStore();
  const manifest = store.manifest;
  const route = useRoute();
  const txIdTemp = route.params.txId;
  if (route.params.txId == undefined || route.params.txId == "") {
    return;
  }
  const path = await getFullPath(txIdTemp as string);
  if (path == "") {
    return;
  }
  const loadingBarStore = useLoadingBarStore();
  loadingBarStore.startLoadingBar();

  if (appEnv.VITE_USE_LOCAL_WRITINGS) {
    const text = await getLocalWriting(manifest!.paths[path].id);
    store.setCurrentWritingText(text);
  } else {
    const text = (
      await axios.get(`https://arweave.net/${manifest!.paths[path].id}`)
    ).data;
    store.setCurrentWritingText(text);
  }
  await nextTick();
  loadingBarStore.finishLoadingBar();
};

// watch(
//   () => route.params.txId,
//   () => {
//     loadWriting();
//   }
// );
