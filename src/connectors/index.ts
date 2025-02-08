import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { NetworkConnector } from './NetworkConnector';
import { getInjected } from '../state/swap/constant';
import { Network_Url } from 'constants/contractConstants';

export const REACT_APP_NETWORK_URL = process.env.REACT_APP_SEPOLIA_NETWORK_URL;

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '11155111'); // have to make this dynamic for chain change with switchNetwork func.

if (typeof REACT_APP_NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`);
}
export const network = new NetworkConnector({
  urls: {
    11155111: Network_Url[11155111],
    97: Network_Url[97],
    80002: Network_Url[80002],
    421614: Network_Url[421614],
    4002: Network_Url[4002],
    43113: Network_Url[43113],
    11155420: Network_Url[11155420],
    59141: Network_Url[59141],
    44787: Network_Url[44787],
    84532: Network_Url[84532],
    168587773: Network_Url[168587773],
    1313161555: Network_Url[1313161555],
    534351: Network_Url[534351],
    1287: Network_Url[1287],
  },
  defaultChainId: 11155111,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = getInjected();

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 5: Network_Url[11155111] },
  // rpc: { 1: REACT_APP_NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
});

// mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: FORMATIC_KEY ?? '',
//   chainId: 1
// })

// mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1]
// })

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: Network_Url[11155111],
  appName: 'Swap',
  // appLogoUrl: '',
});
