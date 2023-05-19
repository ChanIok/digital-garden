import { Uploader } from './Uploader.js';
import { getLatestManifestId, getLatestState, generateLocalManifest } from './utils.js';
const config = {
  distPath: '../dist',
  walletPath: '../wallet.json',
};
const args = process.argv.slice(2);

if (args[0] == 'upload') {
  const uploader = new Uploader(config.distPath, config.walletPath);
  uploader.uploadMissingFiles();
} else if (args[0] == 'getId') {
  console.log(await getLatestManifestId());
} else if (args[0] == 'getMF') {
  console.log(await getLatestState(args[1]));
} else if (args[0] == 'genMF') {
  generateLocalManifest('../dist', '../dist/manifest.json');
}
