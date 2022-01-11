import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import styled from "@emotion/styled";

const useGesture = createUseGesture([dragAction, pinchAction]);

const Card = styled(animated.div)`
  position: relative;
  will-change: transform;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  background: #fff;
  padding: 150px 50px;
  box-sizing: border-box;
  width: 2218px;
  height: 1768px;
  > * {
    pointer-events: none;
  }
`;

const Container = styled.div`
  overflow: hidden;
  background: #ddd;
`;

type Props = {
  actived: boolean;
};

const boardHeight = 1768;
const boardWidth = 2218;
const heightAdded = (window.innerHeight - boardHeight) * 0.5;
const widthAdded = (window.innerWidth - boardWidth) * 0.5;

const Pinch: React.FC<Props> = ({ children, actived }) => {
  useEffect(() => {
    const handler = (e: any) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: widthAdded,
    y: heightAdded,
    scale: 1,
  }));
  const ref = React.useRef<HTMLDivElement>(null);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s],
        memo,
      }) => {
        if (!ref.current) return;

        if (first) {
          const { width, height, x, y } = ref.current.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - ms * memo[2];
        const y = memo[1] - ms * memo[3];
        api.start({ scale: s, x, y });
        return memo;
      },
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        bounds: {
          left: -750,
          right: 0,
          top: 0,
          bottom: Math.max(0, boardHeight - window.innerHeight),
        },
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 0.25, max: 2 },
        rubberband: true,
        enabled: actived,
      },
    }
  );

  return (
    <Container>
      <Card ref={ref} style={style}>
        {children}
      </Card>
    </Container>
  );
};

export default Pinch;
