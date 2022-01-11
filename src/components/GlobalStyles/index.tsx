import { Global, css } from "@emotion/react";

const styles = css`
  body {
    user-select: none;
    margin: 0;
    overflow: hidden;
  }
`;

const GlobalStyles = () => {
  return <Global styles={styles} />;
};

export default GlobalStyles;
