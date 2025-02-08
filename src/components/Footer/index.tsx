import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';
import logo2 from '../../assets/images/logo2.png';
import twitter from '../../assets/images/twitter.png';
import discord from '../../assets/images/discord.png';
import telegram from '../../assets/images/telegram.png';
import Tooltip from '../Tooltip';
import { Link } from 'react-router-dom';
interface SpacedBlockProps {
  marginLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
}

interface IconLinProps {
  text: string;
  url: string;
  icon: typeof twitter;
}

// OLD SCOMPONENTS
const FooterFrame = styled.div`
  position: relative;
  width: 100vw;
  display: flex;
  z-index: 2;
  flex-direction: column;
  background-color: ${({ theme }) => theme.newTheme.primary2};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 2.5rem;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
`;

const TopSection = styled.div`
  padding: 40px 8.5rem 1.5rem;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.newTheme.border};
`;

const SpacedBlock = styled.div<SpacedBlockProps>`
  margin-left: ${({ marginLeft }) => marginLeft && marginLeft};
  margin-top: ${({ marginTop }) => marginTop && marginTop};
  margin-right: ${({ marginRight }) => marginRight && marginRight};
  margin-bottom: ${({ marginBottom }) => marginBottom && marginBottom};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  text-decoration: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const ExternalLink = styled.a`
  text-decoration: none;
  :hover {
    opacity: 0.7;
  }
`;

const links: IconLinProps[] = [
  // { text: 'Facebook', url: '/', icon: FacebookIcon },
  {
    text: 'Twitter',
    url: 'https://twitter.com/chieffinan82039?s=11&t=bD2REFNYmq5tVkqeo75TMQ',
    icon: twitter,
  },
  { text: 'Discord', url: 'https://discord.com/invite/Kk4hSNxnjN', icon: discord },
  { text: 'Telegram', url: 'https://t.me/+BOy8uCAeY6RhOWJh', icon: telegram },
];

// NEW SCOMPONENTS

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const FooterMain = styled.div`
  background: #1c202c;
  color: #fff;
  padding: 40px 0;
  ${Gs.Container} {
    justify-content: space-between;
  }
  .fooLeft {
    width: 347px;
    img {
      width: 230px;
    }
    p {
      font-size: 18px;
      line-height: 1.4;
      margin: 20px 0 0;
    }
  }
  .fooLink {
    h4 {
      font-size: 24px;
      margin: 0 0 24px 0;
      font-weight: 600;
      &:after {
        content: '';
        width: 30px;
        height: 2px;
        background: var(--primary);
        display: table;
        margin: 6px 0 0 3px;
      }
    }
    a {
      display: table;
      font-size: 18px;
      margin: 0 0 20px 0;
      &:hover {
        color: var(--primary);
      }
      img {
        margin: 4px 4px 0 0;
      }
    }
  }
  ${Media.md} {
    ${Gs.Container} {
      max-width: 100%;
    }
  }
  ${Media.sm} {
    .fooLeft {
      width: 100%;
      order: 3;
      margin-top: 30px;
    }
    .fooLink {
      order: 1;
    }
  }
`;

export default function Footer() {
  return (
    <FooterFrame>
      <FooterMain>
        <Gs.Container>
          <div className="fooLeft">
            <Link to="/">
              <img src={logo2} />
            </Link>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna. aliqua.{' '}
            </p>
            <p>© Copyright 2023 | All Rights Reserved.</p>
          </div>
          <div className="fooLink">
            <h4>Links</h4>
            <Link style={{ color: 'white' }} to="/service">
              Terms of Services
            </Link>
            <a style={{ color: 'white' }} href="mailto:bidelity@yahoo.com">
              Support
            </a>
            <Link style={{ color: 'white' }} to="/faq">
              FAQ
            </Link>
          </div>
          <div className="fooLink">
            <h4>Contact us</h4>
            {links.map(({ text, icon, url }, index) => (
              <a style={{ color: 'white' }} key={index} href={url}>
                <img style={{ verticalAlign: 'top' }} src={icon} alt={text} /> {text}
              </a>
            ))}
          </div>
        </Gs.Container>
      </FooterMain>
    </FooterFrame>
  );
}

const IconLink = ({ text, icon, url }: IconLinProps) => {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <SpacedBlock>
      <Tooltip show={show} text={text} placement="bottom-start">
        <ExternalLink target="_blank" href={url} onMouseEnter={open} onMouseLeave={close}>
          <img width="34px" height="34px" src={icon} alt={text} />
        </ExternalLink>
      </Tooltip>
    </SpacedBlock>
  );
};
