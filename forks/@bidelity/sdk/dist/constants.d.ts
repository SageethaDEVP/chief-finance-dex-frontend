import JSBI from 'jsbi'
export declare type BigintIsh = JSBI | bigint | string
export declare enum ChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  BINANCETEST = 97,
  AMOY = 80002,
  ARBITRUM = 421614,
  FANTOM = 4002,
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
export declare enum TradeType {
  EXACT_INPUT = 0,
  EXACT_OUTPUT = 1,
}
export declare enum Rounding {
  ROUND_DOWN = 0,
  ROUND_HALF_UP = 1,
  ROUND_UP = 2,
}

// export declare const FACTORY_ADDRESS = '0x2752604ec26fAf7153eEa3053F06982e063D8742'
// export declare const INIT_CODE_HASH = '0x7f599de486e38be0019025ec7a9854bf07c24449db7c05a11d87df62410f77b5'

// export declare const FACTORY_ADDRESS = '0x4D21B0E30d94f54ef9B5324709ceB5C06F86EBa8'
// export declare const INIT_CODE_HASH = '0xe973e3d886c55dcdd68af79ba1794ef0161db147d6a5eda7d2bf70fce9265a03'
export declare const MINIMUM_LIQUIDITY: JSBI
export declare const ZERO: JSBI
export declare const ONE: JSBI
export declare const TWO: JSBI
export declare const THREE: JSBI
export declare const FIVE: JSBI
export declare const TEN: JSBI
export declare const _100: JSBI
export declare const _997: JSBI
export declare const _1000: JSBI
export declare enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}
export declare const SOLIDITY_TYPE_MAXIMA: {
  uint8: JSBI
  uint256: JSBI
}
