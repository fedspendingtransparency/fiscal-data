import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import NotesAndLimitations, { sectionTitle } from './notes-and-limitations';

describe('Notes and Limitations (N&KL) - Only dataset level N&KL', () => {
  const text = 'Rabble dabble.\r\nWriggle jiggle.';

  it('provides the section title', () => {
    const { getByText } = render(<NotesAndLimitations bodyText={text} />);
    expect(getByText(sectionTitle)).toBeInTheDocument();
  });

  it('passes the text given to it as a param to the ReactMarkdown component', () => {
    const { getByText } = render(<NotesAndLimitations bodyText={text} />);
    const renderedText = getByText(text, { collapseWhitespace: false });
    expect(renderedText).toBeInTheDocument();
  });

  it('does not render any data table level content', () => {
    const { queryAllByRole } = render(<NotesAndLimitations bodyText={text} />);
    const accordions = queryAllByRole('button');
    expect(accordions.length).toStrictEqual(0);
  });
});

describe('Notes and Limitations (N&KL) - Dataset and data table level N&KL', () => {
  const dsText = 'This is a dataset level N&KL, which helps give information about all its tables';
  const apis = [
    {
      apiId: 1,
      tableName: 'Fred Flintstone',
    },
    {
      apiId: 2,
      tableName: 'Thanos',
      apiNotesAndLimitations: "Don't believe everything you've read on the internet.",
    },
    {
      apiId: 3,
      tableName: 'Abraham Lincoln',
      apiNotesAndLimitations: 'Perfectly balanced as all things should be.',
    },
  ];

  it('includes the dataset level N&KL', () => {
    const { getByText } = render(<NotesAndLimitations apis={apis} bodyText={dsText} />);
    expect(getByText(dsText)).toBeInTheDocument();
  });

  it('includes the title and N&KL for any data table that have their own', () => {
    const { getByText, getAllByTestId } = render(<NotesAndLimitations apis={apis} bodyText={dsText} />);
    fireEvent.click(getAllByTestId('button')[0]);
    expect(getByText(apis[1].apiNotesAndLimitations)).toBeInTheDocument();
    expect(getByText(apis[1].tableName)).toBeInTheDocument();
    fireEvent.click(getAllByTestId('button')[1]);
    expect(getByText(apis[2].apiNotesAndLimitations)).toBeInTheDocument();
    expect(getByText(apis[2].tableName)).toBeInTheDocument();
  });

  it('includes an accordion for each data table that has its own N&KL', () => {
    const { getAllByRole } = render(<NotesAndLimitations apis={apis} bodyText={dsText} />);

    const numAccordions = apis.filter(api => api.apiNotesAndLimitations).length;
    expect(getAllByRole('button').length).toStrictEqual(numAccordions);
  });
});
