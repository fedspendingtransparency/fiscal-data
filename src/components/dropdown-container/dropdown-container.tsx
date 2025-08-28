import React, { FocusEventHandler, FunctionComponent, KeyboardEventHandler, ReactElement, useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

interface IDropdownContainer {
  dropdownButton: ReactElement;
  children: ReactElement;
  setActive: (active: boolean) => void;
  containerWidth?: string;
}

const DropdownContainer: FunctionComponent<IDropdownContainer> = ({
  dropdownButton,
  children,
  setActive,
  containerWidth = '20rem',
}: IDropdownContainer) => {
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => {
    setActive(false);
  });
  /* accessibility-enabling event handlers for interpreting focus state on control */
  const handleMouseBlur: FocusEventHandler<HTMLDivElement> = event => {
    const next = event.relatedTarget as Node | null;

    const container = event.currentTarget;

    if (!next || !container.contains(next)) {
      setActive(false);
    }
    // if (event) {
    //   const currentTarget = event.target as HTMLElement;
    //   const relatedTarget = event.relatedTarget as HTMLElement;
    //   const mouseEvent = event.type !== 'blur';
    //   if (mouseEvent && !currentTarget?.parentElement?.contains(relatedTarget)) {
    //     setTimeout(() => {
    //       setActive();
    //     });
    //   }
    // }
  };

  const handleKeyDown: KeyboardEventHandler = event => {
    if (event.key === 'Escape') setActive(false);
  };

  return (
    <div ref={dropdownRef} onBlur={handleMouseBlur} onKeyDown={handleKeyDown} role="presentation" style={{ width: containerWidth }}>
      {dropdownButton}
      {children}
    </div>
  );
};

export default DropdownContainer;
