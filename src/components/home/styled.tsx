import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';
import Media from '../../theme/media-breackpoint';

export const StyledHomePageLink = styled(Link)`
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
