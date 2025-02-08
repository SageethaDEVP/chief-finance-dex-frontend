import React, { useMemo } from 'react';
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme,
} from 'styled-components';
import { Text, TextProps } from 'rebass';
import { Colors, ColorsNewTheme } from './styled';

export * from './components';

const MEDIA_WIDTHS = {
  upToExtraSmall: 540,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `;
    return accumulator;
  },
  {}
) as any;

const white = '#FFFFFF';
const black = '#000000';

export function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#000000',
    text2: '#565A69',
    text3: '#888D9B',
    text4: '#C3C5CB',
    text5: '#EDEEF2',

    // backgrounds / greys
    bg1: '#fafafa',
    bg2: '#ededed',
    bg3: '#e6e6e8',
    bg4: '#CED0D9',
    bg5: '#888D9B',

    //specialty colors
    modalBG: 'rgba(0,0,0,0.3)',
    advancedBG: 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: '#2792d6',
    primary2: '#3099db',
    primary3: '#389fe0',
    primary4: '#54afe8',
    primary5: '#5fb3e8',

    // color text
    primaryText1: '#000',

    // secondary colors
    secondary1: '#3B6A9C',
    secondary2: '#F6DDE8',
    secondary3: '#FDEAF1',

    // other
    red1: '#FD4040',
    red2: '#F82D3A',
    red3: '#D60000',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#3B6A9C',

    // will replace the old one once the app is finished.
    newTheme: {
      white,
      black,

      textPrimary: '#1A203F',
      textSecondary: '#8E8EA9',
      text1: '#72747A',
      text2: '#88898E',
      text3: '#FBFBFB',
      text4: '#1F2937',
      text5: '#8192AA',
      text6: '#F5841F',

      bg1: '#F5F5F5',
      bg2: '#F3F4F7',
      bg3: '#323540',
      bg4: '#EFF0F5',
      bg5: '#F6F6F6',
      bg6: '#EFF0F5',
      bg7: '#F4F5FA',
      bg8: '#F5F7FF',
      bg9: '#EAFAF6',
      bg10: '#FFF7EB',
      bg11: '#F9F9FB',

      modalBG: 'rgba(28,32,44,0.14)',

      border: '#2E323E',
      border2: '#414553',
      border3: '#EAEAEF',
      border4: '#C0C0CF',

      primary1: '#1BC19A',
      primary2: '#1C202C',

      error: '#E73449',
      warning: '#F2994A',
      blue: '#335BE9',
      teal: '#C7F0E6',
    },
  };
}

export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeObject = useMemo(() => theme(), []);

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

// will replace the TextWrapper once the app is finished.
const TextWrapperNew = styled(Text)<{ color: keyof ColorsNewTheme }>`
  color: ${({ color, theme }) => (theme.newTheme as any)[color]};
`;

// will replace the TYPE once the app is finished.
export const TEXT = {
  white(props: TextProps) {
    return <TextWrapperNew color="white" {...props} />;
  },
  white600(props: TextProps) {
    return <TextWrapperNew fontWeight={600} color="white" fontSize={14} {...props} />;
  },
  primaryText(props: TextProps) {
    return <TextWrapperNew color="primary2" {...props} />;
  },
  secondary(props: TextProps) {
    return <TextWrapperNew color="textSecondary" {...props} />;
  },
  primary(props: TextProps) {
    return <TextWrapperNew color="textPrimary" {...props} />;
  },
  text4(props: TextProps) {
    return <TextWrapperNew color="text4" {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapperNew fontWeight={500} color="textSecondary" fontSize={10} {...props} />;
  },
  big(props: TextProps) {
    return <TextWrapperNew fontWeight={800} color="white" fontSize={20} {...props} />;
  },
  footerText(props: TextProps) {
    return <TextWrapperNew fontWeight={400} color="text2" fontSize={14} {...props} />;
  },
  footerTextSmall(props: TextProps) {
    return <TextWrapperNew fontWeight={300} color="text2" fontSize={12} {...props} />;
  },
  default(props: TextProps) {
    return <TextWrapperNew {...props} />;
  },
};

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />;
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />;
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />;
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />;
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />;
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />;
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />;
  },
};

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  //font-display: fallback;
}

html,
body {
  margin: 0;
  padding: 0;
}

a {
  color: #3B6A9C;
}

* {
  box-sizing: border-box;
}

button {  
  user-select: none;
}

html {
  font-size: 18px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
}
`;

export const ThemedGlobalStyle = createGlobalStyle`
body {
  min-height: 100vh;
}
`;
