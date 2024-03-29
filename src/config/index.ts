export const owner = 'xGyL40lbKQUphARzMC7gpPMlnzxCaZ4_MWsXMd3d6ZA';
export const appName = 'PlaneOfEuthymia';
export const appWritingsName = 'PlaneOfEuthymiaWritings';

export const gateways = [
  'https://arweave.net',
  // 'https://ar-io.dev',
  // 'https://arweave.dev',
  'https://g8way.io',
];

const { MODE, VITE_USE_LOCAL_MANIFEST, VITE_USE_LOCAL_WRITINGS, VITE_LOCAL_REQUEST_URL } =
  import.meta.env;
export const appEnv = {
  MODE,
  VITE_USE_LOCAL_MANIFEST: VITE_USE_LOCAL_MANIFEST === 'true',
  VITE_USE_LOCAL_WRITINGS: VITE_USE_LOCAL_WRITINGS === 'true',
  VITE_LOCAL_REQUEST_URL: VITE_LOCAL_REQUEST_URL,
};
