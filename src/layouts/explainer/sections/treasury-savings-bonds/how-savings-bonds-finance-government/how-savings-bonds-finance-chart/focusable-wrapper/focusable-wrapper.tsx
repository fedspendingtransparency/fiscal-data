import React, { useRef } from 'react';
import { Cell, CellProps } from 'recharts';

interface FocusableCellProps extends CellProps {
  onFocus: (data: any, index: number) => void;
  onBlur: () => void;
  index: number;
  ariaLabel: string;
}

const FocusableCell: React.FunctionComponent<FocusableCellProps> = ({ onFocus, onBlur, index, ariaLabel }) => {
  const cellRef = useRef<SVGReactElement>(null);
  const handleFocus = () => {
    onFocus(props, index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<SVGReactElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      cellRef.current?.focus();
      event.preventDefault();
      handleFocus();
    }
  };

  return (
    <g tabIndex={0} role="button" aria-label={ariaLabel} onFocus={handleFocus} onBlur={onBlur} onKeyDown={handleKeyDown}>
      <Cell ref={cellRef} {...props} />
    </g>
  );
};

export default FocusableCell;
