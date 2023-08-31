import { appEnv } from '@/config';
import { useLoadingBarStore } from '@/store/modules/loading-bar';
import { getFullPath } from '@/utils/artools';
import { nextTick } from 'vue';
import { useStore, useWritingStore } from '@/store';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { IManifest } from '@/typings';
import { useRouter } from 'vue-router';

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
  const router = useRouter();
  const txId = route.params.txId;
  if (txId == undefined || txId == '') {
    return;
  }
  const path = await getFullPath(txId as string);
  if (path == '') {
    return;
  }
  router.push(`/writings/${path}`);
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
    markdownList += `[${path}](${subPaths[path]})\n\n`;
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
    : `${store.gateway}/${manifest?.paths[currentWritingPath]?.id}`;
  const { data } = await axios.get(url);
  if (isReturnTextDirectly) {
    return data;
  } else {
    writingStore.setCurrentWritingText(data);
    await nextTick();
  }
  if (!isReturnTextDirectly) {
    loadingBarStore.finishLoadingBar();
  }
};
