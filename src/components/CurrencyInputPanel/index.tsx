import { Currency, Pair } from '@bidelity/sdk';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import { TEXT } from '../../theme';
import { Input as NumericalInput } from '../NumericalInput';
import { darken } from 'polished';
import VectorDonIcon from '../../assets/images/arrow2.png';
import bannerEl from '../../assets/images/bannerEl.png';
import bannerBg from '../../assets/images/bannerBg.jpg';
import Swap from '../../assets/images/swap.png';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/down.png';
import Eth from '../../assets/images/eth.png';
import Tooltip from '../Tooltip';
import Media from 'theme/media-breackpoint';
import Gs from 'theme/globalStyles';
import WalletIco from '../../assets/images/wallet.png';

// OLD SCOMPONENTS
const InputRow = styled.div<{ selected: boolean; isHomePage?: boolean; isSecond?: boolean }>`
  position: relative;

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
`;

const CurrencySelect = styled.button<{ isHomePage?: boolean; isFirst?: boolean }>`
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
`;

const FlexedBlock = styled.div`
  display: flex;
`;

const Aligner = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 6px;
`;

const InputPanel = styled.div<{ hideInput?: boolean; isHomePage?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border: ${({ isHomePage, theme }) => (isHomePage ? `1px solid ${theme.newTheme.primary1}` : '')};
  z-index: 1;
  padding: ${({ isHomePage }) => (isHomePage ? '' : '8px 10px 7px 0')};
  overflow: hidden;
`;

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  display: flex;
  justify-content: space-between;
`;

// new
const StyledTokenName = styled.span`
  margin-left: auto;
  font-family: var(--font);
`;

const StyledBalanceMax = styled.span`
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ theme }) => theme.newTheme.primary1};
`;

const AvailabilityRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.3rem;
`;

const InputLabel = styled.span<{ isSecond?: boolean }>`
  font-size: 12px;
  color: var(--txtLight2);
  position: absolute;
  padding: 0 0;
  top: 25px;
  left: 0;
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
  showAvailableInPool?: boolean;
  availabilityInPool?: string | undefined;
  showBorder?: boolean;
  isHomePage?: boolean;
  label2?: string;
  isFirst?: boolean;
  isSecond?: boolean;
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  showAvailableInPool = false,
  availabilityInPool,
  showBorder = false,
  isHomePage = false,
  label2,
  isFirst = false,
  isSecond,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const openTooltip = useCallback(() => setShowTooltip(true), [Tooltip]);
  const closeTooltip = useCallback(() => setShowTooltip(false), [Tooltip]);

  const currencyName =
    currency && currency.symbol && currency.symbol.length > 20
      ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
      : currency?.symbol;

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const shortName = currency?.name?.split(' ')[0];

  return (
    <>
      <Container hideInput={hideInput}>
        {!isHomePage && (
          // <AmountBox id={id} isHomePage={isHomePage}>
          <ExBox>
            <InputRow
              isSecond={isSecond}
              isHomePage={isHomePage}
              style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
              selected={disableCurrencySelect}
            >
              <InputLabel isSecond={isSecond}>{label2}</InputLabel>
              {!hideInput && (
                <>
                  <NumericalInput
                    fontSize={isHomePage ? '20px' : undefined}
                    className="input-container"
                    value={value}
                    onUserInput={(val) => {
                      onUserInput(val);
                    }}
                  />
                  {showMaxButton && <Maxlabel onClick={onMax}>MAX</Maxlabel>}
                </>
              )}
            </InputRow>
            <DropSelect className="ExBox-right">
              <a
                className="selectBtn"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true);
                  }
                }}
              >
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={26} margin={true} />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size={'26px'} />
                ) : null}

                {currencyName !== undefined ? (
                  <Aligner>
                    {pair ? (
                      <StyledTokenName>
                        {pair?.token0.symbol}:{pair?.token1.symbol}
                      </StyledTokenName>
                    ) : (
                      <StyledTokenName>{currencyName}</StyledTokenName>
                    )}
                  </Aligner>
                ) : (
                  <TEXT.default color="textSecondary" fontWeight={600} fontSize={12} textAlign="left">
                    Select a currency
                  </TEXT.default>
                )}
                {!disableCurrencySelect && <ArrowImg className="arrow" src={VectorDonIcon} alt="img" />}
              </a>
            </DropSelect>
          </ExBox>
          // </AmountBox>
        )}
        {isHomePage && (
          <>
            <div className="ExBox">
              <div className="input-container">
                <label htmlFor="yousend">{label2}</label>
                <InputRow
                  className=""
                  isSecond={isSecond}
                  isHomePage={isHomePage}
                  style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
                  selected={disableCurrencySelect}
                >
                  {!hideInput && (
                    <>
                      <NumericalInput
                        fontSize={isHomePage ? '20px' : undefined}
                        className=""
                        value={value}
                        onUserInput={(val) => {
                          onUserInput(val);
                        }}
                      />
                      {showMaxButton && <Maxlabel onClick={onMax}>MAX</Maxlabel>}
                    </>
                  )}
                </InputRow>
              </div>

              {/* <div className="ExBox-right">
                  <a className="selectBtn">
                    <img className="token" src={Thr} alt="" />
                    Tether <img className="arrow" src={Dwn} alt="" />
                  </a>
                  <h4>USDT</h4>
                </div> */}
              <div className="ExBox-right">
                <a
                  className="selectBtn"
                  onClick={() => {
                    if (!disableCurrencySelect) {
                      setModalOpen(true);
                    }
                  }}
                >
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={26} margin={true} />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size={'26px'} />
                  ) : null}

                  {currencyName !== undefined ? (
                    <Aligner>
                      {pair ? (
                        <StyledTokenName>
                          {pair?.token0.symbol}:{pair?.token1.symbol}
                        </StyledTokenName>
                      ) : (
                        <StyledTokenName>{currencyName}</StyledTokenName>
                      )}
                    </Aligner>
                  ) : (
                    <TEXT.default color="textSecondary" fontWeight={600} fontSize={12} textAlign="left">
                      Select a currency
                    </TEXT.default>
                  )}
                  {!disableCurrencySelect && <ArrowImg className="arrow" src={VectorDonIcon} alt="img" />}
                </a>
                <h4>{shortName && shortName}</h4>
              </div>
            </div>
          </>
        )}
      </Container>

      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
      {showAvailableInPool && (
        <AvailabilityRow>
          <TEXT.default color="textSecondary" fontWeight={500} fontSize={10}>
            Availability In Pool: {availabilityInPool ? availabilityInPool : '-'} {currencyName}
          </TEXT.default>
        </AvailabilityRow>
      )}
    </>
  );
}

// NEW SCOMPONENTS

const AmountBox = styled.div<{ hideInput?: boolean; isHomePage?: boolean }>`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 20px 19px 32px;
  margin: 0 0 28px 0;
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

const Maxlabel = styled.b`
   {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary);
    position: absolute;
    top: 0;
    right: 17px;
    cursor: pointer;
  }
`;

const DropSelect = styled.div<{ isHomePage?: boolean; isFirst?: boolean }>`
  width: 83px;
  flex-shrink: 0;
  align-self: center;
  margin-right: 0;
  margin-left: 20px;
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

const ArrowImg = styled.img`
  margin-left: auto;
  width: 7px;
  flex-shrink: 0;
  position: relative;
`;

const Exchange = styled.div`
  width: 602px;
  box-shadow: 0 0 8px #08514030;
  display: flex;
  border-radius: 30px;
  margin-left: auto;
  padding: 50px;
  flex-flow: column;
  align-self: center;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  &:after {
    content: '';
    position: absolute;
    right: 100%;
    top: 32px;
    background: url(${bannerEl}) no-repeat;
    width: 225px;
    height: 221px;
  }
  .ExTop {
    position: relative;
    margin: 0 0 26px 0;
    .switch {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -8px;
      background: var(--primary);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 5px rgba(27, 193, 154, 0.2);
      transition: all 0.3s ease-in-out 0s;
      cursor: pointer;
      z-index: 1;
      &:hover {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  .ExBox {
    display: flex;
    box-shadow: 1px -2px 7px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    height: 128px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.6);
    &:focus-within {
      box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.16);
    }
    .input-container {
      position: relative;
      input {
        border: 0px;
        font-size: 35px;
        background: none;
        color: #9ba4a6;
        font-family: var(--font);
        padding: 12px 30px 0;
        height: 128px;
        width: 100%;
      }
      label {
        font-size: 20px;
        color: var(--txtColor);
        position: absolute;
        padding: 0 30px;
        top: 25px;
        left: 0;
      }
    }
    .ExBox-right {
      width: 160px;
      flex-shrink: 0;
      align-self: center;
      padding: 0 20px 0 0;
      .selectBtn {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 2px;
        width: 100%;
        border-radius: 4px;
        padding: 4px 8px;
        &:hover {
          background: rgba(0, 0, 0, 0.16);
        }
        .token {
          margin-right: 9px;
          width: 28px;
          height: 28px;
        }
        .arrow {
          margin-left: auto;
          margin-right: 5px;
          flex-shrink: 0;
          position: relative;
          right: -5px;
        }
      }
      h4 {
        font-size: 24px;
        color: var(--txtColor);
        font-weight: 500;
        margin: 0;
        padding: 0 8px 4px;
      }
    }
  }
  ${Media.lg} {
    max-width: 48%;
    &:after {
      width: 160px;
      height: 210px;
      background-size: contain;
    }
  }
  ${Media.lg2} {
    padding: 35px;
    &:after {
      display: none;
    }
    .ExTop {
      margin-bottom: 5px;
    }
  }
  ${Media.md} {
    width: 100%;
    max-width: 100%;
  }
  ${Media.xs} {
    padding: 25px;
    .ExBox {
      flex-flow: column;
      height: auto;
      .input-container {
        border-bottom: 1px solid #e5e5e5;
        padding-top: 15px;
        input {
          height: 50px;
          font-size: 25px;
          padding: 0 30px 0;
        }
        label {
          font-size: 18px;
          top: 5px;
          position: static;
        }
      }
      .ExBox-right {
        width: 100%;
        padding: 15px 10px;
        h4 {
          font-size: 20px;
        }
      }
    }
  }
`;

const InputContainer = styled.div`
  width: 602px;
  box-shadow: 0 0 8px #08514030;
  display: flex;
  border-radius: 30px;
  margin-left: auto;
  padding: 50px;
  flex-flow: column;
  align-self: center;
  position: relative;
  // background: rgba(255, 255, 255, 0.5);
  &:after {
    content: '';
    position: absolute;
    right: 100%;
    top: 32px;
    // background: url(${bannerEl}) no-repeat;
    width: 225px;
    height: 221px;
  }
  .ExTop {
    position: relative;
    margin: 0 0 26px 0;
    .switch {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -8px;
      background: var(--primary);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 5px rgba(27, 193, 154, 0.2);
      transition: all 0.3s ease-in-out 0s;
      cursor: pointer;
      z-index: 1;
      &:hover {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  .ExBox {
    display: flex;
    box-shadow: 1px -2px 7px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    height: 128px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.6);
    &:focus-within {
      box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.16);
    }
    .input-container {
      position: relative;
      input {
        border: 0px;
        font-size: 35px;
        background: none;
        color: #9ba4a6;
        font-family: var(--font);
        padding: 12px 30px 0;
        height: 128px;
        width: 100%;
      }
      label {
        font-size: 20px;
        color: var(--txtColor);
        position: absolute;
        padding: 0 30px;
        top: 25px;
        left: 0;
      }
    }
    .ExBox-right {
      width: 160px;
      flex-shrink: 0;
      align-self: center;
      padding: 0 20px 0 0;
      .selectBtn {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 2px;
        width: 100%;
        border-radius: 4px;
        padding: 4px 8px;
        &:hover {
          background: rgba(0, 0, 0, 0.16);
        }
        .token {
          margin-right: 9px;
          width: 28px;
          height: 28px;
        }
        .arrow {
          margin-left: auto;
          margin-right: 5px;
          flex-shrink: 0;
          position: relative;
          right: -5px;
        }
      }
      h4 {
        font-size: 24px;
        color: var(--txtColor);
        font-weight: 500;
        margin: 0;
        padding: 0 8px 4px;
      }
    }
  }
  ${Media.lg} {
    max-width: 48%;
    &:after {
      width: 160px;
      height: 210px;
      background-size: contain;
    }
  }
  ${Media.lg2} {
    padding: 35px;
    &:after {
      display: none;
    }
    .ExTop {
      margin-bottom: 5px;
    }
  }
  ${Media.md} {
    width: 100%;
    max-width: 100%;
  }
  ${Media.xs} {
    padding: 25px;
    .ExBox {
      flex-flow: column;
      height: auto;
      .input-container {
        border-bottom: 1px solid #e5e5e5;
        padding-top: 15px;
        input {
          height: 50px;
          font-size: 25px;
          padding: 0 30px 0;
        }
        label {
          font-size: 18px;
          top: 5px;
          position: static;
        }
      }
      .ExBox-right {
        width: 100%;
        padding: 15px 10px;
        h4 {
          font-size: 20px;
        }
      }
    }
  }
`;
