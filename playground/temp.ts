import fs from 'fs';
import Irys from '@irys/sdk';

const getIrys = async () => {
  const network = 'mainnet';
  const token = 'arweave';
  const key = JSON.parse(fs.readFileSync('D:\\Environment\\arweave\\wallet.json').toString());

  const irys = new Irys({
    network, // "mainnet" or "devnet"
    token, // Token used for payment and signing
    key, // Arweave wallet
  });
  return irys;
};

const test = async () => {
  const irys = await getIrys();

  // Get loaded balance in atomic units
  const atomicBalance = await irys.getLoadedBalance();
  console.log(`Node balance (atomic units) = ${atomicBalance}`);

  // Convert balance to standard
  const convertedBalance = irys.utils.fromAtomic(atomicBalance);
  console.log(`Node balance (converted) = ${convertedBalance}`);
};


const main = async () => {
  const res = await test();
  console.log(res);
};

main();
