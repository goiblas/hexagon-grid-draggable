import React, { useRef } from "react";
import { useDrag as useDragProvider } from "./DragProvider";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const styles = {
  width: 200,
  height: 200,
  cursor: "pointer",
  position: "relative",
  backgroundImage: "url(https://source.unsplash.com/random/150x150)",
  backgroundSize: "cover",
  clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%",
} as React.CSSProperties;

const Drag: React.FC<{ id: string }> = ({ children, id }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { onDrag, onDragEnd } = useDragProvider();
  const [{ x, y, zIndex }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    zIndex: 1,
  }));

  useDrag(
    ({ down, movement: [mx, my], active, xy: [x, y] }) => {
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        zIndex: down ? 3 : 1,
        immediate: (key: string) => down || key === "zIndex",
      });

      if (!ref.current) return;

      if (active) {
        onDrag({ x, y, ref: ref.current });
      } else {
        onDragEnd({ x, y, ref: ref.current }, id);
      }
    },
    {
      target: ref,
      eventOptions: { passive: false },
    }
  );

  return (
    <>
      <animated.div ref={ref} style={{ x, y, zIndex, ...styles }}>
        {children}
      </animated.div>
    </>
  );
};

export default Drag;
