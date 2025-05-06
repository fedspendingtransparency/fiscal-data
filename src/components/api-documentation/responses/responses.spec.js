import React from 'react';
import Responses from './responses';
import { render } from '@testing-library/react';

describe('Responses', () => {
  it('has SectionContent as a part of its layout', () => {
    const { getAllByTestId } = render(<Responses />);
    expect(getAllByTestId('section-content').length).toBeGreaterThan(0);
  });

  it('creates the Responses section with the desired id, heading tag and title', () => {
    const title = 'Responses and Response Objects';
    const { getByRole } = render(<Responses />);

    const heading = getByRole('heading', { level: 2, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('contains an html table element', () => {
    const { getByRole } = render(<Responses />);

    expect(getByRole('table')).toBeInTheDocument();
  });

  it('<table> tag has aria-described by set and to reference <p> id', () => {
    const tableDescription = 'The following response codes may be returned:';
    const { getByRole, getByText } = render(<Responses />);

    const table = getByRole('table');
    const p = getByText(tableDescription);
    expect(table).toHaveAttribute('aria-describedby', 'response-codes-id');
    expect(p).toHaveAttribute('id', 'response-codes-id');
  });

  it('includes meta object component in its layout', () => {
    const title = 'Meta Object';
    const { getByRole } = render(<Responses />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
  it('includes links object component in its layout', () => {
    const title = 'Links Object';
    const { getByRole } = render(<Responses />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
  it('includes data object component in its layout', () => {
    const title = 'Data Object';
    const { getByRole } = render(<Responses />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
  it('includes error object component in its layout', () => {
    const title = 'Error Object';
    const { getByRole } = render(<Responses />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
  it('includes pagination header component in its layout', () => {
    const title = 'Pagination Header';
    const { getByRole } = render(<Responses />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
});
