import { InjectedConnector } from '@web3-react/injected-connector';
import { supportedChainIds } from 'constants/contractConstants';

export function getInjected() {
  const router = window.location.href;
  return router.includes('bridge')
    ? new InjectedConnector({
        // supportedChainIds: [1],
        supportedChainIds: supportedChainIds,
      })
    : new InjectedConnector({
        // supportedChainIds: [1],
        supportedChainIds: supportedChainIds,
      });
}