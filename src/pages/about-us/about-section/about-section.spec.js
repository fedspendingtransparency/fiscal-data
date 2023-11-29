import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import globalConstants from '../../../helpers/constants';

import About from './about-section';

const h3Headers = [
  'about-mission',
  'about-Vision',
  'about-values',
  'about-who',
  'about-difference',
  'about-background',
  'about-open-data',
  'about-international',
  'about-sources',
  'about-understanding',
  'about-dev',
  'about-licensing',
  'about-more',
];

describe('About section', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<About />);
  });
  const instance = component.root;

  it(`renders a SectionContent component with correct title and
  headingLevel for main title`, () => {
    const title = instance.find(e => e.props.id === 'about-fiscal-data');
    expect(title.props.title).toEqual('About Fiscal Data');
    expect(title.props.headingLevel).toEqual(2);
  });

  it('renders the correct number of SectionContent components with headingLevel 3', () => {
    const headers = instance.findAllByProps({ headingLevel: 3 });
    expect(headers.length).toEqual(h3Headers.length);
  });

  it('provides a link to Fiscal Service About Us', () => {
    const { getByTestId } = render(<About />);

    expect(getByTestId('fsLink')).toHaveAttribute('href', `${globalConstants.FISCAL_TREASURY_URL}/about.html`);
  });
});
