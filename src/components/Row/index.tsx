import styled from "@emotion/styled";

type Props = {
  odd?: boolean;
};

const Row = styled.div<Props>`
  display: flex;
  gap: 2px;
  margin-top: -98px;
  padding-left: ${(props) => (props.odd ? "100px" : 0)};
`;

export default Row;
