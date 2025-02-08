import React, { useRef, useState } from 'react';
import GlobalIcon from '../../assets/svg-bid/global.svg';
import styled from 'styled-components';
import { darken } from 'polished';
import { TEXT } from '../../theme';
import { useLanguage } from '../../state/application/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state';
import { changeLanguage } from '../../i18n';
import { changeLanguageAction } from '../../state/localization/actions';
import EnglishFlagIcon from '../../assets/svg-bid/english-flag.svg';
import RussianFlagIcon from '../../assets/svg-bid/russian-flag.svg';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import Media from 'theme/media-breackpoint';
import globe from '../../assets/images/globe.png';
import down from '../../assets/images/down.png';

const Wrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;

  background-color: ${({ theme }) => theme.newTheme.bg3};
  border-radius: 8px;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.03, theme.newTheme.bg3)};
  }
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 146px;
  border: 1px solid ${({ theme }) => theme.newTheme.border2};
  border-radius: 12px;
  overflow: hidden;
`;

const DropdownItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${({ theme, active }) => (active ? theme.newTheme.border2 : theme.newTheme.bg3)};
  padding: 16px 40px 16px 16px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.newTheme.border2};
  }

  :first-child {
    border-bottom: 1px solid ${({ theme }) => theme.newTheme.border2};
  }

  img {
    width: 25px;
    height: 18px;
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
const ENGLISH_LANGUAGE = 'en';
const RUSSIAN_LANGUAGE = 'ru';

export default function LanguageSwitcher() {
  const node = useRef<HTMLDivElement>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const language = useLanguage();
  const dispatch = useDispatch<AppDispatch>();

  const setLanguage = (newLanguage: 'en' | 'ru') => {
    changeLanguage(newLanguage);
    dispatch(changeLanguageAction(newLanguage));
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => setIsDropdownVisible((prev) => !prev);

  useOnClickOutside(node, isDropdownVisible ? toggleDropdown : undefined);

  return (
    <Wrapper ref={node as any}>
      <Button2 onClick={toggleDropdown}>
        <img src={globe} alt="language" />
        <span>Eng</span>
        <img className="arrow" src={down} alt="down" />
      </Button2>
      {isDropdownVisible && (
        <DropdownWrapper>
          <DropdownItem active={language === ENGLISH_LANGUAGE} onClick={() => setLanguage(ENGLISH_LANGUAGE)}>
            <img src={EnglishFlagIcon} alt="en" />
            <TEXT.default fontSize={14} fontWeight={500} color="text3" marginLeft={16}>
              English
            </TEXT.default>
          </DropdownItem>
          <DropdownItem active={language === RUSSIAN_LANGUAGE} onClick={() => setLanguage(RUSSIAN_LANGUAGE)}>
            <img src={RussianFlagIcon} alt="ru" />
            <TEXT.default fontSize={14} fontWeight={500} color="text3" marginLeft={16}>
              Russian
            </TEXT.default>
          </DropdownItem>
        </DropdownWrapper>
      )}
    </Wrapper>
  );
}
