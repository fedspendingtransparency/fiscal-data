import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import {
  container,
  accordion,
  open as openStyle,
  closed,
  heading,
  toggle,
  content
} from './accordion.module.scss';

const Accordion = ({
  defaultOpen,
  containerClass,
  title,
  altStyleIcon,
  altStyleAccordion,
  altStyleHeaderOpen,
  altStyleChildren,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen || false);

  const onToggle = (e) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      setOpen((prevState) => !prevState);
    }
  };

  return (
    <div className={containerClass ? containerClass : container}>
      <section
        data-testid="section"
        className={`${accordion} ${open ? `${openStyle} accordionOpen` : closed}`}
      >
        <div
          data-testid="heading"
          onClick={onToggle}
          onKeyPress={onToggle}
          role="button"
          tabIndex={0}
          className={`${heading} accordionHeading`}
          style={!open ? altStyleAccordion : altStyleHeaderOpen}
        >
          {title}
          <div
            data-testid="button"
            className={toggle}
          >
            {open ? (
              <FontAwesomeIcon
                icon={faMinus}
                style={altStyleIcon}
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlus}
                style={altStyleIcon}
              />
            )}
            <span data-testid="sr-desc" className="sr-only">toggle contents</span>
          </div>
        </div>
        <div data-testid="content"
             className={`${content} accordionContent`}
             style={altStyleChildren}
        >
          {children}
        </div>
      </section>
    </div>
  );
};

export default Accordion;
