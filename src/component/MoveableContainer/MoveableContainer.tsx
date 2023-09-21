import React, { FC, useEffect, useRef, useState } from "react";
import classes from './MoveableContainer.module.css'

interface IMoveableContainer {
  direction?: "row" | "col";
  children?: [React.ReactNode, React.ReactNode];
  movingWrapper?: boolean;
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
}

const zxxDrag = (window as any).zxxDrag;

export const MoveableContainer: FC<IMoveableContainer> = ({
  direction,
  children,
  defaultPosition,
  movingWrapper,
  onPositionChange,
}) => {
  const len = children?.length;
  const [position, setPosition] = useState(defaultPosition || 50);
  const [isMoving, setIsMoving] = useState(false);
  const wrapperEl = useRef<HTMLDivElement>(null);
  const splitEl = useRef<HTMLDivElement>(null);
  const isRow = direction === "row";
  useEffect(() => {
    if (!wrapperEl || !splitEl) {
      return;
    }
    const releaseBinding = zxxDrag(splitEl.current, {
      bounding: wrapperEl.current,
      onMove: (left: number, top: number) => {
        if (!wrapperEl.current) {
          return;
        }
        const { width, height } = wrapperEl.current.getBoundingClientRect();
        const newPosition = !isRow
          ? (top / height) * 100
          : (left / width) * 100;
        // console.log({left, top, newPosition})
        onPositionChange && onPositionChange(newPosition);
        setPosition(newPosition);
        if (!isMoving && movingWrapper) {
          setIsMoving(true);
        }
      },
      onEnd: () => {
        setIsMoving(false);
      },
    });
    return () => releaseBinding();
  }, [wrapperEl]);
  if (!len) {
    return <></>;
  }
  return (
    <div
      style={{ flexDirection: !isRow ? "column" : "row" }}
      className={classes.wrapper}
      ref={wrapperEl}
    >
      <div
        className={classes.item}
        style={
          isRow
            ? { right: `${100 - position}%` }
            : { bottom: `${100 - position}%` }
        }
      >
        {children[0]}
      </div>

      <div
        className={classes.spilt}
        ref={splitEl}
        style={
          isRow
            ? { left: `${position}%`, width: "4px", bottom: 0, top: 0 }
            : {
                top: `${position}%`,
                height: "4px",
                left: 0,
                right: 0,
                cursor: "row-resize",
              }
        }
      ></div>

      <div
        className={classes.item}
        style={isRow ? { left: `${position}%` } : { top: `${position}%` }}
      >
        {children[1]}
      </div>
      {isMoving && (
        <>
          <div
            className={classes.item}
            style={
              isRow
                ? { right: `${100 - position}%` }
                : { bottom: `${100 - position}%` }
            }
          ></div>
          <div
            className={classes.item}
            style={isRow ? { left: `${position}%` } : { top: `${position}%` }}
          ></div>
        </>
      )}
    </div>
  );
};
