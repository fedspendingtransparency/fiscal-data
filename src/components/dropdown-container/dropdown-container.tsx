import React, { FocusEventHandler, FunctionComponent, ReactElement, useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

interface IDropdownContainer {
  dropdownButton: ReactElement;
  children: ReactElement;
  setActive: (activeState: boolean) => void;
  containerWidth?: string;
}

const DropdownContainer: FunctionComponent<IDropdownContainer> = ({
  dropdownButton,
  children,
  setActive,
  containerWidth = '20rem',
}: IDropdownContainer) => {
  const dropdownRef = useRef(null);

  /* accessibility-enabling event handlers for interpreting focus state on control */
  const handleMouseBlur = (event: MouseEvent) => {
    if (event) {
      const currentTarget = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement;
      const mouseEvent = event.type !== 'blur';
      if (mouseEvent && !currentTarget?.parentElement?.contains(relatedTarget)) {
        setTimeout(() => {
          setActive(false);
        });
      }
    }
  };

  useOnClickOutside(dropdownRef, handleMouseBlur);

  const handleKeyboardBlur: FocusEventHandler = event => {
    if (event) {
      const parent = dropdownRef.current;
      const related = event?.relatedTarget as HTMLElement;
      if ((!parent?.outerText?.includes(related?.outerText) || !related?.outerText) && related?.id !== 'gatsby-focus-wrapper') {
        setActive(false);
      }
    }
  };

  return (
    <div ref={dropdownRef} onBlur={handleKeyboardBlur} role="presentation" style={{ width: containerWidth }}>
      {dropdownButton}
      {children}
    </div>
  );
};

export default DropdownContainer;
