import React from 'react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

const shouldForwardProp = (prop) => {
  const blockedProps = ['isDesktop', 'isMobileWithCard', 'isMobile', 'isTablet'];
  if (blockedProps.includes(prop)) return false;
  if (prop.startsWith('$')) return false;
  return isPropValid(prop);
};

export const StyledComponentsProvider = ({ children }) => (
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    {children}
  </StyleSheetManager>
);
