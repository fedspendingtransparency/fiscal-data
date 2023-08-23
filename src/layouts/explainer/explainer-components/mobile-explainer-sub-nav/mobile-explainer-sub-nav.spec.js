import React from "react";
import MobileExplainerSubNav from './mobile-explainer-sub-nav';
import {render, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Analytics from "../../../../utils/analytics/analytics";

describe("ExplainerSubNav Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'government-revenue'} />)
    expect(getByTestId("mobileSubNav")).toBeInTheDocument()
  })

  it('sets className depending on scroll', async() =>  {
    const { getByTestId } = render(
      <div style={{ height: '100px', display: 'block' }} data-testid="mockDiv">
        <MobileExplainerSubNav hidePosition={5} pageName={'government-revenue'} />
      </div>
    );

    fireEvent.scroll(window, { target: { pageYOffset: 4 } });
    expect(await getByTestId('mobileSubNavBlock')).toHaveClass('mainContainerShow');

    fireEvent.scroll(window, { target: { pageYOffset: 10 } });
    expect(await getByTestId('mobileSubNavBlock')).toHaveClass('mainContainerHidden');

    fireEvent.scroll(window, { target: { pageYOffset: 8 } });
    expect(await getByTestId('mobileSubNavBlock')).toHaveClass('mainContainerSticky');
  });

  it('sets active state of revenue button', async() =>{
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'government-revenue'} />)
    fireEvent.click(getByTestId('revenueButton'));
    expect(await getByTestId('revenueButton')).toHaveClass('activeMenu');
  });

  it('sets active state of spending button', async() =>{
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'federal-spending'} />)
    fireEvent.click(getByTestId('spendingButton'));
    expect(await getByTestId('spendingButton')).toHaveClass('activeMenu');
  });

  it('sets active state of deficit button', async() =>{
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'national-deficit'} />)
    fireEvent.click(getByTestId('deficitButton'));
    expect(await getByTestId('deficitButton')).toHaveClass('activeMenu');
  });

  it('sets active state of debt button', async() =>{
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'national-debt'} />)
    fireEvent.click(getByTestId('debtButton'));
    expect(await getByTestId('debtButton')).toHaveClass('activeMenu');
  });

  it('sets active state of overview button', async() =>{
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true} pageName={'americas-finance-guide'} />)
    fireEvent.click(getByTestId('mobileSubNavBlockButton'));
    fireEvent.click(getByTestId('afgSpan'));
    fireEvent.keyPress(getByTestId('afgSpan'),  { key: "Enter", code: 13, charCode: 13 });
    expect(await getByTestId('mobileSubNavBlockButton')).toHaveClass('activeMenu');
  });


});

describe("Mobile ExplainerSubNav analytics", () => {

  it('Calls Universal Analytics event for each mobile nav link clicked', async() => {
    const { getByText } = render(<MobileExplainerSubNav isShown={true} pageName={'americas-finance-guide'} />);
    const spy = jest.spyOn(Analytics, 'event');

    const navMenuOptions = ["Overview", "Revenue", "Spending", "Deficit", "Debt"];


    navMenuOptions.forEach(text => {
      userEvent.click(getByText(text));
      expect(spy).toHaveBeenCalledWith({
        category: 'Explainers',
        action: `Sub Nav Click`,
        label: text
      });
    });
  });

  it('Pushes analytics event to dataLayer for GA4 for each mobile nav link clicked', async() => {
    const { getByText } = render(<MobileExplainerSubNav isShown={true} pageName={'americas-finance-guide'} />);
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    const navMenuOptions = ["Overview", "Revenue", "Spending", "Deficit", "Debt"];


    navMenuOptions.forEach(text => {
      userEvent.click(getByText(text));
      expect(spy).toHaveBeenCalledWith({
        event: `Sub Nav Click`,
        eventLabel: text
      });
    });
  });
});
