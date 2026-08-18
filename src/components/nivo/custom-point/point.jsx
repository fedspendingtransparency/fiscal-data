import React from 'react';

const Point = ({ currentPoint, borderColor, borderWidth }) => {
  console.log(currentPoint);
  return (
    <g>
      <circle
        r={currentPoint?.r ? currentPoint?.r * 4 : 8}
        fill="#D8D8D8"
        stroke={borderColor}
        strokeWidth={borderWidth}
        opacity={currentPoint?.opacity === 0 ? 0 : ''}
        fillOpacity={currentPoint?.opacity === 0 ? 0 : 0.35}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
      <circle
        r={currentPoint?.r ? currentPoint?.r : 2}
        fill="#000000"
        stroke="#000000"
        strokeWidth="4"
        opacity={currentPoint?.opacity === 0 ? 0 : ''}
        fillOpacity={currentPoint?.opacity === 0 ? 0 : 0.85}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
    </g>
  );
};

export default Point;
