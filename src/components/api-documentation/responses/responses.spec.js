import React from 'react';
import Responses from './responses';
import { render } from '@testing-library/react';

describe('Responses', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Responses />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Responses section with the desired id, heading tag and title', async () => {
    const title = 'Responses & Response Objects';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('contains an html table element', async () => {
    const { findByRole } = render(<Responses />);
    const table = await findByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('<table> tag has aria-described by set and to reference <p> id', async () => {
    const tableDescription = 'The following response codes may be returned:';
    const { findByRole, findByTestId, findAllByTestId } = render(<Responses />);
    const table = await findByRole('table');

    const section = await findAllByTestId('section-content')[1];
    expect(section).toHaveAttribute('id', 'responses-response-codes');

    const p = await findByTestId('list-of-endpoints-id');
    expect(table).toHaveAttribute('aria-describedby', 'list-of-endpoints-id');
    expect(p).toHaveAttribute('id', 'list-of-endpoints-id');
    // todo update test
    // const p = instance.findByProps({ children: tableDescription }).findByType('p');
    // expect(table.props['aria-describedby']).toBe('response-codes-id');
    // expect(p.props['id']).toBe('response-codes-id');
    // expect(table.props['aria-describedby']).toEqual(p.props['id']);
  });

  it('includes meta object component in its layout', async () => {
    const title = 'Meta Object';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('includes links object component in its layout', async () => {
    const title = 'Links Object';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('includes data object component in its layout', async () => {
    const title = 'Data Object';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('includes error object component in its layout', async () => {
    const title = 'Error Object';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('includes pagination header component in its layout', async () => {
    const title = 'Pagination Header';
    const { findByRole } = render(<Responses />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
