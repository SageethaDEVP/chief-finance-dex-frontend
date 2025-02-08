import { useActiveWeb3React } from 'hooks';
import React, { useState, ChangeEvent, FormEvent, useCallback, useEffect, useMemo } from 'react';
import { AutoColumn } from '../../components/Column';
import ArrowsCellIcon from '../../assets/svg-bid/button-cell.svg';
import { ArrowWrapperSwap } from '../../components/swap/styleds';
import { TEXT } from '../../theme';
import { AutoRow } from '../../components/Row';
import { ExchangeButton } from 'components/CrossChainComponents/StyledComponents/Button';
import { WrapContent, WrapSelect, Pagewrap } from 'components/CrossChainComponents/StyledComponents/Wrappers';
import { InputLabel, Inputrow } from '../../components/CrossChainComponents/StyledComponents/InputPanel/index';
import ChainInputPanel from 'components/CrossChainComponents/ChainInputPanel';
import { Container } from '../../components/CrossChainComponents/StyledComponents/Container/index';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { utils } from 'ethers';
import { ethers } from 'ethers';
import { getCCRouterContract } from 'utils';
import { CCCurrencyInputPanel } from '../../components/CrossChainComponents/CCCurrencyInputPanel';
import ccRouterABI from '../../constants/abis/ccRouter';
import Swap from '../../assets/images/swap.png';
import InfoIco from '../../assets/images/info.png';
import SettingIco from '../../assets/images/setting.png';
import errInfo from '../../assets/images/errInfo.png';

import {
  listToTokenMap,
  useTokensFromMap,
  usePreSelectedCurrency,
  usePreSelectedChain,
  getRouterAddress,
} from '../../components/CrossChainComponents/CCHooks';
import { TextValues } from 'components/CrossChainComponents/StyledComponents/TextValues';
import { fetchBalances } from 'components/CrossChainComponents/TokenBalances';
// import { Chain, chains, tokenInfo } from 'components/CrossChainComponents/CCHooks/types';

import { useWalletModalToggle } from 'state/application/hooks';
import { ButtonPrimary } from 'components/Button';
import { useTranslation } from 'react-i18next';
import TransactionDetailsModal from 'components/CrossChainComponents/TransactionDetailsModal';
import { SuccessTransactionModal } from 'components/CrossChainComponents/TransactionDetailsModal/TransactionData';
import styled from 'styled-components';
import Media from 'theme/media-breackpoint';
import QuestionHelper from 'components/QuestionHelper';
import Gs from 'theme/globalStyles';
import { CC_ROUTERS, Chain, chains, tokenInfo } from '../../constants';
// import chainlist from './Chainlist.json';

async function Bridge(
  fromChain: number,
  toChain: number,
  fromToken: string | undefined,
  toToken: string | undefined,
  fromAmount: string,
  fromAddress: string,
  toAddress: string,
  slippage: number
): Promise<void> {
  const integratorId = 'yash-swap-widget';
  const queryParams: any = await {
    fromChain: fromChain,
    toChain: toChain,
    fromToken: fromToken,
    toToken: toToken,
    fromAmount: fromAmount,
    fromAddress: fromAddress,
    toAddress: toAddress,
    slippage: slippage,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const baseUrl = 'https://testnet.api.0xsquid.com/v1/route';
  const url = `${baseUrl}?${queryString}`;

  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'x-integrator-id': integratorId,
      'Content-Type': 'application/json',
    },
  });

  const route = await result.json();
  return route;
}
export const Bridgecall = () => {
  const [currentvalue, setcurrentvalue] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [AmountIn, setAmountIn] = useState('');

  const { chainId, library, account } = useActiveWeb3React();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [route, setRoute] = useState<any>();

  const [inputBalanceAvailable, setInputBalanceAvailable] = useState<number>(0);
  const [outputBalanceAvailable, setOutputBalanceAvailable] = useState<number>(0);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const [inputChainModalOpen, setInputChainModalOpen] = useState<boolean>(false);
  const [outputChainModalOpen, setOutputChainModalOpen] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [successTransactionModalOpen, setSuccessTransactionModalOpen] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>('');

  const OpenSuccessModal = () => {
    setSuccessTransactionModalOpen(true);
  };
  const toggleModal = () => {
    setSuccessTransactionModalOpen(false);
  };
  const [inputCurrency, setInputCurrency] = useState<tokenInfo>();
  const [outputCurrency, setOutputCurrency] = useState<tokenInfo>();
  const [availability, setAvailability] = useState([0, 0]);

  const [inputChain, setInputChain] = useState<Chain>(chains[5]);
  const [outputChain, setOutputChain] = useState<Chain>(chains[2]);

  const toggleWalletModal = useWalletModalToggle();

  useEffect(() => {
    async function fetch() {
      if (inputCurrency && account) {
        const balance: any = await fetchBalances([inputCurrency], account, inputChain.chainId);
        setInputBalanceAvailable(balance[inputCurrency.address]);
      }
    }
    fetch();
  }, [inputCurrency, account]);
  useEffect(() => {
    async function fetch() {
      if (outputCurrency && account) {
        const balance: any = await fetchBalances([outputCurrency], account, outputChain.chainId);
        setOutputBalanceAvailable(balance[outputCurrency.address]);
      }
    }
    fetch();
  }, [outputCurrency, account]);

  const [currentchainid, setcurrentchainid] = useState(1);

  const rotateOnHover = {
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  // ===============================================================================
  useEffect(() => {
    const selectedChain = chains.find((chain) => chain?.chainId === currentchainid);

    if (selectedChain) {
      setInputChain(selectedChain);
    }
  }, [currentchainid]);

  // ===============================================================================

  // useEffect(() => {
  //   setInputCurrency(ethItemData[0]);
  //   setOutputCurrency(polyItemData[0]);
  // }, []);
  const { currIn, currOut } = usePreSelectedCurrency(inputChain?.chainId);

  const { chainIn, chainOut } = usePreSelectedChain(inputChain?.chainId);

  useEffect(() => {
    setInputCurrency(currIn);
    setOutputCurrency(currOut);
  }, [currIn, currOut]);

  useEffect(() => {
    setInputChain(chainIn);
    setOutputChain(chainOut);
  }, [chainIn, chainOut]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!account) {
          console.error('Account is undefined or null.');
          return;
        }

        const route: any = await Bridge(
          inputChain.chainId,
          outputChain.chainId,
          inputCurrency?.address,
          outputCurrency?.address,
          AmountIn,
          account,
          account,
          1
        );

        if (route.route) {
          setcurrentvalue(parseFloat(utils.formatUnits(route?.route?.estimate?.toAmount, 'ether')));
          setExchangeRate(route?.route?.estimate?.exchangeRate);
          setRoute(route);
          setError('');
        } else if (route.errors) {
          setError(route?.errors[0]?.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    // Use a debounce function to delay the execution of fetchData
    let timeoutId: NodeJS.Timeout;

    const debounceFetchData = function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      setLoading(true);
      timeoutId = setTimeout(() => fetchData.apply(this, args), 1000);
    };

    // Call fetchData after the user stops typing for 2 seconds
    if (AmountIn && inputCurrency && outputCurrency && inputChain && outputChain && account) debounceFetchData();

    // Cleanup function to clear the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [AmountIn, inputCurrency, outputCurrency, inputChain, outputChain, account]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Ensure that the value is a valid number or an empty string
    // const newValue = e.target.value === '' ? '' : parseFloat(e.target.value);
    if (e.target.value) {
      const wei = utils.parseUnits(e.target.value, 'ether');
      setAmountIn(wei.toString());
    } else setAmountIn('');
  };

  // Getting chain id for default Token

  useEffect(() => {
    const checkSelectedChain = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Function to handle chain changes

        // Listen for chain changes

        // Call the handler initially to get the current chain ID
        try {
          const network = await provider.getNetwork();
          // handleChainChange(network.chainId.toString());
          setcurrentchainid(network.chainId);
        } catch (error) {
          console.error('Error getting chain ID from MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected. Please install and connect MetaMask.');
      }
    };

    // window?.ethereum?.on('chainChanged', checkSelectedChain);
    if (window?.ethereum?.on) {
      // Listen for chain changes
      window.ethereum.on('chainChanged', checkSelectedChain);
    }
    checkSelectedChain();
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleKeys = (event: any) => {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === '-' ||
      event.key === 'e'
    ) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const handleDocumentWheel = (e: WheelEvent) => {
      const targetElement = e.target as Element | null;

      if (targetElement?.tagName === 'INPUT' && (e.deltaY !== 0 || e.deltaX !== 0)) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleDocumentWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleDocumentWheel);
    };
  }, []);

  const executeSmartContract = async (
    params: any,
    methodName: string,
    maxFeePerGas: string,
    value: string,
    gasLimit: string
  ) => {
    if (!chainId || !library || !account) return;
    const chain = inputChain.name;
    if (!chain) return;
    const ccRouter: any = getCCRouterContract(chainId, library, chain, account);
    setTransactionModalOpen(true);
    const result = await ccRouter[methodName](...params, {
      gasLimit: gasLimit,
      value: value,
    })
      .then((response: any) => {
        setTransactionModalOpen(false);
        setSuccessTransactionModalOpen(true);
        setTxnHash(response.hash);
      })
      .catch((error: Error) => {
        setTransactionModalOpen(false);
        setSuccessTransactionModalOpen(false);
        setTxnHash('');
        console.debug('transaction failed', error);
      });
  };

  const bridgecall = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!account) {
      console.error('Account is undefined or null.');
      return;
    }

    const abi = ccRouterABI;
    const interFace = new ethers.utils.Interface(abi);
    type Methods = {
      CALL_BRIDGE_CALL: 'callBridgeCall';
      BRIDGE_CALL: 'bridgeCall';
      CALL_BRIDGE: 'callBridge';
    };

    const methods: Methods = {
      CALL_BRIDGE_CALL: 'callBridgeCall',
      BRIDGE_CALL: 'bridgeCall',
      CALL_BRIDGE: 'callBridge',
    };
    const txnData = route.route.transactionRequest;
    const routeType: keyof Methods = txnData.routeType;
    const methodName: Methods[keyof Methods] = methods[routeType];
    const gasLimit = txnData.gasLimit;
    const gasPrice = txnData.gasPrice;
    const maxFeePerGas = txnData.maxFeePerGas;
    const maxPriorityFeePerGas = txnData.maxPriorityFeePerGas;
    const target = txnData.target;
    const value = txnData.value;

    const data = route.route.transactionRequest.data;
    const result = interFace.parseTransaction({ data, value });
    const dat: any = [...result.args[2]];

    if (methodName !== 'bridgeCall') {
      const ccRouter = getRouterAddress(inputChain.chainId);
      const repAddress = dat[2][3].replace('481a2aae41cd34832ddcf5a79404538bb2c02bc8', ccRouter);
      dat[2] = [dat[2][0], dat[2][1], dat[2][2], repAddress, dat[2][4]];
    }

    const paramObj = [];
    paramObj[0] = inputCurrency?.address;
    paramObj[1] = AmountIn;
    paramObj[2] = dat;
    paramObj[3] = result.args.bridgedTokenSymbol;
    paramObj[4] = outputChain?.slug;
    paramObj[5] = CC_ROUTERS[outputChain.chainId];
    paramObj[6] = result.args.payload;
    paramObj[7] = result.args.gasRefundRecipient;
    paramObj[8] = false;
    executeSmartContract(paramObj, methodName, maxFeePerGas, value, gasLimit);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const swapitem = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setInputCurrency(outputCurrency);
    setOutputCurrency(inputCurrency);
    setInputChain(outputChain);
    setOutputChain(inputChain);
  };

  const handleInputSelect = useCallback((inputCurrency: tokenInfo) => {
    setInputCurrency(inputCurrency);
    setInputModalOpen(false);
  }, []);

  const handleOutputSelect = useCallback(
    (outputCurrency: tokenInfo) => {
      setOutputModalOpen(false);
      setOutputCurrency(outputCurrency);
    },
    [setOutputCurrency]
  );

  const handleDismissSearch = useCallback(() => {
    setOutputModalOpen(false);
    setInputModalOpen(false);
  }, [setOutputModalOpen, setInputModalOpen]);

  const buttonName = () => {
    let btnName = <Gs.BtnSm className="lg secondary">Exchange</Gs.BtnSm>;
    if (!account) btnName = <Gs.BtnSm className="lg">Connect Wallet</Gs.BtnSm>;
    else if (!AmountIn) btnName = <Gs.BtnSm className="lg">Enter Valid Amount</Gs.BtnSm>;
    return btnName;
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <AmountBox className="normal">
            <div className="DropDowns">
              <CCCurrencyInputPanel
                setBalanceAvailable={setInputBalanceAvailable}
                setModalOpen={() => setInputModalOpen(true)}
                isOpen={inputModalOpen}
                onDismiss={handleDismissSearch}
                onCurrencySelect={handleInputSelect}
                selectedCurrency={inputCurrency}
                otherSelectedCurrency={outputCurrency}
                showCommonBases={undefined}
                chainId={inputChain?.chainId}
              />
              <ChainInputPanel
                isOpen={inputChainModalOpen}
                setModalOpen={setInputChainModalOpen}
                selectedChain={inputChain}
                otherSelectedChain={outputChain}
                setChain={setInputChain}
              />
            </div>

            {/* INPUT PANEL */}
            <ExBox>
              <div className="input-container w-100">
                <label htmlFor="yousend">Availability: {inputBalanceAvailable ? inputBalanceAvailable : 0}</label>
                <input
                  type="number"
                  placeholder="0.000"
                  onChange={handleAmountChange}
                  onWheel={handleWheel}
                  onKeyDown={handleKeys}
                />
              </div>
            </ExBox>
            {/* INPUT PANEL */}
          </AmountBox>
          {/* SWAP ICON */}
          <Switch className="normal">
            <a className="switch" onClick={swapitem}>
              <img src={Swap} alt="Swap" />
            </a>
          </Switch>
          {/* SWAP ICON */}
          <AmountBox className="normal">
            <div className="DropDowns">
              {/* CURRENCY SELECTION */}
              <CCCurrencyInputPanel
                setBalanceAvailable={setOutputBalanceAvailable}
                setModalOpen={() => setOutputModalOpen(true)}
                isOpen={outputModalOpen}
                onDismiss={handleDismissSearch}
                onCurrencySelect={handleOutputSelect}
                selectedCurrency={outputCurrency}
                otherSelectedCurrency={inputCurrency}
                showCommonBases={undefined}
                chainId={outputChain?.chainId}
              />
              {/* CURRENCY SELECTION */}

              {/* CHAIN SELECTION */}
              <ChainInputPanel
                isOpen={outputChainModalOpen}
                setModalOpen={setOutputChainModalOpen}
                selectedChain={outputChain}
                otherSelectedChain={inputChain}
                setChain={setOutputChain}
              />
              {/* CHAIN SELECTION */}
            </div>
            {/* INPUT PANEL */}
            {loading ? (
              <Skeleton width={'340px'} height={64} borderRadius={5} />
            ) : (
              <ExBox className="v2">
                <div className="input-container w-100">
                  <label htmlFor="yousend">Availability: {outputBalanceAvailable ? outputBalanceAvailable : 0}</label>
                  <input
                    id="yousend"
                    type="number"
                    placeholder="0.000"
                    value={currentvalue ? currentvalue.toFixed(6) : '0.0'}
                    disabled
                  />
                </div>
              </ExBox>
            )}
            {/* INPUT PANEL */}
          </AmountBox>
          {/* PRICE AND SLIPPAGE INFO */}
          <InfoSec className="mt0">
            <p>
              Price
              <span>
                {loading ? <Skeleton width={80} height={15} borderRadius={5} /> : Number(exchangeRate).toFixed(6)}
              </span>
            </p>
            <p>
              Slippage Tolerance{' '}
              <QuestionHelper
                iconSize={20}
                text="Your transaction will revert if the price changes unfavorably by more than this percentage."
              />
              {/* <a>
                <img style={{ verticalAlign: 'top' }} width={16} src={SettingIco} />
              </a> */}
              <span className="color-primary">1%</span>
            </p>
          </InfoSec>
          {/* PRICE AND SLIPPAGE INFO */}
          {/* ERROR STATES  */}
          {error && (
            <ErrorMessage>
              <i>
                <img style={{ verticalAlign: 'top' }} width={30} src={errInfo} />
              </i>{' '}
              {error}
            </ErrorMessage>
          )}
          {/* ERROR STATES */}
          {/* BUTTONS  */}
          <>
            {!account ? (
              <Gs.BtnSm className="lg" onClick={toggleWalletModal}>
                {t('connect wallet')}
              </Gs.BtnSm>
            ) : !AmountIn ? (
              <Gs.BtnSm className="lg">Enter Valid Amount</Gs.BtnSm>
            ) : error ? (
              <Gs.BtnSm className="lg error">Error</Gs.BtnSm>
            ) : (
              <Gs.BtnSm className="lg secondary" onClick={bridgecall}>
                Exchange
              </Gs.BtnSm>
            )}
          </>

          {/* BUTTONS  */}
          <TransactionDetailsModal isOpen={transactionModalOpen} setModalOpen={setTransactionModalOpen} />
          {/* <button onClick={OpenSuccessModal}> */}
          <SuccessTransactionModal hash={txnHash} isOpen={successTransactionModalOpen} onDismiss={toggleModal} />
          {/* Success Modal Open
              </button> */}
          <br />
        </form>
      </div>
    </>
  );
};

const AmountBox = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 20px 19px 32px;
  margin: 0 0 28px 0;
  .DropDowns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }
  &.normal {
    padding-bottom: 20px;
    margin-bottom: 10px;
  }
`;

const ExBox = styled.div`
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  background: var(--bgLight);
  padding: 12px 12px;
  &:focus-within {
    box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.16);
  }
  &:last-child {
    margin-bottom: 0;
  }
  .input-container {
    position: relative;
    border-right: 1px solid #abd0d9;
    width: 214px;
    &.w-100 {
      border-right: 0;
      width: 100%;
    }
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }
    input {
      border: 0px;
      font-size: 24px;
      background: none;
      color: var(--txtLight);
      font-family: var(--font);
      padding: 0 55px 20px 0;
      height: 40px;
      width: 100%;
      font-weight: 600;
      ::-ms-input-placeholder {
        /* Edge 12-18 */
        color: var(--txtLight2);
      }
      ::placeholder {
        color: var(--txtLight2);
      }
    }
    label {
      font-size: 12px;
      color: var(--txtLight);
      position: absolute;
      padding: 0 0;
      top: 25px;
      left: 0;
    }
    b {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      position: absolute;
      top: 0;
      right: 17px;
      cursor: pointer;
    }
  }
  &.v2 {
    background: var(--offWhite);
    height: 64px;
  }
  ${Media.xs} {
    .input-container {
      width: 100%;
      input {
        font-size: 20px;
        padding: 0 45px 20px 0;
      }
      b {
        right: 8px;
      }
    }
  }
`;

const Switch = styled.div`
  display: block;
  text-align: center;
  height: 0;
  a {
    width: 60px;
    height: 60px;
    background: var(--primary);
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out 0s;
    cursor: pointer;
    z-index: 1;
    position: relative;
    top: -48px;
    img {
      filter: brightness(100);
    }
    &:hover {
      transform: rotate(180deg);
      box-shadow: 0 0 0 5px rgba(27, 193, 154, 0.2);
    }
  }
  &.normal {
    height: auto;
    margin-bottom: 10px;
    a {
      top: 0;
    }
  }
`;

const InfoSec = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 15px 19px 5px;
  margin: -10px 0 21px 0;
  p {
    display: flex;
    align-items: flex-start;
    color: var(--txtLight);
    margin: 0 0 11px 0;
    a {
      vertical-align: top;
      display: inline-block;
      margin: 5px 0 0 8px;
    }
    span {
      margin-left: auto;
    }
  }
  .color-primary {
    color: var(--primary);
  }
  &.mt0 {
    margin-top: 0;
  }
`;

const ErrorMessage = styled.label`
  color: var(--txtRed);
  font-weight: 400;
  margin: 14px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    margin-right: 4px;
    margin-top: 4px;
  }
`;
