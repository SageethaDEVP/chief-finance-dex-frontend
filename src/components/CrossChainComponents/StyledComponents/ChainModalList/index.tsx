import styled from 'styled-components';

interface ListsProps {
  disabled?: boolean;
}

export const ChainList = styled.div`
  list-style-type: none;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;
  row-gap: 1px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
`;

export const Lists = styled.div<ListsProps>`
  // display: flex;
  // width: 100%;
  // border-radius: 4px;
  // // border: 1px solid #ccc;
  // flex-direction: row;
  // flex-wrap: wrap;
  // align-content: center;
  // column-gap: 10px;
  // justify-content: flex-start;
  // align-items: center;
  // &:hover {
  //   background: #f0f0f0;
  // }

  // img {
  //   margin-right: 10px;
  //   padding: 8px;
  // }

  // Ensure that pointer-events are not allowed when disabled
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  // Add styling for the disabled state
  ${(props) => props.disabled && 'opacity: 0.5;'}
`;
