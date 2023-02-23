import {render} from "@testing-library/react";
import ShareButtonContent from "./share-button-content";
import { breakpointLg, breakpointSm } from '../../../../../variables.module.scss';
import React from 'react';
import userEvent from "@testing-library/user-event";

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600,
  breakpointLg: 992
}));
describe('Social Share component', () => {

  it('renders the social share button with icon and text', () => {
    const {getByRole} = render(
      <ShareButtonContent name={'facebook'} width={breakpointLg} displayStyle={'responsive'} />
    );

    const facebook = getByRole('button', {name: 'Facebook'});
    const icon = getByRole('img', {hidden: true});

    expect(facebook).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('icon color changes to grey on hover', () => {
    const {getByRole} = render(
      <ShareButtonContent name={'facebook'} width={breakpointLg} displayStyle={'responsive'} />
    );

    const icon = getByRole('img', {hidden: true});

    userEvent.hover(icon);
    expect(icon).toHaveStyle({color: 'rgb(85, 85, 85)'});

    userEvent.unhover(icon);
    expect(icon).not.toHaveStyle({color: 'rgb(85, 85, 85)'});
  });

});
