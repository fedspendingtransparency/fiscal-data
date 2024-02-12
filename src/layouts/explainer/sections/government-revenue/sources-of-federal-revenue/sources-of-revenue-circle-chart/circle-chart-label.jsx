import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, semiBoldWeight } from '../../../../../../variables.module.scss';
import React from 'react';
import { useNodeMouseHandlers } from '@nivo/circle-packing';

const labelFormatTable = {
  'Individual Income Taxes': {
    desktop: {
      lines: ['Individual Income Taxes'],
    },
    mobile: {
      lines: ['Individual Income', 'Taxes'],
    },
  },
  'Corporate Income Taxes': {
    desktop: {
      lines: ['Corporate', 'Income Taxes'],
    },
    mobile: {
      lines: ['Corporate ', 'Income', 'Taxes'],
    },
  },
  'Social Security and Medicare Taxes': {
    desktop: {
      lines: ['Social Security', 'and Medicare Taxes'],
    },
    mobile: {
      lines: ['Social Security', 'and', 'Medicare Taxes'],
    },
  },
  'Miscellaneous Income': {
    desktop: {
      lines: ['Miscellaneous', 'Income'],
      horizontalOffset: 16,
    },
    mobile: {
      lines: ['Miscellaneous', 'Income'],
      horizontalOffset: 15,
    },
    hide: true,
  },
  'Customs Duties': {
    desktop: {
      lines: ['Customs', 'Duties'],
      horizontalOffset: 16,
    },
    mobile: {
      lines: ['Customs', 'Duties'],
      horizontalOffset: 8,
    },
    hide: true,
  },
  'Estate & Gift Taxes': {
    desktop: {
      lines: ['Estate', '& Gift Taxes'],
      horizontalOffset: 30,
    },
    mobile: {
      lines: ['Estate', '& Gift Taxes'],
      horizontalOffset: 20,
    },
    hide: true,
  },
  'Excise Taxes': {
    desktop: {
      lines: ['Excise', 'Taxes'],
      horizontalOffset: 8,
    },
    mobile: {
      lines: ['Excise', 'Taxes'],
      horizontalOffset: 6,
    },
    hide: true,
  },
};

const LabelComponent = ({ node, label, width, HandleClick, HandleMouseEnter, HandleMouseLeave }) => {
  const handlers = useNodeMouseHandlers(node, {
    onMouseEnter: HandleMouseEnter,
    onMouseLeave: HandleMouseLeave,
    onClick: HandleClick,
  });

  const labelFormat = width < pxToNumber(breakpointLg) ? labelFormatTable[label].mobile : labelFormatTable[label].desktop;
  const lines = labelFormat.lines;

  const lineSpaceOffset = width < pxToNumber(breakpointLg) ? 12.5 : 16.5;
  const yStartPoint = node.y - (lines.length / 2) * lineSpaceOffset + 9;

  const handleInteraction = e => {
    // only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    const prevFocusedElementId = e?.key === 'Enter' ? document?.activeElement?.getAttribute('id') : null;
    HandleMouseEnter(node, e, prevFocusedElementId);
  };
  const textElementStyle = {
    fontSize: width < pxToNumber(breakpointLg) ? 10 : 14,
    fontWeight: semiBoldWeight,
  };

  if (!labelFormatTable[label].external) {
    // if text label over a circle, let the mouse events fall through to its circle
    textElementStyle.pointerEvents = 'none';
  }

  return (
    <>
      <text
        dominantBaseline="central"
        style={textElementStyle}
        onClick={handlers.onClick}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        onKeyPress={e => handleInteraction(e)}
        tabIndex={0}
        textAnchor="middle"
        id={label}
      >
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {labelFormatTable[label].hide ? (
              <tspan x={node.x} y={yStartPoint + lineSpaceOffset * index} style={{ opacity: 0 }}>
                {line}
              </tspan>
            ) : (
              <tspan x={node.x} y={yStartPoint + lineSpaceOffset * index} fill="#FFFFFF">
                {line}
              </tspan>
            )}
          </React.Fragment>
        ))}
      </text>
    </>
  );
};

export default LabelComponent;
