import React from 'react';
import SectionCollapseButton from '../section-collapse/section-collapse-button';
import { render, fireEvent } from "@testing-library/react";


describe('SectionCollapseButton', () => {

  const sectionName = 'api-quick-guide';

  it('initializes with a button that displays Show More by default', () => {
    const { getByTestId } = render(<SectionCollapseButton sectionName={sectionName} handleToggle={() => {}} />);
    expect(getByTestId('collapse-button')).toBeInTheDocument();
    expect(getByTestId('collapse-span').innerHTML).toStrictEqual('Show More');
  });

  it('displays button text as Show Less on toggle', () => {
    const { getByTestId } = render(<SectionCollapseButton sectionName={sectionName} handleToggle={() => {}} />);
    fireEvent.click(getByTestId('collapse-button'));
    expect(getByTestId('collapse-span').innerHTML).toStrictEqual('Show Less');
  });

});
