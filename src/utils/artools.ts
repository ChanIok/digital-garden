import axios from 'axios';
import { loadManifest } from './loader';
import { gatewayUrl, owner, appWritingsName } from '@/config';
import { IManifest } from '@/typings';
import { useStore } from '@/store';

export const getLatestManifestId = async () => {
  const graphql = {
    query:
      'query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {\n  transactions(\n    ids: $ids\n    owners: $owners\n    recipients: $recipients\n    tags: $tags\n    bundledIn: $bundledIn\n    block: $block\n    first: $first\n    after: $after\n    sort: $sort\n  ) {\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        block {\n          height\n          id\n          timestamp\n        }\n        recipient\n        owner {\n          address\n          key\n        }\n        fee {\n          winston\n          ar\n        }\n        quantity {\n          winston\n          ar\n        }\n        tags {\n          name\n          value\n        }\n        data {\n          size\n          type\n        }\n        bundledIn {\n          id\n        }\n      }\n    }\n  }\n}\n',
    variables: {
      owners: [owner],
      tags: [
        {
          name: 'App-Name',
          values: [appWritingsName],
        },
      ],
      first: 10,
    },
    operationName: 'getTransactions',
  };
  return (await axios.post(`${gatewayUrl}/graphql`, graphql)).data.data.transactions.edges[0].node
    .id;
};

export const getLatestState = async (txId: string) => {
  return (await axios.get(`${gatewayUrl}/${txId}/manifest.json`)).data;
};

export const getFullPath = async (prefix: string) => {
  const store = useStore();
  if (!store.manifest) await loadManifest();
  const paths = store.manifest!.paths;
  const path = Object.keys(paths || {}).find((key) => paths[key].id.includes(prefix)) || '';
  return path;
};
