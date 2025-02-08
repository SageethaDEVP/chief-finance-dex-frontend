import { splitSignature } from '@ethersproject/bytes';
import { Contract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';
import { currencyEquals, ETHER, Percent } from '@bidelity/sdk';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';
import { RouteComponentProps } from 'react-router';
import { Text } from 'rebass';
import styled, { ThemeContext } from 'styled-components';
import { ButtonConfirmed, ButtonError, ButtonPrimary } from '../../components/Button';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import DoubleCurrencyLogo from '../../components/DoubleLogo';
import { MinimalPositionCard } from '../../components/PositionCard';
import { RowBetween, RowFixed } from '../../components/Row';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import Swap from '../../assets/images/swap.png';

import CurrencyLogo from '../../components/CurrencyLogo';
import Slider from '../../components/Slider';
import { getContractData, LP_TOKEN_NAME } from '../../constants';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { usePairContract } from '../../hooks/useContract';
import useIsArgentWallet from '../../hooks/useIsArgentWallet';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';

import { BigNumber } from '@ethersproject/bignumber';
import ArrowInCircleIcon from '../../assets/svg-bid/arrow-down-in-circle.svg';
import AmountTabs from '../../components/AmountTabs';
import { Dots } from '../../components/swap/styleds';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { useSuccessModalOpen, useSuccessModalToggle, useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/burn/actions';
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { TEXT, TYPE } from '../../theme';
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils';
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import AppBody, { PageWrap } from '../AppBody';
import { ButtonOutlinedRemove, FlexAlign, InfoCard, SliderWrapper, Wrapper } from '../Pool/styleds';
import { SuccessTransactionModal } from '../../components/swap/SuccessTransactionModal';
import { useQuery } from '@apollo/client';
import { PAIRS_LOCK_QUERY } from '../AddLiquidity/query';
import { GreyCardLight } from '../../components/Card';
import { isPairLocked } from '../../utils/isPairLocked';
import Gs from 'theme/globalStyles';
import SwapHeader from 'components/swap/SwapHeader';
import { NavLink } from 'react-router-dom';
import Media from 'theme/media-breackpoint';
import { WETH } from '../../constants';

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId, library } = useActiveWeb3React();
  const { data: pairsList, refetch } = useQuery(PAIRS_LOCK_QUERY, { context: { clientName: chainId } });
  useEffect(() => {
    refetch();
  }, [chainId]);
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined];

  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId]
  );

  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const deadline = useTransactionDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  const toggleSuccessModal = useSuccessModalToggle();
  const isOpenSuccessModal = useSuccessModalOpen();

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  };

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address);

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
    null
  );

  const ROUTER_CONTRACT_ADDRESS = getContractData(chainId as any).ROUTER_ADDRESS;

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_CONTRACT_ADDRESS);

  const isArgentWallet = useIsArgentWallet();

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    if (isArgentWallet) {
      return approveCallback();
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account);

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ];
    const domain = {
      name: LP_TOKEN_NAME,
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address,
    };
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ];
    const message = {
      owner: account,
      spender: ROUTER_CONTRACT_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    };
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    });

    library
      .send('', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        });
      })
      .catch((error) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback();
        }
      });
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null);
      return _onUserInput(field, typedValue);
    },
    [_onUserInput]
  );

  // tx sending
  const addTransaction = useTransactionAdder();
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies');
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts');
    }
    const router = getRouterContract(chainId, library, account);

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    };

    if (!currencyA || !currencyB) throw new Error('missing tokens');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    const currencyBIsETH = currencyB === ETHER;
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH;

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[], args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          // amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          // amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          '0',
          '0',
          account,
          deadline.toHexString(),
        ];
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          // amountsMin[Field.CURRENCY_A].toString(),
          // amountsMin[Field.CURRENCY_B].toString(),
          '0',
          '0',
          account,
          deadline.toHexString(),
        ];
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.');
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error);
            return undefined;
          })
      )
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.');
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setAttemptingTxn(true);
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              'Remove ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencyA?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencyB?.symbol,
          });

          setTxHash(response.hash);
        })
        .catch((error: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        });
    }
  }

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
    ${SliderBx} + & a {
      top: -69px;
    }
  `;
  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="16" color={theme.text2} />
        </RowFixed>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <TYPE.italic fontSize={12} color={theme.text2} textAlign="left" padding={'12px 0 10px 0'}>
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    );
  }

  function modalBottom() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <RowBetween>
          <Text color={theme.text2} fontWeight={500} fontSize={16} margin={'2px'}>
            {currencyA?.symbol + '/' + currencyB?.symbol} Burned
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} />
            <Text fontWeight={500} fontSize={16}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween margin={'2px'}>
              <Text color={theme.text2} fontWeight={500} fontSize={16}>
                Price
              </Text>
              <Text fontWeight={500} fontSize={16} color={theme.text1}>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween margin={'1px'}>
              <div />
              <Text fontWeight={500} fontSize={16} color={theme.text1} margin={'4px'}>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)} onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </div>
    );
  }

  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencyA?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`;

  const pendingContent = () => {
    return (
      <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" textAlign="center">
        Removing{' '}
        <TEXT.default color="primary1" display="inline">
          {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} {currencyA?.symbol}
        </TEXT.default>{' '}
        and{' '}
        <TEXT.default color="primary1" display="inline">
          {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} {currencyB?.symbol}
        </TEXT.default>
      </TEXT.default>
    );
  };

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setSignatureData(null); // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0');
    }
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  );

  const handleAmountTabs = (percent: number) => {
    onUserInput(Field.LIQUIDITY_PERCENT, percent.toString());
  };

  const toggleSuccess = () => {
    setTxHash('');
    setShowConfirm(false);
    toggleSuccessModal();
  };

  useEffect(() => {
    return () => {
      setInnerLiquidityPercentage(0);
    };
  }, []);

  const isLocked = pairsList && pairsList?.pairs && pair ? isPairLocked(pairsList.pairs, pair) : false;

  return (
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
            <TabContainer>
              <AddLiquidity>
                <SuccessTransactionModal
                  hash={txHash !== '' ? txHash : undefined}
                  isOpen={isOpenSuccessModal}
                  onDismiss={toggleSuccess}
                />
                <TransactionConfirmationModal
                  isOpen={showConfirm}
                  onDismiss={handleDismissConfirmation}
                  attemptingTxn={attemptingTxn}
                  hash={txHash ? txHash : ''}
                  pair={pair}
                  isRemove={true}
                  content={() => (
                    <ConfirmationModalContent
                      title={'You will receive'}
                      onDismiss={handleDismissConfirmation}
                      topContent={modalHeader}
                      bottomContent={modalBottom}
                    />
                  )}
                  pendingText={pendingText}
                  pendingContent={pendingContent}
                />
                <>
                  <ALTop>
                    <h3>
                      Remove {currencyA?.symbol}/{currencyB?.symbol} Liquidity
                    </h3>
                    <p>
                      To Receive {currencyA?.symbol} and {currencyB?.symbol}
                    </p>
                  </ALTop>
                  <SliderBx>
                    <label>Amount</label>
                    <h4 className="SliderVal">{formattedAmounts[Field.LIQUIDITY_PERCENT]}%</h4>
                    <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                    <AmountTabs onChange={handleAmountTabs} />
                  </SliderBx>
                  <Switch>
                    <a className="switch">
                      <img src={Swap} alt="Swap" />
                    </a>
                  </Switch>
                  {/* <ColumnCenter>
                    <img src={ArrowInCircleIcon} alt="icon" />
                  </ColumnCenter> */}

                  <InfoSec className="mt0">
                    <h4>You will receive</h4>
                    <p>
                      <div className="img">
                        <CurrencyLogo style={{ marginRight: '3px' }} size={'17px'} currency={currencyA} />
                      </div>
                      {currencyA?.symbol}
                      <span>{formattedAmounts[Field.CURRENCY_A] || '-'}</span>
                    </p>
                    <p>
                      <div className="img">
                        <CurrencyLogo style={{ marginRight: '3px' }} size={'17px'} currency={currencyB} />
                      </div>
                      {currencyB?.symbol}
                      <span>{formattedAmounts[Field.CURRENCY_B] || '-'}</span>
                    </p>
                  </InfoSec>

                  {pair && (
                    <InfoSec className="mt0">
                      <h4>Prices and pool share:</h4>
                      <p>
                        1 {currencyA?.symbol} =
                        <span>
                          {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                        </span>
                      </p>
                      <p>
                        1 {currencyB?.symbol} =
                        <span>
                          {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                        </span>
                      </p>
                    </InfoSec>
                  )}

                  {pair ? <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} /> : null}

                  <div style={{ position: 'relative', marginTop: '20px', columnGap: '10px' }}>
                    {!account ? (
                      <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
                    ) : isLocked ? (
                      <GreyCardLight style={{ textAlign: 'center', padding: '12px' }}>
                        <TYPE.main>Pair locked</TYPE.main>
                      </GreyCardLight>
                    ) : (
                      <ButtonWrapper
                        style={{ position: 'relative', marginTop: '20px', columnGap: '10px', borderRadius: '5px' }}
                      >
                        <ButtonConfirmed
                          className="lg secondary"
                          onClick={onAttemptToApprove}
                          confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                          disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                          mr="0.5rem"
                          fontWeight={600}
                          fontSize={14}
                          style={{ paddingTop: '10px', paddingBottom: '10px', borderRadius: '5px' }}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <Dots>Approving</Dots>
                          ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                            'Enabled'
                          ) : (
                            'Enable'
                          )}
                        </ButtonConfirmed>
                        {!isValid || (signatureData === null && approval !== ApprovalState.APPROVED) ? (
                          <ButtonError
                            className="lg secondary"
                            onClick={() => {
                              setShowConfirm(true);
                            }}
                            disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                            error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                            style={{ paddingTop: '10px', paddingBottom: '10px', borderRadius: '5px' }}
                          >
                            <Text fontSize={14} fontWeight={600}>
                              {error || 'Remove'}
                            </Text>
                          </ButtonError>
                        ) : (
                          <ButtonOutlinedRemove
                            className="lg secondary"
                            onClick={() => {
                              setShowConfirm(true);
                            }}
                          >
                            <TEXT.primary className="lg secondary" fontSize={14} fontWeight={600}>
                              Remove
                            </TEXT.primary>
                          </ButtonOutlinedRemove>
                        )}
                      </ButtonWrapper>
                    )}
                  </div>
                </>
              </AddLiquidity>
            </TabContainer>
          </>
        </ExchangeBx>
      </Gs.Container>
    </>
  );
}
const ButtonWrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
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

const TabContainer = styled.div``;

const AddLiquidity = styled.div`
  li {
    list-style: none;
    background: #fff;
    border-radius: 5px;
    padding: 0 20px;
    margin-bottom: 12px;
  }
  .LLTitle {
    font-size: 18px;
    font-weight: 600;
    color: var(--txtLight);
    padding: 6px 0px;
    height: 63px;
    position: relative;
    p {
      margin: 0;
      font-size: 18px;
    }
    i {
      img {
        margin-right: 3px;
        vertical-align: top;
        margin-top: 3px;
      }
    }
    .arrowDown {
      position: absolute;
      right: -5px;
      top: 50%;
      margin-top: -13px;
      width: 26px;
      height: 26px;
      display: flex;
      align-self: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.5s ease-in-out;
      img {
        width: 13px;
        object-fit: contain;
      }
      &:hover {
        background-color: var(--bgLight);
      }
    }
    ${Gs.BtnSm} {
      position: absolute;
      top: 50%;
      margin-top: -20px;
      right: 28px;
      opacity: 0;
      visibility: hidden;
    }
    &.show {
      ${Gs.BtnSm} {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .LLContent {
    width: 100%;
    padding: 8px 0 14px;
    &.mt0 {
      margin-top: 0;
    }
    p {
      display: flex;
      align-items: center;
      color: var(--txtLight);
      margin: 0 0 11px 0;
      font-weight: 500;
      a {
        vertical-align: top;
        display: inline-block;
        margin: 5px 0 0 8px;
      }
      span {
        margin-left: auto;
      }
      &.bold {
        font-weight: 600;
      }
    }
    i {
      margin-right: 7px;
    }
    ${Gs.BtnSm} {
      margin-top: 10px;
    }
  }
  ${Media.xs} {
    .LLTitle {
      font-size: 16px;
      ${Gs.BtnSm} {
        padding: 5px 5px;
        font-size: 13px;
        width: 76px;
      }
      p {
        font-size: 16px;
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
    font-weight: 500;
  }
`;

const SliderBx = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 12px 19px 20px;
  margin: 42px 0 80px 0;
  position: relative;
  label {
    font-weight: 500;
    position: absolute;
    top: -37px;
    left: -2px;
  }
  .SliderVal {
    margin: 0 0 30px 0;
    font-weight: 600;
    color: var(--txtColor);
    font-size: 24px;
  }
`;

const InfoSec = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 15px 19px 5px;
  margin: -10px 0 21px 0;
  &.mt0 {
    margin-top: 0;
  }
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
    &.bold {
      font-weight: 600;
    }
  }
  .img {
    margin-right: 7px;
    img {
      margin-right: 3px;
    }
  }
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--txtLight);
    margin: 0 0 16px;
  }
`;
