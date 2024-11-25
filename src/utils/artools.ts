import axios from 'axios';
import { gateways, owner, appWritingsName, appName } from '@/config';
import { useStore } from '@/store';

export const getLatestManifest = async (isAppName = false) => {
  const store = useStore();
  const graphql = {
    query:
      'query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {\n  transactions(\n    ids: $ids\n    owners: $owners\n    recipients: $recipients\n    tags: $tags\n    bundledIn: $bundledIn\n    block: $block\n    first: $first\n    after: $after\n    sort: $sort\n  ) {\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        block {\n          height\n          id\n          timestamp\n        }\n        recipient\n        owner {\n          address\n          key\n        }\n        fee {\n          winston\n          ar\n        }\n        quantity {\n          winston\n          ar\n        }\n        tags {\n          name\n          value\n        }\n        data {\n          size\n          type\n        }\n        bundledIn {\n          id\n        }\n      }\n    }\n  }\n}\n',
    variables: {
      owners: [owner],
      tags: [
        { name: 'Content-type', values: ['application/x.arweave-manifest+json'] },
        {
          name: 'App-Name',
          values: [isAppName ? appName : appWritingsName],
        },
      ],
      first: 5,
    },
    operationName: 'getTransactions',
  };
  return (await axios.post(`${store.gateway}/graphql`, graphql)).data;
};

export const getLatestManifestId = async () => {
  return (await getLatestManifest()).data.transactions.edges[0].node.id;
};

export const getLatestState = async (txId: string) => {
  const store = useStore();
  return (await axios.get(`${store.gateway}/${txId}/manifest`)).data;
};

export const getFullPath = async (prefix: string) => {
  const store = useStore();
  if (!store.manifest) {
    return '';
  }
  const paths = store.manifest!.paths;
  const path = Object.keys(paths || {}).find((key) => paths[key].id.includes(prefix)) || '';
  return path;
};

export async function checkValidGateway() {
  const testGatewayAvailability = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(() => resolve(url))
        .catch(() => reject(url));
    });
  };
  const store = useStore();
  const promises = gateways.map((gateway) => testGatewayAvailability(gateway));

  return Promise.race(promises).then((availableUrl) => {
    store.setGateWay(availableUrl);
  });
}
