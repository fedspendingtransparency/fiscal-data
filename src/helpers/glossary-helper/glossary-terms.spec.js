import {findGlossaryTerm} from "./glossary-terms";

describe('Glossary term finder', () => {
  const glossaryExample = [
    {
      id: 1,
      term: 'Hello',
      definition: 'A greeting',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 2,
      term: 'gOOdbYe',
      definition: 'A test of case insensitivity',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 3,
      term: 'Blue',
      definition: 'A color',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    }
  ]

  it('Gets the proper term definition based on term name', () => {
    expect(findGlossaryTerm('Hello', glossaryExample)).toBe(glossaryExample[0])
  })

  it('Gets the proper term definition regardless of term case', () => {
    expect(findGlossaryTerm('Goodbye', glossaryExample)).toBe(glossaryExample[1])
  })

  it('Does not find term and throws console warning', () => {
    global.console = {warn: jest.fn()}
    findGlossaryTerm('Wow', glossaryExample);
    expect(console.warn).toBeCalled();
  })

} )
