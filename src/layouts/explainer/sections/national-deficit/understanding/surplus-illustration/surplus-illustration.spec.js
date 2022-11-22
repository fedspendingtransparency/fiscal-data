import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import SurplusIllustration from "./surplus-illustration";
import Analytics from '../../../../../../utils/analytics/analytics'
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import { renderHook } from '@testing-library/react-hooks';


describe('Surplus Illustration', () => {
  const glossary = [];  

  it('renders all three tab titles', () => {
    const {getByText} = render(<SurplusIllustration glossary={glossary} />);
    expect(getByText('Surplus')).toBeInTheDocument();
    expect(getByText('Balanced Budget')).toBeInTheDocument();
    expect(getByText('Deficit')).toBeInTheDocument();
  });

  it('renders the surplus image', () => {
    const {getByTestId} = render(<SurplusIllustration glossary={glossary} />);
    expect(getByTestId('surplus-image')).toBeInTheDocument();
  });

  it('renders the balanced budget image', () => {
    global.console = {warn: jest.fn()}
    const {getByTestId, getByText} = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Balanced Budget');
    tab.click();
    expect(getByTestId('balanced-budget-image')).toBeInTheDocument();
  });

  it('renders the deficit image', () => {
    const {getByTestId, getByText} = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Deficit');
    tab.click();
    expect(getByTestId('deficit-image')).toBeInTheDocument();
  });

  it('calls the appropriate analytics when a tab is clicked',  () => {
    const {getByTestId, getByText, debug} = render(<SurplusIllustration glossary={glossary} />);
    const spy = jest.spyOn(Analytics, "event");
    const surplusTab = getByTestId('surplus-tab');
    const budgetTab = getByTestId('budget-tab');
    const deficitTab = getByTestId('deficit-tab');

    fireEvent.click(surplusTab);
    expect(spy).toHaveBeenCalled();

    fireEvent.click(budgetTab);
    expect(spy).toHaveBeenCalled();

    fireEvent.click(deficitTab);
    expect(spy).toHaveBeenCalled();

    spy.mockClear();
  });

});