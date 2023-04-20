import { useStore } from "@/store";
import { getLatestManifestId, getLatestState } from "./artools";
import axios from "axios";
import { appEnv } from "@/config";
import { Liyue } from "@/assets";
import { Venti } from "@/assets";
import { IManifest } from "@/typings";

const imgArr = [Liyue];
const imgArrAsync = [Venti];

export const loadThemeConfig = () => {
  const storageTheme = localStorage.getItem("theme");
  if (storageTheme == undefined || storageTheme == null) {
    localStorage.setItem("theme", "dark");
  } else if (storageTheme == "dark") {
    // isDark = true;
  } else {
    // isDark = false;
  }
};

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
  const setManifest = (manifest: IManifest) => {
    const store = useStore();
    store.setManifest(manifest);
    localStorage.setItem("manifest", JSON.stringify(manifest));
  };
  if (appEnv.VITE_USE_LOCAL_MANIFEST) {
    const res = await axios.get(appEnv.VITE_LOCAL_MANIFEST_URL);
    setManifest(res.data);
    return;
  }
  async function fetchManifest() {
    const latestManifestId = await getLatestManifestId();
    const latestState = await getLatestState(latestManifestId);
    setManifest(latestState);
  }

  const storageManifest = localStorage.getItem("manifest");
  if (storageManifest) {
    const manifest = JSON.parse(storageManifest);
    setManifest(manifest);
  } else {
    await fetchManifest();
  }
};
