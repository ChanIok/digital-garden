import { useStore } from "@/store";
import axios from "axios";

export const getLocalWriting = async (txId: string) => {
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
