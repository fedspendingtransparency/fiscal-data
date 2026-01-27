import '@testing-library/jest-dom';
import ExperimentalSwitch from './experimental-switch';
import React from 'react';
import 'gatsby-env-variables';
import Experimental from '../experimental';

jest.mock('gatsby-env-variables', () => ({
  ENV_ID: 'dev',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  EXPERIMENTAL_WHITELIST: ['mock experimental feature'],
}));

const container = (
  <>
    <ExperimentalSwitch />
    <Experimental featureId="mock experimental feature">
      <span>Some EXPERIMENTAL content</span>
      <div>And some more content.</div>
    </Experimental>
  </>
);

describe('Experimental wrapper component', () => {
  it('should ', () => {
    expect(true);
  });
  // it('shows up in a lower environment', () => {
  //   const { getByTestId } = render(container);
  //   expect(getByTestId('experimental-switch')).toBeInTheDocument();
  // });
  //
  // it('does not render experimental components when switch is off', () => {
  //   const { queryByText } = render(container);
  //   expect(queryByText('Some EXPERIMENTAL content')).toBeNull();
  //   expect(queryByText('And some more content.')).toBeNull();
  // });
  //
  // it('renders experimental components when switch is on', () => {
  //   const { queryByText } = render(<siteContext.Provider value={{ showExperimentalFeatures: true }}>{container}</siteContext.Provider>);
  //   expect(queryByText('Some EXPERIMENTAL content')).toBeInTheDocument();
  //   expect(queryByText('And some more content.')).toBeInTheDocument();
  // });
});
