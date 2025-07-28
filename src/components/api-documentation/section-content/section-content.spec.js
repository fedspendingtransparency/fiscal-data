import React from 'react';
import SectionContent from './section-content';
import { render } from '@testing-library/react';

describe('Section Content', () => {
  const testSectionContent = {
    id: 'test-section',
    headingLevel: 3,
    title: 'Test Section',
  };
  const testParagraph = 'Test Paragraph - This time it is not Lorem Ipsum';

  it('creates a section with the specified anchor id', () => {
    const instance = render(
      <SectionContent id={testSectionContent.id} headingLevel={testSectionContent.headingLevel} title={testSectionContent.title}>
        <p data-testid="testParagraph">{testParagraph}</p>
      </SectionContent>
    );
    expect(instance).toBeDefined();
  });

  it('creates the heading tag with the appropriate heading level', async () => {
    const { findByRole } = render(
      <SectionContent id={testSectionContent.id} headingLevel={testSectionContent.headingLevel} title={testSectionContent.title}>
        <p data-testid="testParagraph">{testParagraph}</p>
      </SectionContent>
    );
    const heading = await findByRole('heading', { name: testSectionContent.title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the desired content within the section content', async () => {
    const { findByText } = render(
      <SectionContent id={testSectionContent.id} headingLevel={testSectionContent.headingLevel} title={testSectionContent.title}>
        <p data-testid="testParagraph">{testParagraph}</p>
      </SectionContent>
    );

    const paragraph = await findByText(testParagraph);
    expect(paragraph).toBeInTheDocument();
  });

  it('header level generates expected h tag', async () => {
    const nextSectionContent = [
      {
        id: 'next-section-1',
        headingLevel: 1,
        title: 'Next Level 1',
        expectedHeader: 'h2',
      },
      {
        id: 'next-section-2',
        headingLevel: 2,
        title: 'Next Level 2',
        expectedHeader: 'h2',
      },
      {
        id: 'next-section-5',
        headingLevel: 5,
        title: 'Next Level 5',
        expectedHeader: 'h5',
      },
      {
        id: 'next-section-6',
        headingLevel: 6,
        title: 'Next Level 6',
        expectedHeader: 'h6',
      },
    ];

    nextSectionContent.forEach(async section => {
      const { findByRole } = render(
        <SectionContent id={section.id} headingLevel={section.headingLevel} title={section.title}>
          <p>The Next paragraph's paragraph.</p>
        </SectionContent>
      );
      const heading = await findByRole('heading', { name: section.title, level: section.headingLevel });
      expect(heading).toBeInTheDocument();
    });
  });
});
