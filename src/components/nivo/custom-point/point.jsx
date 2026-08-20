import React from 'react';

const Point = ({ currentPoint, borderColor = undefined, borderWidth = undefined }) => {
  const radius = currentPoint?.r ?? 2;
  const hidden = currentPoint?.opacity === 0;

  return (
    <g>
      <circle
        r={radius * 4}
        fill="#D8D8D8"
        stroke={borderColor}
        strokeWidth={borderWidth}
        opacity={hidden ? 0 : undefined}
        fillOpacity={hidden ? 0 : 0.35}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
      <circle
        r={radius}
        fill="#000000"
        stroke="#000000"
        strokeWidth="4"
        opacity={hidden ? 0 : undefined}
        fillOpacity={hidden ? 0 : 0.85}
        cx={currentPoint?.x}
        cy={currentPoint?.y}
      />
    </g>
  );
};

export default Point;
