import Bundlr from '@bundlr-network/client';
import fs from 'fs';

// Load the JWK wallet key file from disk
const privateKey = JSON.parse(fs.readFileSync('D:\\Environment\\arweave\\wallet.json').toString());

// Initailze the bundlr SDK
const bundlr = new Bundlr('http://node1.bundlr.network', 'arweave', privateKey);

// Fund the node
const main = async () => {
  const fundTx = await bundlr.fund(300000000000);
  console.log(fundTx);
};

main();
