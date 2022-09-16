import React from "react"
import ExplainerSubNav from './explainer-sub-nav'
import {render, screen, document} from '@testing-library/react';

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

describe("Icon Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<ExplainerSubNav />)
    expect(getByTestId("explainerSubNav")).toBeInTheDocument()
  })

  it("renders all the correct links", () => {
    const { getByText  } = render(<ExplainerSubNav />)
    
    urls.forEach(url => {
      expect(getByText(url.text).closest('a')).toHaveAttribute('href', url.url)
    })
  })

})