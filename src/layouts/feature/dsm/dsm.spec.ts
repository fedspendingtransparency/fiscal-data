import { render } from '@testing-library/react';
import dsmComponents from './dsm';

describe('Feature DSM Components', () => {

  it('creates a DS&M section with passed in content', () => {
    const dsmText = `Lorem ipsum dummy text';`
    const dsmTitle = `Data Sources & Methodologies`;
    const {getByText} = render(dsmComponents.DSM({children: dsmText}));
    const dsmAccordion = getByText(dsmTitle);
    dsmAccordion.click();
    expect(getByText(dsmText)).toBeDefined();
  });

  it('has a function that returns an icon', () => {
    const {getByTestId} = render(dsmComponents.ExtIcon());
    expect(getByTestId('dsmExtIcon')).toBeDefined();
  });
});
