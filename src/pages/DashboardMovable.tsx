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

const useGesture = createUseGesture([dragAction, wheelAction, pinchAction]);

const Card = styled(animated.div)`
  position: relative;
  will-change: transform;
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
  // overflow: hidden;
  // background: #ddd;
  // height: 100vh;
`;

type Props = {
  enabled: boolean;
};

const INITIAL = {
  x: -500,
  y: -500,
  scale: 1,
}

const CENTER_SCREEN = [window.innerWidth/2, window.innerHeight / 2];

// @TODO: move width scroll
const Pinch: React.FC<Props> = ({ children, enabled }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ x, y, scale }, api] = useSpring(() => ({ ...INITIAL, config: { mass: 5, tension: 350, friction: 40 }  }));

  useGesture({
    onWheel: ({ offset: [x, y], metaKey, event }) => {
      const w = ref.current?.getBoundingClientRect().width;
      console.log(w);

      if(metaKey) {
        api.set({ x, y , scale: 1 + y / 50 });
      } else {
        api.set({ x, y });
      }
    }, 
    onWheelEnd: ( props) => {
      // console.log(props)
    }
  }, {
    target: document.body,
    wheel: {
      from: () => [x.get(), y.get()],
      // bounds: {bottom: 10, top: -1200, left: -1600, right: 10 }
    }
  })

  return (
    <Container>
      <Card ref={ref} style={{ x, y, scale }}>
        {children}
      </Card>
    </Container>
  );
};

export default Pinch;
