import { Uploader } from "./Uploader.js";

const config = {
  distPath: "../dist",
  walletPath: "../wallet.json",
};
const args = process.argv.slice(2);

const uploader = new Uploader(config.distPath, config.walletPath);
if (args[0] == "upload") {
  uploader.uploadMissingFiles();
}
