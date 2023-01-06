import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from './section-content';

describe('Section Content', () => {

  const testSectionContent = {
    id: 'test-section',
    headingLevel: 3,
    title: 'Test Section'
  };
  const testParagraph = 'Test Paragraph - This time it is not Lorem Ipsum';
  let section = null;

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <SectionContent id={testSectionContent.id}
                      headingLevel={testSectionContent.headingLevel}
                      title={testSectionContent.title}
      >
        <p data-test-id={'testParagraph'}>{testParagraph}</p>
      </SectionContent>
    )
  });

  const instance = component.root;

  beforeEach(() => {
    section = instance.findByProps({'id': testSectionContent.id});
  });

  it('creates a section with the specified anchor id', () => {
    expect(section).toBeDefined();
  });

  it('creates the heading tag with the appropriate heading level', async() => {
    // Verifies the headingLevel is applied appropriately
    const heading = section.findByType('h3');

    expect(heading.children[0]).toBe(testSectionContent.title);
  });

  it('creates the desired content within the section content', () => {
    const paragraph = section.findByProps({'data-test-id': 'testParagraph'});
    expect(paragraph.children[0]).toBe(testParagraph);
  });

  it('header level generates expected h tag', () => {
    const nextSectionContent = [
      {
        id: 'next-section-1',
        headingLevel: 1,
        title: 'Next Level 1',
        expectedHeader: 'h2'
      },
      {
        id: 'next-section-2',
        headingLevel: 2,
        title: 'Next Level 2',
        expectedHeader: 'h2'
      },
      {
        id: 'next-section-5',
        headingLevel: 5,
        title: 'Next Level 5',
        expectedHeader: 'h5'
      },
      {
        id: 'next-section-6',
        headingLevel: 6,
        title: 'Next Level 6',
        expectedHeader: 'h6'
      }
    ];

    nextSectionContent.forEach((section) => {
      let component = renderer.create();
      renderer.act(() => {
        component = renderer.create(<SectionContent id={section.id}
                                                    headingLevel={section.headingLevel}
                                                    title={section.title}
                                    >
          <p>The Next paragraph's paragraph.</p>
                                    </SectionContent>);
      });
      const instance = component.root;
      const sectionNode = instance.findByProps({'id': section.id});
      const heading = sectionNode.findByType(`${section.expectedHeader}`)
      expect(heading.children[0]).toBe(section.title);
    });
  });
});
