import React, { FocusEventHandler, FunctionComponent, KeyboardEventHandler, PointerEventHandler, ReactElement, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pointerDownInside = useRef(false);

  useOnClickOutside(dropdownRef, () => {
    setActive(false);
  });
  /* accessibility-enabling event handlers for interpreting focus state on control */

  const markPointerDowninside: PointerEventHandler<HTMLDivElement> = event => {
    if (!dropdownRef.current) return;
    pointerDownInside.current = dropdownRef.current.contains(event.target as Node);
  };
  const clearPointerDownInside = () => {
    setTimeout(() => {
      pointerDownInside.current = false;
    }, 0);
  };
  const handleMouseBlur: FocusEventHandler<HTMLDivElement> = event => {
    if (pointerDownInside.current) return;

    const next = event.relatedTarget as Node | null;

    const container = event.currentTarget;

    if (!next || !container.contains(next)) {
      setActive(false);
    }
  };

  const handleKeyDown: KeyboardEventHandler = event => {
    if (event.key === 'Escape') setActive(false);
  };

  return (
    <div
      ref={dropdownRef}
      onBlur={handleMouseBlur}
      onKeyDown={handleKeyDown}
      role="presentation"
      style={{ width: containerWidth }}
      onPointerDownCapture={markPointerDowninside}
      onPointerUpCapture={clearPointerDownInside}
    >
      {dropdownButton}
      {children}
    </div>
  );
};

export default DropdownContainer;
