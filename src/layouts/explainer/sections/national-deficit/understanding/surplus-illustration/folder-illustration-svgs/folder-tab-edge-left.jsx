import {withWindowSize} from "react-fns";
import React from "react";
import {tabEdgeLeft} from "../surplus-illustration.module.scss";

const FolderTabEdgeLeft = () => {
  return (
    <div className={tabEdgeLeft}>
      <svg version={1.1} overflow='visible' height='36' viewBox='0 -1 14 35'>
        <g strokeLinejoin='miter'>
          <path
            d='M -11 32 L 2 32 C 2.9654 31.561 5 32 6 30 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0'
            fill='none'
            strokeLinecap='square'
            stroke='#e0baab'
            strokeMiterlimit='80'
            strokeWidth='2'
          />
        </g>
      </svg>
    </div>
  )
}

export default withWindowSize(FolderTabEdgeLeft);
