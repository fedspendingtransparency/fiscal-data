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
      term: 'Goodbye',
      definition: 'A farewell',
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

  it('Does not find term and throws console warning', () => {
    global.console = {warn: jest.fn()}
    findGlossaryTerm('Wow', glossaryExample);
    expect(console.warn).toBeCalled();
  })

} )
