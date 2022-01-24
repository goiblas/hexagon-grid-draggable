import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    createUseGesture,
    pinchAction,
    scrollAction,
} from "@use-gesture/react";
import styled from "@emotion/styled";

const useGesture = createUseGesture([pinchAction]);
const useScrollGesture = createUseGesture([scrollAction]);

const Card = styled.div`
    position: relative;
    will-change: transform;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    background: #fff;
    flex-shrink: 0;
    justify-content: center;
    padding: 150px 50px;
    width: 2400px;
    height: 1400px;
`;

const Scroll = styled.div`
    overflow: auto;
    background: #ddd;
    width: 100vw;
    height: 100vh;
`;

type Props = {
    enabled?: boolean;
};

const CanvasScroll: React.FC<Props> = ({ children, enabled }) => {
    const [state, setState] = useState({
        x: 50,
        y: 50,
        scale: 1
    });

    const contentRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (!contentRef.current || !scrollRef.current) return;

        const contentBounds = contentRef.current.getBoundingClientRect();
        const scrollBounds = scrollRef.current.getBoundingClientRect();


        const left = (contentBounds.width - scrollBounds.width) * (state.x / 100);
        const top = (contentBounds.height - scrollBounds.height) * (state.y / 100);

        scrollRef.current.scrollTo({
            top,
            left
        });
    }

    useEffect(() => {
        if (scrollRef.current) {
            updatePosition();
        }
    }, [scrollRef]);

    useScrollGesture({
        onScrollEnd: () => {
            if (!contentRef.current || !scrollRef.current) return;

            const contentBounds = contentRef.current.getBoundingClientRect();
            const scrollBounds = scrollRef.current.getBoundingClientRect();

            const fullWidth = scrollBounds.width - contentBounds.width;
            const fullHeight = scrollBounds.height - contentBounds.height;

            const x = contentBounds.left * 100 / fullWidth;
            const y = contentBounds.top * 100 / fullHeight;

            setState(currentState => ({ ...currentState, x, y }))
        },
    }, {
        target: scrollRef,
    });

    useGesture({
        onPinch: ({ offset: [d], memo, origin: [originX, originY] }) => {
            memo ??= {
                bounds: contentRef.current?.getBoundingClientRect(),
                crop: { scale: state.x },
            }

            const transformOriginX = memo.bounds.x + memo.bounds.width / 2;
            const transformOriginY = memo.bounds.y + memo.bounds.height / 2;

            const displacementX = (transformOriginX - originX) / memo.crop.scale;
            const displacementY = (transformOriginY - originY) / memo.crop.scale;

            const initialOffsetDistance = (memo.crop.scale - 1) * 50;
            const movementDistance = d - initialOffsetDistance;

            setState(currentState => ({
                x: currentState.x + (displacementX * movementDistance) / 200,
                y: currentState.y + + (displacementY * movementDistance) / 200,
                scale: 1 + d / 200,
            }))

            return memo;
        },
        onPinchEnd: () => {
            // deberia hacer algo
        },
    }, {
        target: contentRef,
        eventOptions: { passive: false },
    })


    return (
        <Scroll ref={scrollRef}>
            <Card ref={contentRef}>
                {children}
            </Card>
        </Scroll>
    );
};

export default CanvasScroll;
