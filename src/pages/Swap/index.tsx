import { CurrencyAmount, JSBI, Token, TokenAmount, Trade } from '@bidelity/sdk';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowDown } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import AddressInputPanel from '../../components/AddressInputPanel';
import { ButtonConfirmed, ButtonError, ButtonPrimary } from '../../components/Button';
import { GreyCard } from '../../components/Card';
import Column, { AutoColumn } from '../../components/Column';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import Loader from '../../components/Loader';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import PoolsLink from '../../components/Poolslink';
import ProgressSteps from '../../components/ProgressSteps';
import QuestionHelper from '../../components/QuestionHelper';
import { AutoRow, RowBetween } from '../../components/Row';
import SettingsTab from '../../components/Settings';
import TokenWarningModal from '../../components/TokenWarningModal';
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal';
import { SuccessTransactionModal } from '../../components/swap/SuccessTransactionModal';
import SwapHeader from '../../components/swap/SwapHeader';
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee';
import {
  AlignCenter,
  ArrowWrapper,
  ArrowWrapperSwap,
  BottomGrouping,
  RefreshWrapper,
  SwapCallbackError,
  Wrapper,
} from '../../components/swap/styleds';
import { usePair } from '../../data/Reserves';
import { useActiveWeb3React } from '../../hooks';
import { useAllTokens, useCurrency } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { useSuccessModalOpen, useSuccessModalToggle, useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from '../../state/user/hooks';
import { LinkStyledButton, TEXT, TYPE } from '../../theme';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices';
import AppBody, { PageWrap } from '../AppBody';
import ArrowsCellIcon from '../../assets/svg-bid/button-cell.svg';
import RefreshIcon from '../../assets/svg-bid/refresh.svg';
import AmountTabs from '../../components/AmountTabs';
import { useDerivedMintInfo } from '../../state/mint/hooks';
import { FIVE_PERCENTS, ONE_HUNDRED, nativeSymbol, wrappedSymbol } from '../../constants';
import { useSwapPercents } from '../../hooks/useSwapPercents';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';
import styled from 'styled-components';

import WalletIco from '../../assets/images/wallet.png';
import resetIco from '../../assets/images/reset.png';
import chartIco from '../../assets/images/chartIco.png';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/arrow2.png';
import Swapimage from '../../assets/images/swap.png';
import InfoIco from '../../assets/images/info.png';
import SettingIco from '../../assets/images/setting.png';
import ChartImg from '../assets/images/chart.png';
import Pool from '../../pages/Pool';
import { Link, NavLink } from 'react-router-dom';
import Chart from 'pages/Limit/chart';
import { mobile_width } from '../../constants';

const MainWrap = styled.div`
  @media (max-width: ${mobile_width}px) {
    flex: 1 0;
    flex-direction: column;
  }
  @media (min-width: ${mobile_width + 1}px) {
    flex: 2 0 auto;
  }
`;
export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();

  const swapFee = useSwapPercents();

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  const [showInvertedPrice, setShowInvertedPrice] = useState<boolean>(false);

  const [isFivePercent, setIsFivePercent] = useState(false);

  const invertPrice = () => setShowInvertedPrice((prev) => !prev);

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    v2UniTrade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();
  const { chainId } = useActiveWeb3React();

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);

  const inputCurrencyName = currencies[Field.INPUT] && currencies[Field.INPUT]?.symbol;
  const outputCurrencyName = currencies[Field.OUTPUT] && currencies[Field.OUTPUT]?.symbol;

  const inputValueA =
    inputCurrencyName === nativeSymbol[chainId ? chainId : 1]
      ? currencies[Field.INPUT]?.symbol
      : (currencies[Field.INPUT] as Token)?.address;

  const inputValueB =
    outputCurrencyName === nativeSymbol[chainId ? chainId : 1]
      ? currencies[Field.OUTPUT]?.symbol
      : (currencies[Field.OUTPUT] as Token)?.address;

  const currencyA = useCurrency(inputValueA);
  const currencyB = useCurrency(inputValueB);

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

  // const trade = v2Trade && !isFivePercent ? v2Trade : v2UniTrade;

  const trade = v2Trade;

  const parsedAmounts = useMemo(() => {
    return showWrap
      ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
      : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        };
  }, [independentField, parsedAmount, showWrap, trade?.inputAmount, trade?.outputAmount]);

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = useMemo(() => {
    let dependentTokenAmount = showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '';

    if (
      independentField === Field.OUTPUT &&
      inputCurrencyName === nativeSymbol[chainId ? chainId : 1] &&
      !showWrap &&
      parsedAmounts[dependentField]?.toSignificant(6)
    ) {
      const formattedInputAmount = parsedAmounts[dependentField]?.toSignificant(6);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const originalAmount = ethers.utils.parseEther(formattedInputAmount);
      const formattedSwapFee = BigNumber.from(Math.ceil(swapFee * ONE_HUNDRED));
      const oneHundred = BigNumber.from(ONE_HUNDRED);
      const extraPercentAmount = originalAmount.mul(formattedSwapFee).div(oneHundred).div(oneHundred);
      const sum = originalAmount.add(extraPercentAmount);
      const sumAmountToString = BigNumber.from(sum).toString();
      dependentTokenAmount = ethers.utils.formatEther(sumAmountToString);
    }

    return {
      [independentField]: typedValue,
      [dependentField]: dependentTokenAmount,
    };
  }, [dependentField, independentField, parsedAmounts, showWrap, typedValue, inputCurrencyName, swapFee]);

  const v2Pair = usePair(currencyA ? currencyA : undefined, currencyB ? currencyB : undefined);
  const getCurrencyPoolAmount = useCallback(
    (currencySymbol: string | undefined) => {
      if (v2Pair && v2Pair[1] && v2Pair[1]?.token0 && v2Pair[1]?.token1) {
        const token0 = v2Pair[1]?.token0;
        const token1 = v2Pair[1]?.token1;
        let amount;
        if (currencySymbol === token0.symbol) {
          amount = new TokenAmount(v2Pair[1]?.token0, v2Pair[1]?.reserve0.raw);
        } else if (currencySymbol === token1.symbol) {
          amount = new TokenAmount(v2Pair[1]?.token1, v2Pair[1]?.reserve1.raw);
        } else if (
          currencySymbol === nativeSymbol[chainId ? chainId : 1] &&
          token0.symbol === wrappedSymbol[chainId ? chainId : 1]
        ) {
          amount = new TokenAmount(v2Pair[1]?.token0, v2Pair[1]?.reserve0.raw);
        } else if (
          currencySymbol === nativeSymbol[chainId ? chainId : 1] &&
          token1.symbol === wrappedSymbol[chainId ? chainId : 1]
        ) {
          amount = new TokenAmount(v2Pair[1]?.token1, v2Pair[1]?.reserve1.raw);
        }
        return amount?.toSignificant(6);
      } else {
        return undefined;
      }
    },
    [v2Pair]
  );

  const currencyAPoolAmount = useMemo(() => {
    return getCurrencyPoolAmount(currencyA?.symbol);
  }, [getCurrencyPoolAmount, currencyA?.symbol]);

  const currencyBPoolAmount = useMemo(() => {
    return getCurrencyPoolAmount(currencyB?.symbol);
  }, [getCurrencyPoolAmount, currencyB?.symbol]);

  const percents = useMemo(() => {
    return formattedAmounts[Field.INPUT] && currencyAPoolAmount
      ? (+formattedAmounts[Field.INPUT] / +currencyAPoolAmount) * 100
      : undefined;
  }, [currencyAPoolAmount, formattedAmounts]);

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  useEffect(() => {
    if (percents === undefined && userHasSpecifiedInputOutput) {
      localStorage.setItem('isGreater', 'true');
      setIsFivePercent(true);
    } else if (percents && percents >= FIVE_PERCENTS) {
      localStorage.setItem('isGreater', 'true');
      setIsFivePercent(true);
    } else if (percents && percents < FIVE_PERCENTS) {
      localStorage.setItem('isGreater', 'false');
      setIsFivePercent(false);
    }

    return () => localStorage.removeItem('isGreater');
  }, [percents, userHasSpecifiedInputOutput]);

  const route = trade?.route;

  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two-step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  useEffect(() => {
    const inputAmount = localStorage.getItem('inputAmount');
    const outputAmount = localStorage.getItem('outputAmount');

    if (inputAmount) {
      onUserInput(Field.INPUT, inputAmount);
    } else if (outputAmount) {
      onUserInput(Field.OUTPUT, outputAmount);
    }

    localStorage.removeItem('inputAmount');
    localStorage.removeItem('outputAmount');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const maxAmountOutput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.OUTPUT]);
  // const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));
  // const atMaxAmountOutput = Boolean(maxAmountOutput && parsedAmounts[Field.OUTPUT]?.equalTo(maxAmountOutput));

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    swapFee
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, showConfirm]);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non-expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleMaxOutput = useCallback(() => {
    maxAmountOutput && onUserInput(Field.OUTPUT, maxAmountOutput.toExact());
  }, [maxAmountOutput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const { t } = useTranslation();

  const handleInputAmount = useCallback(
    (percents: number) => {
      maxAmountInput && onUserInput(Field.INPUT, ((+maxAmountInput.toExact() * percents) / 100).toString());
    },
    [maxAmountInput, onUserInput]
  );
  const handleOutputAmount = useCallback(
    (percents: number) => {
      maxAmountOutput && onUserInput(Field.OUTPUT, ((+maxAmountOutput.toExact() * percents) / 100).toString());
    },
    [maxAmountOutput, onUserInput]
  );

  const { price } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const priceValue = price && showInvertedPrice ? price?.invert()?.toSignificant(6) : price?.toSignificant(6);

  const toggleSuccessModal = useSuccessModalToggle();
  const isOpenSuccessModal = useSuccessModalOpen();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getDisabledButton = () => {
    let bigInput;

    if (!maxAmountInput || !maxAmountOutput) {
      bigInput = true;
      return { bigInput };
    }

    bigInput = parseFloat(formattedAmounts[Field.INPUT]) > parseFloat(maxAmountInput?.toExact());

    return { bigInput };
  };

  const { bigInput } = getDisabledButton();

  // new UI
  const [activeTab, setActiveTab] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);

  const handleTabClick = (index: any) => {
    setActiveTab(index);
  };
  const [isGraphVisible, setisGraphVisible] = useState(false);

  const toggleRefresh = () => {
    setIsRefresh(!isRefresh);
  };
  const toggleGraph = () => {
    setisGraphVisible(!isGraphVisible);
  };

  return (
    <ExchangeBg>
      <Gs.Container>
        {/* <SwapHeader /> */}
        {isGraphVisible && (
          <MainWrap>
            <Chart isRefresh={isRefresh} />
          </MainWrap>
        )}

        <TokenWarningModal
          isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
          tokens={importTokensNotInDefault}
          onConfirm={handleConfirmTokenWarning}
          onDismiss={handleConfirmTokenWarning}
        />
        {/* <SwapHeader /> */}
        {/* <SwapPoolTabs active={'swap'} /> */}
        {/* INTEGRATED */}
        <ExchangeBx>
          <ExchangeTop>
            <TabMain>
              <NavLink to={'/swap'} className="active">
                Exchange
              </NavLink>
              <NavLink to={'/pool'}>Pool</NavLink>
            </TabMain>

            <a className="rightBtns" onClick={toggleRefresh}>
              <img src={resetIco} alt="reset" />
            </a>
            <a className="rightBtns" onClick={toggleGraph}>
              <img src={chartIco} alt="chart" />
            </a>
          </ExchangeTop>
          {activeTab === 0 && (
            <Wrapper id="swap-page">
              <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
                v2pair={v2Pair}
              />
              <SuccessTransactionModal hash={txHash} isOpen={isOpenSuccessModal} onDismiss={toggleSuccessModal} />
              <AmountBox>
                <CurrencyInputPanel
                  label2={`Availability: ${maxAmountInput?.toExact() ?? ''} ${
                    inputCurrencyName ? inputCurrencyName : ''
                  }`}
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={true}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  availabilityInPool={currencyAPoolAmount}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="yousend"
                />
                <AmountTabs onChange={handleInputAmount} />
              </AmountBox>
              {/* <div>
                {!!maxAmountInput && !!inputCurrencyName && (
                  <TEXT.default fontSize={12} fontWeight={500} color="text1">
                    Availability: {maxAmountInput.toExact()} {!!inputCurrencyName && inputCurrencyName}
                  </TEXT.default>
                )}
              </div> */}
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <SwapSwitch
                    onClick={() => {
                      setApprovalSubmitted(false); // reset 2 step UI for approvals
                      onSwitchTokens();
                    }}
                  >
                    <a className="switch">
                      <img src={Swapimage} alt="Swap" />
                    </a>
                  </SwapSwitch>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <AmountBox>
                <CurrencyInputPanel
                  label2={`Availability: ${maxAmountOutput?.toExact() ?? ''} ${
                    outputCurrencyName ? outputCurrencyName : ''
                  }`}
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={'To'}
                  showMaxButton={true}
                  onMax={handleMaxOutput}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  availabilityInPool={currencyBPoolAmount}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />
                <AmountTabs onChange={handleOutputAmount} />
              </AmountBox>

              {/* <div>
              {!!maxAmountOutput && !!outputCurrencyName && (
                <TEXT.default fontSize={12} fontWeight={500} color="text1">
                  Availability: {maxAmountOutput.toExact()} {!!outputCurrencyName && outputCurrencyName}
                </TEXT.default>
              )}
            </div> */}
              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.text2} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}
              {showWrap ? null : (
                <InfoSec>
                  <RowBetween align="center">
                    <p>Price </p>
                    {price !== undefined ? (
                      <AlignCenter>
                        <span>{priceValue}</span>
                        <div style={{ marginLeft: 4 }}>
                          {showInvertedPrice ? (
                            <span>
                              {inputCurrencyName} per {outputCurrencyName}
                            </span>
                          ) : (
                            <span>
                              {outputCurrencyName} per {inputCurrencyName}
                            </span>
                          )}
                        </div>
                        <RefreshWrapper onClick={invertPrice}>
                          <img src={RefreshIcon} width="18px" height="18px" alt="refresh" />
                        </RefreshWrapper>
                      </AlignCenter>
                    ) : (
                      <GapBetween> - </GapBetween>
                    )}
                  </RowBetween>

                  <RowBetween align="center">
                    <AlignCenter>
                      <p>Slippage Tolerance</p>
                      <GapBetween style={{ marginTop: 5 }}>
                        <QuestionHelper
                          iconSize={16}
                          text="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                        />
                      </GapBetween>

                      <GapBetween style={{ marginLeft: 0 }}>
                        <SettingsTab />
                      </GapBetween>
                    </AlignCenter>
                    <GapBetween>
                      <span>{allowedSlippage / 100}%</span>
                    </GapBetween>
                  </RowBetween>
                </InfoSec>
              )}
              {/* </AutoColumn> */}
              <BottomGrouping>
                {!account ? (
                  <Gs.BtnSm className="lg" onClick={toggleWalletModal}>
                    <img src={WalletIco} alt="Wallet" />
                    {t('connect wallet')}
                  </Gs.BtnSm>
                ) : showWrap ? (
                  <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </ButtonPrimary>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                    {singleHopOnly && <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>}
                  </GreyCard>
                ) : showApproveFlow && !bigInput ? (
                  <RowBetween style={{ columnGap: '10px' }}>
                    <ButtonConfirmed
                      onClick={approveCallback}
                      disabled={
                        approval !== ApprovalState.NOT_APPROVED ||
                        (approvalSubmitted && approval !== ApprovalState.NOT_APPROVED)
                      }
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={approval === ApprovalState.APPROVED}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          Approving <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                        'Approved'
                      ) : (
                        'Approve ' + currencies[Field.INPUT]?.symbol
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap();
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          });
                        }
                      }}
                      width="48%"
                      id="swap-button"
                      disabled={
                        !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                      }
                      error={isValid && priceImpactSeverity > 2}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {priceImpactSeverity > 3 && !isExpertMode
                          ? `Price Impact High`
                          : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                      </Text>
                    </ButtonError>
                  </RowBetween>
                ) : (
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap();
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        });
                      }
                    }}
                    id="swap-button"
                    disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || bigInput}
                    error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {bigInput
                        ? `Insufficient ${!!inputCurrencyName ? inputCurrencyName : 'input'} balance`
                        : swapInputError
                        ? swapInputError
                        : priceImpactSeverity > 3 && !isExpertMode
                        ? `Price Impact Too High`
                        : `Exchange`}
                    </Text>
                  </ButtonError>
                )}
                {showApproveFlow && !bigInput && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </BottomGrouping>
            </Wrapper>
          )}
          {activeTab === 1 && (
            <TabContainer>
              <Pool />
            </TabContainer>
          )}
        </ExchangeBx>
      </Gs.Container>
      <PoolsLink to="/pools" />
    </ExchangeBg>
  );
}

// NEW SCOMPONENTS

const ExchangeBg = styled.section`
  min-height: 100vh;
  background: #d0e6ea;
  position: relative;
  z-index: 2;
  h2 {
    color: var(--txtBlue);
    width: 100%;
    text-align: center;
    font-size: 24px;
    margin: 25px 0;
  }
  &:after {
    content: '';
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translate(-50%, 0%);
    background: var(--primary);
    width: 440px;
    height: 600px;
    z-index: -1;
    opacity: 0.1;
    filter: blur(80px);
  }
`;
const ExchangeBx = styled.section`
  border: 1px solid #fff;
  border-radius: 30px;
  box-shadow: 4px 0px 6px 2px rgba(0, 0, 0, 0.04);
  width: 440px;
  min-height: 634px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0px auto;
  padding: 26px 30px;
  margin-top: 50px;
  max-width: 100%;
  ${Media.xs} {
    padding: 18px 18px;
    border-radius: 20px;
    height: auto;
  }
`;

// Top most part for the box
const ExchangeTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 19px;
  .rightBtns {
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 3px;
    margin-left: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 15px;
      height: 15px;
      object-fit: contain;
      transition: all 0.3s ease-in-out;
    }
    &:hover {
      background: var(--txtColor);
      img {
        filter: brightness(100);
      }
    }
  }
`;
const TabMain = styled.div`
  border-radius: 10px;
  background: var(--bgLight2);
  width: 221px;
  height: 50px;
  display: flex;
  padding: 5px;
  margin-right: auto;
  a {
    width: 50%;
    font-weight: 500;
    border-radius: 10px;
    text-align: center;
    padding: 9px 0;
    &.active {
      background: #fff;
      box-shadow: 0px 0px 6px rgba(27, 193, 154, 0.07);
    }
  }
`;
// Top most part for the box

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
  .input-container {
    position: relative;
    border-right: 1px solid #abd0d9;
    width: 214px;
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
      color: var(--txtLight2);
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
const DropSelect = styled.div`
  width: 83px;
  flex-shrink: 0;
  align-self: center;
  margin-right: 0;
  margin-left: auto;
  .selectBtn {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 2px;
    width: 100%;
    border-radius: 30px;
    padding: 0 12px 0 0;
    height: 19px;
    background: #fff;
    width: 84px;
    .token {
      margin-right: 9px;
      width: 28px;
      height: 28px;
      width: 12px;
      height: 12px;
      transform: scale(2);
    }
    span {
      margin: 0 5px 0 auto;
    }
    .arrow {
      margin-left: auto;
      width: 7px;
      flex-shrink: 0;
      position: relative;
    }
  }
`;
const SwapSwitch = styled.div`
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
`;
const InfoSec = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 15px 19px 5px;
  margin: -10px 0 21px 0;
  p {
    display: flex;
    align-items: center;
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
`;
const ChartSec = styled.div`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  padding: 10px 10px 0;
  width: 865px;
`;
const TabContainer = styled.div``;

const GapBetween = styled.div`
  margin-bottom: 11px;
`;

const AmountBox = styled.div<{ hideInput?: boolean; isHomePage?: boolean }>`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 20px 19px 32px;
  margin: 0 0 28px 0;
`;
