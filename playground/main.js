import { Uploader } from "./Uploader.js";
import { getLatestManifestId, getLatestState } from "./utils.js";
const config = {
  distPath: "../dist",
  walletPath: "../wallet.json",
};
const args = process.argv.slice(2);

const uploader = new Uploader(config.distPath, config.walletPath);
if (args[0] == "upload") {
  uploader.uploadMissingFiles();
} else if (args[0] == "getId") {
  console.log(await getLatestManifestId());
} else if (args[0] == "getMF") {
  console.log(await getLatestState(args[1]));
}
