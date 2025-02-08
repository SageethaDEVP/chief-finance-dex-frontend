// export const ETHTOKEN ={ETH:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',Gorlie:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',AUSDC:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',};

// export const BNBTOKEN={BNB:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',BNBTOKEN1:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',BNBTOKEN2:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'};
// export const POLLYTOKEN={MATIC:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',POLLYTOKEN1:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',POLLYTOKEN2:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',};

export const ETHROUTER = 'ethereum_Router_address';
export const BNBROUTER = 'BNB_router_address';
export const POLYROUTER = 'POLLY_Router_address';

export async function Bridge(
  fromChain: number,
  toChain: number,
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromAddress: string,
  toAddress: string
): Promise<void> {
  const integratorId = 'yash-swap-widget';
  const result = await fetch('https://testnet.v2.api.squidrouter.com/v2/route', {
    method: 'POST',
    body: JSON.stringify({
      fromChain: fromChain,
      toChain: toChain,
      fromToken: fromToken,
      toToken: toToken,
      fromAmount: fromAmount, // 0.1 AVAX
      fromAddress: fromAddress,
      toAddress: toAddress,
      slippageConfig: {
        autoMode: 1,
      },
    }),
    headers: {
      'x-integrator-id': integratorId,
      'Content-Type': 'application/json',
    },
  });

  const route = await result.json();

  return route;
}
