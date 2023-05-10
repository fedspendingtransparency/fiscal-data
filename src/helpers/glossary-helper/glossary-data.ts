import { IGlossaryTerm } from '../../models/IGlossaryTerm';


export interface IGlossaryMap {
  [letter: string]: IGlossaryTerm[]
}


export const getGlossaryMap = (glossaryData: IGlossaryTerm[]):IGlossaryTerm[] => {
  const glossaryMap = {};
  const glossaryList = [];
  if(glossaryData) {
    const sortedGlossaryData = [...glossaryData];
    sortedGlossaryData.sort((a,b) => a.term.localeCompare(b.term));
    sortedGlossaryData.forEach(node => {
      if(glossaryMap[node.term.charAt(0).toUpperCase()]) {
        glossaryMap[node.term.charAt(0).toUpperCase()].push(node)
      } else {
        glossaryMap[node.term.charAt(0).toUpperCase()] = [node]
      }
    })

    if (glossaryData) {
      const sortedGlossaryData = [...glossaryData];
      let letterList = [];
      let lastTerm = '';
      sortedGlossaryData.sort((a,b) => a.term.localeCompare(b.term));
      sortedGlossaryData.forEach(node => {
        if(node.term.charAt(0) !== lastTerm.charAt(0)) {
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


    console.log(glossaryList);


  }
  return glossaryList;
}
