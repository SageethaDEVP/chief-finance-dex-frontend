import styled from 'styled-components';
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
import Swapimage from '../../assets/images/swap.png';
import Loader from '../../components/Loader';
import ProgressSteps from '../../components/ProgressSteps';
import QuestionHelper from '../../components/QuestionHelper';
import { AutoRow, RowBetween } from '../../components/Row';
import SettingsTab from '../../components/Settings';
import TokenWarningModal from '../../components/TokenWarningModal';
import ConfirmSwapModal from '../../components/Limit/ConfirmSwapModal';
import Gs from './../../theme/globalStyles';
import { SuccessTransactionModal } from '../../components/Limit/SuccessTransactionModal';
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
import { ApprovalState, useApproveCallbackFromBlid } from '../../hooks/useApproveCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { useSuccessModalOpen, useSuccessModalToggle, useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks';
import { LinkStyledButton, TEXT, TYPE } from '../../theme';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import LimitHeader from '../../components/Limit/LimitHeader';
import ArrowsCellIcon from '../../assets/svg-bid/button-cell.svg';
import RefreshIcon from '../../assets/svg-bid/refresh.svg';
import AmountTabs from '../../components/AmountTabs';
import { FIVE_PERCENTS, ONE_HUNDRED, nativeSymbol, wrappedSymbol } from '../../constants';
import { useSwapPercents } from '../../hooks/useSwapPercents';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { isNaN } from 'lodash';
import { mobile_width } from '../../constants';
import { escapeRegExp, getBidlityContract } from '../../utils';
import { feeLimit, executorFee, expire } from '../../constants';
import { useTransactionAdder } from '../../state/transactions/hooks';
import Media from 'theme/media-breackpoint';
const ControlWrapper = styled.div`
  position: relative;
  padding: 24px;
  margin: 10px;
  border-radius: 20px;
  background: ${({ theme }) => theme.newTheme.white};

  @media (max-width: ${mobile_width}px) {
    width: 98%;
  }
  @media (min-width: ${mobile_width + 1}px) {
    height: 778px;
    width: 100%;
  }
`;

const InputRow = styled.div`
  align-items: center;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #eaeaef;
`;

const InputLimitPrice = styled.input`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 10px 0;
  &.mt0 {
    margin-top: 0;
  }
  &.mb20 {
    margin-bottom: 20px;
  }
  border: none;
  width: auto;
  outline: none;
  font-weight: 500;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme }) => theme.text1};
  text-align: left;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`;

const ButtonMarket = styled(ButtonPrimary)`
  width: 92px;
  height: 28px;
  padding: 10px;
  margin-left: 10px;
  color: ${({ theme }) => theme.newTheme.white};
  border: 1px solid ${({ theme }) => theme.newTheme.primary1};
  border-radius: 8px;

  font-size: 14px;
  font-weight: 500;
`;

const PaddingTopRow = styled(RowBetween)<{ paddingTop: number }>`
  margin-top: ${({ paddingTop }) => paddingTop + 'px'};
`;
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export default function ControlPanel() {
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

  const { account, chainId, library } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  const [showInvertedPrice, setShowInvertedPrice] = useState<boolean>(false);

  const [isFivePercent, setIsFivePercent] = useState(false);

  const [limitPrice, setLimitPrice] = useState('');
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

  const showWrap: boolean = false; //wrapType !== WrapType.NOT_APPLICABLE;

  const trade = v2Trade && !isFivePercent ? v2Trade : v2UniTrade;

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

  const [actualInputAmount, setActualInputAmount] = useState('');
  const [actualOutAmount, setActualOutAmount] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [diffMarket, setDiffMarket] = useState(0);
  const myOnSwitchTokens = () => {
    onSwitchTokens();
    setLimitPrice('');
    setActualInputAmount('');
    setActualOutAmount('');
  };

  const isValidLimit = actualOutAmount != '' && actualInputAmount != '';
  const isValid = !swapInputError && isValidLimit;

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

  const myOnUserInput = (io: Field, value: string) => {
    onUserInput(io, value);

    if (io == Field.INPUT) {
      setActualInputAmount(value);
      updateLimitAmounts(value, '', limitPrice);
    } else {
      setActualOutAmount(value);
      updateLimitAmounts('', value, limitPrice);
    }
  };

  const handleTypeInput = useCallback(
    (value: string) => {
      myOnUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      myOnUserInput(Field.OUTPUT, value);
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
  const [approval, approveCallback] = useApproveCallbackFromBlid(trade, allowedSlippage + feeLimit * 100);

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
      myOnUserInput(Field.INPUT, inputAmount);
    } else if (outputAmount) {
      myOnUserInput(Field.OUTPUT, outputAmount);
    }

    localStorage.removeItem('inputAmount');
    localStorage.removeItem('outputAmount');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const maxAmountOutput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.OUTPUT]);

  //execute limit order
  const addTransaction = useTransactionAdder();

  const getBigNumber = (value: number) => {
    return BigNumber.from(toFixed(value));
  };

  const toFixed = (_x: number) => {
    let rt;
    let x = Math.floor(_x);
    rt = x.toString();
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        rt = '0.' + new Array(e).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        rt = x.toString() + new Array(e + 1).join('0');
      }
    }
    return rt;
  };
  const handleSwap = async () => {
    if (!chainId || !library || !account || !trade) return;
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });

    try {
      //call execute limit;

      const bidelity = getBidlityContract(chainId, library, account);

      let assetIn: string,
        assetOut: string,
        assetInOffered: BigNumber,
        assetOutExpected: BigNumber,
        path: string[] = [],
        value;

      let orderType = 2;
      if (trade['inputAmount'].currency.symbol == nativeSymbol[chainId ? chainId : 1]) {
        orderType = 0;
      } else if (trade['outputAmount'].currency.symbol == nativeSymbol[chainId ? chainId : 1]) {
        orderType = 1;
      }

      trade?.route?.path?.map((token) => path.push(token.address));
      assetIn = path[0];
      assetOut = path[path.length - 1];
      assetInOffered = getBigNumber(Number(actualInputAmount) * Math.pow(10, trade.route.input.decimals));
      assetOutExpected = getBigNumber(Number(actualOutAmount) * Math.pow(10, trade.route.output.decimals));

      const _exeFee = getBigNumber(Number(executorFee));
      const _exeFeeEth = _exeFee.add(assetInOffered.mul(getBigNumber(1e18 + 1e16 * feeLimit)).div(getBigNumber(1e18)));

      value = orderType == 0 ? _exeFeeEth : getBigNumber(0);

      const params = [
        orderType,
        assetIn,
        assetOut,
        assetInOffered,
        assetOutExpected,
        getBigNumber(Number(limitPrice) * Math.pow(10, 18)),
        getBigNumber((Number(allowedSlippage) / 100) * Math.pow(10, 18)),
        path,
        executorFee,
        getBigNumber(Date.now() / 1000 + expire),
      ];

      const gasLimit = await bidelity.estimateGas.createOrder(params, {
        from: account,
        value: value.toString(),
      });

      const response = await bidelity.createOrder(params, {
        from: account,
        gasLimit,
        value: value.toString(),
      });

      addTransaction(response, {});
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: undefined,
        txHash: response.hash,
      });
      setLimitPrice('');
      setActualOutAmount('');
      setActualInputAmount('');
    } catch (error) {
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: 'Transaction Filed.',
        txHash: undefined,
      });
    }
  };

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non-expert mode
  const showApproveFlow =
    isValidLimit &&
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED));

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      myOnUserInput(Field.INPUT, '');
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
    maxAmountInput && myOnUserInput(Field.INPUT, (+maxAmountInput.toExact() / (1 + feeLimit / 100)).toFixed(6));
  }, [maxAmountInput]);

  const handleMaxOutput = useCallback(() => {
    maxAmountOutput && myOnUserInput(Field.OUTPUT, maxAmountOutput.toExact());
  }, [maxAmountOutput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const { t } = useTranslation();

  const handleInputAmount = useCallback(
    (percents: number) => {
      if (maxAmountInput) {
        myOnUserInput(Field.INPUT, (((+maxAmountInput.toExact() / (1 + feeLimit / 100)) * percents) / 100).toFixed(6));
      }
    },
    [maxAmountInput, onUserInput]
  );
  const handleOutputAmount = useCallback(
    (percents: number) => {
      maxAmountOutput && myOnUserInput(Field.OUTPUT, ((+maxAmountOutput.toExact() * percents) / 100).toFixed(6));
    },
    [maxAmountOutput, onUserInput]
  );

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

  const inputAmount = parseFloat(formattedAmounts[Field.INPUT]);
  const outputAmount = parseFloat(formattedAmounts[Field.OUTPUT]);
  const inputToOutputPrice = inputAmount / outputAmount;
  const outputToInputPricePrice = outputAmount / inputAmount;
  const showPrice = !isNaN(inputToOutputPrice) && !isNaN(outputToInputPricePrice);

  const onUserInputLimitPrice = (price: string) => {
    if (price === '' || inputRegex.test(escapeRegExp(price))) {
      setLimitPrice(price);
      if (independentField === Field.INPUT) {
        updateLimitAmounts(actualInputAmount, '', price);
      } else {
        updateLimitAmounts('', actualOutAmount, price);
      }
    }
  };

  useEffect(() => {
    if (!isNaN(inputToOutputPrice) && !isNaN(outputToInputPricePrice)) {
      setMarketPrice((outputAmount / inputAmount).toFixed(8));
    }
  }, [outputAmount, inputAmount]);

  useEffect(() => {
    if (limitPrice != '' && marketPrice != '') {
      setDiffMarket(((Number(limitPrice) - Number(marketPrice)) / Number(marketPrice)) * 100);
    } else {
      setDiffMarket(0);
    }
  }, [marketPrice, limitPrice]);

  const onMarketPrice = () => {
    if (!isNaN(inputToOutputPrice) && !isNaN(outputToInputPricePrice)) {
      setLimitPrice(marketPrice);
      if (independentField === Field.INPUT) {
        updateLimitAmounts(actualInputAmount, '', marketPrice);
      } else {
        updateLimitAmounts('', actualOutAmount, marketPrice);
      }
    } else {
      setLimitPrice('');
    }
  };

  const updateLimitAmounts = (inAmount: string, outAmount: string, limit: string) => {
    if (limit != '') {
      if (inAmount == '') {
        if (outAmount !== '') {
          inAmount = (Number(outAmount) / Number(limit)).toFixed(8);
          setActualInputAmount(inAmount);
        }
      } else {
        if (inAmount !== '') {
          outAmount = (Number(inAmount) * Number(limit)).toFixed(8);
          setActualOutAmount(outAmount);
        }
      }
    } else {
      if (inAmount == '') {
        setActualInputAmount('');
      } else {
        setActualOutAmount('');
      }
    }
  };

  const handleLimit = () => {
    setSwapState({
      tradeToConfirm: trade,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      showConfirm: true,
      txHash: undefined,
    });
  };
  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleConfirmTokenWarning}
      />
      <ExchangeBg className="limit-order">
        <Gs.Container>
          <ExchangeBx>
            <LimitHeader />
            <TabContainer>
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
                actualInput={actualInputAmount}
                actualOutput={actualOutAmount}
                limitPrice={limitPrice}
                marketPrice={marketPrice}
              />

              <SuccessTransactionModal hash={txHash} isOpen={isOpenSuccessModal} onDismiss={toggleSuccessModal} />

              <>
                <AmountBox>
                  <CurrencyInputPanel
                    label2={`Availability: ${maxAmountInput?.toExact() ?? ''} ${
                      inputCurrencyName ? inputCurrencyName : ''
                    }`}
                    label={'From'}
                    value={actualInputAmount}
                    showMaxButton={false}
                    currency={currencies[Field.INPUT]}
                    onUserInput={handleTypeInput}
                    onMax={handleMaxInput}
                    onCurrencySelect={handleInputSelect}
                    availabilityInPool={currencyAPoolAmount}
                    otherCurrency={currencies[Field.OUTPUT]}
                    id="swap-currency-input"
                  />
                  <AmountTabs onChange={handleInputAmount} />
                </AmountBox>
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
                    value={actualOutAmount}
                    onUserInput={handleTypeOutput}
                    label={'To'}
                    showMaxButton={false}
                    onMax={handleMaxOutput}
                    currency={currencies[Field.OUTPUT]}
                    onCurrencySelect={handleOutputSelect}
                    availabilityInPool={currencyBPoolAmount}
                    otherCurrency={currencies[Field.INPUT]}
                    id="swap-currency-output"
                  />
                  {false && <AmountTabs onChange={handleOutputAmount} />}
                  {/* <div>
                    {!!maxAmountOutput && !!outputCurrencyName && (
                      <TEXT.default fontSize={12} fontWeight={500} color="text1">
                        Availability: {maxAmountOutput.toExact()} {!!outputCurrencyName && outputCurrencyName}
                      </TEXT.default>
                    )}
                  </div> */}
                </AmountBox>

                {/* <PriceRow>
                  <div className="">
                    <span>Price:</span>
                    <a className="active">Market Price</a>
                  </div>
                  <a className="">At Market Price</a>
                </PriceRow> */}

                <>
                  <PriceRow>
                    <div className="">
                      <span>Price:</span>
                      <button className="active" onClick={onMarketPrice}>
                        Market Price
                      </button>
                    </div>

                    <a color={diffMarket >= 0 ? theme.newTheme.primary1 : theme.newTheme.warning}>
                      {diffMarket == 0
                        ? 'At Market Price'
                        : diffMarket > 0
                        ? diffMarket.toFixed(2) + '% above market'
                        : diffMarket.toFixed(2) + '% below market'}
                    </a>
                  </PriceRow>
                </>
                <InfoSec className="mt0 mb20">
                  <InputLimitPrice
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    minLength={1}
                    maxLength={10}
                    value={limitPrice}
                    placeholder="0.0"
                    onChange={(e: any) => {
                      onUserInputLimitPrice(e.target.value);
                    }}
                  />
                </InfoSec>
                {/* <InfoSec className="mt0">
                <p>
                  <b>ETH - UNI</b>{" "}
                  <span>
                    Expiration Date: 2.01.2024{" "}
                    <i>
                      <img width={20} src={InfoIco} />
                    </i>
                  </span>
                </p>
                <p>
                  Slippage Tolerance{" "}
                  <i>
                    <img width={20} src={InfoIco} />
                  </i>{" "}
                  <a>
                    <img width={16} src={SettingIco} />
                  </a>
                  <span>0.5%</span>
                </p>
              </InfoSec> */}
                <InfoSec className="mt0">
                  <p>
                    <b color={theme.newTheme.primary2}>
                      {inputCurrencyName} - {outputCurrencyName}
                    </b>
                    <span color={'#72747A'}>
                      Expiration Date: 2.09.2024
                      <i>
                        <QuestionHelper iconSize={20} text="Order will be expired after this time." />
                      </i>
                    </span>
                  </p>

                  <p>
                    Slippage Tolerance
                    <i>
                      <QuestionHelper
                        iconSize={20}
                        text="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                      />
                    </i>
                    <SettingsTab />
                    <span color={theme.newTheme.primary1}>{allowedSlippage / 100}%</span>
                  </p>
                </InfoSec>

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
                  <div>
                    <AutoColumn gap="8px">
                      {false && (
                        <RowBetween align="center">
                          <Text fontWeight={500} fontSize={14} color={theme.newTheme.primary2}>
                            Price
                          </Text>
                          <>
                            {showPrice ? (
                              <AlignCenter>
                                <TEXT.default fontWeight={600} fontSize={14}>
                                  {showInvertedPrice ? inputToOutputPrice : outputToInputPricePrice}
                                </TEXT.default>
                                <div style={{ marginLeft: 4 }}>
                                  {showInvertedPrice ? (
                                    <TEXT.default fontWeight={500} fontSize={14}>
                                      {inputCurrencyName} per {outputCurrencyName}
                                    </TEXT.default>
                                  ) : (
                                    <TEXT.default fontWeight={500} fontSize={14}>
                                      {outputCurrencyName} per {inputCurrencyName}
                                    </TEXT.default>
                                  )}
                                </div>
                                <RefreshWrapper onClick={invertPrice}>
                                  <img src={RefreshIcon} width="18px" height="18px" alt="refresh" />
                                </RefreshWrapper>
                              </AlignCenter>
                            ) : (
                              '-'
                            )}
                          </>
                        </RowBetween>
                      )}
                    </AutoColumn>
                  </div>
                )}
              </>

              <BottomGrouping>
                {!account ? (
                  <ButtonPrimary onClick={toggleWalletModal}>{t('connect wallet')}</ButtonPrimary>
                ) : showWrap ? (
                  <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </ButtonPrimary>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                  </GreyCard>
                ) : showApproveFlow && !bigInput ? (
                  <RowBetween>
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
                      disabled={!isValid || approval !== ApprovalState.APPROVED}
                      error={!isValid}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        Place an Order
                      </Text>
                    </ButtonError>
                  </RowBetween>
                ) : (
                  <ButtonError
                    onClick={() => {
                      handleLimit();
                    }}
                    id="swap-button"
                    disabled={!isValid || bigInput}
                    error={false}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {bigInput
                        ? `Insufficient ${!!inputCurrencyName ? inputCurrencyName : 'input'} balance`
                        : swapInputError
                        ? swapInputError
                        : diffMarket < 0
                        ? 'Only possible to place sell orders above market rate'
                        : `Place an Order`}
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
            </TabContainer>
          </ExchangeBx>
        </Gs.Container>
      </ExchangeBg>
    </>
  );
}

const ExchangeBx = styled.section`
  border: 1px solid #fff;
  border-radius: 30px;
  box-shadow: 4px 0px 6px 2px rgba(0, 0, 0, 0.04);
  width: 440px; /* min-height: 634px; */
  background: rgba(255, 255, 255, 0.4);
  margin: 0px auto;
  padding: 26px 30px;
  max-width: 100%;
  align-self: flex-start;
  ${Media.lg} {
    margin-right: 0;
  }
  ${Media.xs} {
    padding: 18px 18px;
    border-radius: 20px;
    height: auto;
  }
  ${Media.md} {
    margin: 0 auto;
  }
`;

const TabContainer = styled.div``;
const ExchangeBg = styled.section`
  min-height: 100vh;
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
  &.limit-order {
    padding: 70px 0;
  }
`;
const AmountBox = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 20px 19px 32px;
  margin: 0 0 28px 0;
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

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  margin-top: -10px;
  div {
    display: flex;
    align-items: center;
    a {
      border: 1px solid var(--txtLight);
      padding: 5px 13px;
      border-radius: 5px;
      margin-left: 10px;
      &.active,
      &:hover {
        background: var(--primary);
        color: #fff;
        border: 1px solid var(--primary);
      }
    }
    button {
      border: 1px solid var(--txtLight);
      padding: 5px 13px;
      border-radius: 5px;
      margin-left: 10px;
      &.active,
      &:hover {
        background: var(--primary);
        color: #fff;
        border: 1px solid var(--primary);
      }
    }
  }
  & > a {
    color: var(--primary);
    &.yellow {
      color: var(--txtYellow);
    }
  }
  & + & {
    margin-top: 0;
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
      display: flex;
      margin-left: auto;
    }
    &.bold {
      font-weight: 600;
    }
  }
  h5 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 10px 0;
  }
  &.mt0 {
    margin-top: 0;
  }
  &.mb20 {
    margin-bottom: 20px;
  }
`;
