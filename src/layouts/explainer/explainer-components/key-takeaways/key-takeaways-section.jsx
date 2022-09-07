import React from "react"
import {
  icon,
  iconBackground,
  keyTakeawaysContent,
  offsetIcon,
} from "./key-takeaways-section.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GlossaryTerm from "../../../../components/glossary-term/glossary-term"
import reactStringReplace from "react-string-replace"

export const toTitleCase = text => {
  return text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ")
    .trim()
}

const getText = (takeaway, glossary) => {
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
        console.log(match, "MATCH", glossaryTerm)
        return (
          <GlossaryTerm
            term={toTitleCase(glossaryTerm ? glossaryTerm : match)}
            page={page}
            glossary={glossary}
            key={i}
          >
            {match}
          </GlossaryTerm>
        )
      }
    )
  }
  return text
}

const KeyTakeawaysSection = ({
  takeaways,
  primaryColor,
  secondaryColor,
  glossary,
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
        <p>{getText(takeaway, glossary)}</p>
      </div>
    ))}
  </>
)

export default KeyTakeawaysSection
