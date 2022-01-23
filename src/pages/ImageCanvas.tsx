import { useRef } from "react";
import { createUseGesture, pinchAction, dragAction } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import styled from "@emotion/styled";

const useGesture = createUseGesture([pinchAction, dragAction]);

function dampen(val: number, [min, max]: [number, number]) {
    if (val > max) {
      let extra = val - max;
      let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
      return max + dampenedExtra * 2;
    } else if (val < min) {
      let extra = val - min;
      let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
      return min + dampenedExtra * 2;
    } else {
      return val;
    }
  }

const Container = styled.div`
    overflow: hidden;
    position: relative;
    width: 80vw;
    aspect-ratio: 1 / 1;
    margin: 24px auto;
    outline: 2px solid #333;
`;

const Image = styled(motion.img)`
    display: block;
    position: relative;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
`;

interface State {
    x: number,
    y: number,
    scale: number
}

interface Props {
    src: string;
    state: State,
    onChangeState: (s: State) => void,
}
const ImageCanvas: React.FC<Props> = ({ src, state, onChangeState }) => {
    const x = useMotionValue(state.x);
    const y = useMotionValue(state.y);
    const scale = useMotionValue(state.scale);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const adjustImage = () => {
        if(!imageRef.current || !containerRef.current) return;

        const newCrop = { x: x.get(), y: y.get(), scale: scale.get() };

        const imageBounds = imageRef.current.getBoundingClientRect();
        const containerBounds = containerRef.current.getBoundingClientRect();
        console.log(imageBounds.height, containerBounds.height);
        console.log(imageBounds);

        const originalWidth = imageRef.current.clientWidth;
        const widthOverhang = (imageBounds.width - originalWidth) / 2;

        const originalHeight = imageRef.current.clientHeight;
        const heightOverhang = (imageBounds.height - originalHeight) / 2;

        if(imageBounds.left > 0) {
            newCrop.x = widthOverhang;
        } else if (imageBounds.right < containerBounds.right) {
            newCrop.x = -(imageBounds.width - containerBounds.width) + widthOverhang;
        }

        if(imageBounds.top > containerBounds.top) {
            newCrop.y = heightOverhang
        } else if ( imageBounds.bottom < containerBounds.bottom) {
            newCrop.y = -(imageBounds.height - containerBounds.height) + heightOverhang;
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

    useGesture({
        onDrag: ({ offset: [dx, dy]}) => {
            if(!imageRef.current || !containerRef.current) return;
            x.stop();
            y.stop();

            const imageBounds = imageRef.current.getBoundingClientRect();
            const containerBounds = containerRef.current.getBoundingClientRect();
    
            const originalWidth = imageRef.current.clientWidth;
            const widthOverhang = (imageBounds.width - originalWidth) / 2;
    
            const originalHeight = imageRef.current.clientHeight;
            const heightOverhang = (imageBounds.height - originalHeight) / 2;

            const maxX = widthOverhang;
            const minX = -(imageBounds.width - containerBounds.width) + widthOverhang;
            const maxY = heightOverhang;
            const minY = -(imageBounds.height - containerBounds.height) + heightOverhang;

            x.set(dampen(dx, [minX, maxX]));
            y.set(dampen(dy, [minY, maxY]));
        },
        onPinch: ({ offset: [d], memo, origin: [originX, originY] }) => {
            memo ??= {
                bounds: imageRef.current?.getBoundingClientRect(),
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
        onDragEnd: adjustImage,
        onPinchEnd: adjustImage
    }, {
        target: imageRef,
        eventOptions: { passive: false},
        pinch: {
            scaleBounds: {
                min: 1,
                max: 200
            }
        },
        drag: {
            from: () => [x.get(), y.get()]
        }
    })

    return (
        <Container ref={containerRef}>
            {/* <Image
              src={src}
              ref={imageRef}
              alt=""
              style={{
                x: x,
                y: y,
                scale: scale,
              }}
            /> */}
        </Container>
    )
}

export default ImageCanvas

