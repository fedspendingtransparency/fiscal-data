import React from "react"
import ExplainerSubNav from './explainer-sub-nav'
import {render, fireEvent} from '@testing-library/react';

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
    const { getByText  } = render(<ExplainerSubNav hidePosition={160} />)
    
    urls.forEach(url => {
      expect(getByText(url.text).closest('a')).toHaveAttribute('href', url.url)
    })
  })

  it('sets className depending on scroll', async() =>  {
    const { getByTestId, container } = render(
      <div style={{ height: '100px', display: 'block' }} data-testid='mockDiv'>
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


})