import { IGlossaryTerm } from '../../models/IGlossaryTerm';

export interface IGlossaryListSection {
  sortedList: IGlossaryTerm[]

  map(element: (term) => JSX.Element): any;
}


export const getSortedGlossaryList = (glossaryData: IGlossaryTerm[]):IGlossaryListSection[] => {
  const glossaryList = [];
  if (glossaryData) {
    const sortedGlossaryData = [...glossaryData];

    //Add a slug for each glossary term
    sortedGlossaryData.map((term) => term.slug = term.term.toLowerCase().split(' ').join('-'));

    let letterList = [];
    let lastTerm = '';
    sortedGlossaryData.sort((a,b) => a.term.localeCompare(b.term));
    sortedGlossaryData.forEach(node => {
      if(node.term.charAt(0).toLowerCase() !== lastTerm.charAt(0).toLowerCase()) {
        if (letterList.length !== 0) {
          glossaryList.push(letterList);
        }
        letterList = [node];
      } else {
        letterList.push(node);
      }
      lastTerm = node.term;
    })
    glossaryList.push(letterList);
  }
  return glossaryList;
}
