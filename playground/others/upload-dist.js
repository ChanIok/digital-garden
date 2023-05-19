import glob from "glob";
import path from "path";
import hash from "object-hash";
import fs from "fs";
import Bundlr from "@bundlr-network/client";
import axios from "axios";

const jwk = JSON.parse(fs.readFileSync("wallet.json").toString());
const bundlr = new Bundlr.default("http://node1.bundlr.network", "arweave", jwk);

export const getFileToHash = (filesPath) => {
  const resolvedBasePath = path.resolve(filesPath);
  const paths = glob.sync("**/*", { cwd: resolvedBasePath, nodir: true});
  const fileToHash = {};
  paths.forEach((filepathTemp) => {
    fileToHash[filepathTemp] = hash.sha1(
      fs.readFileSync(path.resolve(resolvedBasePath, filepathTemp)).toString()
    );
  });
  return fileToHash
};


export const differentialUpload = async (
  filesPath,
  latestManifest
) => {
  const resolvedBasePath = path.resolve(filesPath);
  console.log(resolvedBasePath);
  const paths = glob.sync("**/*", { cwd: resolvedBasePath, nodir: true });
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
  fs.writeFileSync("./dist/manifest.json", manifestContent);
  await bundlr.uploadFile("./dist/manifest.json").then((res) => {
    manifest.paths["manifest.json"] = {
      id: res.id,
      hash: hash.sha1(fs.readFileSync("./dist/manifest.json").toString()),
    };
  });
  // 上传最终清单
  manifestContent = JSON.stringify(manifest);
  const res = await bundlr.upload(manifestContent, {
    tags: [
      { name: "Content-type", value: "application/x.arweave-manifest+json" },
      { name: "App-Name", value: "PlaneOfEuthymia" },
    ],
  });
  if (res.id == undefined) {
    throw `upload manifest failed`;
  }
  console.log(`upload complete:${res.id}`);
};

export const getLatestManifestId = async () => {
  const graphql = {
    query:
      "query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {\n  transactions(\n    ids: $ids\n    owners: $owners\n    recipients: $recipients\n    tags: $tags\n    bundledIn: $bundledIn\n    block: $block\n    first: $first\n    after: $after\n    sort: $sort\n  ) {\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        block {\n          height\n          id\n          timestamp\n        }\n        recipient\n        owner {\n          address\n          key\n        }\n        fee {\n          winston\n          ar\n        }\n        quantity {\n          winston\n          ar\n        }\n        tags {\n          name\n          value\n        }\n        data {\n          size\n          type\n        }\n        bundledIn {\n          id\n        }\n      }\n    }\n  }\n}\n",
    variables: {
      owners: ["LGphzQz7HJd9E8i2UpzzYK_V6azt1wAZDTJ8iNllka0"],
      tags: [
        {
          name: "App-Name",
          values: ["PlaneOfEuthymia"],
        },
      ],
      first: 10,
    },
    operationName: "getTransactions",
  };
  return (await axios.post("https://arweave.net/graphql", graphql)).data.data
    .transactions.edges[0].node.id;
};

export const getLatestState = async (txId) => {
  return (await axios.get(`https://arweave.net/${txId}/manifest.json`)).data;
};

(async () => {
  differentialUpload(
    "./dist",
    await getLatestState("P7LM_NES122Zf3oVysu451-gnLNcmavytywoOq2ijeI")
  );
})()

