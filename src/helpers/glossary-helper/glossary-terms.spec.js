import {findGlossaryTerm} from "./glossary-terms";

describe('Glossary term finder', () => {
  const glossaryExample = [
    {
      id: 1,
      term: 'Hello',
      site_page: 'debt',
      definition: 'A greeting',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 2,
      term: 'gOOdbYe',
      site_page: 'debt',
      definition: 'A test of case insensitivity',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 3,
      term: 'hEllo',
      site_page: 'spending',
      definition: 'A messed up greeting',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    }
  ]

  it('Gets the proper term definition based on term name', () => {
    const result = findGlossaryTerm('Hello', glossaryExample);
    expect(result).toContain(glossaryExample[0])
    expect(result).toContain(glossaryExample[2])
  })

  it('Gets the proper term definition regardless of term case', () => {
    const result = findGlossaryTerm('Goodbye', glossaryExample);
    expect(result).toContain(glossaryExample[1])
  })
} )
