import React from 'react'
import { render } from '@testing-library/react';
import AmericasFinanceGuidePage from './index';



describe('Americas Finance Guide', () => {
    it('renders the top container', () => {
        const { getByTestId } = render(<AmericasFinanceGuidePage />);
        expect(getByTestId("topContainer")).toBeInTheDocument()
        expect(getByTestId("quoteContainer")).toBeInTheDocument()
        expect(getByTestId("bottomContainer")).toBeInTheDocument()
    }); 

    it('renders an component', () => {
        const { getByTestId, container } = render(<AmericasFinanceGuidePage />);
        expect(container.querySelector('[data-testid="afg-icon"]')).toBeInTheDocument();
        //expect(getByTestId("afg-icon")).toBeInTheDocument()
    });
  
});