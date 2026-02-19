import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { accordion, closed, container, content, heading, open as openStyle, toggle } from './accordion.module.scss';
import Analytics from '../../utils/analytics/analytics';
import useGAEventTracking from '../../hooks/useGAEventTracking';

const Accordion = ({
  defaultOpen,
  containerClass,
  title,
  altStyleIcon,
  altStyleAccordion,
  children,
  openEventNumber,
  explainerGAEvent,
  ga4ID,
  tabindex,
  dataTestId,
  onOpen,
}) => {
  const [open, setOpen] = useState(defaultOpen || false);

  const { getGAEvent } = useGAEventTracking(null, explainerGAEvent);
  const triggerGAEvent = isOpen => {
    const gaEvent = isOpen ? getGAEvent(openEventNumber) : null;
    gaEvent &&
      Analytics.event({
        category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
  };

  const onToggle = e => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      setOpen(prevState => !prevState);
      if (onOpen && !open) {
        onOpen();
      }
      triggerGAEvent(!open);
    }
  };

  return (
    <div className={containerClass ? containerClass : container}>
      <section data-testid="section" className={`${accordion} ${open ? `${openStyle} accordionOpen` : `${closed} accordionClosed`}`}>
        <div
          data-testid="heading"
          onClick={onToggle}
          onKeyPress={onToggle}
          role="button"
          tabIndex={tabindex ? tabindex : 0}
          className={`${heading} accordionHeading`}
          style={altStyleAccordion}
          id={`accordion-${open}-${ga4ID}`}
        >
          {title}
          <div data-testid="button" className={`${toggle} accordionToggle`}>
            {open ? <FontAwesomeIcon icon={faMinus} style={altStyleIcon} /> : <FontAwesomeIcon icon={faPlus} style={altStyleIcon} />}
            <span data-testid="sr-desc" className="sr-only">
              toggle contents
            </span>
          </div>
        </div>
        {open ? (
          <div data-testid={dataTestId ? dataTestId : 'content'} className={`${content} accordionContent`}>
            {children}
          </div>
        ) : (
          <div data-testid="content" className={`${content} accordionContent`}></div>
        )}
      </section>
    </div>
  );
};

export default Accordion;
