import React from "react";
import MobileExplainerSubNav from './mobile-explainer-sub-nav'
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

describe("ExplainerSubNav Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<MobileExplainerSubNav isShown={true}/>)
    expect(getByTestId("mobileSubNav")).toBeInTheDocument()
  })
})
