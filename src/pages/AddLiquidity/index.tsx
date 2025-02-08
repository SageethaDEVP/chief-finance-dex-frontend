import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { Currency, currencyEquals, ETHER, TokenAmount } from '@bidelity/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import resetIco from '../../assets/images/reset.png';
import chartIco from '../../assets/images/chartIco.png';
import { Link, NavLink, RouteComponentProps, useLocation } from 'react-router-dom';
import { Text } from 'rebass';
import { ButtonError, ButtonPrimary, ButtonPrimarySmallerText } from '../../components/Button';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { RowBetween } from '../../components/Row';
import { PairState, usePair } from '../../data/Reserves';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';
import {
  useApproveTokensModalOpen,
  useApproveTokensModalToggle,
  useErrorModalOpen,
  useErrorModalToggle,
  useSuccessModalOpen,
  useSuccessModalToggle,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { Field } from '../../state/mint/actions';
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks';
import styled from 'styled-components';

import { useTransactionAdder } from '../../state/transactions/hooks';
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks';
import { TEXT, TYPE } from '../../theme';
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import AppBody, { PageWrap } from '../AppBody';
import { Dots, FlexAlign, LiquidityIconWrapper, LiquidityInfoCard, Wrapper } from '../Pool/styleds';
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom';
import { currencyId } from '../../utils/currencyId';
import { PoolPriceBar } from './PoolPriceBar';
import CircleArrowIcon from '../../assets/svg-bid/circle-arrrow.svg';
import ArrowsCellIcon from '../../assets/svg-bid/button-cell.svg';
import AmountTabs from '../../components/AmountTabs';
import CurrencyLogo from '../../components/CurrencyLogo';
import { truncateString } from '../../utils/truncateString';
import { ApproveTokensModal, TransactionErrorModal } from './modals';
import { MinimalPositionCard } from '../../components/PositionCard';
import { useDerivedBurnInfo } from '../../state/burn/hooks';
import { SuccessTransactionModal } from '../../components/swap/SuccessTransactionModal';
import { useFindTokenAddress } from '../../state/swap/hooks';
import { PAIRS_LOCK_QUERY } from './query';
import { useQuery } from '@apollo/client';
import { GreyCardSecondaryLight } from '../../components/Card';
import { isPairLocked } from '../../utils/isPairLocked';
import useSetLiquidityTokensInUrl from '../../hooks/useSetLiquidityTokensInUrl';
import Swapimage from '../../assets/images/swap.png';
import Gs from 'theme/globalStyles';
import SwapHeader from 'components/swap/SwapHeader';
import Media from 'theme/media-breackpoint';
import { AutoRow } from './../../components/Row/index';
import { chainId_ChainName, getContractData, nativeSymbol, WETH } from '../../constants/index';

const Addliquidity = styled.div``;
const ALTop = styled.div`
  margin-bottom: 20px;
  width: 100%;
  h3 {
    margin: 0 0 8px;
    font-weight: 600;
    font-size: 24px;
  }
  p {
    margin: 0;
    font-size: 15px;
  }
`;

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React();

  const { data: pairsList, refetch } = useQuery(PAIRS_LOCK_QUERY, { context: { clientName: chainId } });
  useEffect(() => {
    refetch();
  }, [chainId]);

  const usdtAddress = useFindTokenAddress('CFNC');
  // CHANGE THIS IF NEEDED TODO. #VISHAL
  // const usdtAddress = useFindTokenAddress('wUSDT');

  let currencyA = useCurrency(currencyIdA);
  let currencyB = useCurrency(currencyIdB);

  useSetLiquidityTokensInUrl(currencyIdA, currencyIdB, usdtAddress, history);

  const USDT = useCurrency(usdtAddress);
  const ETH = useCurrency(nativeSymbol[chainId ? chainId : 1]);

  currencyA = currencyA ?? USDT;
  currencyB = currencyB ?? ETH;

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  const expertMode = useIsExpertMode();

  const { pair } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined);

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  );

  const isErrorModalOpen = useErrorModalOpen();
  const toggleErrorModal = useErrorModalToggle();

  const toggleSuccessModal = useSuccessModalToggle();
  const isOpenSuccessModal = useSuccessModalOpen();

  const isApproveTokensModalOpen = useApproveTokensModalOpen();
  const toggleApproveTokensModal = useApproveTokensModalToggle();

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const { onFieldAInput, onFieldBInput, onSwitchMintCurrencies } = useMintActionHandlers(noLiquidity);

  useEffect(() => {
    return () => {
      onFieldAInput('');
      onFieldBInput('');
    };
  }, [onFieldBInput, onFieldAInput]);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      };
    },
    {}
  );

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      };
    },
    {}
  );

  let contractData = getContractData(chainId as any);
  const ROUTER_CONTRACT_ADDRESS = contractData.ROUTER_ADDRESS;

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_CONTRACT_ADDRESS);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_CONTRACT_ADDRESS);

  const addTransaction = useTransactionAdder();

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    // setTxHash('');
  }, [onFieldAInput, txHash]);

  async function onAdd() {
    if (!chainId || !library || !account) return;
    const router = getRouterContract(chainId, library, account);

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    };

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER;
      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString());
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol,
          });
          setTxHash(response.hash);
        })
      )
      .catch((error) => {
        setAttemptingTxn(false);
        handleDismissConfirmation();
        toggleErrorModal();
      });
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="6px">
        <FlexAlign>
          <TEXT.primary fontSize={12} fontWeight={500}>
            {currencies[Field.CURRENCY_A]?.symbol + ' / ' + currencies[Field.CURRENCY_B]?.symbol}
          </TEXT.primary>
          <FlexAlign style={{ marginLeft: '8px' }}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} />
          </FlexAlign>
          <FlexAlign style={{ marginLeft: '8px' }}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} />
          </FlexAlign>
        </FlexAlign>
      </AutoColumn>
    ) : (
      <AutoColumn gap="6px">
        <FlexAlign>
          <TEXT.primary fontWeight={700} fontSize={22}>
            {truncateString(liquidityMinted?.toSignificant(6), 16)}
          </TEXT.primary>
          <FlexAlign style={{ marginLeft: '8px' }}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} />
          </FlexAlign>
          <FlexAlign style={{ marginLeft: '8px' }}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} />
          </FlexAlign>
        </FlexAlign>
        <TEXT.primary fontSize={12} fontWeight={500}>
          {currencies[Field.CURRENCY_A]?.symbol + ' / ' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}
        </TEXT.primary>
      </AutoColumn>
    );
  };

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    );
  };

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`;

  const pendingContent = () => {
    return (
      <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" textAlign="center">
        Supplying{' '}
        <TEXT.default color="primary1" display="inline">
          {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} {currencies[Field.CURRENCY_A]?.symbol}
        </TEXT.default>{' '}
        and{' '}
        <TEXT.default color="primary1" display="inline">
          {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} {currencies[Field.CURRENCY_B]?.symbol}
        </TEXT.default>
      </TEXT.default>
    );
  };

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA, chainId || 1);
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`);
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`);
      }
    },
    [currencyIdB, history, currencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB, chainId || 1);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          history.push(`/add/${newCurrencyIdB}`);
        }
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : nativeSymbol[chainId || 1]}/${newCurrencyIdB}`);
      }
    },
    [currencyIdA, history, currencyIdB]
  );

  const handleASwitchCurrencies = () => {
    if (!currencyIdA && !currencyIdB) {
      return;
    }
    history.push(`/add/${currencyIdB}/${currencyIdA}`);
    onSwitchMintCurrencies();
  };

  const handleMaxFieldAAmount = useCallback(
    (percents: number) => {
      maxAmounts[Field.CURRENCY_A] &&
        onFieldAInput(((+maxAmounts[Field.CURRENCY_A]?.toExact()! * percents) / 100).toString());
    },
    [maxAmounts[Field.CURRENCY_A], onFieldAInput]
  );

  const handleMaxFieldBAmount = useCallback(
    (percents: number) => {
      maxAmounts[Field.CURRENCY_B] &&
        onFieldBInput(((+maxAmounts[Field.CURRENCY_B]?.toExact()! * percents) / 100).toString());
    },
    [maxAmounts[Field.CURRENCY_B], onFieldBInput]
  );

  const v2Pair = usePair(currencyA ? currencyA : undefined, currencyB ? currencyB : undefined);

  const toggleSuccess = () => {
    setTxHash('');
    setShowConfirm(false);
    toggleSuccessModal();
  };

  const isLocked = pairsList && pairsList?.pairs && pair ? isPairLocked(pairsList.pairs, pair) : false;

  const location = useLocation();

  const isPoolsExchangePage = location.pathname.match(/pools$/);

  const isExchangeTabActive = location.pathname.match(/swap$/) || isPoolsExchangePage;
  const isLimitTabActive = location.pathname.match(/limit$/);
  const isPoolTabActive =
    location.pathname.match(/\/pool$/) ||
    location.pathname.includes('/add') ||
    location.pathname.includes('/remove') ||
    location.pathname.includes('pools:list');

  return (
    <>
      <>
        <Gs.Container>
          {/* <SwapHeader /> */}
          <ExchangeBx>
            <ExchangeTop>
              <TabMain>
                <NavLink to={'/swap'}>Exchange</NavLink>
                <NavLink to={'/pool'} className="active">
                  {' '}
                  Pool
                </NavLink>
              </TabMain>
            </ExchangeTop>

            <>
              <Addliquidity>
                <ALTop>
                  <h3>Add Liquidity</h3>
                  <p>Add Liquidity to receive LP Tokens</p>
                </ALTop>
                {/* <LiquidityIconWrapper>
                  <img src={CircleArrowIcon} alt="refresh" />
                </LiquidityIconWrapper> */}
                <SuccessTransactionModal
                  hash={txHash !== '' ? txHash : undefined}
                  isOpen={isOpenSuccessModal}
                  onDismiss={toggleSuccess}
                />
                <TransactionConfirmationModal
                  isOpen={showConfirm}
                  onDismiss={handleDismissConfirmation}
                  attemptingTxn={attemptingTxn}
                  hash={txHash}
                  isAddLiquidityPage={true}
                  pair={pair}
                  v2pair={v2Pair}
                  content={() => (
                    <ConfirmationModalContent
                      title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                      onDismiss={handleDismissConfirmation}
                      topContent={modalHeader}
                      bottomContent={modalBottom}
                    />
                  )}
                  pendingText={pendingText}
                  pendingContent={pendingContent}
                />
                <TransactionErrorModal isOpen={isErrorModalOpen} onDismiss={toggleErrorModal} />
                <ApproveTokensModal
                  isOpen={isApproveTokensModalOpen}
                  onDismiss={toggleApproveTokensModal}
                  pendingText={pendingText}
                />

                <>
                  <AmountBox>
                    <CurrencyInputPanel
                      label={'From'}
                      label2={
                        maxAmounts[Field.CURRENCY_A]?.toExact()
                          ? `Availability: ${parseFloat(maxAmounts[Field.CURRENCY_A]?.toExact() || '0').toFixed(4)}`
                          : ''
                      }
                      value={formattedAmounts[Field.CURRENCY_A]}
                      onUserInput={onFieldAInput}
                      onMax={() => {
                        onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '');
                      }}
                      onCurrencySelect={handleCurrencyASelect}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                      currency={currencies[Field.CURRENCY_A]}
                      showAvailableInPool={false}
                      id="add-liquidity-input-tokena"
                      showCommonBases
                    />
                    <AmountTabs onChange={handleMaxFieldAAmount} />
                  </AmountBox>

                  {/* {!!maxAmounts[Field.CURRENCY_A]?.toExact() && (
                    <TEXT.secondary fontWeight={600} fontSize={12}>
                      Availability: {maxAmounts[Field.CURRENCY_A]?.toExact() ?? '0'}
                    </TEXT.secondary>
                  )} */}
                  <SwapSwitch onClick={handleASwitchCurrencies}>
                    <a style={{ cursor: 'pointer' }} className="switch">
                      <img src={Swapimage} alt="arrow" />
                    </a>
                  </SwapSwitch>
                  <AmountBox>
                    <CurrencyInputPanel
                      label={'To'}
                      label2={
                        maxAmounts[Field.CURRENCY_B]?.toExact()
                          ? `Availability: ${parseFloat(maxAmounts[Field.CURRENCY_B]?.toExact() || '0').toFixed(4)}`
                          : ''
                      }
                      value={formattedAmounts[Field.CURRENCY_B]}
                      onUserInput={onFieldBInput}
                      onCurrencySelect={handleCurrencyBSelect}
                      onMax={() => {
                        onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '');
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                      currency={currencies[Field.CURRENCY_B]}
                      showAvailableInPool={false}
                      id="add-liquidity-input-tokenb"
                      showCommonBases
                    />
                    <AmountTabs onChange={handleMaxFieldBAmount} />
                  </AmountBox>
                  {/* {!!maxAmounts[Field.CURRENCY_B]?.toExact() && (
                    <TEXT.secondary fontWeight={600} fontSize={12}>
                      Availability: {maxAmounts[Field.CURRENCY_B]?.toExact() ?? '0'}
                    </TEXT.secondary>
                  )} */}
                  {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                    <>
                      <InfoSec>
                        <h4>Prices and pool share:</h4>

                        <PoolPriceBar
                          currencies={currencies}
                          poolTokenPercentage={poolTokenPercentage}
                          noLiquidity={noLiquidity}
                          price={price}
                        />
                      </InfoSec>
                    </>
                  )}

                  {!account ? (
                    <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
                  ) : isLocked ? (
                    <GreyCardSecondaryLight style={{ textAlign: 'center' }}>
                      <TYPE.main>Pair locked</TYPE.main>
                    </GreyCardSecondaryLight>
                  ) : (
                    <AutoColumn gap={'md'}>
                      {(approvalA === ApprovalState.NOT_APPROVED ||
                        approvalA === ApprovalState.PENDING ||
                        approvalB === ApprovalState.NOT_APPROVED ||
                        approvalB === ApprovalState.PENDING) &&
                        isValid && (
                          <RowBetween>
                            {approvalA !== ApprovalState.APPROVED && (
                              <ButtonPrimarySmallerText
                                onClick={approveACallback}
                                disabled={approvalA === ApprovalState.PENDING}
                                width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                              >
                                {approvalA === ApprovalState.PENDING ? (
                                  <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                                ) : (
                                  'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                                )}
                              </ButtonPrimarySmallerText>
                            )}
                            {approvalB !== ApprovalState.APPROVED && (
                              <ButtonPrimarySmallerText
                                onClick={approveBCallback}
                                disabled={approvalB === ApprovalState.PENDING}
                                width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                              >
                                {approvalB === ApprovalState.PENDING ? (
                                  <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                                ) : (
                                  'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                                )}
                              </ButtonPrimarySmallerText>
                            )}
                          </RowBetween>
                        )}
                      <ButtonError
                        onClick={() => {
                          expertMode ? onAdd() : setShowConfirm(true);
                        }}
                        disabled={
                          !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                        }
                        error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                      >
                        <Text fontSize={20} fontWeight={500}>
                          {error ?? 'Supply'}
                        </Text>
                      </ButtonError>
                    </AutoColumn>
                  )}
                </>
              </Addliquidity>
            </>

            {pair ? (
              <AutoColumn style={{ width: '100%', maxWidth: '388px', marginTop: '24px' }}>
                <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
              </AutoColumn>
            ) : null}
          </ExchangeBx>
        </Gs.Container>
      </>
    </>
  );
}

const ExchangeBg = styled.section`
  min-height: 100vh;
  background: #d0e6ea;
  h2 {
    color: var(--txtBlue);
    width: 100%;
    text-align: center;
    font-size: 24px;
    margin: 25px 0;
  }
`;
const ExchangeBx = styled.section`
  border: 1px solid #fff;
  border-radius: 30px;
  box-shadow: 4px 0px 6px 2px rgba(0, 0, 0, 0.04);
  width: 440px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0px auto;
  margin-bottom: 50px;
  padding: 26px 30px;
  margin-top: 50px;
  max-width: 100%;
  ${Media.xs} {
    padding: 18px 18px;
    border-radius: 20px;
    height: auto;
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

const AmountBox = styled.div<{ hideInput?: boolean; isHomePage?: boolean }>`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 20px 19px 32px;
  margin: 0 0 28px 0;
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
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--txtLight);
    margin: 0 0 16px;
  }
`;
