import * as glob from 'glob';
import path from 'path';
import hash from 'object-hash';
import fs from 'fs';
import Bundlr from '@bundlr-network/client';

export class Uploader {
  constructor(filesPath, walletPath) {
    this.filesPath = filesPath;
    this.jwk = JSON.parse(fs.readFileSync(walletPath).toString());
    this.bundlr = new Bundlr.default('http://node1.bundlr.network', 'arweave', this.jwk);
    this.resolvedBasePath = path.resolve(filesPath);
    this.filePaths = glob.sync('**/*', { cwd: this.resolvedBasePath, nodir: true });
    this.manifest = {
      manifest: 'arweave/paths',
      version: '0.1.0',
      index: {
        path: 'index.html',
      },
      paths: {},
    };
  }

  async uploadFile(item, hashToPath) {
    const itemPath = path.resolve(this.resolvedBasePath, item);
    const itemHash = hash.sha1(fs.readFileSync(itemPath).toString());

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
        hash: hash.sha1(fs.readFileSync(itemPath).toString()),
      };
    }
  }

  async uploadManifest() {
    const manifestPath = path.resolve(this.filesPath, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest));
    const manifestHash = hash.sha1(fs.readFileSync(manifestPath).toString());
    const manifestUploadResponse = await this.bundlr.uploadFile(manifestPath);
    if (!manifestUploadResponse.id) {
      throw new Error('Failed to upload manifest file');
    }
    this.manifest.paths['manifest.json'] = {
      id: manifestUploadResponse.id,
      hash: manifestHash,
    };
  }

  async uploadMissingFiles(latestManifest, type = 'app') {
    const hashToPath = {};
    for (const key in latestManifest.paths) {
      const { hash, id } = latestManifest.paths[key];
      hashToPath[hash] = { path: key, id };
    }

    const filteredPaths = this.filePaths.filter((item) => item !== 'manifest.json');

    // Upload files in promises
    const promises = filteredPaths.map((item) => this.uploadFile(item, hashToPath));
    await Promise.all(promises);

    // Upload the raw manifest
    // await this.uploadManifest();

    // Upload the final manifest
    const finalManifestContent = JSON.stringify(this.manifest);
    const tags = [
      { name: 'Content-type', value: 'application/x.arweave-manifest+json' },
      { name: 'App-Name', value: type == 'app' ? 'PlaneOfEuthymia' : 'PlaneOfEuthymiaWritings' },
    ];

    const finalManifestUploadResponse = await this.bundlr.upload(finalManifestContent, {
      tags: tags,
    });
    if (!finalManifestUploadResponse.id) {
      throw new Error('Failed to upload final manifest');
    }
    console.log(`Upload complete: ${finalManifestUploadResponse.id}`);
  }
}
