import {findGlossaryTerm} from "./glossary-terms";

describe('Glossary term finder', () => {
  const glossaryExample = [
    {
      id: 1,
      term: 'Hello There',
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
      site_page: 'debt',
      definition: 'A messed up greeting',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    }
  ]

  it('Gets the proper term definition based on term name', () => {
    const result = findGlossaryTerm('Hello There', glossaryExample);
    expect(result).toContain(glossaryExample[0])
    // expect(result).toContain(glossaryExample[2])
  })

  it('Gets the proper term definition regardless of term case', () => {
    const result = findGlossaryTerm('Goodbye', glossaryExample);
    expect(result).toContain(glossaryExample[1])
  })

  it('Does not find term and throws console warning', () => {
    global.console = {warn: jest.fn()}
    const result = findGlossaryTerm('Wow', glossaryExample);
    expect(console.warn).toBeCalled();
    expect(result).toEqual([]);
  })

} )
