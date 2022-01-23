import { useRef } from "react";
import { createUseGesture, pinchAction, dragAction, wheelAction } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import styled from "@emotion/styled";

const useGesture = createUseGesture([pinchAction, dragAction, wheelAction]);

function dampen(val: number, [min, max]: [number, number]) {
    if (val > max) {
      const extra = val - max;
      const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
      return max + dampenedExtra * 2;
    }
    
    if (val < min) {
      const extra = val - min;
      const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
      return min + dampenedExtra * 2;
    }
    
    return val;
}

const Container = styled.div`
    overflow: hidden;
    position: relative;
    width: 100vw;
    height: 100vh;
`;

const Card = styled(motion.div)`
    display: block;
    position: relative;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    width: min-content;
     > * {
         pointer-events: none;
     }
`;

interface State {
    x: number,
    y: number,
    scale: number
}

interface Props {
    state: State,
    onChangeState: (s: State) => void,
}
const MobileCanvas: React.FC<Props> = ({  state, onChangeState, children }) => {
    const x = useMotionValue(state.x);
    const y = useMotionValue(state.y);
    const scale = useMotionValue(state.scale);

    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const adjustContent = () => {
        if(!contentRef.current || !containerRef.current) return;

        const newCrop = { x: x.get(), y: y.get(), scale: scale.get() };

        const contentBounds = contentRef.current.getBoundingClientRect();
        const containerBounds = containerRef.current.getBoundingClientRect();

        const originalWidth = contentRef.current.clientWidth;
        const widthOverhang = (contentBounds.width - originalWidth) / 2;

        const originalHeight = contentRef.current.clientHeight;
        const heightOverhang = (contentBounds.height - originalHeight) / 2;

        if(contentBounds.left > 0) {
            newCrop.x = widthOverhang;
        } else if (contentBounds.right < containerBounds.right) {
            newCrop.x = -(contentBounds.width - containerBounds.width) + widthOverhang;
        }

        if(contentBounds.top > containerBounds.top) {
            newCrop.y = heightOverhang
        } else if ( contentBounds.bottom < containerBounds.bottom) {
            newCrop.y = -(contentBounds.height - containerBounds.height) + heightOverhang;
        }

        animate(x, newCrop.x, {
            type: "tween",
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
          });
          animate(y, newCrop.y, {
            type: "tween",
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
        });
        
        onChangeState(newCrop);
    }

    const moveContent = (dx:number, dy: number) => {
        if(!contentRef.current || !containerRef.current) return;
        x.stop();
        y.stop();


        const contentBounds = contentRef.current.getBoundingClientRect();
        const containerBounds = containerRef.current.getBoundingClientRect();

        const originalWidth = contentRef.current.clientWidth;
        const widthOverhang = (contentBounds.width - originalWidth) / 2;

        const originalHeight = contentRef.current.clientHeight;
        const heightOverhang = (contentBounds.height - originalHeight) / 2;

        const maxX = widthOverhang;
        const minX = -(contentBounds.width - containerBounds.width) + widthOverhang;
        const maxY = heightOverhang;
        const minY = -(contentBounds.height - containerBounds.height) + heightOverhang;

        x.set(dampen(dx, [minX, maxX]));
        y.set(dampen(dy, [minY, maxY]));
    }

    useGesture({
        onDrag: ({ offset: [dx, dy]}) => {
            moveContent(dx, dy);
        },
        onWheel: ({ offset: [dx, dy]}) => {
            moveContent(dx, dy);
        },
        onPinch: ({ offset: [d], memo, origin: [originX, originY] }) => {
            memo ??= {
                bounds: contentRef.current?.getBoundingClientRect(),
                crop: { x: x.get(), y: y.get(), scale: scale.get() },
            }

            const transformOriginX = memo.bounds.x + memo.bounds.width / 2;
            const transformOriginY = memo.bounds.y + memo.bounds.height / 2;

            const displacementX = (transformOriginX - originX) / memo.crop.scale;
            const displacementY = (transformOriginY - originY) / memo.crop.scale;

            const initialOffsetDistance = (memo.crop.scale - 1) * 50;
            const movementDistance = d - initialOffsetDistance;

            scale.set(1 + d / 200);
            x.set(memo.crop.x + (displacementX * movementDistance) / 200);
            y.set(memo.crop.y + (displacementY * movementDistance) / 200);

            return  memo;
        },
        onDragEnd: adjustContent,
        onPinchEnd: adjustContent,
        onWheelEnd: adjustContent
    }, {
        target: contentRef,
        eventOptions: { passive: false},
        pinch: {
            scaleBounds: {
                min: 1,
                max: 200
            }
        },
        wheel: {
            from: () => [x.get(), y.get()]
        },
        drag: {
            from: () => [x.get(), y.get()],
            enabled: true
        }
    })

    return (
        <Container ref={containerRef}>
            <Card
                ref={contentRef}
                style={{
                    x: x,
                    y: y,
                    scale: scale,
              }}>
                {children}
            </Card>
        </Container>
    )
}

export default MobileCanvas

