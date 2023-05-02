import { IGlossaryTerm } from '../../models/IGlossaryTerm';


export interface IGlossaryMap {
  [letter: string]: IGlossaryTerm[]
}

export const getGlossaryData = (glossaryData: IGlossaryTerm[]):IGlossaryMap => {
  const glossaryMap = {};
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


  }
  return glossaryMap;
}
