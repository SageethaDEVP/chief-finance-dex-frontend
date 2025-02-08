import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const SelectCurrency = styled.div`
  transition: 0.2s;
  display: flex;
  justify-content: center;
  flex: 1;
  width: 140px;

 button {
  padding: 10px;
  border: none;
  width: 140px;
  font-size: large;
  display: flex;
  flex-direction:column;
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  border-radius: 10px;
  cursor:pointer;
  :hover {
    background-color: ${({ theme }) => darken(0.03, theme.newTheme.bg2)};
  }
}

select {
  padding: 5px;
  border: none;
  width: 100%;
  font-size: large;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  :hover {
    background-color: ${({ theme }) => darken(0.03, theme.newTheme.bg2)};
  }
`;

export const SelectChain = styled.div`
  transition: 0.2s;
  display: flex;
  justify-content: center;
  flex: 1;
  width: 140px;

  button {
    padding: 10px;
    border: none;
    width: 140px;
    font-size: large;
    display: flex;
    flex-direction:row;
    align-items: center;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    border-radius: 10px;
    cursor:pointer;
    :hover {
      background-color: ${({ theme }) => darken(0.03, theme.newTheme.bg2)};
    }
  }
  
  select {
    padding: 5px;
    border: none;
    width: 100%;
    font-size: large;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    :hover {
      background-color: ${({ theme }) => darken(0.03, theme.newTheme.bg2)};
    }
`;
