import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import Media from './../theme/media-breackpoint';

const Gs = {};
Gs.GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0; 
    font-family: 'Barlow', sans-serif;
    background-color:#fff; 
    color:var(--txtColor); 
    font-size: 16px;
    & > iframe {pointer-events: none;}
  }  
  html {
    --scroll-behavior: smooth;
    scroll-behavior: smooth;
  }
`;

Gs.MainBox = styled.div``;
Gs.Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: 0px 15px;
  display: flex;
  flex-flow: wrap;
  align-items: flex-start;
  &.hmFix01 {
    position: relative;
    z-index: 3;
  }
  ${Media.lg} {
    max-width: 1200px;
  }
  ${Media.lg2} {
    max-width: 991px;
  }
  ${Media.md} {
    max-width: 640px;
  }
  ${Media.sm} {
    max-width: 640px;
    width: 100%;
  }
`;
Gs.BtnSm = styled.a`
  background: var(--primary);
  ${'' /* padding: 0 26px; */}
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
  img {
    margin-right: 6px;
  }
  &.lg {
    width: 100%;
    & + & {
      margin-top: 20px;
    }
  }
  &.sm {
    font-size: 16px;
    padding: 7px 14px;
    height: auto;
    letter-spacing: -0.01em;
    min-height: inherit;
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
  &.error {
    background: var(--txtRed);
    &:hover {
      filter: brightness(0.8);
    }
  }
  &.disabled {
    background: var(--txtLight2);
    cursor: no-drop;
  }
  ${Media.lg2} {
    ${'' /* padding: 0 20px; */}
    padding: 10px 20px;
  }
  ${Media.md} {
  }
`;
Gs.PopupMain = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;
Gs.Popup = styled.div`
  box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.04);
  background: #fff;
  border-radius: 30px;
  position: relative;
  top: 0;
  width: 412px;
  padding: 30px 30px 23px;
  overflow: hidden;
  align-self: center;
  max-width: calc(100% - 30px);
  h3 {
    display: flex;
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    align-items: center;
    margin-bottom: 30px;
    justify-content: space-between;
    a.arrow {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a.close {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      background: var(--bgLight2);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        transition: all 0.3s ease-in-out;
      }
      &:hover {
        background: var(--txtColor);
        img {
          filter: brightness(100);
        }
      }
    }
  }
  &.hasBorderBtm {
    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: var(--primary);
    }
  }
  ${Media.xs} {
    padding: 15px 15px 13px;
    border-radius: 15px;
    h3 {
      margin-bottom: 15px;
      font-size: 22px;
    }
  }
`;
Gs.OverLay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: #cfe6e9;
  opacity: 0.6;
`;
Gs.Percent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;
  a {
    color: var(--txtLight2);
    font-weight: 600;
    border-radius: 5px;
    border: 1px solid #baece1;
    text-align: center;
    padding: 4px 0;
    &:hover {
      border: 1px solid var(--primary);
    }
    &.active {
      color: #fff;
      background: var(--primary);
      border: 1px solid var(--primary);
      box-shadow: 0px 0px 7px rgba(27, 202, 161, 0.52);
    }
  }
  .inputBx {
    width: 88px;
    display: flex;
    align-items: center;
    input {
      width: 75px;
      border: 1px solid #baece1;
      height: 30px;
      border-radius: 5px;
      padding: 0 10px;
      text-align: center;
      font-size: 16px;
      font-family: var(--font);
      font-weight: 600;
      color: var(--txtLight2);
    }
    span {
      color: var(--txtLight2);
      margin-left: 2px;
    }
  }
`;
export default Gs;
