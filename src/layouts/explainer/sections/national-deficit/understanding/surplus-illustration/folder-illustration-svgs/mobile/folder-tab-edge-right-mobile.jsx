import { withWindowSize } from 'react-fns';
import React from 'react';
import { tabEdgeRight } from '../../surplus-illustration.module.scss';

const FolderTabEdgeRightMobile = () => {
  return (
    <div className={tabEdgeRight}>
      <svg version={1.1} overflow="visible" height="35" width="22" viewBox="-8 -1 14 34">
        <g transform="scale(-1,1)">
          <path
            d="M 4.1118 30.9027 C 3.0346 30.561 2.038 33.588 2 34 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4 L 7.5451 30.7801 Z"
            fill="#e0baab"
            strokeLinecap="round"
            stroke="none"
            strokeMiterlimit="80"
          />
          <path
            d="M 4 31 L 2 31 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.051 4"
            fill="none"
            strokeLinecap="square"
            stroke="#e0baab"
            strokeMiterlimit="80"
            strokeWidth="2"
          />
        </g>
        <g strokeLinejoin="miter" transform="scale(-1,1)">
          <path
            d="M -2 32 L 2 32 C 2.9654 31.561 5 32 6 30 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
            fill="none"
            strokeLinecap="square"
            stroke="#e0baab"
            strokeMiterlimit="80"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

export default withWindowSize(FolderTabEdgeRightMobile);
