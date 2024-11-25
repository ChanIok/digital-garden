import { Uploader } from './Uploader';
import { getLatestManifestId, getLatestState, generateLocalManifest } from './utils';

// 在这里改变命令
let command = 'upload';
// 是否只上传文章，'true'则上传文章，'false'则上传站点dist
let isUploadWritings = true;

const config = {
  isUploadWritings: true,
  filesPath: '',
  distPath: 'D:\\code\\digital-garden\\dist',
  writingsPath: 'C:\\Users\\CH\\OneDrive\\Writings',
  walletPath: 'D:\\Environment\\arweave\\wallet.json',
  appName: 'PlaneOfEuthymia',
  appWritingsName: 'PlaneOfEuthymiaWritings',
  ignore: ['.obsidian/**', '.trash/**', 'manifest.json'],
};

const main = async () => {
  if (isUploadWritings) {
    config.isUploadWritings = true;
    config.filesPath = config.writingsPath;
  } else {
    config.isUploadWritings = false;
    config.filesPath = config.distPath;
  }

  const uploader = new Uploader(
    config.isUploadWritings,
    config.filesPath,
    config.walletPath,
    config.ignore
  );

  const defaultManifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    index: { path: 'index.html' },
    paths: {},
  };

  switch (command) {
    case 'upload':
      const latestManifestId = await getLatestManifestId(isUploadWritings);
      const latestState = await getLatestState(latestManifestId);
      uploader.uploadMissingFiles(latestState);
      break;

    case 'uploadAll':
      uploader.uploadMissingFiles(defaultManifest);
      break;

    case 'getId':
      console.log(await getLatestManifestId(isUploadWritings));
      break;

    case 'getMF':
      console.log(await getLatestState(''));
      break;

    case 'genMF':
      generateLocalManifest(config.writingsPath, `${config.writingsPath}/manifest.json`);
      break;

    default:
      console.log('Invalid command');
      break;
  }
};
main();
