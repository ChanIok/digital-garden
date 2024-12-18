import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import hash from 'object-hash';
import mime from 'mime-types';
import { TurboAuthenticatedClient, TurboFactory } from '@ardrive/turbo-sdk';

interface HashToPath {
  [hash: string]: { id: any; path: string };
}

interface Manifest {
  manifest: string;
  version: string;
  index?: { path: string };
  paths: { [path: string]: { id: any; hash: string; date: number } };
}

export class Uploader {
  private readonly jwk: any;
  private readonly turbo: TurboAuthenticatedClient;
  private readonly isUploadWritings: boolean;
  private readonly resolvedBasePath: string;
  private readonly filePaths: string[];
  private manifest: Manifest;
  constructor(
    isUploadWritings: boolean,
    filesPath: string,
    walletPath: fs.PathOrFileDescriptor,
    ignore: string[]
  ) {
    this.isUploadWritings = isUploadWritings;
    this.jwk = JSON.parse(fs.readFileSync(walletPath).toString());
    this.turbo = TurboFactory.authenticated({ privateKey: this.jwk });
    this.resolvedBasePath = path.resolve(filesPath);
    this.filePaths = sync('**/*', {
      cwd: this.resolvedBasePath,
      nodir: true,
      ignore: ignore,
    });
    this.filePaths = this.filePaths.map((file) => file.replace(/\\/g, '/'));
    this.manifest = {
      manifest: 'arweave/paths',
      version: '0.1.0',
      paths: {},
    };

    if (!isUploadWritings) {
      this.manifest.index = { path: 'index.html' };
    }
  }

  async uploadFile(item: string, hashToPath: HashToPath) {
    const itemPath = path.resolve(this.resolvedBasePath, item);
    const itemHash = hash(fs.readFileSync(itemPath).toString());

    if (itemHash in hashToPath) {
      this.manifest.paths[item] = {
        id: hashToPath[itemHash].id,
        hash: itemHash,
        date: fs.statSync(itemPath).mtime.getTime(),
      };
    } else {
      const mimeType = mime.lookup(itemPath) || 'application/octet-stream';
      const tags = [{ name: 'Content-Type', value: mimeType }];
      const res = await this.turbo.uploadFile({
        fileStreamFactory: () => fs.createReadStream(itemPath),
        fileSizeFactory: () => fs.statSync(itemPath).size,
        dataItemOpts: {
          tags: tags,
        },
      });
      if (res.id == undefined) {
        throw new Error(`upload file failed:${item}`);
      }
      console.log(`uploaded file:${item}`);
      this.manifest.paths[item] = {
        id: res.id,
        hash: hash(fs.readFileSync(itemPath).toString()),
        date: fs.statSync(itemPath).mtime.getTime(),
      };
    }
  }

  async uploadMissingFiles(latestManifest: Manifest) {
    const hashToPath: HashToPath = {};
    for (const key in latestManifest.paths) {
      const { hash, id, date } = latestManifest.paths[key];
      hashToPath[hash] = { path: key, id };
    }

    const filteredPaths = this.filePaths.filter((item: string) => item !== 'manifest.json');

    // Upload files in promises
    const uploadPromises = filteredPaths.map((item: string) => this.uploadFile(item, hashToPath));
    await Promise.all(uploadPromises);

    // Upload the final manifest
    const manifestDistPath = path.resolve(this.resolvedBasePath, 'manifest.json');
    const finalManifestContent = JSON.stringify(this.manifest);
    fs.writeFileSync(manifestDistPath, finalManifestContent);

    if (this.isUploadWritings) {
      const res = await this.turbo.uploadFile({
        fileStreamFactory: () => fs.createReadStream(manifestDistPath),
        fileSizeFactory: () => fs.statSync(manifestDistPath).size,
      });
      if (res.id == undefined) {
        throw new Error(`upload manifest file failed`);
      }
      this.manifest.paths.manifest = {
        id: res.id,
        hash: hash(fs.readFileSync(manifestDistPath).toString()),
        date: fs.statSync(manifestDistPath).mtime.getTime(),
      };
      const finalManifestContent = JSON.stringify(this.manifest);
      fs.writeFileSync(manifestDistPath, finalManifestContent);
    }

    const tags = [
      { name: 'Content-type', value: 'application/x.arweave-manifest+json' },
      {
        name: 'App-Name',
        value: this.isUploadWritings ? 'PlaneOfEuthymiaWritingsForTest' : 'PlaneOfEuthymia',
      },
    ];

    console.log(this.manifest);

    const finalManifestUploadResponse = await this.turbo.uploadFile({
      fileStreamFactory: () => fs.createReadStream(manifestDistPath),
      fileSizeFactory: () => fs.statSync(manifestDistPath).size,
      dataItemOpts: {
        tags: tags,
      },
    });
    if (finalManifestUploadResponse.id === undefined) {
      throw new Error('Failed to upload final manifest');
    }
    console.log(`Upload complete: ${finalManifestUploadResponse.id}`);
  }
}
