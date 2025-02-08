import React, { useRef, useState } from 'react';

import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { ApplicationModal } from '../../state/application/actions';
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { TEXT } from '../../theme';
import { AutoColumn } from '../Column';
import Modal from '../Modal';
import TransactionSettings from '../TransactionSettings';
import SettingsIcon from '../../assets/svg-bid/setting.svg';
import CloseSvgIcon from '../../assets/svg-bid/close-small.svg';
import { ButtonPrimary } from '../Button';
import SettingIco from '../../assets/images/setting.png';
import Gs from 'theme/globalStyles';
import cross from '../../assets/images/cross.png';
import InfoIco from '../../assets/images/info.png';
import Clock from '../../assets/images/clock.png';
import Tick from '../../assets/images/tick.png';
import Copy from '../../assets/images/copy.png';
import confirmIco from '../../assets/images/confirm.png';
import Media from 'theme/media-breackpoint';
const StyledMenuButton = styled.button`
  display: flex;
  align-items: center;
  position: relative;
  border: none;
  background-color: transparent;
  margin-top: 2px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`;

const ButtonsSection = styled.div`
  display: flex;
  align-items: center;
`;

const MenuFlyout = styled.span`
  position: relative;
  width: 100%;
  max-width: 345px;
  background-color: ${({ theme }) => theme.newTheme.white};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 20px;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonWithColor = styled(ButtonPrimary)`
  width: 50%;
  padding: 10px 0;
  color: ${({ theme }) => theme.newTheme.white};
  border: 1px solid ${({ theme }) => theme.newTheme.primary1};
  border-radius: 14px;
  margin-left: 15px;

  font-size: 14px;
  font-weight: 600;
`;

const ButtonTransparent = styled(ButtonWithColor)`
  color: ${({ theme }) => theme.newTheme.black};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.newTheme.border4};
  margin-left: 0;

  :hover,
  :focus {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.newTheme.black};
    opacity: 0.6;
  }
`;

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>();
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleSettingsMenu();

  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance();

  const [localUserSlippageTolerance, setLocalUserSlippageTolerance] = useState(userSlippageTolerance);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useOnClickOutside(node, open ? toggle : undefined);

  const onSave = () => {
    setUserslippageTolerance(localUserSlippageTolerance);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* <Gs.PopupMain>
            <Gs.OverLay onClick={onClose} />
            <Gs.Popup>
                <h3>Setting
                    <a onClick={onClose} className='close'><img width={12} src={cross} alt='cross' /></a>
                </h3>

                <SecTitle>Exchange & Liquidity</SecTitle>
                <SecLabel>Slippage Tolerance <i><img width={20} src={InfoIco} /></i></SecLabel>
                <Gs.Percent>
                    <a className='active'>25%</a>
                    <a>50%</a>
                    <a>75%</a>
                    <div className='inputBx'>
                        <input type='text' className='' />
                        <span>%</span>
                    </div>
                </Gs.Percent>
                <ErrorMessage>Your transaction may fail</ErrorMessage>
                <BtnCont>
                    <Gs.BtnSm className='secondary'>Cancel</Gs.BtnSm>
                    <Gs.BtnSm>Save</Gs.BtnSm>
                </BtnCont>
            </Gs.Popup>

            */}

      <StyledMenu ref={node as any}>
        <StyledMenuButton onClick={toggleModal} id="open-settings-dialog-button">
          <img src={SettingIco} width="16px" height="16px" alt="settings" />
        </StyledMenuButton>
        <Modal isOpen={isModalOpen} onDismiss={toggleModal} maxWidth={345}>
          <Gs.PopupMain>
            <Gs.OverLay />
            <Gs.Popup>
              <h3>
                Settings
                <a onClick={toggleModal} className="close">
                  <img width={12} src={cross} alt="close" />
                </a>
              </h3>

              <SecTitle>Exchange & Liquidity</SecTitle>
              <TransactionSettings
                rawSlippage={localUserSlippageTolerance}
                setRawSlippage={setLocalUserSlippageTolerance}
              />

              <BtnCont>
                <Gs.BtnSm className="secondary" onClick={toggleModal}>
                  Cancel
                </Gs.BtnSm>
                <Gs.BtnSm onClick={onSave}>Save</Gs.BtnSm>
              </BtnCont>
            </Gs.Popup>
          </Gs.PopupMain>
        </Modal>
      </StyledMenu>
    </>
  );
}

// NEW SCOMPONENTS

const SecTitle = styled.h4`
  font-size: 20px;
  color: #000;
  font-weight: 500;
  margin: 0 0 14px;
`;
const ErrorMessage = styled.label`
  color: var(--txtRed);
  font-weight: 400;
  margin: 14px 0 14px;
  display: flex;
  align-items: center;
  i {
    margin-left: 4px;
  }
`;
const SecLabel = styled.label`
  color: var(--txtLight);
  font-weight: 400;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  i {
    margin-left: 4px;
  }
`;
const BtnCont = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  margin-top: 15px;
  ${Gs.BtnSm} {
    width: 50%;
  }
`;
const Wating = styled.div`
  text-align: center;
  margin-bottom: 30px;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--txtYellow);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
  p {
    color: var(--txtLight);
    font-size: 20px;
    font-weight: 400;
    margin: 16px 0 0;
  }
  span {
    color: var(--primary);
  }
  b {
    font-weight: 500;
  }
  ${Media.xs} {
    margin-bottom: 20px;
    p {
      margin-top: 10px;
    }
  }
`;
const SuccessTxt = styled.div`
  text-align: center;
  margin-bottom: 30px;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--primary);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
  p {
    color: var(--txtLight);
    font-size: 20px;
    font-weight: 400;
    margin: 16px 0 0;
  }
  span {
    color: var(--primary);
  }
  b {
    font-weight: 500;
  }
  .color-blue {
    color: var(--txtBlue);
  }
  ${Media.xs} {
    margin-bottom: 20px;
    p {
      margin-top: 10px;
    }
  }
`;
const ConformTxt = styled.div`
  text-align: center;
  margin: 15px 0;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--primary);
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  p {
    color: var(--txtLight);
    font-size: 18px;
    font-weight: 400;
    margin: 10px 0 0;
  }
  span {
    color: var(--primary);
  }
  b {
    font-weight: 500;
  }
  .color-blue {
    color: var(--txtBlue);
  }
`;
const TextBox = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;
  margin-top: 14px;
  label {
    color: var(--txtLight);
    font-size: 14px;
    margin-bottom: 8px;
  }
  input {
    color: var(--txtBlue);
    background: var(--bgLight);
    border: 0;
    border-radius: 5px;
    height: 65px;
    font-weight: 500;
    padding: 8px 12px;
    font-weight: 500;
  }
  .copy {
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -10px;
  }
  ${Media.xs} {
    input {
      height: 50px;
    }
  }
`;
