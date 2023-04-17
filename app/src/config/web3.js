import {Connection} from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { AnchorProvider } from '@coral-xyz/anchor';
import IDl from '../id1.json';

export const wallets = [
  new PhantomWalletAdapter(),
];
const x =JSON.stringify(IDl);
export const idl = JSON.parse(x);
// export const programId = new PublicKey(idl.metadata.address)
export const programId = "Gn3U9YVqjFmaNnKFBvDX4qaoTum4CBDwJz4KoYH6P4hA";
const network = 'http://127.0.0.1:8899';

export const getProvider = async (wallet) => {
  const connection = new Connection(network, 'processed');
  const provider = new AnchorProvider(connection, wallet, 'processed');
  return provider;
}