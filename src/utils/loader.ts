import { useStore } from '@/store';
import { getLatestManifestId, getLatestState } from './artools';
import axios from 'axios';
import { appEnv } from '@/config';
import { Venti } from '@/assets';
import { IManifest } from '@/typings';
import { loadWriting } from '@/views/Writings/Writings';

const imgArr: string[] = [];
const imgArrAsync = [Venti];
const imgPreloadList = ['/Liyue.webp'];
export const loadImgs = async () => {
  const store = useStore();
  imgPreloadList.forEach((src) => {
    const image = new Image();
    image.src = `${src}`;
  });
  // 延迟加载异步图片
  imgArrAsync.forEach((txId) => {
    const image = new Image();
    image.src = `${store.gateway}/${txId}`;
  });
  // 同步加载图片并返回 Promise
  return Promise.all(
    imgArr.map((txId) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = `${store.gateway}/${txId}`;
        image.onload = () => resolve(image);
      });
    })
  );
};

// 预加载文章首页，#/writings/index.md
export const preLoadWriting = async () => {
  await loadWriting(true, 'index.md');
};
export const loadManifest = async () => {
  const store = useStore();
  const setManifest = (manifest: IManifest) => {
    store.setManifest(manifest);
  };
  if (appEnv.VITE_USE_LOCAL_MANIFEST) {
    const res = (await axios.get(`${appEnv.VITE_LOCAL_REQUEST_URL}/manifest.json`)).data;
    setManifest(res);
    return;
  }
  async function fetchManifest() {
    const latestManifestId = await getLatestManifestId();
    const latestState = await getLatestState(latestManifestId);
    setManifest(latestState);
  }
  await fetchManifest();
};
