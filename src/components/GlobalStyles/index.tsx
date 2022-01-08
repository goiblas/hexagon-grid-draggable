import { Global, css } from "@emotion/react";

const styles = css`
  body {
    user-select: none;
    margin: 0;
  }
`;

const GlobalStyles = () => {
  return <Global styles={styles} />;
};

export default GlobalStyles;
