import { JSBI, Percent, Token } from '@bidelity/sdk';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useActiveWeb3React } from 'hooks';
import { WrappedTokenInfo } from 'state/lists/hooks';
import { TokenList } from '@uniswap/token-lists/dist/types';

import {
  // fortmatic,
  injected,
  // portis,
  walletconnect,
  // walletlink,
} from '../connectors';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ChainId, Factory, Init_code, Router } from './contractConstants';

const chainss = {
  11155111: 'SEPOLIA',
  97: 'BINANCETEST',
  80002: 'AMOY',
  421614: 'ARBITRUM',
  4002: 'FANTOM',
  1: 'MAINNET',
  43113: 'AVALANCE',
  11155420: 'OPTIMISM',
  59141: 'LINEA',
  44787: 'CELO',
  84532: 'BASE',
  168587773: 'BLAST',
  1313161555: 'AURORA',
  534351: 'SCROLL',
  1287: 'MOONBASE',
};

export const mobile_width = 1000;

export const graphEndPoints: { [key: string]: string } = {
  1: '',
  97: 'https://api.studio.thegraph.com/query/57306/cf-chapel/version/latest',
  11155111: 'https://api.studio.thegraph.com/query/57306/chief-finance-sepoliaa/version/latest',
  80002: 'https://api.studio.thegraph.com/query/57306/cf-polygon-amoy/version/latest',
  421614: 'https://api.studio.thegraph.com/query/57306/cf-arbitrum-sepolia/version/latest',
  43113: ' https://api.studio.thegraph.com/query/57306/cf-avalanche-fuji-testnet/version/latest',
  11155420: 'https://api.studio.thegraph.com/query/57306/cf-optimism/version/latest',
  59141: 'https://api.studio.thegraph.com/query/57306/cf-lineasepolia/version/latest',
  44787: 'https://api.studio.thegraph.com/query/84765/cf-celoalfajores/version/latest',
  84532: 'https://api.studio.thegraph.com/query/84765/cf-basesepolia/version/latest',
  168587773: 'https://api.studio.thegraph.com/query/57306/cf-blasttestnet/v0.0.1',
  1313161555: 'https://api.studio.thegraph.com/query/57306/cf-auroratestnet/version/latest',
  534351: 'https://api.studio.thegraph.com/query/57306/cf-scroll-testnet/version/latest',
  1287: 'https://api.studio.thegraph.com/query/84765/cf-mbase/0.0.1',
  4002: 'https://api.studio.thegraph.com/query/57306/cf-fantom-testnet/version/latest',
};
export const wrappedSymbol: { [chainId in ChainId]: string } = {
  1: 'WETH',
  97: 'WBNB',
  80002: 'WMATIC',
  421614: 'WARB',
  4002: 'WFTM',
  11155111: 'WETH',
  43113: 'WAVAX',
  11155420: 'WOPT',
  59141: 'WLINEAETH',
  44787: 'WCELO',
  84532: 'WETHER',
  168587773: 'WETHER',
  1313161555: 'WETHER',
  534351: 'WETHER',
  1287: 'WDEV',
};
export const nativeSymbol: { [chainId in ChainId]: string } = {
  1: 'ETH',
  97: 'BNB',
  80002: 'MATIC',
  421614: 'ARB',
  4002: 'FTM',
  11155111: 'ETH',
  43113: 'AVAX',
  11155420: 'OPT',
  59141: 'LINEAETH',
  44787: 'CELO',
  84532: 'ETHER',
  168587773: 'ETHER',
  1313161555: 'ETHER',
  534351: 'ETHER',
  1287: 'DEV',
};

export const WETH: {
  1: Token;
  11155111: Token;
  97: Token;
  80002: Token;
  421614: Token;
  4002: Token;
  43113: Token;
  11155420: Token;
  59141: Token;
  44787: Token;
  84532: Token;
  168587773: Token;
  1313161555: Token;
  534351: Token;
  1287: Token;
} = {
  97: new Token(ChainId.BINANCETEST, '0x1D330e82FE5742704a40e1ADbbED3e22c3250921', 18, 'WBNB', 'Wrapped BNB'),
  80002: new Token(ChainId.AMOY, '0x01805a841ece00cf680996bF4B4e21746C68Fd4e', 18, 'WMATIC', 'Wrapped MATIC'),
  421614: new Token(ChainId.ARBITRUM, '0xa1012ee0bee96dcbc08267fc35e6b06e64e4ac45', 18, 'WARB', 'Wrapped ARB'),
  4002: new Token(ChainId.FANTOM, '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45', 18, 'WFTM', 'Wrapped FTM'),
  11155111: new Token(ChainId.SEPOLIA, '0xCa3949080ce2c1134dbc0BEf36F0cB49f44B918D', 18, 'WETH', 'Wrapped Ether'),
  43113: new Token(ChainId.AVALANCE, '0xF05d5519A45C6D877B7D86B8bA89A6Af0F875360', 18, 'WAVAX', 'Wrapped AVAX'),
  11155420: new Token(ChainId.OPTIMISM, '0x01805a841ece00cf680996bF4B4e21746C68Fd4e', 18, 'WOPT', 'Wrapped OPT'),
  59141: new Token(ChainId.LINEA, '0x2B8Aa9Bc15870A79DEf1cD4A3182287B08AcE30A', 18, 'WLINEAETH', 'Wrapped ETH'),
  44787: new Token(ChainId.CELO, '0xF771707F18751a644B4066d6818cbe11B96Ea9a3', 18, 'WCELO', 'Wrapped CELO'),
  84532: new Token(ChainId.BASE, '0x40b250Dc7c789F3f8f4CdEf2cE369421869eA380', 18, 'WETHER', 'Wrapped ETH'),
  168587773: new Token(ChainId.BLAST, '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd', 18, 'WETHER', 'Wrapped ETH'),
  1313161555: new Token(ChainId.AURORA, '0xa19Ab77b849d4b2D137b0D0d148b4566183557Bc', 18, 'WETHER', 'Wrapped ETH'),
  534351: new Token(ChainId.SCROLL, '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd', 18, 'WETHER', 'Wrapped ETH'),
  1287: new Token(ChainId.MOONBASE, '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45', 18, 'WDEV', 'Wrapped DEV'),
} as {
  1: Token;
  11155111: Token;
  97: Token;
  80002: Token;
  421614: Token;
  4002: Token;
  43113: Token;
  11155420: Token;
  59141: Token;
  44787: Token;
  84532: Token;
  168587773: Token;
  1313161555: Token;
  534351: Token;
  1287: Token;
};
// export const BLID_ADDRESS = '0xC696A459d461467ffeCFC8F6953e41EDB7D44f41'; // MAINNET CONTRACT
// export const BLID_ADDRESS = '0x99212bAd63859E18b827b08F86C954DCdcFb4f7E'; // GOERLI TESTNET CONTRACT
export const BLID_ADDRESS = '0x9ea167b7a205df38d8de4da6c3d2ca58b9e5cb66'; // SEPOLIA TESTNET CONTRACT
export const feeLimit = 0.35;
export const executorFee = 1e15;
export const expire = 24 * 3600 * 90; //90 days
export const bitquery_key = 'BQYAUI1wWPE1jS3hJXeuIq5UjVsjjOue';

export const WETH_ADDRESS = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.SEPOLIA]: '0xCa3949080ce2c1134dbc0BEf36F0cB49f44B918D',
  // [ChainId.BINANCETEST]: '0xCFbE3AA58eA0E2EFeF56abaF6Aa649AfADa44CA7',
  [ChainId.BINANCETEST]: '0x1D330e82FE5742704a40e1ADbbED3e22c3250921',
  [ChainId.AMOY]: '0x01805a841ece00cf680996bF4B4e21746C68Fd4e',
  [ChainId.ARBITRUM]: '0xa1012ee0bee96dcbc08267fc35e6b06e64e4ac45',
  [ChainId.FANTOM]: '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45',
  [ChainId.AVALANCE]: '0xF05d5519A45C6D877B7D86B8bA89A6Af0F875360',
  [ChainId.OPTIMISM]: '0x01805a841ece00cf680996bF4B4e21746C68Fd4e',
  [ChainId.LINEA]: '0x2B8Aa9Bc15870A79DEf1cD4A3182287B08AcE30A',
  [ChainId.CELO]: '0xF771707F18751a644B4066d6818cbe11B96Ea9a3',
  [ChainId.BASE]: '0x40b250Dc7c789F3f8f4CdEf2cE369421869eA380',
  [ChainId.BLAST]: '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd',
  [ChainId.AURORA]: '0xa19Ab77b849d4b2D137b0D0d148b4566183557Bc',
  [ChainId.SCROLL]: '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd',
  [ChainId.MOONBASE]: '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45',
};

export const CFC_TOKEN_ADDRESS = '0x9BED7e1B07be88894bBf599b50E8189C55b0a888';

export const Chain_To_Symboll = {
  '97': 'BNB',
  '11155111': 'SEP',
  '1': 'ETH',
  '43113': 'AVAX',
  '11155420': 'OPT',
  '59141': 'LINEAETH',
  '44787': 'CELO',
  '84532': 'ETHER',
  '168587773': 'ETHER',
  '1313161555': 'ETHER',
  '534351': 'ETHER',
  '1287': 'DEV',
};

export const getContractData = (chainId: ChainId) => {
  return {
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    ROUTER_ADDRESS: Router[chainId],
    FACTORY_ADDRESS: Factory[chainId],
    CFC_TOKEN_ADDRESS: '0x9BED7e1B07be88894bBf599b50E8189C55b0a888',
    INIT_CODE_HASH: Init_code[chainId],
  };
};

export const LP_TOKEN_NAME = 'Swap-LP-Token';
export const LP_TOKEN_SYMBOL = 'SWAP-LP';

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const DAI = new Token(
  ChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
);
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin');
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD');
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound');
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker');
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth');
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC');

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13;
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320;
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS;
export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC';

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [TIMELOCK_ADDRESS]: 'Timelock',
};

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.SEPOLIA]: [WETH[ChainId.SEPOLIA]],
  [ChainId.BINANCETEST]: [WETH[ChainId.BINANCETEST]],
  [ChainId.AMOY]: [WETH[ChainId.AMOY]],
  [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
  [ChainId.FANTOM]: [WETH[ChainId.FANTOM]],
  [ChainId.AVALANCE]: [WETH[ChainId.AVALANCE]],
  [ChainId.OPTIMISM]: [WETH[ChainId.OPTIMISM]],
  [ChainId.LINEA]: [WETH[ChainId.LINEA]],
  [ChainId.CELO]: [WETH[ChainId.CELO]],
  [ChainId.BASE]: [WETH[ChainId.BASE]],
  [ChainId.BLAST]: [WETH[ChainId.BLAST]],
  [ChainId.AURORA]: [WETH[ChainId.AURORA]],
  [ChainId.SCROLL]: [WETH[ChainId.SCROLL]],
  [ChainId.MOONBASE]: [WETH[ChainId.MOONBASE]],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC],
  [ChainId.BINANCETEST]: [...WETH_ONLY[ChainId.BINANCETEST]],
  [ChainId.AMOY]: [...WETH_ONLY[ChainId.AMOY]],
  [ChainId.ARBITRUM]: [...WETH_ONLY[ChainId.ARBITRUM]],
  [ChainId.FANTOM]: [...WETH_ONLY[ChainId.FANTOM]],
  [ChainId.AVALANCE]: [...WETH_ONLY[ChainId.AVALANCE]],
  [ChainId.OPTIMISM]: [...WETH_ONLY[ChainId.OPTIMISM]],
  [ChainId.LINEA]: [...WETH_ONLY[ChainId.LINEA]],
  [ChainId.CELO]: [...WETH_ONLY[ChainId.CELO]],
  [ChainId.BASE]: [...WETH_ONLY[ChainId.BASE]],
  [ChainId.BLAST]: [...WETH_ONLY[ChainId.BLAST]],
  [ChainId.AURORA]: [...WETH_ONLY[ChainId.AURORA]],
  [ChainId.SCROLL]: [...WETH_ONLY[ChainId.SCROLL]],
  [ChainId.MOONBASE]: [...WETH_ONLY[ChainId.MOONBASE]],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
  },
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.SEPOLIA]: [...WETH_ONLY[ChainId.SEPOLIA]],
  [ChainId.BINANCETEST]: [...WETH_ONLY[ChainId.BINANCETEST]],
  [ChainId.AMOY]: [...WETH_ONLY[ChainId.AMOY]],
  [ChainId.ARBITRUM]: [...WETH_ONLY[ChainId.ARBITRUM]],
  [ChainId.FANTOM]: [...WETH_ONLY[ChainId.FANTOM]],
  [ChainId.AVALANCE]: [...WETH_ONLY[ChainId.AVALANCE]],
  [ChainId.OPTIMISM]: [...WETH_ONLY[ChainId.OPTIMISM]],
  [ChainId.LINEA]: [...WETH_ONLY[ChainId.LINEA]],
  [ChainId.CELO]: [...WETH_ONLY[ChainId.CELO]],
  [ChainId.BASE]: [...WETH_ONLY[ChainId.BASE]],
  [ChainId.BLAST]: [...WETH_ONLY[ChainId.BLAST]],
  [ChainId.AURORA]: [...WETH_ONLY[ChainId.AURORA]],
  [ChainId.SCROLL]: [...WETH_ONLY[ChainId.SCROLL]],
  [ChainId.MOONBASE]: [...WETH_ONLY[ChainId.MOONBASE]],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string[];
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: injected,
  //   name: 'Injected',
  //   iconName: 'arrow-right.svg',
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true,
  // },
  METAMASK: {
    connector: injected,
    name: 'MetaMask Wallet',
    iconName: 'metamask.png',
    description: [
      'To connect to MetaMask from browser use Google chrome extension',
      'To connect to MetaMask from mobile use MetaMask app',
    ],
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'walletConnectIcon.svg',
    description: ['Connection to Wallet Connect under development '],
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5',
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true,
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true,
  // },
};

export const NetworkContextName = 'NETWORK';
// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;
// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);
export const BIG_INT_ZERO = JSBI.BigInt(0);
// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%
// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));
export const ZERO_PERCENT = new Percent('0');
export const ONE_HUNDRED_PERCENT = new Percent('1');
export const FIVE_PERCENTS = 5;
export const ONE_HUNDRED = 100;
export const ZERO_STRING = '0';

export const chainId_ChainName = {
  '11155111': 'SEPOLIA',
  '97': 'BINANCETEST',
  '80002': 'AMOY',
  '421614': 'ARBITRUM',
  '4002': 'FANTOM',
  '43113': 'AVALANCE',
  '11155420': 'OPTIMISM',
  '59141': 'LINEA',
  '44787': 'CELO',
  '84532': 'BASE',
  '168587773': 'BLAST',
  '1313161555': 'AURORA',
  '534351': 'SCROLL',
  '1287': 'MOONBASE',
};

export const Symbol = [
  'BNB',
  'ETH',
  'MATIC',
  'ARB',
  'FTM',
  'AVAX',
  'OPT',
  'LINEAETH',
  'CELO',
  'ETHER',
  'ETHER',
  'ETHER',
  'ETHER',
  'DEV',
];

export function useChainId() {
  const { chainId } = useActiveWeb3React();
  return chainId;
}

export const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  11155111: 'sepolia.',
  97: 'testnet.',
  80002: 'amoy.',
  421614: 'sepolia.',
  4002: 'testnet.',
  43113: 'testnet.',
  11155420: 'sepolia-optimism.',
  59141: 'sepolia.',
  44787: 'alfajores.',
  84532: 'sepolia.',
  168587773: 'sepolia.',
  1313161555: 'explorer.',
  534351: 'sepolia.',
  1287: 'moonbase.',
};

export const ETHERSCAN_POSTFIXES: { [chainId in ChainId]: string } = {
  1: '',
  11155111: 'etherscan.io',
  97: 'bscscan.com',
  80002: 'polygonscan.com',
  421614: 'arbiscan.io',
  4002: 'ftmscan.com',
  43113: 'avascan.info/blockchain/c',
  11155420: 'etherscan.io',
  59141: 'lineascan.build',
  44787: 'celoscan.io',
  84532: 'basescan.org',
  168587773: 'blastscan.io',
  1313161555: 'testnet.aurora.dev/',
  534351: 'scrollscan.com/',
  1287: 'moonscan.io/',
};

export interface Chain {
  chainId: number;
  name: string;
  symbol: string;
  logoURI: string;
  slug: string;
}

export const chains: Chain[] = [
  {
    chainId: 1,
    name: 'ETHEREUM',
    symbol: 'ETH',
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
    slug: 'ethereum',
  },
  {
    chainId: 97,
    name: 'BINANCE TESTNET',
    symbol: 'BNB',
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029',
    slug: 'binance',
  },
  {
    chainId: 80002,
    name: 'AMOY',
    symbol: 'MATIC',
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=031',
    slug: 'amoy',
  },
  {
    chainId: 421614,
    name: 'ARBITRUM',
    symbol: 'ARB',
    logoURI: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=032',
    slug: 'arbitrum',
  },
  {
    chainId: 4002,
    name: 'FANTOM',
    symbol: 'FTM',
    logoURI: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=032',
    slug: 'fantom',
  },
  {
    chainId: 11155111,
    name: 'SEPOLIA',
    symbol: 'SepoliaETH',
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
    slug: 'ethereum-2',
  },
  {
    chainId: 43113,
    name: 'AVALANCE',
    symbol: 'AVAX',
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=032',
    slug: 'avalance',
  },
  {
    chainId: 11155420,
    name: 'OPTIMISM',
    symbol: 'OPT',
    logoURI: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg?v=032',
    slug: 'optimism',
  },
  {
    chainId: 59141,
    name: 'LINEA',
    symbol: 'LINEAETH',
    logoURI: 'https://app.lineans.domains/static/media/linea.ac8e60ef8dc99ebc06a1.png',
    slug: 'linea',
  },
  {
    chainId: 44787,
    name: 'CELO',
    symbol: 'CELO',
    logoURI: 'https://cryptologos.cc/logos/celo-celo-logo.svg?v=032',
    slug: 'celo',
  },
  {
    chainId: 84532,
    name: 'BASE',
    symbol: 'ETHER',
    logoURI: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
    slug: 'base',
  },
  {
    chainId: 168587773,
    name: 'BLAST',
    symbol: 'ETHER',
    logoURI: 'https://www.bee.com/wp-content/uploads/2023/11/blastOeT9Ef1J_400x400.jpg',
    slug: 'blast',
  },
  {
    chainId: 1313161555,
    name: 'AURORA',
    symbol: 'ETHER',
    logoURI: 'https://cryptologos.cc/logos/aurora-aoa-logo.svg?v=032',
    slug: 'aurora',
  },
  {
    chainId: 534351,
    name: 'SCROLL',
    symbol: 'ETHER',
    logoURI: 'https://scrollscan.com/assets/scroll/images/svg/logos/chain-light.svg?v=24.6.4.0',
    slug: 'scroll',
  },
  {
    chainId: 1287,
    name: 'MOONBASE',
    symbol: 'DEV',
    logoURI: 'https://pbs.twimg.com/profile_images/1754376280873852928/S_IdfQ0v_400x400.jpg',
    slug: 'moonbase',
  },
];

export const tokenAddresses = {
  name: 'Uniswap Default List',
  timestamp: '2021-01-21T23:57:10.982Z',
  version: {
    major: 2,
    minor: 0,
    patch: 0,
  },
  tags: {},
  logoURI: 'ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir',
  keywords: ['uniswap', 'default'],
  tokens: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 97,
      decimals: 18,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      name: 'BINANCE',
      symbol: 'BNB',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 80002,
      decimals: 18,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      name: 'AMOY',
      symbol: 'MATIC',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 421614,
      decimals: 18,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      name: 'ARBITRUM',
      symbol: 'ARB',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 4002,
      decimals: 18,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      name: 'FANTOM',
      symbol: 'FTM',
    },
    {
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      chainId: 1,
      decimals: 18,
      logoURI: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_ZRX.svg',
      name: '0x Protocol Token',
      symbol: 'ZRX',
    },
    {
      chainId: 11155111,
      address: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
      name: 'aUSDC',
      symbol: 'aUSDC',
      decimals: 6,
      logoURI: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 11155111,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'Sepolia ETH',
      symbol: 'ETH',
    },
    {
      chainId: 97,
      address: '0x510601cb8Db1fD794DCE6186078b27A5e2944Ad6',
      name: 'MDT',
      symbol: 'MDT',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 43113,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'AVALANCE',
      symbol: 'AVAX',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 11155420,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'OPTIMISM',
      symbol: 'OPT',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 59141,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'LINEA',
      symbol: 'LINEAETH',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 44787,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'CELO',
      symbol: 'CELO',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 84532,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'BASE',
      symbol: 'ETHER',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 168587773,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'BLAST',
      symbol: 'ETHER',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 1313161555,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'AURORA',
      symbol: 'ETHER',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 534351,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'SCROLL',
      symbol: 'ETHER',
    },
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chainId: 1287,
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
      name: 'MOONBASE',
      symbol: 'DEV',
    },
    // {
    //   chainId: 97,
    //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
    //   name: 'USDT',
    //   symbol: 'USDT',
    //   decimals: 6,
    //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
    // },
    // {
    //   chainId: 97,
    //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
    //   name: 'USDT',
    //   symbol: 'USDT',
    //   decimals: 6,
    //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
    // },
  ],
};

export interface tokenInfo {
  address: string;
  balance: number;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  tokenInfo: {
    address: string;
    chainId: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
  };
}

export enum ChainIds {
  MAINNET = 1,
  BINANCETEST = 97,
  AMOY = 80002,
  ARBITRUM = 421614,
  FANTOM = 4002,
  SEPOLIA = 11155111,
  AVALANCE = 43113,
  OPTIMISM = 11155420,
  LINEA = 59141,
  CELO = 44787,
  BASE = 84532,
  BLAST = 168587773,
  AURORA = 1313161555,
  SCROLL = 534351,
  MOONBASE = 1287,
}
export const EMPTY_LIST: TokenAddressMap = {
  [ChainId.MAINNET]: {},
  [ChainId.BINANCETEST]: {},
  [ChainId.AMOY]: {},
  [ChainId.ARBITRUM]: {},
  [ChainId.FANTOM]: {},
  [ChainId.SEPOLIA]: {},
  [ChainId.AVALANCE]: {},
  [ChainId.OPTIMISM]: {},
  [ChainId.LINEA]: {},
  [ChainId.CELO]: {},
  [ChainId.BASE]: {},
  [ChainId.BLAST]: {},
  [ChainId.AURORA]: {},
  [ChainId.SCROLL]: {},
  [ChainId.MOONBASE]: {},
};

export type TokenAddressMap = Readonly<
  { [chainId in ChainIds]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }> }
>;

export const EMPTY_LIST_tokeninfo: TokenAddressMaptokeninfo = {
  [ChainId.MAINNET]: {},
  [ChainId.BINANCETEST]: {},
  [ChainId.AMOY]: {},
  [ChainId.ARBITRUM]: {},
  [ChainId.FANTOM]: {},
  [ChainId.SEPOLIA]: {},
  [ChainId.AVALANCE]: {},
  [ChainId.OPTIMISM]: {},
  [ChainId.LINEA]: {},
  [ChainId.CELO]: {},
  [ChainId.BASE]: {},
  [ChainId.BLAST]: {},
  [ChainId.AURORA]: {},
  [ChainId.SCROLL]: {},
  [ChainId.MOONBASE]: {},
};

export type TokenAddressMaptokeninfo = Readonly<
  { [chainId in ChainId]: Readonly<{ [tokenAddress: string]: { token: tokenInfo; list: TokenList } }> }
>;

export function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    1: { ...map1[1], ...map2[1] },
    11155111: { ...map1[11155111], ...map2[11155111] },
    97: { ...map1[97], ...map2[97] },
    80002: { ...map1[80002], ...map2[80002] },
    421614: { ...map1[421614], ...map2[421614] },
    4002: { ...map1[4002], ...map2[4002] },
    43113: { ...map1[43113], ...map2[43113] },
    11155420: { ...map1[11155420], ...map2[11155420] },
    59141: { ...map1[59141], ...map2[59141] },
    44787: { ...map1[44787], ...map2[44787] },
    84532: { ...map1[84532], ...map2[84532] },
    168587773: { ...map1[168587773], ...map2[168587773] },
    1313161555: { ...map1[1313161555], ...map2[1313161555] },
    534351: { ...map1[534351], ...map2[534351] },
    1287: { ...map1[1287], ...map2[1287] },
  };
}

export const setOutPutChainId: { [key: number]: number } = {
  97: 11155111,
  11155111: 97,
  1: 97,
  80002: 97,
  421614: 97,
  4002: 97,
  43113: 97,
  11155420: 97,
  59141: 97,
  44787: 97,
  84532: 97,
  168587773: 97,
  1313161555: 97,
  534351: 97,
  1287: 97,
};

export const routerAddresses: { [key: number]: string } = {
  '5': 'C2dB244fb4fE20e2C0176F28e4952b89e3Df708F',
  '97': 'aE32aa62Eb59a007Fd5eE4dbEe3cf0b6f505387c',
  '80001': 'C3b65e0aF3EB670d325B72f43DD8A00AA1DF5661',
};

type CCRouterMap = {
  5: string;
  80001: string;
  97: string;
  [key: number]: string; // Add this index signature
};
const pol = process.env.REACT_APP_CC_POLYGON;
const eth = process.env.REACT_APP_CC_ETHEREUM;
const bnb = process.env.REACT_APP_CC_BINANCE;
export const CC_ROUTERS: CCRouterMap = {
  5: eth ?? '',
  80001: pol ?? '',
  97: bnb ?? '',
};

export const ROUTER_ADDRESS = '0x19BcDe40508D876E2EDa2c0DAd66dfc55b791e7C';
