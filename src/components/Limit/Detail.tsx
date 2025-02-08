import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { ExternalLink, TEXT } from '../../theme';

// import { AutoColumn } from '../Column';

import { AutoColumn, ColumnCenter } from '../Column';

import { RowBetween } from '../Row';
import { AutoRow } from '../Row';
import { ButtonError,ButtonPrimary } from '../Button';
import ArrowRightIcon from '../../assets/svg-bid/arrow-right-grey.svg';
import WarningIcon from '../../assets/svg-bid/warning.svg';
import ExportIcon from '../../assets/svg-bid/export.svg';
import ClockIcon from '../../assets/svg-bid/clock.svg';
import CloseSvgIcon from '../../assets/svg-bid/close-small.svg';
import { ColorsNewTheme } from '../../theme/styled';
import { getEtherscanLink } from '../../utils';
import {TransactionErrorContent} from '../TransactionConfirmationModal';
import { useActiveWeb3React } from '../../hooks';

const TransactionButton = styled(ButtonPrimary)`
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
`;


const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const InfoWrapper = styled.div`
  display:flex;
  flex-direction:row;
  margin-bottom: 6px;
`;

const FlexWithAlign = styled.div`
  display: flex;
  align-items: center;
`;

const InfoRow = styled(FlexWithAlign)`
  flex-grow:3;
  display:flex;
  flex-direction:column;
`;

const AmountInfo = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ArrowWrapper = styled(FlexWithAlign)`
  flex:0;
  justify-content: center;
  margin-right:6px;
  img {
    width: 20px;
    height: 20px;
  }
`;
const TitleSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 2px;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;


const ColoredWrapper = styled.div<{ bgColor: keyof ColorsNewTheme }>`
  background-color: ${({ bgColor, theme }) => (theme.newTheme as any)[bgColor]};;
  border-radius: 8px;
  padding: 10px;
`

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.white};
`;


const ConfirmedIcon = styled(ColumnCenter)`
  margin-top: 40px;
  img {
    width: 50px;
    height: 50px;
  }
`;


const WrapperSecondary = styled(Wrapper)`
  padding: 24px;
`;

const Section = styled(AutoColumn)`
  padding: 16px 16px 0 16px;
`;

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 8px 16px 16px;
`;

const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const PendingSectionSecondary = styled(PendingSection)`
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  border-radius: 14px;
`;

const TopSection = styled(RowBetween)`
  position: relative;
  padding: 10px 3px 4px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  img {
    width: 50px;
    height: 50px;
  }
`;



function TransactionSubmittedContent({hash,onDismiss}:{
  hash:string;
  onDismiss:()=>void;
}){
  const {chainId} = useActiveWeb3React()

  if (!chainId) return null;

return(
      <WrapperSecondary>
        <AutoColumn gap="xl">
          <RowBetween>
            <div />
            <TEXT.primary fontSize={20} fontWeight={600}>
              Order will be cancelled
            </TEXT.primary>
            <div onClick={onDismiss} style={{ cursor: 'pointer' }}>
              <img src={CloseSvgIcon} alt="close" />
            </div>
          </RowBetween>
          <PendingSectionSecondary>
            <ConfirmedIcon>
              <img src={ExportIcon} alt="confirmed" />
            </ConfirmedIcon>
            <AutoColumn gap="14px">
              <AutoColumn gap="10px" justify={'center'}>
                <TEXT.primary fontWeight={600} fontSize={16}>
                  Transaction Submitted
                </TEXT.primary>
                  <ExternalLink href={getEtherscanLink(chainId?chainId:1, hash, 'transaction')}>
                    <TEXT.default fontWeight={600} fontSize={14} color="blue">
                      View on EtherScan
                    </TEXT.default>
                  </ExternalLink>
              </AutoColumn>
            </AutoColumn>
          </PendingSectionSecondary>
          <ButtonWrapper>
            <TransactionButton onClick={onDismiss}>
              <TEXT.default fontWeight={600} fontSize={14} color="white">
                Close
              </TEXT.default>
            </TransactionButton>
          </ButtonWrapper>
        </AutoColumn>
      </WrapperSecondary>
    )
}

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  pendingContent,
}: {
  onDismiss: () => void;
  pendingText: string;
  pendingContent?: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <PendingSection>
        <TopSection>
          <div />
          <div onClick={onDismiss} style={{ cursor: 'pointer' }}>
            <img src={CloseSvgIcon} alt="close" />
          </div>
        </TopSection>
        <ImageWrapper>
          <img src={ClockIcon} alt="pending" />
        </ImageWrapper>
        <AutoColumn gap="12px" justify={'center'}>
          <TEXT.default fontWeight={600} fontSize={20} color="warning">
            Waiting For Confirmation
          </TEXT.default>
          {pendingContent ? (
            pendingContent()
          ) : (
            <TEXT.default fontWeight={600} fontSize={14} textAlign="center">
              {pendingText}
            </TEXT.default>
          )}
          <TEXT.default fontWeight={400} fontSize={14} color="textSecondary" textAlign="center">
            Confirm this transaction in your wallet
          </TEXT.default>
        </AutoColumn>
      </PendingSection>
    </Wrapper>
  );
}



export default function DetailModal({
  selectedIndex,
  isOpen,
  onDismiss,
  doCancel,
  assetIn,
  assetOut,
  limitPrice,
  attemptingTxn,
  cancelError,
  hash,
  expire,
  orderState

}: {
  selectedIndex:number;
  isOpen: boolean;
  onDismiss: () => void;
  doCancel:(index:number)=>void;
  assetIn:any,
  assetOut:any,
  limitPrice:any,
  attemptingTxn:boolean,
  hash:string,
  cancelError:string,
  expire:string,
  orderState:number
}) {


  const firstdialog = ()=>{
    return (
    <Wrapper>
      <Section>
        <TitleSection>
          <TEXT.default fontWeight={600} fontSize={20} color="textPrimary" textAlign="center">
            Open Order Details
          </TEXT.default>
          <CloseIcon onClick={onDismiss}>
            <img src={CloseSvgIcon} alt="close" />
          </CloseIcon>
        </TitleSection>
          <AutoColumn gap={'md'}>
            <InfoWrapper>
              <InfoRowItem asset={assetIn} direction={"From"}/>
              <ArrowWrapper>
                <img src={ArrowRightIcon} alt="arrow" />
              </ArrowWrapper>
              <InfoRowItem asset={assetOut} direction={"To"}/>
            </InfoWrapper>

            <ColoredWrapper bgColor="bg2">
              <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
                  Limit Price
              </TEXT.default>
              <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
                1 {assetIn?.symbol} = {limitPrice!=""?Number(limitPrice).toPrecision(6):""} {assetOut?.symbol}
              </TEXT.default>
              <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
                1 {assetOut?.symbol} = {limitPrice!=""?(1/Number(limitPrice)).toPrecision(6):""} {assetIn?.symbol}
              </TEXT.default>
              {orderState==0 && 
              <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
                  Expire 
              </TEXT.default>
              }
              {orderState==0 && 
              <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
                {expire}
              </TEXT.default>
              }
              {orderState!=0 && 
              <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
                  Status
              </TEXT.default>
              }
              {orderState!=0 && 
              <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
                {orderState==2?"Filled":"Cancelled"}
              </TEXT.default>
              }
            </ColoredWrapper>
            <ColoredWrapper  bgColor="bg10">
              <RowBetween>
                <ArrowWrapper>
                  <img src={WarningIcon} alt="arrow" />
                </ArrowWrapper>
                <TEXT.default fontWeight={500} fontSize={16} color="text6"  style={{flex:"auto"}}>
                  Real Execution Price:
                </TEXT.default>
              </RowBetween>
              <TEXT.default fontWeight={500} fontSize={12} color="text6">
                &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;Your execution gas fees are paid for by the spread between your specified price and thу real execution price.
              </TEXT.default>
              <TEXT.default fontWeight={500} fontSize={12} color="text6">
                &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;Gas fees volatile and thus the exact market price st which your order will execute is.unpredictable.
              </TEXT.default>
              <TEXT.default fontWeight={500} fontSize={12} color="text6">
                &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;It might take much longer than you expected to reach the price that fills your order + fees.
              </TEXT.default>
              
              <TEXT.default fontWeight={500} fontSize={16} color="text6" style={{marginTop:'10px'}}>
                “Fee on Transfer” Tokens
              </TEXT.default>
              <TEXT.default fontWeight={500} fontSize={12} color="text6">
                &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;“Fee on transfer" tokens should not be used. with Limit Orders.
              </TEXT.default>
            </ColoredWrapper>
          </AutoColumn>      
        </Section>
      {orderState==0 &&
        <BottomSection gap="12px">
          <AutoRow>
            <ButtonError
              onClick={()=>doCancel(selectedIndex)}
              disabled={false}
              style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, borderRadius: '8px' }}
            >
              <TEXT.default fontSize={14} fontWeight={600} color="white">
                {'Cancel Order'}
              </TEXT.default>
            </ButtonError>

          </AutoRow>
        </BottomSection>
    }
      {orderState!=0 &&
        <BottomSection gap="12px">
          <AutoRow>
            <ButtonError
              onClick={onDismiss}
              disabled={false}
              style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, borderRadius: '8px' }}
            >
              <TEXT.default fontSize={14} fontWeight={600} color="white">
                {'Close'}
              </TEXT.default>
            </ButtonError>

          </AutoRow>
        </BottomSection>
    }
    </Wrapper>

    )
  }
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxHeight={856}
      maxWidth={436}
    >
    {cancelError 
     ? <TransactionErrorContent  onDismiss={onDismiss}/>
     : hash!="" 
     ? <TransactionSubmittedContent hash={hash} onDismiss={onDismiss}/>
     : attemptingTxn 
     ? <ConfirmationPendingContent onDismiss={onDismiss} pendingText={""}/>
     : firstdialog()}
    </Modal>    
  );
}

const InfoRowItem = ({
  asset,
  direction
}: {
  asset:any,
  direction:string
}) => {
  return (
    <InfoRow>
      <AmountInfo>
        <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" style={{textAlign:direction=="To"?'right':'left'}}>
          {asset ? Number(asset.amount).toPrecision(6):""}
        </TEXT.default>
      </AmountInfo>
      <div style={{'display':'flex','width':'100%'}}>
        <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" marginTop="4px" style={{textAlign:direction=="To"?'right':'left',flex:direction=="To"?'1':''}}>
          {asset?.symbol}
        </TEXT.default>
        <img width="20px" height="20px" src={`https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/${asset.address}/logo.png`}/>
      </div>
    </InfoRow>
  );
};
