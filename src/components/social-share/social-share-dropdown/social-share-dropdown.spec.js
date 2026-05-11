import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SocialShareDropdown from './social-share-dropdown';

const testCopy = {
  title: 'test',
  description: 'test',
  body: 'test',
  emailSubject: 'test',
  emailBody: 'test',
  url: 'test',
  image: 'test',
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('exchange rates banner', () => {
  it('Renders the share button with the text and icon', () => {
    render(<SocialShareDropdown copy={testCopy} pageName="" />);
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    expect(shareBtn).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('opens the dropdown on click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SocialShareDropdown copy={testCopy} pageName="" />);
    expect(screen.queryByText('Facebook')).toBeNull();

    const shareBtn = screen.getByRole('button', { name: 'Share' });
    await user.click(shareBtn);

    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('closes the dropdown when a social button is clicked', async () => {
    const { getByRole } = render(
      <>
        <SocialShareDropdown copy={testCopy} pageName="" />
      </>
    );
    const shareBtn = getByRole('button', { name: 'Share' });
    fireEvent.click(shareBtn);
    const facebookBtn = getByRole('button', { name: 'facebook' });
    fireEvent.click(facebookBtn);
    await waitFor(() => {
      expect(screen.queryByText('Facebook')).toBeNull();
    });
  });

  it('closes the dropdown on scroll', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    window.pageYOffset = 40;
    const { getByRole, queryByText } = render(<SocialShareDropdown copy={testCopy} pageName="" />);

    const shareBtn = getByRole('button', { name: 'Share' });
    await user.click(shareBtn);
    expect(queryByText('Facebook')).toBeInTheDocument();

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(queryByText('Facebook')).toBeNull();
  });
});
