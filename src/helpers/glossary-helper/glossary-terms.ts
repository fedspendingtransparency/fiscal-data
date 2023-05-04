import { IGlossaryTerm } from "../../models/IGlossaryTerm"

export const findGlossaryTerm = (
  term: string,
  glossaryData: IGlossaryTerm[]
): IGlossaryTerm[] => {
  // Uses toLowerCase() for case-insensitive matching
  const matches = [];
  if (!glossaryData) {
    return;
  }
  glossaryData.forEach(entry => {
    if (entry.term && entry.term.toLowerCase() === term.toLowerCase()) {
      matches.push(entry);
    }
  })

  if (matches.length >= 1) {
    return matches;
  } else {
    return [];
  }
}
