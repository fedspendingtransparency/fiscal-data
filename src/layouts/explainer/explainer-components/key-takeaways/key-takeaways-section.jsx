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

const Text = ({ takeaway, glossary }) => {
  const { text } = takeaway
  const glossaryTerms = ["discretionary", "mandatory"]

  glossaryTerms.forEach(term => {
    text = reactStringReplace(text, term, (match, i) => (
      <GlossaryTerm
        term={term}
        page={"Federal Spending Explainer"}
        glossary={glossary}
        key={i}
      >
        {match}
      </GlossaryTerm>
    ))
  })

  return <p>{text}</p>
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
          <Text takeaway={takeaway} glossary={glossary} />
        </div>
      </div>
    ))}
  </>
)

export default KeyTakeawaysSection
