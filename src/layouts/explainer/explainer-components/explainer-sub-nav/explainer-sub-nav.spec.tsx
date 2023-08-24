import React from "react"
import ExplainerSubNav from './explainer-sub-nav'
import {render, fireEvent} from '@testing-library/react';
import Analytics from "../../../../utils/analytics/analytics";

const urls = [{
  text: 'Overview',
  url:  '/americas-finance-guide/'
  },
  {
    text: 'Revenue',
    url:  '/americas-finance-guide/government-revenue/'
  },
  {
    text: 'Spending',
    url:  '/americas-finance-guide/federal-spending/'
  },
  {
    text: 'Deficit',
    url:  '/americas-finance-guide/national-deficit/'
  },
  {
    text: 'Debt',
    url:  '/americas-finance-guide/national-debt/'
  }
]

describe("ExplainerSubNav Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<ExplainerSubNav hidePosition={160} />)
    expect(getByTestId("explainerSubNav")).toBeInTheDocument()
  })

  it("renders all the correct links", () => {
    const { getByText } = render(<ExplainerSubNav hidePosition={160} />)

    urls.forEach(url => {
      expect(getByText(url.text).closest('a')).toHaveAttribute('href', url.url)
    })
  })

  it('sets className depending on scroll', async() =>  {
    const { getByTestId } = render(
      <div style={{ height: '100px', display: 'block' }} data-testid="mockDiv">
        <ExplainerSubNav hidePosition={5} />
      </div>
    );

    fireEvent.scroll(window, { target: { pageYOffset: 4 } });
    expect(await getByTestId('explainerSubNavList')).toHaveClass('navBlock');

    fireEvent.scroll(window, { target: { pageYOffset: 10 } });
    expect(await getByTestId('explainerSubNavList')).toHaveClass('navBlockHidden');

    fireEvent.scroll(window, { target: { pageYOffset: 8 } });
    expect(await getByTestId('explainerSubNavList')).toHaveClass('navBlockSticky');
  });


});

describe("ExplainerSubNav analytics", () => {

  it('Calls Universal Analytics event for each nav link clicked', async() => {
    const { getByText } = render(<ExplainerSubNav hidePosition={160} />);
    const spy = jest.spyOn(Analytics, 'event');

    urls.forEach(link => {
      fireEvent.click(getByText(link.text));
      expect(spy).toHaveBeenCalledWith({
        category: 'Explainers',
        action: `Sub Nav Click`,
        label: link.text
      });
    });
  });

  it('Pushes analytics event to datalayer for GA4 for each nav link clicked', async() => {
    const { getByText } = render(<ExplainerSubNav hidePosition={160} />);
    (window as any).dataLayer = (window as any).dataLayer || [];
    const spy = jest.spyOn((window as any).dataLayer, 'push');

    urls.forEach(link => {
      fireEvent.click(getByText(link.text));
      expect(spy).toHaveBeenCalledWith({
        event: `Sub Nav Click`,
        eventLabel: link.text
      });
    });
  });
});
