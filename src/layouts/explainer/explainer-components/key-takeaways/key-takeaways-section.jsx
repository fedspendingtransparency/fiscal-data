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

const getText = (takeaway, glossary) => {
  const { hasGlossaryTerm, glossaryRegex, text } = takeaway
  if (hasGlossaryTerm) {
    return reactStringReplace(text, glossaryRegex, (match, i) => (
      <GlossaryTerm
        term={match[0].toUpperCase() + match.substring(1)}
        page={"Spending Explainer"}
        glossary={glossary}
        key={i}
      >
        {match}
      </GlossaryTerm>
    ))
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
