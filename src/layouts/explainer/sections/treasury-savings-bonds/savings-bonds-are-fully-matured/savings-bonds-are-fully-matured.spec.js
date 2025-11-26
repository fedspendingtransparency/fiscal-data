import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsBondsAreFullyMatured from './savings-bonds-are-fully-matured';
import Analytics from '../../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';
import { mockSavingsBondFetchResponses } from '../../../explainer-test-helper';

const fullyMaturedAccordion = 'What is the Treasury Doing to Reduce Matured Unredeemed Debt?';

describe('What Happens when Savings Bonds are Fully Matured Section', () => {
  beforeAll(() => {
    mockSavingsBondFetchResponses();
  });
  it('renders the section', () => {
    const { getByText } = render(<SavingsBondsAreFullyMatured />);
    expect(
      getByText('Therefore, the Treasury has increased efforts to encourage bondholders to redeem their matured savings bonds.', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(getByText('Imagine you bought a series EE bond 30 years ago for $500.', { exact: false })).toBeInTheDocument();
    expect(getByText(fullyMaturedAccordion)).toBeInTheDocument();
  });

  it('fetches evergreen values', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<SavingsBondsAreFullyMatured />);
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(2));
    expect(await findByText('As of February 2023, there were 22 million', { exact: false })).toBeInTheDocument();
  });

  it('calls glossary ga events', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<SavingsBondsAreFullyMatured />);
    const glossaryButton = getByRole('button', { name: 'Matured Unredeemed Debt (MUD)' });
    userEvent.click(glossaryButton);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Glossary Term Click',
      category: 'Explainers',
      label: 'Savings Bonds - Matured Unredeemed Debt (MUD)',
    });
  });

  it('calls citation click ga events', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<SavingsBondsAreFullyMatured />);
    const citation1 = getByRole('link', { name: 'Treasury Hunt' });
    userEvent.click(citation1);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Glossary Term Click',
      category: 'Explainers',
      label: 'Savings Bonds - Matured Unredeemed Debt (MUD)',
    });
  });

  it('calls accordion click ga events', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<SavingsBondsAreFullyMatured />);
    const accordion = getByRole('button', { name: 'What is the Treasury Doing to Reduce Matured Unredeemed Debt? toggle contents' });
    userEvent.click(accordion);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Accordion Expand Click',
      category: 'Explainers',
      label: 'Savings Bonds - What is the Treasury Doing to Reduce Matured Unredeemed Debt?',
    });
  });
});
