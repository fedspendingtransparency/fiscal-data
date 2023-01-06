import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import renderer from 'react-test-renderer';
import NotesAndLimitations, { sectionTitle } from './notes-and-limitations';
import ReactMarkdown from "react-markdown";
import Accordion from "../../accordion/accordion";

describe('Notes and Limitations (N&KL) - Only dataset level N&KL', () => {
  let instance;
  const text = 'Rabble dabble.\r\nWriggle jiggle.';
  beforeAll(() => {
    const component = renderer.create(<NotesAndLimitations bodyText={text}/>);
    instance = component.root;
  });

  it('provides the section title', () => {
    const {getByText} = render(<NotesAndLimitations bodyText={text} />);
    expect(getByText(sectionTitle)).toBeInTheDocument();
  });

  it('passes the text given to it as a param to the ReactMarkdown component', () => {
    // We are not using getByText for this test, because getByText struggles with line breaks.
    const renderedText = instance.findByType(ReactMarkdown);
    expect(renderedText.props.source).toBe(text);
  });

  it('does not render any data table level content', () => {
    const accordions = instance.findAllByType(Accordion);
    expect(accordions.length).toStrictEqual(0);
  });
});

describe('Notes and Limitations (N&KL) - Dataset and data table level N&KL', () => {
  const dsText = 'This is a dataset level N&KL, which helps give information about all its tables';
  const apis = [{
      apiId: 1,
      tableName: 'Fred Flintstone'
    },
    {
      apiId: 2,
      tableName: 'Thanos',
      apiNotesAndLimitations: 'Don\'t believe everything you\'ve read on the internet.'
    },
    {
      apiId: 3,
      tableName: 'Abraham Lincoln',
      apiNotesAndLimitations: 'Perfectly balanced as all things should be.'
    }
  ];

  it('includes the dataset level N&KL', () => {
    const {getByText} = render(<NotesAndLimitations apis={apis} bodyText={dsText} />);
    expect(getByText(dsText)).toBeInTheDocument();
  });

  it('includes the title and N&KL for any data table that have their own', () => {
    const {getByText, getAllByTestId} = render(<NotesAndLimitations apis={apis} bodyText={dsText} />);
    fireEvent.click(getAllByTestId('button')[0]);
    expect(getByText(apis[1].apiNotesAndLimitations)).toBeInTheDocument();
    expect(getByText(apis[1].tableName)).toBeInTheDocument();
    fireEvent.click(getAllByTestId('button')[1]);
    expect(getByText(apis[2].apiNotesAndLimitations)).toBeInTheDocument();
    expect(getByText(apis[2].tableName)).toBeInTheDocument();
  });

  it('includes an accordion for each data table that has its own N&KL', () => {
    let component = renderer.create();
    let instance;
    renderer.act(() => {
      component = renderer.create(<NotesAndLimitations apis={apis} bodyText={dsText} />);
    });
    instance = component.root;
    const numAccordions = apis.filter(api => api.apiNotesAndLimitations).length;
    expect(instance.findAllByType(Accordion).length).toStrictEqual(numAccordions);
  });

});


