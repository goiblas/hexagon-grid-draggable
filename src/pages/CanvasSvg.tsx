import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  createUseGesture,
  dragAction,
  pinchAction,
  useWheel,
  useDrag,
  wheelAction,
} from "@use-gesture/react";
import styled from "@emotion/styled";
import clamp from "lodash-es/clamp";

const Controls = styled.div`
  display: flex;
  gap: 12px;
  position: fixed;
  bottom: 16px;
  right: 16px;
`;

const Button = styled.button`
  padding: 0;
  border: 0;
  background: #ddd;
  border-radius: 100%;
  border: 2px solid #fff;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.12);
`;
const useGesture = createUseGesture([dragAction, wheelAction, pinchAction]);

const Svg = styled.svg`
  cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxNiAxNicgd2lkdGg9JzIwcHgnIGhlaWdodD0nMjBweCcgPjxnIHRyYW5zZm9ybT0ncm90YXRlKDAgOCw4KSc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTEgMTQuNlYzLjRsOC4yIDguMkg0bC0zIDN6Jy8+IDxwYXRoIGZpbGw9JyMyMzFGMjAnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZD0nTTAgMTdWMWwxMS42IDExLjZINC40TDAgMTd6bTQtNS40aDUuMkwxIDMuNHYxMS4ybDMtM3onIGNsaXAtcnVsZT0nZXZlbm9kZCcvPjwvZz48L3N2Zz4=")
      0 0,
    auto;
  width: 100vw;
  height: 100vh;
  display: block;
`;

const Card = styled(animated.div)`
  position: relative;
  will-change: transform;
  /* cursor: grab; */
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  background: #fff;
  flex-shrink: 0;
  justify-content: center;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  padding: 150px 50px;
  width: 2400px;
  height: 1400px;
`;

const Container = styled.div`
  /* overflow: hidden;
  background: #ddd; */
`;

type Props = {
  enabled: boolean;
};

const Pinch: React.FC<Props> = ({ children, enabled }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [viewY, setViewY] = useState(0);
  const [viewX, setViewX] = useState(0);
  const [zoom, setZoom] = useState(1);

  const onWheel = useCallback(({ delta: [dx, dy] }) => {
    setViewX((cx) => clamp(cx + dx, -2000, 2000));
    setViewY((cy) => clamp(cy + dy, -2000, 2000));
  }, []);

  useGesture(
    { onWheel },
    {
      target: ref,
      eventOptions: { passive: false },
      enabled,
      wheel: {},
    }
  );

  const zoomIn = () => {
    setZoom((z) => z * 0.9);
  };
  const zoomOut = () => {
    setZoom((z) => z * 1.1);
  };

  return (
    <>
      <Svg
        viewBox={`${viewX} ${viewY} ${window.innerWidth * zoom} ${
          window.innerHeight * zoom
        }`}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject
          x="0"
          y="0"
          //   style={{ width: window.innerWidth, height: window.innerHeight }}
          style={{ width: 2400, height: 1700 }}
        >
          <Container>
            <Card>{children}</Card>
          </Container>
        </foreignObject>
      </Svg>

      <Controls>
        <Button onClick={zoomOut}>-</Button>
        <Button onClick={zoomIn}>+</Button>
      </Controls>
    </>
  );
};

export default Pinch;
