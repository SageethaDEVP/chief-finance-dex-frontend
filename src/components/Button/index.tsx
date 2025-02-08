import React from 'react';
import styled from 'styled-components';
import { darken, lighten } from 'polished';

import { RowBetween } from '../Row';
import { ChevronDown } from 'react-feather';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components';
import Media from 'theme/media-breackpoint';

export const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.newTheme.primary1};
  color: ${({ theme }) => theme.newTheme.white};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.newTheme.primary1)};
  }
`;

const Base = styled(RebassButton)<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 20px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: 0.25s;

  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`;

export const NewButtonPrimary = styled(Base)`
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
  &:active {
    background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
    color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
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
export const DisableButton = styled(Base)`
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
  &:active {
    background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
    color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
  &.lg {
    width: 100%;
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
export const BtnSm = styled.a`
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
export const ButtonPrimary = styled(Base)`
  background: var(--primary);
  color: #fff;
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
  &:active {
    background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
    color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
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
  }
`;
// export const ButtonPrimary = styled(Base)`
//   background-color: ${({ theme }) => theme.newTheme.primary1};
//   color: ${({ theme }) => theme.newTheme.white};
//   &:focus {
//     background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
//   }
//   &:hover {
//     background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
//   }
//   &:active {
//     background-color: ${({ theme }) => darken(0.05, theme.newTheme.primary1)};
//   }
//   &:disabled {
//     background-color: ${({ theme, altDisabledStyle, disabled }) =>
//       altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
//     color: ${({ theme, altDisabledStyle, disabled }) =>
//       altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
//     cursor: auto;
//     box-shadow: none;
//     border: 1px solid transparent;
//     outline: none;
//     opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
//   }

// `;

export const ButtonPrimarySmallerText = styled(ButtonPrimary)`
  padding: 18px 4px;
  font-size: 16px;
`;

export const ButtonSecondary = styled(Base)`
  background: var(--primary);
  padding: 10px 34px 14px;
  margin: 0 auto;
  min-height: 45px;
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
  text-transform: capitalize;

  &:hover {
    background: var(--txtColor);
  }
  &:disabled {
    background: var(--txtLight2);
    cursor: no-drop;
    opacity: 50%;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonErrorStyle = styled(Base)`
  background: var(--txtRed);
  border: 1px solid ${({ theme }) => theme.red1};
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
  text-transform: capitalize;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    filter: brightness(0.8);
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`;

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    // return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />;
    return <NewButtonPrimary style={{ fontSize: '14px' }} {...rest} altDisabledStyle={altDisabledStyle} />;
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
    // return <NewButtonPrimary className="lg" {...rest} />;
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  );
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  );
}
