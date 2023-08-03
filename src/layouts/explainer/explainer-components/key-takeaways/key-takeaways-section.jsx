import React from "react"
import {
  icon,
  iconBackground,
  keyTakeawaysContent,
  offsetIcon,
} from "./key-takeaways-section.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GlossaryPopoverDefinition from "../../../../components/glossary/glossary-term/glossary-popover-definition";
import reactStringReplace from "react-string-replace";

export const toTitleCase = text => {
  return text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ")
    .trim();
}

const getText = (takeaway, glossary, glossaryClickHandler) => {
  const {
    hasGlossaryTerm,
    page,
    glossaryRegex,
    text,
    glossaryString,
    glossaryTerm,
  } = takeaway
  if (hasGlossaryTerm) {
    return reactStringReplace(
      text,
      glossaryRegex || glossaryString,
      (match, i) => {
        return (
          <GlossaryPopoverDefinition
            term={toTitleCase(glossaryTerm ? glossaryTerm : match)}
            page={page}
            glossary={glossary}
            glossaryClickHandler={glossaryClickHandler}
            key={i}
          >
            {match}
          </GlossaryPopoverDefinition>
        )
      }
    )
  }
  return text;
}

//TODO: Replace below icon with afg-icon component
const KeyTakeawaysSection = ({
  takeaways,
  primaryColor,
  secondaryColor,
  glossary,
  glossaryClickHandler
}) => (
  <>
    {takeaways.map(takeaway => (
      <div className={keyTakeawaysContent} key={takeaway.text}>
        <div
          className={iconBackground}
          style={{ backgroundColor: secondaryColor }}
        >
          <FontAwesomeIcon icon={takeaway.icon} className={icon} />
          <FontAwesomeIcon
            icon={takeaway.icon}
            className={offsetIcon}
            style={{ color: primaryColor }}
          />
        </div>
        <p>{getText(takeaway, glossary, glossaryClickHandler)}</p>
      </div>
    ))}
  </>
)

export default KeyTakeawaysSection
