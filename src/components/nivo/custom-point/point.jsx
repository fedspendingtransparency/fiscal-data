import React from 'react';

const Point = ({currentPoint, borderColor, borderWidth}) => {
  return (
    <g>
      <circle
        r={8}
        fill="#D8D8D8"
        stroke={borderColor}
        strokeWidth={borderWidth}
        fillOpacity={0.35}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
      <circle
        r={2}
        fill="#000000"
        stroke="#000000"
        strokeWidth="4"
        fillOpacity={0.85}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
    </g>
  );
}

export default Point;
