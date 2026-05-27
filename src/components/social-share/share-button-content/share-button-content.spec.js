import { render } from '@testing-library/react';
import ShareButtonContent from './share-button-content';
import React from 'react';
import userEvent from '@testing-library/user-event';

const breakpointLg = 992;
describe('Social Share component', () => {
  it('renders the social share button with icon and text', () => {
    const { getByRole, getByTestId } = render(<ShareButtonContent name="facebook" width={breakpointLg} displayStyle="responsive" />);

    const facebook = getByTestId('facebook content');
    const icon = getByRole('img', { hidden: true });

    expect(facebook).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('icon color changes to grey on hover', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<ShareButtonContent name="facebook" width={breakpointLg} displayStyle="responsive" />);

    const icon = getByRole('img', { hidden: true });

    await user.hover(icon);
    expect(icon).toHaveStyle({ color: 'rgb(85, 85, 85)' });

    await user.unhover(icon);
    expect(icon).not.toHaveStyle({ color: 'rgb(85, 85, 85)' });
  });
});
