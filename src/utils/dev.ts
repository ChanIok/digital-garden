import { useStore } from "@/store";
import axios from "axios";

export const getLocalWritingById = async (txId: string) => {
  let res = "";
  const store = useStore();
  const manifest = store.manifest;
  if (!manifest) {
    return res;
  }
  for (const path in manifest.paths) {
    if (manifest.paths[path].id == txId) {
      res = (await axios.get(`./${path}`)).data;
    }
  }
  return res;
};
export const getLocalWritingByPath = async (path: string) => {
  let res = "";
  const store = useStore();
  const manifest = store.manifest;
  if (!manifest) {
    return res;
  }
  res = (await axios.get(`./${path}`)).data;
  console.log(res)
  return res;
};
