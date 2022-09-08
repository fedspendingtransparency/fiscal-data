import { IGlossaryTerm } from "../../models/IGlossaryTerm"

export const findGlossaryTerm = (
  term: string,
  glossaryData: IGlossaryTerm[]
): IGlossaryTerm[] => {
  // Uses toLowerCase() for case-insensitive matching
  const matches = []
  if (!glossaryData) {
    console.warn("Glossary data missing, did you pass the glossary prop?")
    return
  }
  glossaryData.forEach(entry => {
    if (entry.term && entry.term.toLowerCase() === term.toLowerCase()) {
      matches.push(entry)
    }
  })

  if (matches.length >= 1) {
    return matches
  } else {
    console.warn("Glossary term not found.")
    return []
  }
}
