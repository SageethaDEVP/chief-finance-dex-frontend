import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LogoBig from '../../assets/Pngs/logo-white.png';
import BridgeIcon from '../../assets/Pngs/Bridge.png';
import Exchange from '../../assets/svg-bid/landing-exchange.svg';
import { useActiveWeb3React } from '../../hooks';
import Web3Status from '../Web3Status';
import { TEXT } from '../../theme';
import { useHistory, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTokenAddedModalOpen, useTokenAddedModalToggle } from '../../state/application/hooks';
import { TokenAddedModal } from '../SearchModal/TokenAddedModal';
import TokenList from '../home/PricesRow';
import { Link, NavLink } from 'react-router-dom';
// import ConnectWallet from '../component/ConnectWallet';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';
import LogoImg from '../../assets/images/logo.png';
import WalletIco from '../../assets/images/wallet.png';
import globe from '../../assets/images/globe.png';
import down from '../../assets/images/down.png';
import ChainDropDown from '../../components/ChainDropDown';
import Home from './../../pages/Home/index';
import { updateCurrency } from '@bidelity/sdk';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import caution from '../../assets/images/caution.png';
// eslint-disable-next-line @typescript-eslint/camelcase
import { chainId_ChainName } from '../../constants';
import { useWalletModalToggle } from '../../state/application/hooks';

//  OLD SCOMPONENTS
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.newTheme.primary2};
`;

const HeaderFrame = styled.div<{ isBorder: string }>`
  position: relative;
  width: 100vw;
  padding: 16px 1.25rem;
  display: flex;
  z-index: 2;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ theme, isBorder }) => (isBorder === 'true' ? `1px solid ${theme.newTheme.border}` : '')}};
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
`;

const BlockWithMargin = styled(HeaderRow)<{ marginLeft: string }>`
  margin-left: ${({ marginLeft }) => marginLeft};
`;

const StyledNavLink = styled.div`
  color: ${({ theme }) => theme.newTheme.white};
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;

export const AccountElement = styled.div<{ active: boolean }>`
  background: var(--primary);
  padding: 0 26px;
  margin: 0 auto;
  height: 45px;
  text-align: center;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease-in-out 0s;
  line-height: 1;
  img {
    margin-right: 6px;
  }
  &.lg {
    width: 100%;
  }
  &:hover {
    background: var(--txtColor);
  }
  &.secondary {
    background: none;
    border: 1px solid var(--txtLight2);
    color: var(--txtLight);
    &:hover {
      border: 1px solid var(--txtColor);
      background: var(--txtColor);
      color: #fff;
    }
  }
  ${Media.lg2} {
    padding: 0 20px;
  }
  ${Media.md} {
  }
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 0.75rem;
  text-decoration: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const BottomRow = styled.div`
  padding: 10px 0;
`;

const TopRow = styled.div`
  padding: 16px 65px 9px;
`;

// NEW SCOMPONENTS

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 500;
  // flex-wrap: nowrap;
`;
const HeaderBx = styled(FlexDiv)`
  justify-content: space-between;
  padding: 17px 70px;
  background: #fafbff;
  .logo {
  }
  .HeaderRight {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }
  ${Media.lg2} {
    padding: 17px 20px;
  }
  ${Media.sm} {
    .logo {
      width: 200px;
    }
    ${Gs.BtnSm} {
      font-size: 18px;
      height: 40px;
      padding: 0 15px;
      display: none;
      img {
        display: none;
      }
    }
  }
  ${Media.xs} {
    /* .logo {width: 50px; overflow: hidden;
      img {width: 200px; max-width: inherit;}
    } */
    /* ${Gs.BtnSm} { font-size: 16px; height: 35px; font-weight: 400;} */
  }
`;
const Menu = styled.div`
  a {
    color: #fff;
    font-size: 20px;
    color: var(--txtColor);
    border-right: 1px solid var(--txtColor);
    padding: 0 35px;
    font-weight: 500;
    &:nth-last-child(1) {
      border-right: 0px;
    }
    &.active,
    &:hover {
      color: var(--primary);
    }
  }
  ${Gs.BtnSm} {
    display: none;
  }
  ${Media.lg2} {
    a {
      font-size: 18px;
      padding: 0 20px;
    }
  }
  ${Media.md} {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    background: var(--txtColor);
    flex-flow: column;
    padding: 15px;
    &.ShowMenu {
      display: flex;
    }
    a {
      color: #fff;
      padding: 10px 15px;
      border-bottom: 1px solid #fff;
      &:first-child {
        border-top: 1px solid #fff;
      }
    }
    ${Gs.BtnSm} {
      display: flex;
      width: 100%;
      margin-top: 15px;
      border-bottom: 0;
      font-size: 18px;
      img {
        display: inline-block;
      }
    }
  }
`;
const Button2 = styled.div`
  padding: 0 11px;
  color: var(--txtColor);
  height: 45px;
  text-align: center;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid var(--txtColor);
  margin-left: 20px;
  font-weight: 600;
  cursor: pointer;
  img:not(.arrow) {
    margin: 0 7px 0 0;
  }
  .arrow {
    width: 12px;
    margin: 0 0 0 13px;
  }
  &:hover {
    border-color: var(--primary);
  }
  ${Media.sm} {
    font-size: 18px;
    height: 40px;
    span {
      display: none;
    }
    .arrow {
      margin: 0;
    }
  }
  ${Media.xs} {
    font-size: 16px;
    height: 35px;
    margin-left: 10px;
    font-weight: 400;
    /* display: none; */
  }
`;
const ChainSwitch = styled.div`
  padding: 0 11px;
  color: var(--txtColor);
  height: 45px;
  text-align: center;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid var(--txtColor);
  margin-right: 20px;
  font-weight: 600;
  cursor: pointer;
  img:not(.arrow) {
    margin: 0 7px 0 0;
  }
  .arrow {
    width: 12px;
    margin: 0 0 0 13px;
  }
  &:hover {
    border-color: var(--primary);
  }
  ${Media.sm} {
    font-size: 18px;
    height: 40px;
    span {
      display: none;
    }
    .arrow {
      margin: 0;
    }
  }
  ${Media.xs} {
    font-size: 16px;
    height: 35px;
    margin-right: 10px;
    font-weight: 400;
    /* display: none; */
  }
`;

const Hamburger = styled.div`
  width: 32px;
  height: 22px;
  margin-left: 15px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  display: none;
  cursor: pointer;
  align-self: center;
  span {
    display: block;
    height: 3px;
    background: var(--primary);
    border-radius: 5px;
    &:first-child {
      margin-left: 6px;
    }
    &:last-child {
      margin-left: 6px;
    }
  }
  ${Media.md2} {
    display: flex;
  }
`;

export default function Header({
  showBottom = false,
  showTop = false,
  isHome = false,
}: {
  showBottom?: boolean;
  showTop?: boolean;
  isHome?: boolean;
}) {
  const { account, chainId } = useActiveWeb3React();
  useEffect(() => {
    if (chainId) updateCurrency(chainId);
  }, [chainId]);
  const open = useTokenAddedModalOpen();
  const toggle = useTokenAddedModalToggle();
  const currentLocation = useLocation();
  const history = useHistory();

  const handleClick = (to: string) => {
    // window.location.href = to; // Redirect to the specified page
    if (currentLocation.pathname === to) return;
    if (currentLocation.pathname == '/bridge' || to === '/bridge') {
      window.location.href = to; // Reload the page
    } else {
      (history as any).push(to);
    }
  };

  const [isShowMenu, setIsShowMenu] = useState(false);
  const openMenu = () => {
    setIsShowMenu(!isShowMenu);
  };

  useEffect(() => {}, []);

  // Chain Dropdown details
  const node = useRef<HTMLDivElement>();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  useOnClickOutside(node, isDropdownOpen ? toggleDropdown : undefined);

  let imageLogo;
  if (chainId == null) {
    imageLogo = caution;
  } else {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const chainname = chainId_ChainName[chainId?.toString() as keyof typeof chainId_ChainName];
    imageLogo = `./images/${chainname}.png`;
  }
  const toggleWalletModal = useWalletModalToggle();

  return (
    <>
      <HeaderBx>
        <TokenAddedModal isOpen={open} onDismiss={toggle} />
        <a onClick={() => handleClick('/')}>
          <img className="logo" src={LogoImg} alt="logo" />
        </a>
        <Menu className={`${isShowMenu ? 'ShowMenu' : ''}`}>
          <NavLink to={'/swap'}>Exchange</NavLink>
          <NavLink to={'/pool'}>Pool</NavLink>
          <NavLink to={'/bridge'}>Bridge</NavLink>
          <NavLink to={'/limit'}>Limit Order</NavLink>
          {!account && (
            <Gs.BtnSm id="connect-wallet" style={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              <img src={WalletIco} alt="Wallet" />
              Connect Wallet
            </Gs.BtnSm>
          )}
        </Menu>
        <div className="HeaderRight">
          {/* <AccountElement active={!!account}> */}
          <div ref={node as any} style={{ position: 'relative' }}>
            <ChainSwitch onClick={toggleDropdown}>
              <img style={{ width: '25px', borderRadius: '100%' }} src={imageLogo} alt="logo" />
              <img className="arrow" src={down} alt="down" />
            </ChainSwitch>
            <ChainDropDown closeDropdown={closeDropdown} isVisible={isDropdownOpen} />
          </div>
          <Web3Status />
          {/* </AccountElement> */}
          <LanguageSwitcher />
          <Hamburger id="nav-icon2" onClick={openMenu}>
            <span></span>
            <span></span>
            <span></span>
          </Hamburger>
        </div>
      </HeaderBx>
    </>
  );
}
