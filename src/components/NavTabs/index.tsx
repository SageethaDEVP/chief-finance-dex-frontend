import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 10px 0;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.newTheme.primary2};
  font-size: 16px;
  font-weight: 600;

  &.${activeClassName} {
    color: ${({ theme }) => theme.newTheme.white};
    background-color: ${({ theme }) => theme.newTheme.primary1};
  }
`;

export const NavWrapper = styled.div`
  position: relative;
  display: flex;
  max-width: 436px;
  width: 100%;
  padding: 4px;
  margin-top: 2.5rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.newTheme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
  `}
`;

export default function NavTabs() {
  const location = useLocation();

  const isPoolsExchangePage = location.pathname.match(/pools$/);

  const isExchangeTabActive = location.pathname.match(/swap$/) || isPoolsExchangePage;
  const isLimitTabActive = location.pathname.match(/limit$/);
  const isPoolTabActive =
    location.pathname.match(/\/pool$/) ||
    location.pathname.includes('/add') ||
    location.pathname.includes('/remove') ||
    location.pathname.includes('pools:list');

  return (
    <NavWrapper>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => isExchangeTabActive}>
        Exchange
      </StyledNavLink>
      <StyledNavLink id={`limit-nav-link`} to={'/limit'} isActive={() => isLimitTabActive}>
        Limit
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => isPoolTabActive}>
        Pool
      </StyledNavLink>
    </NavWrapper>
  );
}
