import { useStore } from '@/store';
import { getLatestManifestId, getLatestState } from './artools';
import axios from 'axios';
import { appEnv } from '@/config';
import { Liyue } from '@/assets';
import { Venti } from '@/assets';
import { IManifest } from '@/typings';
import Clipboard from 'clipboard';

const clipboard = new Clipboard('.copyBtn');

const imgArr = [Liyue];
const imgArrAsync = [Venti];

export const loadImgs = async () => {
  imgArrAsync.map((path) => {
    const image = new Image();
    image.src = path;
  });
  return await Promise.all(
    imgArr.map((path) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = path;
        image.onload = () => resolve(image);
      });
    })
  );
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
