export const apiUrls = {
  wallets: {
    addWallet: '/api/wallets',
    address: '/api/wallets/{address}/address',
  },
  tokens: {
    getByAddress: '/api/tokens/{address}',
    inactiveList: '/api/tokens/inactive',
  },
  pairs: {
    hiddenPairs: '/api/pairs/hide-list',
    getPairInfo: '/api/pairs',
  },
};
