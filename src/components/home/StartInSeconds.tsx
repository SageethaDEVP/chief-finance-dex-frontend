import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import { AutoColumn } from '../Column';
import { StyledHomePageLink } from './styled';
import { CFC_TOKEN_ADDRESS } from '../../constants';
import startimg from '../../assets/images/startimg.png';
import Media from '../../theme/media-breackpoint';
import Gs from '../../theme/globalStyles';
import checkIco from '../../assets/images/check.png';
// OLD SCOMPONENTS
const Wrapper = styled.div`
  width: 100%;
  margin-top: 197px;
  display: flex;
  justify-content: center;
`;

const BodyWrapper = styled(AutoColumn)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function StartInSeconds() {
  return (
    <Start>
      <Gs.Container>
        <div className="s-left">
          <img src={startimg} alt="startimg" />
        </div>
        <div className="s-right">
          <h2>
            Start <br />
            in seconds
          </h2>
          <ul>
            <li>
              <img src={checkIco} alt="check" /> Connect your crypto wallet to start using in seconds.
            </li>
            <li>
              <img src={checkIco} alt="check" /> No registration needed.
            </li>
            <StyledHomePageLink to={`/swap?inputCurrency=ETH&outputCurrency=${CFC_TOKEN_ADDRESS}`}>
              Buy CFNC
            </StyledHomePageLink>
          </ul>
        </div>
      </Gs.Container>
    </Start>
  );
}

//  NEW SCOMPONENTS
const Start = styled.div`
  background: #e6f9f4;
  padding: 96px 0;
  .s-left {
    align-self: center;
  }
  .s-right {
    align-self: center;
    margin: 0 auto;
    width: 33.33%;
    h2 {
      font-size: 60px;
      margin: 0 0 35px;
      line-height: 1;
    }
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      font-size: 24px;
      color: var(--txtLight);
      list-style: none;
      margin-bottom: 30px;
      display: flex;
      img {
        width: 16px;
        height: 16px;
        margin: 8px 10px 0 0;
      }
    }
  }
  ${Media.lg2} {
    .s-left {
      width: 50%;
      img {
        max-width: 100%;
      }
    }
    .s-right {
      width: 40%;
      margin: 0 0 0 auto;
    }
  }
  ${Media.md} {
    .s-left {
      width: 100%;
      margin-bottom: 30px;
      text-align: center;
      img {
        max-width: 450px;
      }
    }
    .s-right {
      width: 100%;
      text-align: center;
      h2 {
        font-size: 45px;
        margin: 0 0 20px;
      }
      li {
        justify-content: center;
        margin: 0 0 20px;
      }
    }
  }
  ${Media.xs} {
    padding: 80px 0;
    &:after {
      display: none;
    }
    .s-right {
      h2 {
        font-size: 35px;
      }
      li {
        font-size: 18px;
        line-height: 1.5;
        margin-bottom: 15px;
        img {
          margin: 6px 5px 0 0;
        }
      }
    }
    .s-left {
      img {
        max-width: 100%;
      }
    }
  }
`;
