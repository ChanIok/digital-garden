interface IManifestPath {
  id: string;
  hash: string;
}
export interface IManifest {
  manifest: "arweave/paths";
  version: "0.1.0";
  index: { path: "index.html" };
  paths: Record<string, IManifestPath>;
}
