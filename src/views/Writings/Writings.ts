import { appEnv } from "@/config";
import { useLoadingBarStore } from "@/store/modules/loading-bar";
import { getFullPath } from "@/utils/artools";
import { nextTick } from "vue";
import { useStore, useWritingStore } from "@/store";
import { useRoute } from "vue-router";
import { getLocalWritingByPath } from "@/utils/dev";
import axios from "axios";
import { IManifest } from "@/typings";

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

export const getSubPathsList = (manifest: IManifest, targetPath: string) => {
  const paths = manifest.paths;
  const subPaths: any = {};
  let markdownList = "";
  for (const path in paths) {
    if (path.startsWith(targetPath)) {
      const pathSegments = path.slice(targetPath.length).split("/");
      if (pathSegments.length > 2) {
        subPaths[pathSegments[1]] =
          `${targetPath}/${pathSegments[1]}/index.md`.replace(/\s/g, "%20");
      } else {
        subPaths[pathSegments[1]] = `${targetPath}/${pathSegments[1]}`.replace(
          /\s/g,
          "%20"
        );
      }
    }
  }
  for (const path in subPaths) {
    markdownList += `[${path}](${subPaths[path].slice(
      "writings/".length
    )})\n\n`;
  }
  console.log(markdownList);
  return markdownList;
};

export const loadWriting = async () => {
  const store = useStore();
  const writingStore = useWritingStore();
  const manifest = store.manifest;
  const currentWritingPath = writingStore.currentWritingPath;
  if (!manifest) {
    return;
  }
  if (currentWritingPath.endsWith("/index.md")) {
    if (!(currentWritingPath in manifest.paths)) {
      const text = getSubPathsList(
        manifest,
        currentWritingPath.slice(
          0,
          currentWritingPath.length - "/index.md".length
        )
      );
      writingStore.setCurrentWritingText(text);
      return;
    }
  }
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
