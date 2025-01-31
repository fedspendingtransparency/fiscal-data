import React from 'react';
import { BodyCopy } from './body-copy';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analytics from '../../../../../utils/analytics/analytics';

describe('Interest Expense Body Copy', () => {
  it('renders the section', () => {
    const instance = render(<BodyCopy />);
    expect(instance).toBeDefined();
  });

  it('call GA event on glossary button click', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<BodyCopy />);
    const glossaryTerm = getByRole('button', { name: 'Interest Expense' });
    userEvent.click(glossaryTerm);
    expect(spy).toHaveBeenCalledWith({ action: 'Glossary Term Click', category: 'Interest Expense', label: 'Interest Expense' });
  });
});
