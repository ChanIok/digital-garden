import { TurboFactory, WinstonToTokenAmount } from '@ardrive/turbo-sdk';
import fs from 'fs';
import axios from 'axios';
import tunnel from 'tunnel';

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: '127.0.0.1',
    port: 7890,
  },
});

// load your JWK directly to authenticate
const jwk = JSON.parse(fs.readFileSync('D:\\Environment\\arweave\\wallet.json').toString());

const turbo = TurboFactory.authenticated({ privateKey: jwk });

async function main() {
  // 充值
  const topup = async () => {
    const { winc, status, id, ...fundResult } = await turbo.topUpWithTokens({
      tokenAmount: WinstonToTokenAmount(200_000_000000), // 0.2 AR
      feeMultiplier: 1.1,
    });
  };

  const { winc: balance } = await turbo.getBalance();
  console.log(balance);
}

main();
