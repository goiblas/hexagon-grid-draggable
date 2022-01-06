import { Global, css } from "@emotion/react";

const styles = css`
  body {
    padding: 24px;
  }
`;

const GlobalStyles = () => {
  return <Global styles={styles} />;
};

export default GlobalStyles;
