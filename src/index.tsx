import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import 'inter-ui';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { NetworkContextName, graphEndPoints } from './constants';
import './i18n';
import App from './pages/App';
import store from './state';
import ApplicationUpdater from './state/application/updater';
import ListsUpdater from './state/lists/updater';
import MulticallUpdater from './state/multicall/updater';
import TransactionUpdater from './state/transactions/updater';
import UserUpdater from './state/user/updater';
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme';
import getLibrary from './utils/getLibrary';
import { useActiveWeb3React } from 'hooks';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

const endpoint1 = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
});

const endpoint2 = new HttpLink({
  // uri: 'https://api.thegraph.com/subgraphs/name/yash-khatri-minddeft/chief-finance-graph',
  // uri: 'https://api.studio.thegraph.com/query/51975/chieffinance/0.0.1',
  uri: 'https://api.studio.thegraph.com/query/57306/cf-sepolia/version/latest',
});

// export const client = new ApolloClient({
//   link: ApolloLink.split(
//     (operation) => (graphEndPoints[operation.getContext().clientName] ? true : false),
//     new HttpLink({ uri: graphEndPoints[operation.getContext().clientName] }),
//     new HttpLink({ uri: graphEndPoints[operation.getContext().clientName] })
//   ),
//   uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
//   cache: new InMemoryCache(),
// });

const getUriFromContext = (operation: any) => {
  const clientName = operation.getContext().clientName;
  return graphEndPoints[clientName] || 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
};

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => !!graphEndPoints[operation.getContext().clientName],
    new HttpLink({ uri: getUriFromContext }),
    new HttpLink({ uri: getUriFromContext })
  ),
  cache: new InMemoryCache(),
});

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <ThemeProvider>
            <ThemedGlobalStyle />
            <BrowserRouter>
              <ApolloProvider client={client}>
                <App />
              </ApolloProvider>
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);
