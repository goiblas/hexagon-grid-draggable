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
import { measureMemory } from "vm";

const useGesture = createUseGesture([dragAction, wheelAction, pinchAction]);

const Card = styled(animated.div)`
  position: relative;
  will-change: transform;
  cursor: grab;
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
  > * {
    pointer-events: none;
  }
`;

const Container = styled.div`
  overflow: hidden;
  background: #ddd;
  height: 100vh;
`;

type Props = {
  enabled: boolean;
};

const Pinch: React.FC<Props> = ({ children, enabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setSize({ width, height });
    }
  }, [ref]);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  const onDrag = useCallback(
    ({ offset: [x, y] }) => {
      api.start({ x, y });
    },
    [api]
  );

  const onPinch = useCallback(
    ({ offset: [d] }) => {
      api.start({ scale: 1 + d / 50 });
    },
    [api]
  );

  const onWheel = useCallback(
    ({ delta: [, dy], memo = 1 }) => {
      memo = clamp(memo + dy / 100, 1, 4);
      api.start({ scale: memo });

      return memo;
    },
    [api]
  );

  useGesture(
    { onDrag, onPinch, onWheel },
    {
      target: ref,
      eventOptions: { passive: false },
      enabled,
      drag: {
        bounds: {
          left: Math.min(window.innerWidth - size.width, 0),
          right: 0,
          top: Math.min(window.innerHeight - size.height, 0),
          bottom: 0,
        },
        rubberband: true,
        enabled,
      },
      pinch: {},
      wheel: {},
    }
  );

  return (
    <Container>
      <Card ref={ref} style={{ x, y, scale }}>
        {children}
      </Card>
    </Container>
  );
};

export default Pinch;
