import { UnsupportedChainIdError } from '@web3-react/core';
import { isMobile } from 'react-device-detect';
import { toHex } from 'web3-utils';

async function addNetwork(chainId : any , chainName: string , rpcUrls : any , explorerUrl : string ,name : string,symbol : string , decimals : number) {
  if (!window.ethereum) {
    console.error("Couldn't find wallet");
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  await window.ethereum?.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: toHex(chainId),
        chainName: chainName,
        rpcUrls: [(rpcUrls)],
        blockExplorerUrls: [(explorerUrl)],
        nativeCurrency: {
          name: name,
          symbol: symbol,
          decimals: decimals,     
        },
      },
    ],
  });
  
}

export async function switchNetwork (chainId : any , chainName: string , rpcUrls : any ,explorerUrl : string ,name : string,symbol : string , decimals : number ) {
  if (!window.ethereum) {
    console.error("Couldn't find wallet");
    isMobile && alert('Change network in your application');
  }
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toHex(chainId)}],
      
      // params: [{ chainId: toHex(NETWORK_CHAIN_ID) }],
    });
  } catch (error) {

    if (error instanceof UnsupportedChainIdError || error.code === 4902 || error.code === -32603) await addNetwork(chainId , chainName , rpcUrls,explorerUrl, name , symbol,decimals);
    console.error('error while switching networks');
  }
}
