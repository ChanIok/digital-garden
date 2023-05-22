import { appEnv } from '@/config';
import { useLoadingBarStore } from '@/store/modules/loading-bar';
import { getFullPath } from '@/utils/artools';
import { nextTick } from 'vue';
import { useStore, useWritingStore } from '@/store';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { IManifest } from '@/typings';

export const getLocalWritingByPath = async (path: string) => {
  let res = '';
  const store = useStore();
  const manifest = store.manifest;
  if (!manifest) {
    return res;
  }
  res = (await axios.get(`${appEnv.VITE_LOCAL_REQUEST_URL}/${path}`)).data;
  return res;
};

export const checkPath = async () => {
  const route = useRoute();
  const txIdTemp = route.params.txId;
  if (route.params.txId == undefined || route.params.txId == '') {
    return;
  }
  const path = await getFullPath(txIdTemp as string);
  if (path == '') {
    return;
  }
  const writingStore = useWritingStore();
  writingStore.setCurrentWritingPath(path);
};

export const getSubPathsList = (manifest: IManifest, targetPath: string) => {
  const paths = manifest.paths;
  const subPaths: any = {};
  let markdownList = '';
  for (const path in paths) {
    if (path.startsWith(targetPath)) {
      const pathSegments = path.slice(targetPath.length).split('/');
      if (pathSegments.length > 2) {
        subPaths[pathSegments[1]] = `${targetPath}/${pathSegments[1]}/index.md`.replace(
          /\s/g,
          '%20'
        );
      } else {
        subPaths[pathSegments[1]] = `${targetPath}/${pathSegments[1]}`.replace(/\s/g, '%20');
      }
    }
  }
  for (const path in subPaths) {
    markdownList += `[${path}](${subPaths[path].slice('writings/'.length)})\n\n`;
  }
  return markdownList;
};

export const loadWriting = async (isReturnTextDirectly = false, path = '/index.md') => {
  const store = useStore();
  const writingStore = useWritingStore();
  const loadingBarStore = useLoadingBarStore();
  const manifest = store.manifest;
  const currentWritingPath = isReturnTextDirectly ? path : writingStore.currentWritingPath;
  if (!manifest) {
    return;
  }
  if (currentWritingPath.endsWith('/index.md') && !(currentWritingPath in manifest.paths)) {
    const text = getSubPathsList(
      manifest,
      currentWritingPath.slice(0, currentWritingPath.length - '/index.md'.length)
    );
    if (isReturnTextDirectly) {
      return text;
    } else {
      writingStore.setCurrentWritingText(text);
      return;
    }
  }
  if (!isReturnTextDirectly) {
    loadingBarStore.startLoadingBar();
  }
  const url = appEnv.VITE_USE_LOCAL_WRITINGS
    ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${currentWritingPath}`
    : `https://arweave.net/${manifest?.paths[currentWritingPath]?.id}`;
  const { data } = await axios.get(url);
  if (isReturnTextDirectly) {
    await nextTick();
    return data;
  } else {
    writingStore.setCurrentWritingText(data);
    await nextTick();
  }
  if (!isReturnTextDirectly) {
    loadingBarStore.finishLoadingBar();
  }
};
