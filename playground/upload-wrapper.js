import glob from "glob";
import path from "path";
import hash from "object-hash";
import fs from "fs";
import Bundlr from "@bundlr-network/client";
import axios from "axios";

const jwk = JSON.parse(fs.readFileSync("wallet.json").toString());
const bundlr = new Bundlr.default("http://node1.bundlr.network", "arweave", jwk);

const distPath = "../web-wrapper/dist"

export const differentialUpload = async (
  filesPath,
  latestManifest
) => {
  const resolvedBasePath = path.resolve(filesPath);
  console.log(resolvedBasePath);
  const paths = glob.sync("**/*", { cwd: resolvedBasePath, nodir: true});
  let manifest = {
    manifest: "arweave/paths",
    version: "0.1.0",
    index: {
      path: "index.html",
    },
    paths: {},
  };
  // 文件哈希到文件路径
  let hashToPath = {};
  for (const key in latestManifest.paths) {
    hashToPath[latestManifest.paths[key].hash] = {
      path: key,
      id: latestManifest.paths[key].id,
    };
  }
  // 循环，逐个上传
  for (const item of paths) {
    if (item == "manifest.json") {
      continue;
    }
    const itemHash = hash.sha1(
      fs.readFileSync(path.resolve(resolvedBasePath, item)).toString()
    );
    // 清单中，如果文件内容无更改
    if (itemHash in hashToPath) {
      manifest.paths[item] = {
        id: hashToPath[itemHash].id,
        hash: itemHash,
      };
      // 否则重新上传
    } else {
      const res = await bundlr.uploadFile(path.resolve(resolvedBasePath, item));
      if (res.id == undefined) {
        throw `upload file failed:${item}`;
      }
      console.log(`uploaded file:${item}`);
      manifest.paths[item] = {
        id: res.id,
        hash: hash.sha1(
          fs.readFileSync(path.resolve(resolvedBasePath, item)).toString()
        ),
      };
    }
  }
  // 上传原始清单数据
  let manifestContent = JSON.stringify(manifest);
  fs.writeFileSync(distPath + "/manifest.json", manifestContent);
  await bundlr.uploadFile(distPath + "/manifest.json").then((res) => {
    manifest.paths["manifest.json"] = {
      id: res.id,
      hash: hash.sha1(fs.readFileSync(distPath + "/manifest.json").toString()),
    };
  });
  // 上传最终清单
  manifestContent = JSON.stringify(manifest);
  const res = await bundlr.upload(manifestContent, {
    tags: [
      { name: "Content-type", value: "application/x.arweave-manifest+json" },
      { name: "App-Name", value: "PlaneOfEuthymia-Pointer" },
    ],
  });
  if (res.id == undefined) {
    throw `upload manifest failed`;
  }
  console.log(`upload complete:${res.id}`);
};


export const getLatestState = async (txId) => {
  return (await axios.get(`https://arweave.net/${txId}/manifest.json`)).data;
};


(async () => {

  differentialUpload(
    distPath,
    await getLatestState("3XzYSjejYRDy2WKqS380AQagyVE6M3p37EVtQAX8Ihk")
  );
})()


