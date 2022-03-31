import React from 'react';
import renderer from 'react-test-renderer';
import SectionCollapseButton from '../section-collapse/section-collapse-button';
import { render, fireEvent } from "@testing-library/react";


describe('SectionCollapseButton init isCollapsed === true', () => {

  const sectionName = 'api-quick-guide';

  it('initializes with a button that displays Show More by default', () => {
    const { getByTestId } = render(<SectionCollapseButton sectionName={sectionName} handleToggle={() => {}} />);
    expect(getByTestId('collapse-button')).toBeInTheDocument();
    expect(getByTestId('collapse-span').innerHTML).toStrictEqual('Show More');
  });

});

describe('SectionCollapseButton isCollapsed === false', () => {

  const sectionName = 'api-quick-guide';

  it('displays button text as Show Less on toggle', () => {
    const { getByTestId } = render(<SectionCollapseButton sectionName={sectionName} handleToggle={() => {}} />);
    fireEvent.click(getByTestId('collapse-button'));
    expect(getByTestId('collapse-span').innerHTML).toStrictEqual('Show Less');
  });

});
