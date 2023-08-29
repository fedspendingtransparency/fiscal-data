import React from "react";
import {
  staticCharacter,
  flip,
  splitFlapCharacter,
  halfPanel,
  top,
  bottom,
  splitFlap, FlipOut, FlipIn, flipIn, flipOut
} from './split-flap-character.module.scss';

interface ISplitFlapCharacter {
  value: string,
  prevValue: string,
  cycleDelay: number
}

type Position = "top" | "bottom";
type Direction = "in" | "out";

const SplitFlapCharacter = (
  {
    value,
    prevValue,
    cycleDelay
  }: ISplitFlapCharacter
): JSX.Element => {

  const half = (position: Position, value: string) => (
    <div className={[
      halfPanel, `${position === "top" ? top : bottom}`
    ].join(' ')}
    >
      <span>{value}</span>
    </div>
  );

  const panel = (position: Position, value: string) => (
    half(position, value)
  );

  const halfFlipPanel = (
    value: string,
    position: Position,
    direction: Direction,
    duration: number
  ) => (
    <div className={[
      halfPanel,
      flip,
      `${position === "top" ? top : bottom}`,
      `${direction === "in" ? flipIn : flipOut}`
    ].join(' ')}
         style={{
           animationFillMode: "forwards",
           animation: `
           ${direction === "in" ? FlipIn : FlipOut}
           ${direction === "in" ? 'linear' : 'ease-out'}
           ${duration}s
           `,
         }}
    >
      <span>{value}</span>
    </div>
  );

  return (
    <div className={splitFlapCharacter}>
      {
        [',', '.'].includes(value) ?
        <div className={staticCharacter}>{value}</div>
        :
        <div className={splitFlap}>
          {panel('top', value)}
          {panel('bottom', prevValue)}
          { prevValue !== value && (
            halfFlipPanel(prevValue, "top", "out", cycleDelay / 1000)
          )}
          { prevValue !== value && (
            halfFlipPanel(value, "bottom", "in", cycleDelay / 1000)
          )}
        </div>
      }
    </div>
  );
};

export default SplitFlapCharacter;
