import path from 'path';
import axios from 'axios';
import * as glob from 'glob';
import fs from 'fs';
import tunnel from 'tunnel';

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: '127.0.0.1',
    port: 7890,
  },
});

export const getLatestManifestId = async (isUploadWritings: boolean) => {
  const graphql = {
    query:
      'query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {\n  transactions(\n    ids: $ids\n    owners: $owners\n    recipients: $recipients\n    tags: $tags\n    bundledIn: $bundledIn\n    block: $block\n    first: $first\n    after: $after\n    sort: $sort\n  ) {\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        block {\n          height\n          id\n          timestamp\n        }\n        recipient\n        owner {\n          address\n          key\n        }\n        fee {\n          winston\n          ar\n        }\n        quantity {\n          winston\n          ar\n        }\n        tags {\n          name\n          value\n        }\n        data {\n          size\n          type\n        }\n        bundledIn {\n          id\n        }\n      }\n    }\n  }\n}\n',
    variables: {
      owners: ['xGyL40lbKQUphARzMC7gpPMlnzxCaZ4_MWsXMd3d6ZA'],
      tags: [
        {
          name: 'App-Name',
          values: isUploadWritings ? ['PlaneOfEuthymiaWritings'] : ['PlaneOfEuthymia'],
        },
      ],
      first: 1,
    },
    operationName: 'getTransactions',
  };
  return (
    await axios.post('https://arweave.net/graphql', graphql, {
      httpsAgent: agent,
    })
  ).data.data.transactions.edges[0].node.id;
};

export const getLatestState = async (txId: string) => {
  return (
    await axios.get(`https://arweave.net/raw/${txId}`, {
      httpsAgent: agent,
    })
  ).data;
};

export const generateLocalManifest = (filesPath: string, outPutPath: string) => {
  const resolvedBasePath = path.resolve(filesPath);
  const filePaths = glob.sync('**/*', {
    cwd: resolvedBasePath,
    nodir: true,
  });
  const paths = Object.fromEntries(
    filePaths.map((filePath) => [filePath.replace(/\\/g, '/'), { id: '', hash: '' }])
  );
  const manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    index: {
      path: 'index.html',
    },
    paths,
  };
  fs.writeFileSync(outPutPath, JSON.stringify(manifest));
};
