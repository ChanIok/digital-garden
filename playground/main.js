import { Uploader } from './Uploader.js';
import { getLatestManifestId, getLatestState, generateLocalManifest } from './utils.js';

const type = 'writings';

const config = {
  uploadPath: type=='app'?'../dist':'',
  walletPath: '../wallet.json',
  appName: 'PlaneOfEuthymia',
  appWritingsName: 'PlaneOfEuthymiaWritings',
};
const [command, arg1] = process.argv.slice(2);

const uploader = new Uploader(config.uploadPath, config.walletPath);
const latestManifestId = await getLatestManifestId();
const latestState = await getLatestState(latestManifestId);

switch (command) {
  case 'upload':
    uploader.uploadMissingFiles(latestState, type);
    break;

  case 'getId':
    console.log(await getLatestManifestId());
    break;

  case 'getMF':
    console.log(await getLatestState(arg1));
    break;

  case 'genMF':
    generateLocalManifest(config.uploadPath, `${config.uploadPath}/manifest.json`);
    break;

  default:
    console.log('Invalid command');
    break;
}
