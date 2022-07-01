import {IGlossaryTerm} from "../../models/IGlossaryTerm";

export const findGlossaryTerm = (term: string, glossaryData: IGlossaryTerm[]): IGlossaryTerm[] => {
  // Uses toLowerCase() for case-insensitive matching
  const matches = [];
  glossaryData.forEach((entry => {
    if(entry.term && entry.term.toLowerCase() === term.toLowerCase()) {
      matches.push(entry);
    }
  }))

  if(matches.length >= 1) {
    return matches;
  }

  else {
    console.warn('Glossary term not found.')
    return [];
  }

}


