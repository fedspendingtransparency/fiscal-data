import {IGlossaryTerm} from "../../models/IGlossaryTerm";

export const findGlossaryTerm = (term: string, glossaryData: IGlossaryTerm[]): IGlossaryTerm => {
  // Uses toLowerCase() for case-insensitive matching
  const match = glossaryData.find(entry => entry.term.toLowerCase() === term.toLowerCase());
  if (match) {
    return match;
  }
  else {
    console.warn('Glossary term not found.')
  }
}


