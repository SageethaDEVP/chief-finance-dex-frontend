import styled from 'styled-components';

export const CommonPageWrapper = styled.div`
  position: relative;
  width: 100vw;
  min-height: 100vh;
`;

export const CommonPageBody = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.bg6};
  padding: 50px 135px 70px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 50px 50px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 40px 20px;
  `};
`;

export const CommonHeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

export const Li = styled.li`
  color: ${({ theme }) => theme.newTheme.textSecondary};
`;

export const Ul = styled.ul`
  padding-left: 30px;
`;
