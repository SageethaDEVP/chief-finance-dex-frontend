import React from 'react';
import styled from 'styled-components';
import { ExternalLink, TEXT } from '../../theme';
import { darken } from 'polished';
import ErrorIco from '../../assets/images/errorIco.png';
import MetaIcon from '../../assets/images/metamask.png';
const InfoCard = styled.div`
  outline: none;
  border: none;
  padding: 0;
  background-color: transparent;
  border-radius: 12px;
  cursor: pointer;
  width: 100% !important;
`;

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`;

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  background: var(--bgLight);
  display: flex;
  align-items: center;
  width: 100%;
  padding: 18px 20px 15px 0;
  border-radius: 10px;
  margin-bottom: 20px;
  min-height: 148px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ color }) => (color === '#E8831D' ? '#E8831D' : '#4196FC')};
    bottom: 0;
  }
  .WlImg {
    flex-grow: 1;
    text-align: center;
    &:after {
      content: '';
      width: calc(100% - 45px);
      height: 5px;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));
      display: table;
      margin: 0 auto;
      border-radius: 100%;
      opacity: 0.3;
      filter: blur(1px);
      margin-top: 15px;
      transition: all 0.3s ease-in-out;
    }
  }
  .WlTxt {
    text-align: right;
    width: 190px;
    h4 {
      font-weight: 600;
      margin: 0 0 10px;
    }
    p {
      font-size: 14px;
      color: var(--txtLight);
      margin: 0 0 6px;
      line-height: 1.3;
    }
  }
  &.lastChild {
    &:after {
      background: #3b99fb;
    }
    .WlTxt {
      h4 {
        color: #3b99fb;
      }
    }
  }
  &:hover {
    .WlImg {
      &:after {
        margin-top: 30px;
        transform: scaleX(0.8);
      }
    }
  }
  &.sm {
    height: 64px;
    min-height: 30px;
    &:after {
      display: none;
    }
    .WlTxt {
      flex-grow: 1;
      h4 {
        margin: 0;
      }
    }
    .WlImg {
      width: 70px;
      flex-grow: inherit;
      margin-left: 12px;
      img {
        width: 38px;
      }
      &:after {
        margin-top: 5px;
        transform: scaleX(1);
        width: 60px;
        height: 3px;
      }
    }
  }
`;

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : ({ theme }) => theme.text1)};
  font-size: 1rem;
  font-weight: 500;
`;

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.newTheme.white};
  border-radius: 50%;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '20px')};
    width: ${({ size }) => (size ? size + 'px' : '20px')};
  }
`;

const DescriptionTextWrapper = styled.div`
  width: 80%;
  margin-top: 12px;
`;

export default function Option({
  link = null,
  size,
  onClick = null,
  color,
  header,
  icon,
  id,
  description,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  icon: string;
  active?: boolean;
  id: string;
  description?: string[];
}) {
  const content = (
    <>
      <OptionCardClickable id={id} onClick={onClick} color={color}>
        <div className="WlImg">
          <img src={icon} width={68} alt={'Icon'} />
        </div>
        <div className="WlTxt">
          <h4 style={{ color: color }}>{header}</h4>

          {description !== undefined && description.map((value, index) => <p key={index}>{value}</p>)}
        </div>
      </OptionCardClickable>
    </>
  );
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>;
  }

  return content;
}
