import { useStore } from "@/store";
import axios from "axios";
const store = useStore();
const manifest = store.manifest;

export const getWritingLocally = async (txId: string) => {
  let res = "";
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
