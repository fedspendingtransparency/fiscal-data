import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  container,
  accordion,
  open as openStyle,
  closed,
  heading,
  toggle,
  content,
} from "./accordion.module.scss";
import analytics from "../../utils/analytics/analytics";
import useGAEventTracking from "../../hooks/useGAEventTracking";

const Accordion = ({
  defaultOpen,
  containerClass,
  title,
  altStyleIcon,
  altStyleAccordion,
  children,
  openEventNumber,
  closeEventNumber,
  dynamicGaEventValue,
}) => {
  // console.log("dynamicGaEventValue", dynamicGaEventValue);
  const [open, setOpen] = useState(defaultOpen || false);
  const gaEvent = useGAEventTracking(
    open ? openEventNumber : closeEventNumber,
    "Debt",
    dynamicGaEventValue
  );

  useEffect(() => {
    if (gaEvent) {
      analytics.event({
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }
  }, [gaEvent]);

  const onToggle = e => {
    if (e.key === undefined || e.key === "Enter") {
      e.stopPropagation();
      setOpen(prevState => !prevState);
    }
  };

  return (
    <div className={containerClass ? containerClass : container}>
      <section
        data-testid="section"
        className={`${accordion} ${
          open ? `${openStyle} accordionOpen` : `${closed} accordionClosed`
        }`}
      >
        <div
          data-testid="heading"
          onClick={onToggle}
          onKeyPress={onToggle}
          role="button"
          tabIndex={0}
          className={`${heading} accordionHeading`}
          style={altStyleAccordion}
        >
          {title}
          <div data-testid="button" className={`${toggle} accordionToggle`}>
            {open ? (
              <FontAwesomeIcon icon={faMinus} style={altStyleIcon} />
            ) : (
              <FontAwesomeIcon icon={faPlus} style={altStyleIcon} />
            )}
            <span data-testid="sr-desc" className="sr-only">
              toggle contents
            </span>
          </div>
        </div>
        {open ? (
          <div data-testid="content" className={`${content} accordionContent`}>
            {children}
          </div>
        ) : (
          <div
            data-testid="content"
            className={`${content} accordionContent`}
          ></div>
        )}
      </section>
    </div>
  );
};

export default Accordion;
