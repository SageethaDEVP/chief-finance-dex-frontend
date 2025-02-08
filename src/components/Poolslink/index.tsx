import React from 'react';
import { Link } from 'react-router-dom';
import { TEXT } from '../../theme';
import styled from 'styled-components';

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px;
`;

const LinkText = styled.div`
  display: inline;
  cursor: pointer;
`;

const PoolsLink = ({ to }: { to: string }) => {
  return (
    <TextWrapper>
      <LinkText as={Link} to={to} style={{ textDecoration: 'none' }}>
        <TEXT.default fontWeight={600} fontSize={14} color="primary1" lineHeight="23.1px">
          See all available pools
        </TEXT.default>
      </LinkText>
    </TextWrapper>
  );
};

export default PoolsLink;
