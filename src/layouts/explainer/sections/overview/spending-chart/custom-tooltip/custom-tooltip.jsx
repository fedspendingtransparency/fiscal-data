import React from 'react';
import { render } from '@testing-library/react'; 
import CustomTooltip from './custom-tooltip';

describe('<CustomTooltip />', () => {

  it('renders the tooltip when active and has payload', () => {
    const { getByText } = render(
      <CustomTooltip active={true} payload={[{ name: '5 Year Average (2016-2021)', value: 2.345, stroke: 'red' }]} label="Jan" />
    );
    expect(getByText('Janurary')).toBeInTheDocument();
  });

  it('does not render the tooltip when not active', () => {
    const { queryByText } = render(
      <CustomTooltip active={false} payload={[{ name: '5 Year Average (2016-2021)', value: 2.345, stroke: 'red' }]} label="Jan" />
    );
    expect(queryByText('Janurary')).toBeNull();
  });

  it('handles months not in monthNames mapping', () => {
    const { getByText } = render(
      <CustomTooltip active={true} payload={[{ name: '5 Year Average (2016-2021)', value: 2.345, stroke: 'red' }]} label="NonExistentMonth" />
    );
    expect(getByText('NonExistentMonth')).toBeInTheDocument();
  });

  it('displays the shortened version for "5 Year Average (2016-2021)"', () => {
    const { getByText } = render(
      <CustomTooltip active={true} payload={[{ name: '5 Year Average (2016-2021)', value: 2.345, stroke: 'red' }]} label="Jan" />
    );
    expect(getByText('5 Yr Avg:')).toBeInTheDocument();
  });

  it('handles names not in shortName mapping', () => {
    const { getByText } = render(
      <CustomTooltip active={true} payload={[{ name: 'SomeOtherName', value: 2.345, stroke: 'red' }]} label="Jan" />
    );
    expect(getByText('SomeOtherName:')).toBeInTheDocument();
  });

  it('displays the correct value for entry with proper rounding and appending T', () => {
    const { getByText } = render(
      <CustomTooltip active={true} payload={[{ name: '5 Year Average (2016-2021)', value: 2.3456, stroke: 'red' }]} label="Jan" />
    );
    expect(getByText('$2.35T')).toBeInTheDocument();
  });

});
