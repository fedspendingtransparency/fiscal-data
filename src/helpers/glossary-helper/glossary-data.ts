import { IGlossaryTerm } from '../../models/IGlossaryTerm';


export interface IGlossaryMap {
  [letter: string]: IGlossaryTerm[]
}

export const getGlossaryData = (glossaryData: IGlossaryTerm[]):IGlossaryMap => {
  console.log(glossaryData);
  const sortedGlossaryData = [...glossaryData];
  sortedGlossaryData.sort((a,b) => a.term.localeCompare(b.term));
  const glossaryMap = {};
  sortedGlossaryData.forEach(node => {
    if(glossaryMap[node.term.charAt(0).toUpperCase()]) {
      glossaryMap[node.term.charAt(0).toUpperCase()].push(node)
    } else {
      glossaryMap[node.term.charAt(0).toUpperCase()] = [node]
    }
  })

  return glossaryMap;
}
