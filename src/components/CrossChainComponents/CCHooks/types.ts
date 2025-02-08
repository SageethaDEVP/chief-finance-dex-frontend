export interface Chain {
  chainId: number;
  name: string;
  symbol: string;
  logoURI: string;
  slug: string;
}

// export const chains: Chain[] = [
//   {
//     chainId: 1,
//     name: 'ETHEREUM',
//     symbol: 'ETH',
//     logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
//     slug: 'ethereum',
//   },
//   {
//     chainId: 97,
//     name: 'BINANCE TESTNET',
//     symbol: 'BNB',
//     logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029',
//     slug: 'binance',
//   },
//   {
//     chainId: 11155111,
//     name: 'SEPOLIA',
//     symbol: 'SepoliaETH',
//     logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
//     slug: 'ethereum-2',
//   },
// ];

// export const tokenAddresses = {
//   name: 'Uniswap Default List',
//   timestamp: '2021-01-21T23:57:10.982Z',
//   version: {
//     major: 2,
//     minor: 0,
//     patch: 0,
//   },
//   tags: {},
//   logoURI: 'ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir',
//   keywords: ['uniswap', 'default'],
//   tokens: [
    
//     {
//       address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
//       chainId: 97,
//       decimals: 18,
//       logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
//       name: 'BINANCE',
//       symbol: 'BNB',
//     },
//     {
//       address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
//       chainId: 1,
//       decimals: 18,
//       logoURI: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_ZRX.svg',
//       name: '0x Protocol Token',
//       symbol: 'ZRX',
//     },
//     {
//       chainId: 11155111,
//       address: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
//       name: 'aUSDC',
//       symbol: 'aUSDC',
//       decimals: 6,
//       logoURI: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
//     },
//     {
//       address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
//       chainId: 11155111,
//       decimals: 18,
//       logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
//       name: 'Sepolia ETH',
//       symbol: 'ETH',
//     },
//     {
//       chainId: 97,
//       address: '0x510601cb8Db1fD794DCE6186078b27A5e2944Ad6',
//       name: 'MDT',
//       symbol: 'MDT',
//       decimals: 18,
//       logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
//     },
//     // {
//     //   chainId: 97,
//     //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
//     //   name: 'USDT',
//     //   symbol: 'USDT',
//     //   decimals: 6,
//     //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
//     // },
//     // {
//     //   chainId: 97,
//     //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
//     //   name: 'USDT',
//     //   symbol: 'USDT',
//     //   decimals: 6,
//     //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
//     // },
//   ],
// };

// export interface tokenInfo {
//   address: string;
//   balance: number;
//   chainId: number;
//   decimals: number;
//   name: string;
//   symbol: string;
//   tokenInfo: {
//     address: string;
//     chainId: string;
//     decimals: number;
//     logoURI: string;
//     name: string;
//     symbol: string;
//   };
// }
