import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ExperimentalSwitch from './experimental-switch';
import React from 'react';
import "gatsby-env-variables";
import Experimental from '../experimental';

jest.mock("gatsby-env-variables", () => ({
  ENV_ID: 'production',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  EXPERIMENTAL_WHITELIST: ['mock experimental feature']
}));

const container = (
  <>
    <ExperimentalSwitch />
    <Experimental featureId='mock experimental feature'>
       <span>Some EXPERIMENTAL content</span>
       <div>And some more content.</div>
     </Experimental>
  </>
);

describe('Experimental wrapper component', () => {
  it('does not show up in a production environment', () => {
    const { queryByTestId } = render(container);
    expect(queryByTestId('experimental-switch')).toBeNull();
  });
});