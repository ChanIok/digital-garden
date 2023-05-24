import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import hash from 'object-hash';
import Bundlr from '@bundlr-network/client';

interface HashToPath {
  [hash: string]: { id: any; path: string };
}

interface Manifest {
  manifest: string;
  version: string;
  index?: { path: string };
  paths: { [path: string]: { id: any; hash: string } };
}

export class Uploader {
  private readonly jwk: any;
  private readonly bundlr: any;
  private readonly resolvedBasePath: string;
  private readonly filePaths: string[];
  private readonly manifest: Manifest;

  constructor(filesPath: string, walletPath: fs.PathOrFileDescriptor, ignore: string[]) {
    this.jwk = JSON.parse(fs.readFileSync(walletPath).toString());
    this.bundlr = new Bundlr('http://node1.bundlr.network', 'arweave', this.jwk);
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
  }

  async uploadFile(item: string, hashToPath: HashToPath) {
    const itemPath = path.resolve(this.resolvedBasePath, item);
    const itemHash = hash(fs.readFileSync(itemPath).toString());

    if (itemHash in hashToPath) {
      this.manifest.paths[item] = {
        id: hashToPath[itemHash].id,
        hash: itemHash,
      };
    } else {
      const res = await this.bundlr.uploadFile(itemPath);
      if (res.id == undefined) {
        throw new Error(`upload file failed:${item}`);
      }
      console.log(`uploaded file:${item}`);
      this.manifest.paths[item] = {
        id: res.id,
        hash: hash(fs.readFileSync(itemPath).toString()),
      };
    }
  }

  async uploadMissingFiles(latestManifest: Manifest) {
    const hashToPath: HashToPath = {};
    for (const key in latestManifest.paths) {
      const { hash, id } = latestManifest.paths[key];
      hashToPath[hash] = { path: key, id };
    }

    const filteredPaths = this.filePaths.filter((item: string) => item !== 'manifest.json');

    // Upload files in promises
    const promises = filteredPaths.map((item: string) => this.uploadFile(item, hashToPath));
    await Promise.all(promises);

    // Upload the final manifest
    console.log(this.manifest);
    const finalManifestContent = JSON.stringify(this.manifest);
    const manifestDistPath = path.resolve(this.resolvedBasePath, 'manifest.json');
    fs.writeFileSync(manifestDistPath, finalManifestContent);
    const tags = [
      { name: 'Content-type', value: 'application/x.arweave-manifest+json' },
      { name: 'App-Name', value: 'PlaneOfEuthymiaWritings' },
    ];

    const finalManifestUploadResponse = await this.bundlr.uploadFile(manifestDistPath, {
      tags: tags,
    });
    if (finalManifestUploadResponse.id == undefined) {
      throw new Error('Failed to upload final manifest');
    }
    console.log(`Upload complete: ${finalManifestUploadResponse.id}`);
  }
}
