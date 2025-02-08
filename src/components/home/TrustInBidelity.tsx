import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import LogoIcon from '../../assets/Pngs/logo-white.png';
import { StyledHomePageLink } from './styled';
import { CFC_TOKEN_ADDRESS } from '../../constants';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';
import bannerEl from '../../assets/images/bannerEl.png';
import bannerBg from '../../assets/images/bannerBg.jpg';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/down.png';
import Eth from '../../assets/images/eth.png';
import Swap from '../../assets/images/swap.png';
import WalletIco from '../../assets/images/wallet.png';
import OwlCarousel from 'react-owl-carousel-rtl';
import Timg from '../../assets/images/Timg.png';
import ArrowR from '../../assets/images/arrow-right.png';
import ChartSm from '../../assets/images/chartSm.png';
import trustimg from '../../assets/images/trustimg.png';
import startimg from '../../assets/images/startimg.png';
import checkIco from '../../assets/images/check.png';

// OLD SCOMPONENTS
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 165px;
`;

const BodyWrapper = styled.div`
  width: 100%;
  max-width: 948px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 500px;
`;

const RightSection = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.newTheme.primary1};

  img {
    width: 210px;
  }
`;

const StyledExternalLink = styled.a`
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.newTheme.primary1};
  cursor: pointer;
`;

const Spacing = styled.div<{ marginTop?: string; marginLeft?: string }>`
  margin-top: ${({ marginTop }) => !!marginTop && marginTop};
  margin-left: ${({ marginLeft }) => !!marginLeft && marginLeft};
`;

const LinksWapper = styled.div`
  display: flex;
  align-items: center;
`;

export default function TrustInBidelity() {
  return (
    <Trust>
      <Gs.Container>
        <div className="TrustLeft">
          <h2>
            Trust in <br /> Chief Finance
          </h2>
          <p>
            With its innovative features and unparalleled security measures, Chief Finance is the ultimate choice for
            anyone seeking a reliable and efficient cryptocurrency.
          </p>
          <StyledHomePageLink to={`/swap?inputCurrency=ETH&outputCurrency=${CFC_TOKEN_ADDRESS}`}>
            Buy CFNC
          </StyledHomePageLink>
          <a className="btn02" href={`https://goerli.etherscan.io/token/${CFC_TOKEN_ADDRESS}`}>
            Learn
          </a>
        </div>
        <div className="TrustRight">
          <img src={trustimg} alt="trust img" />
        </div>
      </Gs.Container>
    </Trust>
  );
}

// NEW SCOMPONENTS
const Trust = styled.div`
  position: relative;
  z-index: 2;
  padding: 130px 0;
  &:after {
    content: '';
    background: #158c72;
    position: absolute;
    top: 20%;
    left: -75px;
    height: 150px;
    width: 150px;
    border-radius: 100%;
    z-index: -1;
    filter: blur(50px);
    opacity: 0.4;
  }
  .TrustLeft {
    width: 34%;
    align-self: center;
    margin-left: 90px;
    h2 {
      font-size: 60px;
      margin: 0;
      line-height: 1;
    }
    p {
      font-size: 24px;
      color: var(--txtLight);
    }
    .btn02 {
      padding: 0 20px;
      color: var(--txtLight);
      height: 45px;
      text-align: center;
      font-size: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: 1px solid rgba(99, 100, 106, 0.1);
      margin-left: 20px;
      font-weight: 600;
      &:hover {
        background: var(--txtColor);
        border-color: var(--txtColor);
        color: #fff;
      }
    }
  }
  .TrustRight {
    width: 58.33%;
    align-self: center;
    margin-left: auto;
    img {
      max-width: inherit;
    }
  }
  ${Media.lg} {
    .TrustLeft {
      margin-left: 0;
    }
  }
  ${Media.lg2} {
    .TrustLeft {
      width: 44%;
    }
    .TrustRight {
      width: 56%;
      display: flex;
      justify-content: center;
      img {
        margin-right: -10%;
      }
    }
  }
  ${Media.md} {
    .TrustLeft {
      width: 100%;
      text-align: center;
      order: 2;
      h2 {
        font-size: 45px;
      }
    }
    .TrustRight {
      width: 100%;
      order: 1;
      margin-bottom: 30px;
      img {
        max-width: 700px;
      }
    }
  }
  ${Media.xs} {
    padding: 100px 0;
    &:after {
      display: none;
    }
    .TrustLeft {
      h2 {
        font-size: 35px;
      }
      p {
        font-size: 18px;
        line-height: 1.5;
      }
    }
    .TrustRight {
      img {
        max-width: 130%;
      }
    }
  }
`;
