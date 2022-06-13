import {IGlossaryTerm} from "../../models/IGlossaryTerm";

export const findGlossaryTerm = (term: string, glossaryData: IGlossaryTerm[]): IGlossaryTerm => {
  const match = glossaryData.find(entry => entry.term === term);
  if (match) {
    return match;
  }
  else {
    console.warn('Glossary term not found.')
  }
}


