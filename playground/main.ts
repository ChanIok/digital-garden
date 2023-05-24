import { Uploader } from './Uploader';
import { getLatestManifestId, getLatestState, generateLocalManifest } from './utils';

const type = 'writings';
let command = 'upload';

const config = {
  uploadPath: 'C:\\Users\\CH\\OneDrive\\Writings',
  walletPath: 'D:\\Environment\\arweave\\wallet.json',
  appName: 'PlaneOfEuthymia',
  appWritingsName: 'PlaneOfEuthymiaWritings',
  ignore: ['.obsidian/**', '.trash/**', 'attachments/**'],
};

const main = async () => {
  const uploader = new Uploader(config.uploadPath, config.walletPath, config.ignore);

  const latestManifestId = await getLatestManifestId();
  const latestState = await getLatestState(latestManifestId);
  const defaultManifest = { manifest: 'arweave/paths', version: '0.1.0', paths: {} };

  switch (command) {
    case 'upload':
      uploader.uploadMissingFiles(latestState);
      break;

    case 'getId':
      console.log(await getLatestManifestId());
      break;

    case 'getMF':
      console.log(await getLatestState(''));
      break;

    case 'genMF':
      generateLocalManifest(config.uploadPath, `${config.uploadPath}/manifest.json`);
      break;

    default:
      console.log('Invalid command');
      break;
  }
};
main();
