import { useActiveWeb3React } from './index';
import { Token } from '@bidelity/sdk';

export const useAddToMetamask = (token: Token): (() => void) => {
  const { library } = useActiveWeb3React();
  const addToMetamask = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    library?.provider.send(
      {
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token?.address,
            symbol: token?.symbol,
            decimals: token?.decimals,
          },
        } as any,
      },
      (error: any) => {
        console.debug(error);
        console.log('Error while adding to metamask');
      }
    );
    // console.log('Testing Library : ', library);
  };

  return addToMetamask;
};
